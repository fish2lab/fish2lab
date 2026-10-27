# The header picture

`render.mjs` draws the picture at the top of [github.com/fish2lab](https://github.com/fish2lab). It writes `header.svg` and `header-dark.svg` into this folder, and the profile README picks one through a `<picture>` element so GitHub shows the version that matches your theme. Nothing redraws it on a schedule; run the script again after changing the layout or the assets.

## What is in it

On the left is the fish²lab wordmark with the current research line under it. On the right is a school of fish on a logarithmic spiral. Every fish is the fish from the fish²lab logo, scaled to 0.88 of the one before it and placed one fixed step further along the curve, so the school gets smaller and smaller until it reaches a red point at the centre. fish², fish³ and so on is the joke in the name. Read as a diagram, it is a self-improving loop: each round is built from the last one, and the question is whether it converges on the point you meant it to. In dark mode the ink becomes pale on black.

Type and colour follow [fish2lab.com](https://fish2lab.com): Gelasio for the wordmark and the subline, spaced Ubuntu Mono capitals for labels, one red (`#b71c1c`) for the kicker, the ² and the centre point, on the site's warm paper (`#faf8f4`).

## How it is built

An SVG shown through `<img>` cannot load web fonts, so every letter is an outline. `tools/build_assets.py` shapes the fixed strings with HarfBuzz, pulls glyph outlines out of the fonts with fontTools, traces the fish from the logo with potrace, and writes everything into `assets.json`. `render.mjs` needs only Node: it reads that file and writes the two SVGs, with the fish defined once and reused through `<use>`.

```sh
node art/render.mjs

# rebuild assets.json after changing a fixed string, a font or the logo
brew install potrace
uv venv tools/.venv
uv pip install --python tools/.venv/bin/python fonttools uharfbuzz numpy pillow scipy
tools/.venv/bin/python tools/build_assets.py
```

The fonts are not in the repository. Put `Gelasio[wght].ttf`, `Gelasio-Italic[wght].ttf` (both from `ofl/gelasio` in [google/fonts](https://github.com/google/fonts)), `UbuntuMono-Regular.ttf` (`ufl/ubuntumono`) and `NotoSerifSC-VF.ttf` ([notofonts/noto-cjk](https://github.com/notofonts/noto-cjk)) in `tools/fonts/`. Gelasio and Noto Serif SC are under the SIL Open Font License, Ubuntu Mono under the Ubuntu Font Licence; the outlines in `assets.json` are drawn from them for this picture only.

## 中文说明

页首图左边是 fish²lab 字标和当前研究方向，右边是一群沿对数螺线游向中心的鱼。每条鱼都取自 fish²lab 标志，比前一条缩小到 0.88 倍、沿曲线前进固定一步，一直缩到中心的红点。fish²、fish³ 是名字里的玩笑；当图看，它就是一个自我改进的循环：每一轮都从上一轮造出来，要问的是它最后收敛到的是不是你想要的那个点。图是静态的，改布局或素材后手动重跑 `render.mjs`。字体和配色照搬 fish2lab.com。
