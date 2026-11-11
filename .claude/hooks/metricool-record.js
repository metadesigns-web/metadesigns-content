#!/usr/bin/env node
// PostToolUse-hook voor Metricool (MetaDesigns Marketing Agent).
//  - getBrandSettings: schrijft .claude/state/brand-check.json op basis van het ECHTE antwoord van Metricool
//    (ok alleen als merk 8006283 "MetaDesigns" gekoppeld is aan Instagram "metadesigns.1").
//  - createScheduledPost met autoPublish=true en een geslaagd antwoord: voegt de post toe aan
//    .claude/state/autopublish-ledger.json (maandteller voor de limiet van 20).
//  - updateScheduledPost (terug naar concept): markeert de ledger-regel als geannuleerd.
//  - Bevestigt Metricool automatisch publiceren niet (autoPublish/draft), dan komt er een regel in
//    .claude/state/autopublish-warnings.json die de agent moet melden. (De post telt wel mee: veilig voor de limiet.)
//  - getScheduledPosts: telt elke automatische publicatie in Metricool die nog niet in de ledger staat
//    (bijv. door de eigenaar zelf omgezet) mee als source "extern".
// Deze hook blokkeert nooit; hij legt alleen vast.
const fs = require('fs');
const path = require('path');
const DIR = process.env.CLAUDE_PROJECT_DIR || path.resolve(__dirname, '..', '..');
const STATE = path.join(DIR, '.claude', 'state');
const LEDGER = path.join(STATE, 'autopublish-ledger.json');
const BRANDCHECK = path.join(STATE, 'brand-check.json');
const WARN = path.join(STATE, 'autopublish-warnings.json');

let raw = '';
process.stdin.on('data', (c) => (raw += c));
process.stdin.on('end', () => {
  let ev; try { ev = JSON.parse(raw); } catch { process.exit(0); }
  const tool = String(ev.tool_name || '').replace(/^mcp__Metricool_Social_Media_Management__/, '');
  const resp = toObject(ev.tool_response);
  fs.mkdirSync(STATE, { recursive: true });

  if (tool === 'getBrandSettings') {
    const brands = (resp && Array.isArray(resp.data)) ? resp.data : [];
    const b = brands.find((x) => String(x.id) === '8006283');
    const instagram = b && b.networksData ? b.networksData.instagramData : null;
    const ok = !!b && b.label === 'MetaDesigns' && instagram === 'metadesigns.1';
    write(BRANDCHECK, { at: new Date().toISOString(), ok, brandId: b ? String(b.id) : null, label: b ? b.label : null, instagram, brands: brands.length });
    process.exit(0);
  }

  // Reconciliatie: elke automatische publicatie in Metricool (ook handmatig door de eigenaar omgezet)
  // telt mee voor de maandlimiet. Onbekende komen in de ledger met source "extern".
  if (tool === 'getScheduledPosts' && resp && Array.isArray(resp.data) && String((ev.tool_input || {}).brandId) === '8006283') {
    const ledger = read(LEDGER, { months: {} });
    const known = new Set(Object.values(ledger.months).flat().map((e) => String(e.uuid)));
    let added = 0;
    resp.data.forEach((p) => {
      if (p && p.autoPublish === true && p.draft === false && p.uuid && !known.has(String(p.uuid))) {
        const dt = String((p.publicationDate && p.publicationDate.dateTime) || '');
        const month = dt.slice(0, 7);
        if (!month) return;
        ledger.months[month] = ledger.months[month] || [];
        ledger.months[month].push({ date: dt.slice(0, 10), time: dt.slice(11, 16), type: (p.instagramData && p.instagramData.type) || 'POST', id: p.id, uuid: String(p.uuid), created: new Date().toISOString(), source: 'extern', hook: String(p.text || '').split('\n')[0].slice(0, 80) });
        known.add(String(p.uuid)); added++;
      }
    });
    if (added) write(LEDGER, ledger);
    process.exit(0);
  }

  const input = ev.tool_input || {};
  let info = {}; try { info = typeof input.info === 'string' ? JSON.parse(input.info) : (input.info || {}); } catch {}
  const data = resp && resp.data;

  if (tool === 'createScheduledPost' && info.autoPublish === true && info.draft === false) {
    const ig = (data && data.instagramData) || {};
    const prov = (data && Array.isArray(data.providers) ? data.providers : []);
    const pending = prov.length === 1 && prov[0].network === 'instagram' && String(prov[0].status).toUpperCase() === 'PENDING';
    const confirmed = !!data && data.autoPublish === true && data.draft === false && ig.autoPublish === true && pending;
    if (!confirmed) {
      const w = read(WARN, []);
      w.push({ at: new Date().toISOString(), uuid: data && data.uuid ? String(data.uuid) : null, problem: data ? `Metricool bevestigt automatisch publiceren niet (autoPublish=${data.autoPublish}, draft=${data.draft}, instagramData.autoPublish=${ig.autoPublish}, status=${prov.map((x) => x.network + ':' + x.status).join(',')})` : 'geen geldig antwoord van Metricool', hook: String(info.text || '').split('\n')[0].slice(0, 80) });
      write(WARN, w);
    }
  }
  if (tool === 'createScheduledPost' && info.autoPublish === true && info.draft === false && data && data.uuid) {
    const dt = String((data.publicationDate && data.publicationDate.dateTime) || (info.publicationDate && info.publicationDate.dateTime) || '');
    const ledger = read(LEDGER, { months: {} });
    const month = dt.slice(0, 7);
    ledger.months[month] = ledger.months[month] || [];
    if (!ledger.months[month].some((e) => String(e.uuid) === String(data.uuid))) {
      ledger.months[month].push({ date: dt.slice(0, 10), time: dt.slice(11, 16), type: (info.instagramData && info.instagramData.type) || 'POST', id: data.id, uuid: String(data.uuid), created: new Date().toISOString(), hook: String(info.text || '').split('\n')[0].slice(0, 80) });
    }
    write(LEDGER, ledger);
  }

  if (tool === 'updateScheduledPost' && info.draft === true && info.autoPublish === false && data) {
    const ledger = read(LEDGER, { months: {} });
    Object.values(ledger.months).flat().forEach((e) => { if (String(e.uuid) === String(input.uuid)) { e.cancelled = new Date().toISOString(); } });
    write(LEDGER, ledger);
  }
  process.exit(0);
});

function toObject(r) {
  if (r == null) return null;
  if (typeof r === 'object' && !Array.isArray(r) && (r.data || r.rows)) return r;
  let text = '';
  if (typeof r === 'string') text = r;
  else if (Array.isArray(r)) text = r.map((x) => (x && typeof x.text === 'string' ? x.text : '')).join('');
  else if (Array.isArray(r.content)) text = r.content.map((x) => (x && typeof x.text === 'string' ? x.text : '')).join('');
  else if (typeof r.result === 'string') text = r.result;
  else text = JSON.stringify(r);
  try { return JSON.parse(text); } catch { return null; }
}
function read(f, d) { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch { return d; } }
function write(f, v) { fs.writeFileSync(f, JSON.stringify(v, null, 2) + '\n'); }
