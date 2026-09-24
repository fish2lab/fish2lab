# The header picture

`render.mjs` draws the picture at the top of [github.com/fish2lab](https://github.com/fish2lab) from the last year of GitHub contributions. The [`art` workflow](../.github/workflows/art.yml) runs it every night and force-pushes `stream.svg` and `stream-dark.svg` to the [`output`](https://github.com/fish2lab/fish2lab/tree/output) branch, which the profile README reads through a `<picture>` element so GitHub picks the version that matches your theme. The pipeline is the one [Platane/snk](https://github.com/Platane/snk) uses for its contribution snake.

## What is in it

The picture is one engraved stream of 42 lines, spaced wider towards the viewer. Each day with contributions drops a ripple on it, placed the way the contribution calendar further down the profile places its squares: weeks run left to right, Sunday is the far row and Saturday the near one, and a busier day gets more rings, using GitHub's own four quartiles. The fisherman's line hangs over today, where a red float bobs and rings keep spreading; the animation stops if your system asks for reduced motion.

The whale and the fish come from the fish²lab logo. Under the water the whale exists only as the weight of the water lines. Each line swells where the logo's body is dark, thins over the pale belly and lip stripe, and breaks for the eye and for a narrow halo around the body, which is how a banknote engraver builds a portrait out of parallel lines. Above the water everything is a solid ink cut with white details: the fish riding its spout, the boat, the straw hat and cape. In dark mode the ink turns into white scratches on black, the scratchboard look of the [booth film](https://github.com/fish2lab/bjtu-touhou-booth).

Type and colour follow [fish2lab.com](https://fish2lab.com): Gelasio for the wordmark and the subline, spaced Ubuntu Mono capitals for labels, one red (`#b71c1c`) for the kicker, the ² and the seal, on the site's warm paper (`#faf8f4`). The two columns on the right are Li Bai's 闲来垂钓碧溪上，忽复乘舟梦日边, the line in the profile bio.

## How it is built

An SVG shown through `<img>` cannot load web fonts, so every letter is an outline. `tools/build_assets.py` shapes the fixed strings with HarfBuzz and pulls glyph outlines out of the fonts with fontTools, sorts the logo's colours into the classes that make the whale's tone map, traces the fish and its spout with potrace, and writes all of it into `assets.json`. The nightly run needs nothing but Node: it reads that file, asks the GraphQL API for the calendar, and writes the two SVGs. Line breaks, wave phases and ring gaps come from a fixed seed, so the water only changes where the data does.

```sh
# redraw with your own token
GITHUB_TOKEN=$(gh auth token) node art/render.mjs dist

# rebuild assets.json after changing a fixed string, a font or the logo
brew install potrace
uv venv tools/.venv
uv pip install --python tools/.venv/bin/python fonttools uharfbuzz numpy pillow scipy
tools/.venv/bin/python tools/build_assets.py
```

The fonts are not in the repository. Put `Gelasio[wght].ttf`, `Gelasio-Italic[wght].ttf` (both from `ofl/gelasio` in [google/fonts](https://github.com/google/fonts)), `UbuntuMono-Regular.ttf` (`ufl/ubuntumono`) and `NotoSerifSC-VF.ttf` ([notofonts/noto-cjk](https://github.com/notofonts/noto-cjk)) in `tools/fonts/`. Gelasio and Noto Serif SC are under the SIL Open Font License, Ubuntu Mono under the Ubuntu Font Licence; the outlines in `assets.json` are drawn from them for this picture only.

## 中文说明

页首这张图每晚由 GitHub Actions 按过去一年的贡献日历重画。一条刻线的溪流，有贡献的日子在水面落一圈涟漪，位置和主页下方的贡献格子一一对应：周从左到右，周日在远处，周六在近处，越忙的日子圈越多。渔翁的钓线垂在今天那一格上。水下的鲸鱼只靠水面线条的粗细显形，水面以上的鱼、水柱、小舟和斗笠是实心墨块加白线刻出的细节，暗色模式下整张图变成黑底白线的刮画。字体和配色照搬 fish2lab.com。
