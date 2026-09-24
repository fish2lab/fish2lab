// Draws the profile header from the last year of GitHub contributions.
//
//   node art/render.mjs [outDir]            fetches with $GITHUB_TOKEN
//   CAL_JSON=cal.json node art/render.mjs   reads a saved GraphQL response
//
// Writes stream.svg (light) and stream-dark.svg. No dependencies: glyph
// outlines and the whale's tone map come pre-baked in art/assets.json
// (see tools/build_assets.py).
//
// The picture is one engraved stream. Every water line is drawn once; the
// whale from the fish²lab logo exists only as line weight, the way a
// banknote engraver builds a portrait. Each day with contributions drops a
// ripple on the stream, laid out like the calendar under it: weeks run left
// to right, Sunday is the far row and Saturday the near one. The fisherman
// at the right end holds his line over today.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const A = JSON.parse(fs.readFileSync(path.join(HERE, "assets.json"), "utf8"));
const LOGIN = process.env.GH_LOGIN || "fish2lab";

const W = 1600;
const H = 736;
const M = 72; // outer margin

const THEMES = {
  light: {
    paper: "#faf8f4", ink: "#26231f", soft: "#5a544c", muted: "#9c9285",
    rule: "#ddd6ca", red: "#b71c1c", sealText: "#faf8f4",
  },
  dark: {
    paper: "#161512", ink: "#e9e3d7", soft: "#bdb5a6", muted: "#80796d",
    rule: "#2d2a25", red: "#d24a3f", sealText: "#161512",
  },
};

// ── the stream ──────────────────────────────────────────────────────────
const S = {
  top: 340, bottom: 624,      // water band
  lines: 42,                  // engraved water lines
  persp: 0.6,                 // how much the near lines spread apart
  x0: 108, x1: 1310,          // first and last week of the calendar
  base: 0.17,                 // plain water: line weight as share of spacing
};
// depth t in [0,1] → y; convex so spacing grows towards the viewer
const depthY = (t) => S.top + (S.bottom - S.top) * (t + S.persp * t * t) / (1 + S.persp);
const depthScale = (t) => (1 + 2 * S.persp * t) / (1 + S.persp);
const rowT = (r) => 0.08 + (r + 0.5) / 7 * 0.84;

// whale placement in the band, in art units
const WHALE = { x: 560, y: 336, w: 410 };
// line weight per logo colour class (see tools/build_assets.py);
// classes left out are open water
const TONE = { 2: 0.8, 3: 0.44, 4: 0.07, 5: 0.1, 6: 0, halo: 0 };

