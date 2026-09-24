"""One-off: turn fonts and the logo into art/assets.json for art/render.mjs.

The daily workflow never runs this. Re-run it only when a static string,
a font, or the logo changes:

    uv venv tools/.venv && uv pip install --python tools/.venv/bin/python \
        fonttools uharfbuzz numpy pillow
    tools/.venv/bin/python tools/build_assets.py

Fonts go in tools/fonts/ (git-ignored): Gelasio[wght].ttf and
Gelasio-Italic[wght].ttf from google/fonts ofl/gelasio, UbuntuMono-Regular.ttf
from ufl/ubuntumono, NotoSerifSC-VF.ttf from notofonts/noto-cjk.

Glyphs are stored as SVG path data on a 1000-unit em, y pointing down,
baseline at 0, so render.mjs only has to translate and scale.
"""

import base64
import io
import json
import re
import subprocess
from pathlib import Path

import numpy as np
import uharfbuzz as hb
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
FONTS = ROOT / "tools" / "fonts"
OUT = ROOT / "art" / "assets.json"

# Static strings set in the header. Keys are what render.mjs asks for.
SERIF = {
    "wordmark_fish": "fish",
    "wordmark_2": "2",
    "wordmark_lab": "lab",
}
SERIF_ITALIC = {
    "subline": "LLM security & agent harnesses",
}
POEM = ["闲来垂钓碧溪上", "忽复乘舟梦日边"]
SEAL = "苏"
MONO_CHARS = "".join(chr(c) for c in range(32, 127)) + "·→—²"


def load(name, wght=None):
    font = TTFont(FONTS / name)
    if wght is not None and "fvar" in font:
        font = instantiateVariableFont(font, {"wght": wght})
    buf = io.BytesIO()
    font.save(buf)
    return font, buf.getvalue()


def glyph_path(font, gname, scale, dx=0.0, dy=0.0):
    gs = font.getGlyphSet()
    pen = SVGPathPen(gs, lambda v: f"{v:.1f}".rstrip("0").rstrip("."))
    # font units → 1000/em, flip y so the baseline sits at 0 with y down
    gs[gname].draw(TransformPen(pen, (scale, 0, 0, -scale, dx, dy)))
    return pen.getCommands()


def shape(font, blob, text):
    """Shape with HarfBuzz so kerning and ligatures match the font."""
    upem = font["head"].unitsPerEm
    scale = 1000 / upem
    hbfont = hb.Font(hb.Face(blob))
    buf = hb.Buffer()
    buf.add_str(text)
    buf.guess_segment_properties()
    hb.shape(hbfont, buf, {"liga": True, "kern": True})
    order = font.getGlyphOrder()
    parts, x = [], 0.0
    for info, pos in zip(buf.glyph_infos, buf.glyph_positions):
        d = glyph_path(font, order[info.codepoint], scale,
                       x + pos.x_offset * scale, -pos.y_offset * scale)
        if d:
            parts.append(d)
        x += pos.x_advance * scale
    return {"d": " ".join(parts), "advance": round(x, 1)}


def build_text():
    serif, serif_blob = load("Gelasio[wght].ttf", 500)
    italic, italic_blob = load("Gelasio-Italic[wght].ttf", 400)
    mono, _ = load("UbuntuMono-Regular.ttf")
    cjk, _ = load("NotoSerifSC-VF.ttf", 500)
    cjk_bold, _ = load("NotoSerifSC-VF.ttf", 900)

    strings = {k: shape(serif, serif_blob, v) for k, v in SERIF.items()}
    strings.update({k: shape(italic, italic_blob, v) for k, v in SERIF_ITALIC.items()})

    cmap = mono.getBestCmap()
    mscale = 1000 / mono["head"].unitsPerEm
    mono_adv = mono["hmtx"][cmap[ord("M")]][0] * mscale
    glyphs = {}
    for ch in MONO_CHARS:
        if ord(ch) in cmap:
            glyphs[ch] = glyph_path(mono, cmap[ord(ch)], mscale)

    def cjk_glyph(font, ch):
        c = font.getBestCmap()[ord(ch)]
        s = 1000 / font["head"].unitsPerEm
        # centre the ideograph in its em box: x 0..1000, y -880..120
        return glyph_path(font, c, s)

    poem = [[cjk_glyph(cjk, ch) for ch in col] for col in POEM]
    seal = cjk_glyph(cjk_bold, SEAL)
    return {
        "strings": strings,
        "mono": {"advance": round(mono_adv, 1), "glyphs": glyphs},
        "poem": poem,
        "seal": seal,
    }


