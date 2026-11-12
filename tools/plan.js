#!/usr/bin/env node
// Dagplanner van de MetaDesigns Marketing Agent.
// Doel: maximaal 2 Instagram-posts per dag in totaal, inclusief wat al in Metricool staat.
//
// Gebruik: node tools/plan.js <planner.json> <besttimes.json> [--now 2026-11-12T06:37] [--max 2] [--days 14]
//   planner.json   = het volledige antwoord van getScheduledPosts (brand 8006283), of {"data": [...]}
//   besttimes.json = het antwoord van getBestTimeToPostByNetwork (instagram)
// Leest .claude/state/autopublish-ledger.json (maandteller + door de agent gemaakte concepten).
// Schrijft niets; geeft een JSON-plan terug.
//
// Regels:
//  - Een dag telt ALLE posts die in Metricool op die dag staan, ongeacht de status: automatische
//    publicaties, handmatig ingeplande posts én concepten, van de agent of van de eigenaar.
//    Maximaal 2 per dag in totaal.
//  - Dagen met 2 of meer posts worden overgeslagen. Overige dagen worden van vroeg naar laat aangevuld,
//    maximaal --max nieuwe posts per run, binnen --days dagen (vandaag meegerekend).
//  - Format: per dag streven naar 1 Reel + 1 POST (carrousel of afbeelding).
//  - Tijd: het uur met de hoogste Metricool-waarde voor die weekdag, tussen 08:00 en 21:00 (hele uren),
//    minstens 2 uur na het moment van de run en minstens 2 uur van elke andere post op die dag.
//  - Automatisch publiceren zolang de maandteller < 20; anders "concept (maandlimiet)".
const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const opt = (name, dflt) => { const i = args.indexOf('--' + name); return i >= 0 ? args[i + 1] : dflt; };
const [plannerFile, bestFile] = args.filter((a, i) => !a.startsWith('--') && !(i > 0 && args[i - 1].startsWith('--')));
if (!plannerFile || !bestFile) { console.error('Gebruik: node tools/plan.js <planner.json> <besttimes.json> [--now JJJJ-MM-DDTHH:MM] [--max 2] [--days 14]'); process.exit(1); }
const MAX = +opt('max', 2), DAYS = +opt('days', 14), LIMIT = 20;
const ledgerFile = opt('ledger', path.join(__dirname, '..', '.claude', 'state', 'autopublish-ledger.json'));

const unwrap = (x) => (Array.isArray(x) ? x : x && Array.isArray(x.data) ? x.data : []);
const planner = unwrap(JSON.parse(fs.readFileSync(plannerFile, 'utf8')));
const best = unwrap(JSON.parse(fs.readFileSync(bestFile, 'utf8')));
let ledger = { months: {}, drafts: [] };
try { ledger = Object.assign(ledger, JSON.parse(fs.readFileSync(ledgerFile, 'utf8'))); } catch {}

// "nu" in Amsterdamse lokale tijd
const nowLocal = opt('now', null) || new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Amsterdam', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).format(new Date()).replace(' ', 'T');
const toMin = (dt) => { const [d, t] = dt.split('T'); const [y, m, dd] = d.split('-').map(Number); const [h, mi] = t.split(':').map(Number); return Date.UTC(y, m - 1, dd, h, mi) / 60000; };
const nowMin = toMin(nowLocal);
const addDays = (d, n) => { const [y, m, dd] = d.split('-').map(Number); return new Date(Date.UTC(y, m - 1, dd + n)).toISOString().slice(0, 10); };
const isoDow = (d) => { const [y, m, dd] = d.split('-').map(Number); return ((new Date(Date.UTC(y, m - 1, dd)).getUTCDay() + 6) % 7) + 1; };
const DAGEN = ['', 'maandag', 'dinsdag', 'woensdag', 'donderdag', 'vrijdag', 'zaterdag', 'zondag'];

