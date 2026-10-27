// Draws the profile header.
//
//   node art/render.mjs [outDir]     default outDir: art
//
// Writes header.svg (light) and header-dark.svg. No dependencies and no
// network: glyph outlines and the fish from the logo come pre-baked in
// art/assets.json (see tools/build_assets.py). Re-run only when the layout
// or assets.json changes; the SVGs are committed next to this file.
//
// The picture is the fish²lab wordmark beside a school of fish on a
// logarithmic spiral. Each fish is the last one scaled by Q and turned a
// fixed step further in, fish², fish³, … down to a red point at the
// centre: the fixed point a self-improving loop either reaches or misses.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const A = JSON.parse(fs.readFileSync(path.join(HERE, "assets.json"), "utf8"));

const W = 1600;
const H = 420;
const M = 72; // outer margin

const THEMES = {
  light: {
    paper: "#faf8f4", ink: "#26231f", soft: "#5a544c", muted: "#9c9285",
    rule: "#ddd6ca", red: "#b71c1c",
  },
  dark: {
    paper: "#161512", ink: "#e9e3d7", soft: "#bdb5a6", muted: "#80796d",
    rule: "#2d2a25", red: "#d24a3f",
  },
};

// ── the spiral ──────────────────────────────────────────────────────────
const SP = {
  cx: 1268, cy: 226,  // limit point
  r0: 176,            // radius of the outermost fish
  w0: 104,            // width of the outermost fish
  q: 0.88,            // scale from one fish to the next
  theta0: -2.5,       // where the outermost fish sits (radians, y down)
  minW: 3.5,          // stop once a fish is smaller than this
};
// spacing so that consecutive fish leave a gap of about a fifth of a body
SP.step = (1.18 * SP.w0) / SP.r0;
SP.b = -Math.log(SP.q) / SP.step; // r(θ) = r0 · e^(−b(θ−θ0))

const f1 = (v) => (Math.round(v * 10) / 10).toString();
const deg = (a) => (a * 180) / Math.PI;

function spiralPoint(t) {
  const r = SP.r0 * Math.exp(-SP.b * (t - SP.theta0));
  return [SP.cx + r * Math.cos(t), SP.cy + r * Math.sin(t), r];
}

function school() {
  const fish = [];
  for (let i = 0; ; i++) {
    const w = SP.w0 * SP.q ** i;
    if (w < SP.minW) break;
    const t = SP.theta0 + i * SP.step;
    const [x, y, r] = spiralPoint(t);
    // heading along the curve towards the centre
    const dx = -SP.b * r * Math.cos(t) - r * Math.sin(t);
    const dy = -SP.b * r * Math.sin(t) + r * Math.cos(t);
    fish.push({ x, y, w, angle: deg(Math.atan2(dy, dx)) });
  }
  return fish;
}

// a fine engraved guide line along the spiral, from outside the first fish in
function guide() {
  const pts = [];
  for (let t = SP.theta0 - 0.35; t < SP.theta0 + 40; t += 0.04) {
    const [x, y, r] = spiralPoint(t);
    if (r < 1.2) break;
    pts.push(`${f1(x)} ${f1(y)}`);
  }
  return "M" + pts.join("L");
}

// ── type ────────────────────────────────────────────────────────────────
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

function monoText(str, x, y, size, track = 0) {
  const adv = (A.mono.advance / 1000) * size + track;
  let cx = x;
  const parts = [];
  for (const ch of str) {
    const g = A.mono.glyphs[ch];
    if (g) parts.push(place(g, size / 1000, cx, y));
    cx += adv;
  }
  return parts.join("");
}

function svg(theme) {
  const T = THEMES[theme];
  const s = A.strings;

  const kicker = monoText("SILAS SU · BEIJING", M, 104, 20, 5.5);
  const wm = 124 / 1000;
  const wmY = 224;
  const fishD = place(s.wordmark_fish.d, wm, M - 5, wmY);
  const twoX = M - 5 + s.wordmark_fish.advance * wm - 1;
  const twoD = place(s.wordmark_2.d, wm * 0.44, twoX, wmY - 58);
  const labX = twoX + s.wordmark_2.advance * wm * 0.44 + 1;
  const labD = place(s.wordmark_lab.d, wm, labX, wmY);
  const subD = place(s.subline.d, 32 / 1000, M, 276);
  const foot = monoText("PHD STUDENT · BEIJING JIAOTONG UNIVERSITY", M, 340, 16, 3.5);

  // the logo fish faces left; mirror it so it heads along +x, then turn it
  const fh = 1000 * A.fish.aspect;
  const uses = school().map(({ x, y, w, angle }) =>
    `<use href="#f" transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(angle)}) scale(${(-w / 1000).toFixed(4)} ${(w / 1000).toFixed(4)}) translate(-500 ${f1(-fh / 2)})"/>`,
  ).join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img">
<title>fish²lab — Silas Su. Recursive self-improvement and agent security. A school of fish on a spiral, each one a smaller copy of the last, converging on a red point.</title>
<defs><path id="f" d="${A.fish.d}"/></defs>
<rect fill="${T.paper}" width="${W}" height="${H}"/>
<rect width="${W - 2}" height="${H - 2}" x="1" y="1" fill="none" stroke="${T.rule}" stroke-width="2"/>
<path fill="none" stroke="${T.muted}" stroke-width="1" stroke-dasharray="2 5" stroke-linecap="round" d="${guide()}"/>
<g fill="${T.ink}" fill-rule="evenodd">${uses}</g>
<circle cx="${SP.cx}" cy="${SP.cy}" r="3.2" fill="${T.red}"/>
<path fill="${T.red}" d="${kicker}"/>
<path fill="${T.ink}" d="${fishD}${labD}"/>
<path fill="${T.red}" d="${twoD}"/>
<path fill="${T.soft}" d="${subD}"/>
<path fill="${T.muted}" d="${foot}"/>
</svg>
`;
}

const out = process.argv[2] || HERE;
fs.mkdirSync(out, { recursive: true });
for (const [theme, file] of [["light", "header.svg"], ["dark", "header-dark.svg"]]) {
  const body = svg(theme);
  fs.writeFileSync(path.join(out, file), body);
  console.log(`${file} ${(body.length / 1024).toFixed(1)} KB`);
}
