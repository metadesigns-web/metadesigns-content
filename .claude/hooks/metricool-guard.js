#!/usr/bin/env node
// PreToolUse-guard voor Metricool (MetaDesigns Marketing Agent).
//
// Toegestaan:
//  - Lezen (getBrandSettings, getScheduledPosts, analytics, beste tijden).
//  - createScheduledPost als CONCEPT: draft=true, autoPublish=false.
//  - createScheduledPost als AUTOMATISCHE PUBLICATIE, alleen als ALLES klopt:
//      * brandId 8006283, alleen provider instagram, geen threads/descendants;
//      * verse accountcontrole (< 6 uur) door de PostToolUse-hook op getBrandSettings:
//        merk "MetaDesigns" (8006283) gekoppeld aan Instagram "metadesigns.1";
//      * draft=false, autoPublish=true, type POST of REEL;
//      * media alleen van raw.githubusercontent.com/metadesigns-web/metadesigns-content/<sha>/media/JJJJ/MM/DD/,
//        commit staat op origin/main, bestand bestaat in die commit, mapdatum = publicatiedatum;
//        REEL: precies 1 .mp4 + cover .jpg/.png; POST: 1-10 .jpg/.png;
//      * caption niet leeg, max. 2200 tekens, max. 30 hashtags, geen placeholders;
//      * tijdzone Europe/Amsterdam, datum/tijd gelijk aan 'date', tussen 08:00 en 21:59,
//        minstens 2 uur en hoogstens 35 dagen in de toekomst;
//      * maandlimiet: minder dan 20 automatische publicaties in die kalendermaand (ledger),
//        en hoogstens 1 automatische publicatie per dag.
//  - updateScheduledPost alleen om een eigen automatische publicatie uit de ledger
//    TERUG te zetten naar concept (draft=true, autoPublish=false). Verder niets.
// Al het andere (review-functies, onbekende tools, andere merken/netwerken) wordt geblokkeerd.
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const BRAND = '8006283';
const MONTH_LIMIT = 20;
const DIR = process.env.CLAUDE_PROJECT_DIR || path.resolve(__dirname, '..', '..');
const STATE = path.join(DIR, '.claude', 'state');
const LEDGER = path.join(STATE, 'autopublish-ledger.json');
const BRANDCHECK = path.join(STATE, 'brand-check.json');
const MEDIA_RE = /^https:\/\/raw\.githubusercontent\.com\/metadesigns-web\/metadesigns-content\/([0-9a-f]{40})\/(media\/(\d{4})\/(\d{2})\/(\d{2})\/[A-Za-z0-9._-]+)$/;