// ── helpers ─────────────────────────────────────────────────────────────
function rng(seed) {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const f1 = (v) => (Math.round(v * 10) / 10).toString();

// Glyph paths are absolute M/L/H/V/Q/C/Z on a 1000-unit em; bake the
// transform into the numbers so each string is a single <path>.
function place(d, s, tx, ty) {
  const out = [];
  const tok = d.match(/[A-Za-z]|-?\d*\.?\d+(?:e-?\d+)?/g) || [];
  let cmd = "", pair = 0;
  for (const t of tok) {
    if (/[A-Za-z]/.test(t)) { cmd = t; out.push(t); pair = 0; continue; }
    const v = parseFloat(t);
    if (cmd === "H") out.push(f1(v * s + tx));
    else if (cmd === "V") out.push(f1(v * s + ty));
    else { out.push(f1(pair % 2 === 0 ? v * s + tx : v * s + ty)); pair++; }
  }
  return out.join(" ").replace(/ ([A-Za-z]) /g, "$1").replace(/ ([A-Za-z])$/, "$1");
}

function monoText(str, x, y, size, track = 0, anchor = "start") {
  const adv = (A.mono.advance / 1000) * size + track;
  const width = adv * [...str].length - track;
  let cx = anchor === "end" ? x - width : anchor === "middle" ? x - width / 2 : x;
  const parts = [];
  for (const ch of str) {
    const g = A.mono.glyphs[ch];
    if (g) parts.push(place(g, size / 1000, cx, y));
    cx += adv;
  }
  return { d: parts.join(""), width };
}

function grid(g) {
  const bytes = Buffer.from(g.data, "base64");
  return { ...g, at: (cx, cy) => (cx < 0 || cy < 0 || cx >= g.w || cy >= g.h ? 0 : bytes[cy * g.w + cx]) };
}

// Tone map of the whale as a share of line spacing, blurred a little so the
// lines swell into the body instead of stepping. Open water returns null.
function whaleTone() {
  const g = grid(A.whale);
  const body = (c) => TONE[c] !== undefined;
  const R = 3;
  const v = new Float32Array(g.w * g.h).fill(-1); // -1 = open water
  for (let y = 0; y < g.h; y++)
    for (let x = 0; x < g.w; x++) {
      const c = g.at(x, y);
      if (body(c)) { v[y * g.w + x] = TONE[c]; continue; }
      search: for (let dy = -R; dy <= R; dy++)
        for (let dx = -R; dx <= R; dx++)
          if (dx * dx + dy * dy <= R * R && body(g.at(x + dx, y + dy))) { v[y * g.w + x] = TONE.halo; break search; }
    }
  // box blur, radius 1, over carved cells only; open water stays open
  const b = new Float32Array(v);
  for (let y = 0; y < g.h; y++)
    for (let x = 0; x < g.w; x++) {
      if (v[y * g.w + x] < 0) continue;
      let sum = 0, n = 0;
      for (let dy = -1; dy <= 1; dy++)
        for (let dx = -1; dx <= 1; dx++) {
          const xx = x + dx, yy = y + dy;
          if (xx < 0 || yy < 0 || xx >= g.w || yy >= g.h || v[yy * g.w + xx] < 0) continue;
          sum += v[yy * g.w + xx]; n++;
        }
      b[y * g.w + x] = sum / n;
    }
  const h = (WHALE.w * g.h) / g.w;
  return (x, y) => {
    const fx = ((x - WHALE.x) / WHALE.w) * g.w - 0.5;
    const fy = ((y - WHALE.y) / h) * g.h - 0.5;
    const x0 = Math.floor(fx), y0 = Math.floor(fy);
    if (x0 < -1 || y0 < -1 || x0 >= g.w || y0 >= g.h) return null;
    // bilinear over the four neighbours; open-water corners count as null
    let sum = 0, wsum = 0, open = 0;
    for (const [cx, cy, w] of [[x0, y0, (1 - (fx - x0)) * (1 - (fy - y0))], [x0 + 1, y0, (fx - x0) * (1 - (fy - y0))],
      [x0, y0 + 1, (1 - (fx - x0)) * (fy - y0)], [x0 + 1, y0 + 1, (fx - x0) * (fy - y0)]]) {
      const val = cx < 0 || cy < 0 || cx >= g.w || cy >= g.h ? -1 : b[cy * g.w + cx];
      if (val < 0) { open += w; continue; }
      sum += val * w; wsum += w;
    }
    if (open > 0.5 || wsum === 0) return null;
    return sum / wsum;
  };
}

// The fish from the logo, leaping out above the whale's blowhole: the whale
// spouts a fish, fish². Anything above the water is a solid ink cut with
// white details; anything below it exists only as line weight.
const FISH = { w: 150 };
function leapingFish() {
  // the spout's foot is at x 300 of the logo, 110 px into the 240-px crop;
  // the blowhole is at x 300 of the 524-px whale crop that starts at x 60
  const k = FISH.w / 1000;
  const x0 = WHALE.x + (240 / 524) * WHALE.w - (110 / 240) * FISH.w;
  const y0 = S.top + 6 - FISH.w * A.fish.aspect;
  return { fish: place(A.fish.d, k, x0, y0), spout: place(A.spout.d, k, x0, y0) };
}

// ── layers ──────────────────────────────────────────────────────────────
function waterLines() {
  const tone = whaleTone();
  const rand = rng(20260924);
  const strokes = []; // [d, width]
  const fills = [];
  for (let i = 0; i < S.lines; i++) {
    const t = i / (S.lines - 1);
    const y0 = depthY(t);
    const gap = ((S.bottom - S.top) / (S.lines - 1)) * depthScale(t);
    const amp = 0.8 + 1.4 * t;
    const lam = 170 + rand() * 120;
    const ph = rand() * Math.PI * 2;
    const wave = (x) => y0 + amp * Math.sin((x / lam) * Math.PI * 2 + ph);
    const xs = M + 8 + rand() * 70 * (1 - t) + rand() * 24;
    const xe = W - M - 8 - rand() * 70 * (1 - t) - rand() * 24;
    const base = Math.max(1.3, S.base * gap);

    // walk the line in short steps; a run is a stretch of equal weight
    const step = 2.5;
    let x = xs, dashLeft = 40 + rand() * 200;
    let run = null;
    const flush = () => {
      if (!run || run.pts.length < 2) { run = null; return; }
      if (run.kind === "plain") {
        const [a, b] = [run.pts[0], run.pts[run.pts.length - 1]];
        let d = `M${f1(a[0])} ${f1(a[1])}`;
        for (let k = 1; k < run.pts.length; k += 4) d += `L${f1(run.pts[k][0])} ${f1(run.pts[k][1])}`;
        d += `L${f1(b[0])} ${f1(b[1])}`;
        strokes.push([d, base]);
      } else {
        const top = run.pts.map(([px, py, w]) => `${f1(px)} ${f1(py - w / 2)}`);
        const bot = run.pts.slice().reverse().map(([px, py, w]) => `${f1(px)} ${f1(py + w / 2)}`);
        fills.push(`M${top.join("L")}L${bot.join("L")}Z`);
      }
      run = null;
    };
    while (x <= xe) {
      const y = wave(x);
      const tv = tone(x, y0);
      let kind, w;
      if (tv === null) { kind = "plain"; w = base; }
      else { kind = "tone"; w = tv * gap; }
      // taper the free ends of each line
      const edge = Math.min(x - xs, xe - x);
      if (kind === "plain" && edge < 18) { kind = "tone"; w = base * Math.max(0.15, edge / 18); }
      if (kind === "plain") {
        dashLeft -= step;
        if (dashLeft <= 0) {
          flush();
          x += 3 + rand() * 9 * (0.6 + t);
          dashLeft = 40 + rand() * 220;
          continue;
        }
      }
      if (w <= 0.05) { flush(); x += step; continue; }
      if (!run || run.kind !== kind) {
        const prev = run && run.pts[run.pts.length - 1];
        flush();
        run = { kind, pts: prev ? [prev] : [] };
      }
      run.pts.push([x, y, w]);
      x += step;
    }
    flush();
  }
  return { strokes, fills };
}

function ripples(days) {
  const rand = rng(7);
  const knock = [], rings = [];
  const cols = days.length ? days[days.length - 1].week + 1 : 53;
  const dx = (S.x1 - S.x0) / Math.max(1, cols - 1);
  for (const d of days) {
    if (!d.level) continue;
    const t = rowT(d.weekday);
    const s = depthScale(t);
    const cx = S.x0 + d.week * dx;
    const cy = depthY(t);
    for (let k = 1; k <= d.level + 1; k++) {
      const rx = s * (3 + 6.5 * k);
      const ry = rx * 0.3;
      const a = 20 + rand() * 45, b = 4 + rand() * 9;
      const dash = `${f1(a)} ${f1(b)} ${f1(90 - a - b - 6)} 6`;
      const off = f1(rand() * 100);
      knock.push(`<ellipse cx="${f1(cx)}" cy="${f1(cy)}" rx="${f1(rx)}" ry="${f1(ry)}"/>`);
      rings.push(`<ellipse cx="${f1(cx)}" cy="${f1(cy)}" rx="${f1(rx)}" ry="${f1(ry)}" pathLength="96" stroke-dasharray="${dash}" stroke-dashoffset="${off}" stroke-width="${f1(1.6 * s)}"/>`);
    }
  }
  return { knock, rings, dx };
}

// The fisherman: a sampan, a straw cape and hat, a rod held out over
// today's cell. Shapes are authored around the hull's waterline and placed
// with one transform.
const BOAT = { x: 1440, t: 0.4, k: 1.05 };
function angler(fx, fy) {
  const by = depthY(BOAT.t) + 2;
  const k = BOAT.k * depthScale(BOAT.t);
  const hull = "M-96 -17Q-78 -2 -52 6L52 6Q84 0 102 -22Q80 -10 50 -8L-50 -8Q-80 -8 -96 -17Z";
  const cape = "M-40 -8L-31 -38Q-24 -45 -15 -39L-4 -8Z";
  const hat = "M-56 -37L-23 -56L10 -38Q-23 -42 -56 -37Z";
  const carve = "M-56 -1L60 -1M-31 -33L-34 -12M-24 -35L-25 -12M-17 -33L-15 -12";
  const knock = "M-106 -24L112 -30L94 16L-64 16Z";
  const reflect = "M-60 16h40M-8 15h52M-38 24h30M20 25h24M-20 32h18";
  // hands in art space; the rod bends up and out to a tip above the float
  const hx = BOAT.x - 38 * k, hy = by - 24 * k;
  const tipX = fx - 4, tipY = S.top - 26;
  const rod = `M${f1(hx)} ${f1(hy)}Q${f1(hx - 20)} ${f1(tipY + 8)} ${f1(tipX)} ${f1(tipY)}`;
  const line = `M${f1(tipX)} ${f1(tipY)}Q${f1(tipX - 2)} ${f1((tipY + fy) / 2)} ${f1(fx)} ${f1(fy - 5)}`;
  const g = `translate(${BOAT.x} ${f1(by)}) scale(${f1(k * 100) / 100})`;
  return { g, hull, cape, hat, carve, knock, reflect, rod, line, float: [fx, fy] };
}

// ── compose ─────────────────────────────────────────────────────────────
function monthLabels(days, dx) {
  const names = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
  const out = [];
  let last = -1;
  for (const d of days) {
    const m = +d.date.slice(5, 7) - 1;
    if (d.weekday !== 0 && d !== days[0]) continue;
    if (m === last) continue;
    last = m;
    const x = S.x0 + d.week * dx;
    if (d === days[0] && +d.date.slice(8, 10) > 7) continue; // partial first month
    out.push(monoText(names[m], x - 6, S.bottom + 42, 18, 2).d);
  }
  return out.join("");
}

function svg(theme, cal) {
  const T = THEMES[theme];
  const days = cal.weeks.flatMap((w, wi) =>
    w.contributionDays.map((d) => ({
      date: d.date, weekday: d.weekday, count: d.contributionCount, week: wi,
      level: ["NONE", "FIRST_QUARTILE", "SECOND_QUARTILE", "THIRD_QUARTILE", "FOURTH_QUARTILE"].indexOf(d.contributionLevel),
    })),
  );
  const today = days[days.length - 1];
  const water = waterLines();
  const leap = leapingFish();
  const rip = ripples(days);
  const fx = S.x0 + today.week * rip.dx;
  const fy = depthY(rowT(today.weekday));
  const ang = angler(fx, fy);

  // header type
  const kicker = monoText("SILAS SU · BEIJING", M, 98, 20, 5.5);
  const s = A.strings;
  const wm = 124 / 1000;
  const wmY = 218;
  const fishD = place(s.wordmark_fish.d, wm, M - 5, wmY);
  const twoX = M - 5 + s.wordmark_fish.advance * wm - 1;
  const twoD = place(s.wordmark_2.d, wm * 0.44, twoX, wmY - 58);
  const labX = twoX + s.wordmark_2.advance * wm * 0.44 + 1;
  const labD = place(s.wordmark_lab.d, wm, labX, wmY);
  const subD = place(s.subline.d, 32 / 1000, M, 268);

  // poem, two columns read right to left, with a seal under the second
  const cs = 26, lead = 31, py = 80;
  const colR = W - M - cs, colL = colR - 40;
  const poem = A.poem.map((col, ci) =>
    col.map((g, k) => place(g, cs / 1000, ci === 0 ? colR : colL, py + k * lead + cs * 0.88)).join(""),
  ).join("");
  const sealX = colL + 1, sealY = py + 7 * lead + 10, sealS = 25;
  const sealD = place(A.seal, (sealS - 6) / 1000, sealX + 3, sealY + 3 + (sealS - 6) * 0.88);

  const total = cal.totalContributions;
  const cap = monoText(`${total} CONTRIBUTIONS IN THE LAST YEAR · REDRAWN ${today.date}`, W - M, H - 30, 18, 2, "end");

  const [flx, fly] = ang.float;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img">
<title>fish²lab — Silas Su. ${total} contributions in the last year, drawn as ripples on a stream.</title>
<style>
.p{fill:${T.paper}}.i{fill:${T.ink}}.m{fill:${T.muted}}.s{fill:${T.soft}}.r{fill:${T.red}}
.ls{fill:none;stroke:${T.ink};stroke-linecap:round}
.ko{fill:none;stroke:${T.paper}}
.now ellipse{fill:none;stroke:${T.ink};stroke-width:1.6;transform-box:fill-box;transform-origin:center;animation:ring 4.8s cubic-bezier(.2,.6,.3,1) infinite;opacity:0}
.now ellipse:nth-child(2){animation-delay:1.6s}.now ellipse:nth-child(3){animation-delay:3.2s}
@keyframes ring{0%{transform:scale(.25);opacity:0}12%{opacity:.9}100%{transform:scale(1.6);opacity:0}}
.bob{animation:bob 4.8s ease-in-out infinite}
@keyframes bob{0%,100%{transform:translateY(0)}50%{transform:translateY(1.6px)}}
@media (prefers-reduced-motion:reduce){.now ellipse,.bob{animation:none}.now ellipse:first-child{opacity:.8;transform:scale(1)}}
</style>
<rect class="p" width="${W}" height="${H}"/>
<rect width="${W - 2}" height="${H - 2}" x="1" y="1" fill="none" stroke="${T.rule}" stroke-width="2"/>
<g class="ls">${water.strokes.map(([d, w]) => `<path d="${d}" stroke-width="${f1(w)}"/>`).join("")}</g>
<path class="i" d="${water.fills.join("")}"/>
<path class="i" d="${leap.spout}${leap.fish}"/>
<g class="ko" stroke-width="5">${rip.knock.join("")}</g>
<g fill="none" stroke="${T.ink}" stroke-linecap="round">${rip.rings.join("")}</g>
<g transform="${ang.g}">
<path class="p" d="${ang.knock}"/>
<path class="ls" stroke-width="2.2" d="${ang.reflect}"/>
<path class="i" d="${ang.hull}${ang.cape}${ang.hat}"/>
<path fill="none" stroke="${T.paper}" stroke-width="1.8" stroke-linecap="round" d="${ang.carve}"/>
</g>
<path class="ls" stroke-width="2.6" d="${ang.rod}"/>
<path class="ls" stroke-width="1.1" d="${ang.line}"/>
<g class="now">${[0, 1, 2].map(() => `<ellipse cx="${f1(flx)}" cy="${f1(fly)}" rx="22" ry="7.5"/>`).join("")}</g>
<g class="bob"><ellipse class="r" cx="${f1(flx)}" cy="${f1(fly - 4)}" rx="3.2" ry="4.2"/></g>
<path class="r" d="${kicker.d}"/>
<path class="i" d="${fishD}${labD}"/>
<path class="r" d="${twoD}"/>
<path class="s" d="${subD}"/>
<path class="i" d="${poem}"/>
<rect class="r" x="${sealX}" y="${sealY}" width="${sealS}" height="${sealS}" rx="2"/>
<path fill="${T.sealText}" d="${sealD}"/>
<path class="m" d="${monthLabels(days, rip.dx)}${cap.d}"/>
</svg>
`;
}

async function calendar() {
  if (process.env.CAL_JSON) return JSON.parse(fs.readFileSync(process.env.CAL_JSON, "utf8"));
  const token = process.env.GITHUB_TOKEN;
  if (!token) throw new Error("set GITHUB_TOKEN or CAL_JSON");
  const query = `query($l:String!){user(login:$l){contributionsCollection{contributionCalendar{totalContributions weeks{contributionDays{date weekday contributionCount contributionLevel}}}}}}`;
  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: { authorization: `bearer ${token}`, "content-type": "application/json", "user-agent": "fish2lab-profile-art" },
    body: JSON.stringify({ query, variables: { l: LOGIN } }),
  });
  const json = await res.json();
  if (!res.ok || json.errors) throw new Error(JSON.stringify(json.errors || json));
  return json;
}

const out = process.argv[2] || "dist";
const cal = (await calendar()).data.user.contributionsCollection.contributionCalendar;
fs.mkdirSync(out, { recursive: true });
for (const [theme, file] of [["light", "stream.svg"], ["dark", "stream-dark.svg"]]) {
  const body = svg(theme, cal);
  fs.writeFileSync(path.join(out, file), body);
  console.log(`${file} ${(body.length / 1024).toFixed(1)} KB`);
}