# Colour classes of the logo whale. render.mjs maps each class to a line
# weight, so the tone can be tuned without re-running this script.
CLASSES = {
    1: [(255, 255, 255)],                                  # sticker outline
    2: [(98, 160, 172), (110, 160, 172)],                  # teal body, fins
    3: [(160, 206, 208), (170, 206, 214)],                 # pale belly
    4: [(252, 230, 204), (242, 230, 206)],                 # cream lip stripe
    5: [(216, 230, 242), (206, 230, 242)],                 # belly pleats
    6: [(36, 36, 36)],                                     # eye
    7: [(52, 182, 222), (48, 180, 228)],                   # spout and drops
    9: [(96, 192, 230), (120, 204, 230), (84, 180, 230),   # fish belly
        (140, 208, 236), (48, 158, 206)],
    8: [(24, 98, 160), (24, 132, 192), (12, 132, 182),     # fish back
        (36, 144, 192)],
}


def build_whale():
    img = Image.open(ROOT / "assets" / "fish2lab-readme-logo-master.png").convert("RGBA")
    a = np.asarray(img).astype(np.float32)
    rgb, alpha = a[..., :3], a[..., 3]
    ids, cents = [], []
    for k, cs in CLASSES.items():
        for c in cs:
            ids.append(k)
            cents.append(c)
    cents = np.array(cents, np.float32)
    dist = ((rgb[..., None, :] - cents[None, None]) ** 2).sum(-1)
    cls = np.array(ids, np.uint8)[dist.argmin(-1)]
    cls[alpha < 128] = 0

    def crop(x0, y0, x1, y1, step):
        sub = cls[y0:y1, x0:x1]
        h, w = sub.shape[0] // step, sub.shape[1] // step
        # mode over each step×step block keeps hard class edges
        blocks = sub[: h * step, : w * step].reshape(h, step, w, step).transpose(0, 2, 1, 3).reshape(h, w, -1)
        out = np.zeros((h, w), np.uint8)
        for k in range(10):
            cnt = (blocks == k).sum(-1)
            better = cnt > (blocks == out[..., None]).sum(-1)
            out[better] = k
        return {"w": w, "h": h, "step": step,
                "data": base64.b64encode(out.tobytes()).decode()}

    # the whale body sits below the spout; the fish and its drops above it
    from scipy.ndimage import binary_dilation, binary_fill_holes
    fish = (cls == 8) | (cls == 9)
    # a carved gap between the fish and the water it rides on
    spout = (cls == 7) & ~binary_dilation(binary_fill_holes(fish | (cls == 5) | (cls == 6)), iterations=3)
    box = (190, 70, 430, 300)
    return {"whale": crop(60, 236, 584, 626, 2),
            "fish": trace(fish, *box), "spout": trace(spout, *box)}


def trace(mask, x0, y0, x1, y1):
    """Vectorise a mask with potrace; highlights and the eye stay as holes.

    Returns an absolute path on a 1000-unit width, y down, origin top-left.
    """
    sub = mask[y0:y1, x0:x1]
    h, w = sub.shape
    pbm = b"P4\n%d %d\n" % (w, h) + np.packbits(sub, axis=1).tobytes()
    svg = subprocess.run(["potrace", "-b", "svg", "-t", "6", "-O", "0.4", "-o", "-", "-"],
                         input=pbm, capture_output=True, check=True).stdout.decode()
    # potrace writes relative commands under translate(0,h) scale(0.1,-0.1)
    k = 1000 / w
    out, cx, cy, sx, sy = [], 0.0, 0.0, 0.0, 0.0
    fmt = lambda x, y: f"{x * 0.1 * k:.1f} {(h - y * 0.1) * k:.1f}"
    for d in re.findall(r'<path d="([^"]+)"', svg):
        for cmd, args in re.findall(r"([MmCcLlZz])([^MmCcLlZz]*)", d):
            nums = [float(v) for v in re.findall(r"-?\d+(?:\.\d+)?", args)]
            if cmd in "Zz":
                out.append("Z")
                cx, cy = sx, sy
            elif cmd in "Mm":
                cx, cy = (nums[0], nums[1]) if cmd == "M" else (cx + nums[0], cy + nums[1])
                sx, sy = cx, cy
                out.append("M" + fmt(cx, cy))
            elif cmd == "l":
                for i in range(0, len(nums), 2):
                    cx, cy = cx + nums[i], cy + nums[i + 1]
                    out.append("L" + fmt(cx, cy))
            elif cmd == "c":
                for i in range(0, len(nums), 6):
                    a = fmt(cx + nums[i], cy + nums[i + 1])
                    b = fmt(cx + nums[i + 2], cy + nums[i + 3])
                    cx, cy = cx + nums[i + 4], cy + nums[i + 5]
                    out.append(f"C{a} {b} {fmt(cx, cy)}")
    return {"d": "".join(out), "aspect": round(h / w, 4)}


if __name__ == "__main__":
    OUT.parent.mkdir(exist_ok=True)
    assets = build_text()
    assets.update(build_whale())
    OUT.write_text(json.dumps(assets, ensure_ascii=False, separators=(",", ":")))
    print(OUT, OUT.stat().st_size, "bytes")
