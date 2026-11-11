#!/usr/bin/env node
// PreToolUse guard for Metricool: only drafts for brand 8006283 / Instagram, never publish, never modify.
let raw = '';
process.stdin.on('data', (c) => (raw += c));
process.stdin.on('end', () => {
  const block = (msg) => { process.stderr.write('Metricool-guard: ' + msg + '\n'); process.exit(2); };
  let ev; try { ev = JSON.parse(raw); } catch { block('kon de toolaanroep niet lezen; geblokkeerd.'); }
  const tool = String(ev.tool_name || '').replace(/^mcp__Metricool_Social_Media_Management__/, '');
  const readOnly = ['getBrandSettings', 'getScheduledPosts', 'getAnalyticsDataByMetrics', 'getAnalyticsAvailableMetrics', 'getBestTimeToPostByNetwork'];
  if (readOnly.includes(tool)) process.exit(0);
  if (tool !== 'createScheduledPost') block(`'${tool}' is niet toegestaan. De agent mag alleen nieuwe concepten aanmaken met createScheduledPost.`);
  const input = ev.tool_input || {};
  if (String(input.blogId) !== '8006283') block('alleen merk MetaDesigns (blogId 8006283) is toegestaan.');
  let info; try { info = typeof input.info === 'string' ? JSON.parse(input.info) : input.info; } catch { block('info is geen geldige JSON.'); }
  if (!info || info.draft !== true) block('"draft" moet true zijn: alleen concepten.');
  if (info.autoPublish !== false) block('"autoPublish" moet false zijn.');
  const nets = (info.providers || []).map((p) => p && p.network);
  if (nets.length !== 1 || nets[0] !== 'instagram') block('alleen het netwerk instagram (metadesigns.1) is toegestaan.');
  if (info.instagramData && info.instagramData.autoPublish === true) block('instagramData.autoPublish mag niet true zijn.');
  if (Array.isArray(info.descendants) && info.descendants.length) block('threads/vervolgposts zijn niet toegestaan.');
  process.exit(0);
});