const posts = planner.filter((p) => p && p.publicationDate && p.publicationDate.dateTime).map((p) => ({
  uuid: String(p.uuid), dt: p.publicationDate.dateTime.slice(0, 16), day: p.publicationDate.dateTime.slice(0, 10),
  type: (p.instagramData && p.instagramData.type) || 'POST', draft: p.draft === true, auto: p.autoPublish === true,
  counts: true, // elke post telt mee, ook concepten
  hook: String(p.text || '').split('\n')[0].slice(0, 60),
}));

const activeIn = (month) => ((ledger.months || {})[month] || []).filter((e) => !e.cancelled).length;
const extraAuto = {}; // nieuw geplande automatische publicaties per maand in deze run
const scoreFor = (day, hour) => { const d = best.find((b) => b.dayOfWeek === isoDow(day)); const h = d && d.bestTimesByHour.find((x) => x.hourOfDay === hour); return h ? h.value : 0; };

const today = nowLocal.slice(0, 10);
const plan = [], overview = [];
let created = 0;
for (let i = 0; i < DAYS; i++) {
  const day = addDays(today, i);
  const onDay = posts.filter((p) => p.day === day);
  const counting = onDay.filter((p) => p.counts);
  const row = { date: day, weekday: DAGEN[isoDow(day)], existing: counting.length, existingTypes: counting.map((p) => (p.draft ? 'concept ' : p.auto ? 'auto ' : 'handmatig ') + p.type), add: [] };
  overview.push(row);
  if (counting.length >= 2) { row.status = 'vol (overgeslagen)'; continue; }
  if (created >= MAX) { row.status = `nog ${2 - counting.length} vrij (volgende run)`; continue; }
  const needTypes = [];
  const hasReel = counting.some((p) => p.type === 'REEL');
  const hasPost = counting.some((p) => p.type !== 'REEL');
  if (!hasReel) needTypes.push('REEL');
  if (!hasPost) needTypes.push('POST');
  while (counting.length + needTypes.length > 2) needTypes.pop();
  while (counting.length + needTypes.length < 2) needTypes.push(hasReel ? 'POST' : 'REEL');
  const taken = onDay.map((p) => toMin(p.dt));
  for (const type of needTypes) {
    if (created >= MAX) break;
    const hours = [];
    for (let h = 8; h <= 21; h++) hours.push(h);
    hours.sort((a, b) => scoreFor(day, b) - scoreFor(day, a) || a - b);
    const hour = hours.find((h) => { const m = toMin(`${day}T${String(h).padStart(2, '0')}:00`); return m >= nowMin + 120 && taken.every((t) => Math.abs(t - m) >= 120); });
    if (hour === undefined) { row.note = 'geen geldig tijdslot meer op deze dag'; break; }
    const time = `${String(hour).padStart(2, '0')}:00`;
    taken.push(toMin(`${day}T${time}`));
    const month = day.slice(0, 7);
    const used = activeIn(month) + (extraAuto[month] || 0);
    const auto = used < LIMIT;
    if (auto) extraAuto[month] = (extraAuto[month] || 0) + 1;
    const item = { date: day, time, weekday: row.weekday, format: type === 'REEL' ? 'Reel' : 'Carrousel of afbeelding', instagramType: type, metricoolScore: scoreFor(day, hour), mode: auto ? 'automatisch (autoPublish=true, draft=false)' : 'concept (maandlimiet 20 bereikt)', monthCountAfter: auto ? used + 1 : used };
    plan.push(item); row.add.push(`${time} ${item.format}${auto ? '' : ' [concept: limiet]'}`); created++;
  }
  row.status = row.add.length ? `aanvullen: ${row.add.join(', ')}` : row.status || 'niets toegevoegd';
}
console.log(JSON.stringify({ now: nowLocal, maxNewPerRun: MAX, monthCounts: Object.fromEntries(Object.keys(ledger.months || {}).map((m) => [m, activeIn(m)])), plan, overview }, null, 2));
