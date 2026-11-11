// MetaDesigns visual renderer. Usage: node render.js spec.json outdir
// spec: {id, kind:"image"|"carousel"|"reel", slides:[{variant, eyebrow, title, body, list, footer, big}]}
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
const { chromium } = require('playwright');
const [,, specPath, outDir] = process.argv;
const spec = JSON.parse(fs.readFileSync(specPath, 'utf8'));
fs.mkdirSync(outDir, { recursive: true });
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const C = { navy:'#0A1A33', blue:'#1F5BFF', ice:'#EAF0FF', white:'#FFFFFF', mute:'#5B6B85' };
function html(s, i, n, W, H) {
  const v = s.variant || (i === 0 ? 'cover' : 'light');
  const dark = v === 'cover' || v === 'dark' || v === 'cta';
  const bg = v === 'cta' ? C.blue : dark ? C.navy : C.ice;
  const fg = dark ? C.white : C.navy;
  const accent = v === 'cta' ? C.navy : C.blue;
  const sub = dark ? 'rgba(255,255,255,.78)' : C.mute;
  const scale = W / 1080 * (spec.kind === 'reel' ? 1.22 : 1);
  const fb = spec.kind === 'reel' ? 380 : 64, top = spec.kind === 'reel' ? 260 : 96, bot = spec.kind === 'reel' ? 440 : 120;
  const list = (s.list || []).map(t => `<li><span class="b"></span><span>${esc(t)}</span></li>`).join('');
  const counter = n > 1 && spec.kind === 'carousel' ? `<div class="ctr">${i+1}/${n}</div>` : '';
  const swipe = spec.kind === 'carousel' && i === 0 && n > 1 ? `<div class="swipe">Swipe →</div>` : '';
  return `<!doctype html><html><head><meta charset="utf-8"><style>
  *{box-sizing:border-box;margin:0;padding:0}
  html,body{width:${W}px;height:${H}px}
  body{background:${bg};color:${fg};font-family:'Inter Display','Inter',sans-serif;position:relative;overflow:hidden}
  .wrap{position:absolute;inset:${top}px 88px ${bot}px;display:flex;flex-direction:column;justify-content:center;gap:${36*scale}px}
  .eye{font-size:${30*scale}px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:${accent === C.navy ? C.white : accent}}
  .t{font-size:${(s.big?112:v==='cover'?92:72)*scale}px;line-height:1.04;font-weight:800;letter-spacing:-.025em;text-wrap:balance}
  .t em{font-style:normal;color:${accent === C.navy ? C.navy : C.blue}}
  ${v==='cta' ? `.t em{color:${C.white};text-decoration:underline;text-decoration-thickness:${8*scale}px;text-underline-offset:${12*scale}px}` : ''}
  .bd{font-size:${38*scale}px;line-height:1.38;font-weight:450;color:${sub};max-width:${880*scale}px}
  ul{list-style:none;display:flex;flex-direction:column;gap:${26*scale}px;margin-top:${8*scale}px}
  li{display:flex;gap:${24*scale}px;align-items:flex-start;font-size:${40*scale}px;line-height:1.3;font-weight:550}
  .b{flex:none;width:${22*scale}px;height:${22*scale}px;border-radius:50%;background:${accent};margin-top:${14*scale}px}
  .foot{position:absolute;left:88px;right:88px;bottom:${fb}px;display:flex;justify-content:space-between;align-items:center;font-size:${28*scale}px;font-weight:600;color:${sub}}
  .wm{display:flex;align-items:center;gap:${10*scale}px;color:${fg};font-size:${34*scale}px;font-weight:800;letter-spacing:-.02em}
  .dot{width:${18*scale}px;height:${18*scale}px;border-radius:50%;background:${v==='cta'?C.white:C.blue}}
  .ctr,.swipe{font-variant-numeric:tabular-nums}
  .deco{position:absolute;right:${-180*scale}px;top:${-180*scale}px;width:${560*scale}px;height:${560*scale}px;border-radius:50%;border:${3*scale}px solid ${dark? 'rgba(255,255,255,.12)':'rgba(31,91,255,.14)'}}
  .deco2{position:absolute;right:${-60*scale}px;top:${-60*scale}px;width:${320*scale}px;height:${320*scale}px;border-radius:50%;background:${v==='cta'?'rgba(255,255,255,.14)':'rgba(31,91,255,.18)'}}
  </style></head><body><div class="deco"></div><div class="deco2"></div>
  <div class="wrap">${s.eyebrow?`<div class="eye">${esc(s.eyebrow)}</div>`:''}
  ${s.title?`<div class="t">${esc(s.title).replace(/\*(.+?)\*/g,'<em>$1</em>')}</div>`:''}
  ${s.body?`<div class="bd">${esc(s.body)}</div>`:''}${list?`<ul>${list}</ul>`:''}</div>
  <div class="foot"><div class="wm"><span>metadesigns</span><span class="dot"></span></div><div style="display:flex;gap:28px">${s.footer?`<span>${esc(s.footer)}</span>`:''}${swipe}${counter}</div></div>
  </body></html>`;
}
(async () => {
  const reel = spec.kind === 'reel';
  const W = 1080, H = reel ? 1920 : 1350;
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
  const files = [];
  for (let i = 0; i < spec.slides.length; i++) {
    await p.setContent(html(spec.slides[i], i, spec.slides.length, W, H));
    await p.evaluate(() => document.fonts.ready);
    const f = path.join(outDir, `${spec.id}-${String(i+1).padStart(2,'0')}.${reel?'png':'jpg'}`);
    await p.screenshot({ path: f, type: reel ? 'png' : 'jpeg', quality: reel ? undefined : 92 });
    files.push(f);
  }
  await b.close();
  if (reel) {
    // each scene: seconds from slide.seconds (default 2.6), crossfade 0.4s, silent AAC track
    const secs = spec.slides.map(s => s.seconds || 2.6), xf = 0.4;
    const args = ['-y'];
    files.forEach((f, i) => args.push('-loop', '1', '-t', String(secs[i]), '-i', f));
    args.push('-f', 'lavfi', '-t', '60', '-i', 'anullsrc=r=44100:cl=stereo');
    let fc = '', last = '[0:v]', off = 0;
    files.forEach((f, i) => { fc += `[${i}:v]scale=1080:1920,setsar=1,fps=30,format=yuv420p[v${i}];`; });
    last = '[v0]'; off = secs[0] - xf;
    for (let i = 1; i < files.length; i++) {
      fc += `${last}[v${i}]xfade=transition=slideleft:duration=${xf}:offset=${off.toFixed(2)}[x${i}];`;
      last = `[x${i}]`; off += secs[i] - xf;
    }
    fc = fc.replace(/;$/, '');
    const total = secs.reduce((a, c) => a + c, 0) - xf * (files.length - 1);
    const out = path.join(outDir, `${spec.id}.mp4`);
    args.push('-filter_complex', fc, '-map', files.length > 1 ? last : '[v0]', '-map', `${files.length}:a`,
      '-t', total.toFixed(2), '-c:v', 'libx264', '-profile:v', 'high', '-pix_fmt', 'yuv420p', '-r', '30', '-b:v', '6M',
      '-c:a', 'aac', '-b:a', '128k', '-movflags', '+faststart', out);
    execFileSync('ffmpeg', args, { stdio: 'ignore' });
    // cover = first scene as jpg
    execFileSync('ffmpeg', ['-y', '-i', files[0], '-q:v', '3', path.join(outDir, `${spec.id}-cover.jpg`)], { stdio: 'ignore' });
    files.forEach(f => fs.unlinkSync(f));
    console.log(JSON.stringify({ video: out, cover: path.join(outDir, `${spec.id}-cover.jpg`), seconds: total }));
  } else console.log(JSON.stringify({ images: files }));
})();