let raw = '';
process.stdin.on('data', (c) => (raw += c));
process.stdin.on('end', () => {
  const block = (msg) => { process.stderr.write('Metricool-guard: ' + msg + '\n'); process.exit(2); };
  let ev; try { ev = JSON.parse(raw); } catch { block('kon de toolaanroep niet lezen; geblokkeerd.'); }
  const tool = String(ev.tool_name || '').replace(/^mcp__Metricool_Social_Media_Management__/, '');
  const input = ev.tool_input || {};
  const readOnly = ['getBrandSettings', 'getScheduledPosts', 'getAnalyticsDataByMetrics', 'getAnalyticsAvailableMetrics', 'getBestTimeToPostByNetwork'];
  if (readOnly.includes(tool)) process.exit(0);

  const ledger = readJson(LEDGER, { months: {} });
  const parseInfo = () => { try { return typeof input.info === 'string' ? JSON.parse(input.info) : input.info; } catch { block('info is geen geldige JSON.'); } };

  if (tool === 'updateScheduledPost') {
    if (String(input.blogId) !== BRAND) block('alleen merk MetaDesigns (8006283).');
    const info = parseInfo() || {};
    const own = Object.values(ledger.months || {}).flat().some((e) => String(e.uuid) === String(input.uuid) && !e.cancelled);
    if (!own) block('bestaande posts en concepten mogen niet worden gewijzigd. Alleen een eigen automatische publicatie uit de ledger mag terug naar concept.');
    if (info.draft !== true || info.autoPublish !== false) block('een update mag een automatische publicatie alleen terugzetten naar concept (draft=true, autoPublish=false).');
    process.exit(0);
  }
  if (tool !== 'createScheduledPost') block(`'${tool}' is niet toegestaan.`);

  if (String(input.blogId) !== BRAND) block('alleen merk MetaDesigns (blogId 8006283) is toegestaan.');
  const info = parseInfo();
  if (!info) block('info ontbreekt.');
  const nets = (info.providers || []).map((p) => p && p.network);
  if (nets.length !== 1 || nets[0] !== 'instagram') block('alleen het netwerk instagram (metadesigns.1) is toegestaan.');
  if (Array.isArray(info.descendants) && info.descendants.length) block('threads/vervolgposts zijn niet toegestaan.');

  // Concept: altijd toegestaan (zoals voorheen).
  if (info.draft === true && info.autoPublish === false) {
    if (info.instagramData && info.instagramData.autoPublish === true) block('instagramData.autoPublish mag bij een concept niet true zijn.');
    process.exit(0);
  }
  if (!(info.draft === false && info.autoPublish === true)) block('alleen twee vormen zijn toegestaan: concept (draft=true, autoPublish=false) of automatische publicatie (draft=false, autoPublish=true).');

  // ---- Automatische publicatie: strenge controles ----
  const bc = readJson(BRANDCHECK, null);
  if (!bc || bc.ok !== true || bc.brandId !== BRAND || bc.instagram !== 'metadesigns.1' || bc.label !== 'MetaDesigns') block('geen geldige accountcontrole. Roep eerst getBrandSettings aan (merk MetaDesigns moet gekoppeld zijn aan metadesigns.1).');
  if (Date.now() - Date.parse(bc.at) > 6 * 3600e3) block('accountcontrole is ouder dan 6 uur. Roep getBrandSettings opnieuw aan.');

  const ig = info.instagramData || {};
  const type = ig.type || 'POST';
  if (!['POST', 'REEL'].includes(type)) block(`type ${type} mag niet automatisch worden gepubliceerd (alleen POST/carrousel en REEL).`);

  const pd = info.publicationDate || {};
  if (pd.timezone !== 'Europe/Amsterdam') block('publicationDate.timezone moet Europe/Amsterdam zijn.');
  const m = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?$/.exec(String(pd.dateTime || ''));
  if (!m) block('publicationDate.dateTime heeft geen geldig formaat.');
  const [, Y, Mo, D, H, Mi] = m;
  const whenUtc = amsterdamToUtc(+Y, +Mo, +D, +H, +Mi);
  if (input.date && Math.abs(Date.parse(input.date) - whenUtc) > 60e3) block('"date" en publicationDate wijzen naar een ander moment.');
  if (+H < 8 || +H > 21) block('automatische publicaties alleen tussen 08:00 en 21:59 (Amsterdam).');
  if (whenUtc < Date.now() + 2 * 3600e3) block('automatische publicatie moet minstens 2 uur in de toekomst liggen.');
  if (whenUtc > Date.now() + 35 * 86400e3) block('automatische publicatie mag hoogstens 35 dagen vooruit worden ingepland.');
  const day = `${Y}-${Mo}-${D}`;

  const media = Array.isArray(info.media) ? info.media : [];
  const check = (url, label) => {
    const mm = MEDIA_RE.exec(String(url));
    if (!mm) block(`${label} komt niet uit de MetaDesigns-mediarepo: ${url}`);
    const [, sha, file, y, mo, d] = mm;
    if (`${y}-${mo}-${d}` !== day) block(`${label} staat in map ${y}-${mo}-${d}, maar de publicatiedatum is ${day}.`);
    try { execFileSync('git', ['-C', DIR, 'merge-base', '--is-ancestor', sha, 'origin/main'], { stdio: 'ignore' }); } catch { block(`commit ${sha.slice(0, 7)} staat (nog) niet op origin/main.`); }
    try { execFileSync('git', ['-C', DIR, 'cat-file', '-e', `${sha}:${file}`], { stdio: 'ignore' }); } catch { block(`${file} bestaat niet in commit ${sha.slice(0, 7)}.`); }
    return file;
  };
  if (type === 'REEL') {
    if (media.length !== 1 || !/\.mp4$/i.test(media[0])) block('een Reel moet precies 1 .mp4 hebben.');
    check(media[0], 'Reel-video');
    if (!info.videoThumbnailUrl || !/\.(jpe?g|png)$/i.test(info.videoThumbnailUrl)) block('een Reel moet een cover (.jpg/.png) hebben.');
    check(info.videoThumbnailUrl, 'Reel-cover');
  } else {
    if (media.length < 1 || media.length > 10) block('een post/carrousel moet 1 tot 10 afbeeldingen hebben.');
    media.forEach((u, i) => { if (!/\.(jpe?g|png)$/i.test(u)) block(`media ${i + 1} is geen .jpg/.png.`); check(u, `afbeelding ${i + 1}`); });
  }

  const text = String(info.text || '');
  if (!text.trim()) block('caption is leeg.');
  if (text.length > 2200) block('caption is langer dan 2200 tekens.');
  if ((text.match(/#[\p{L}\p{N}_]+/gu) || []).length > 30) block('meer dan 30 hashtags.');
  if (/\{\{|\}\}|TODO|lorem ipsum|\[(?:invullen|naam|plaats)\]/i.test(text)) block('caption bevat een placeholder.');

  const month = `${Y}-${Mo}`;
  const active = (ledger.months[month] || []).filter((e) => !e.cancelled);
  if (active.length >= MONTH_LIMIT) block(`maandlimiet bereikt: al ${active.length} automatische publicaties in ${month} (max. ${MONTH_LIMIT}). Bewaar deze post als concept.`);
  if (active.some((e) => e.date === day)) block(`er staat al een automatische publicatie op ${day} (max. 1 per dag). Bewaar deze post als concept.`);
  process.exit(0);
});

function readJson(f, dflt) { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch { return dflt; } }
function amsterdamToUtc(y, mo, d, h, mi) {
  let t = Date.UTC(y, mo - 1, d, h, mi);
  for (let i = 0; i < 2; i++) {
    const p = Object.fromEntries(new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Amsterdam', hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }).formatToParts(new Date(t)).map((x) => [x.type, x.value]));
    const shown = Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour, +p.minute);
    t += Date.UTC(y, mo - 1, d, h, mi) - shown;
  }
  return t;
}
