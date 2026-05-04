#!/usr/bin/env python3
"""
Subset Inter Variable + Playfair Display Variable for goldoni-website.

Re-run only when source fonts change. Output files are committed to git.

Usage:
    python3 -m venv /tmp/font-venv
    /tmp/font-venv/bin/pip install fonttools brotli
    /tmp/font-venv/bin/python scripts/subset-fonts.py

Strategy:
- Inter (Variable): limit wght axis to 400-700 (was 100-900), pin opsz to default 14.
  Keeps Variable file but drops glyph variations we never use.
  Used weights per codebase: 400 (font-normal), 500 (font-medium),
  600 (font-semibold), 700 (font-bold).
- Playfair Display (Variable): instance to single weight 600 (Display Headings).
  Used per style-guide: Display + Heading at 600.

Both source fonts already have tight Latin coverage (~230 glyphs incl. German
umlauts + Italian accents + €). No further glyph subsetting required.

Saves ~51 KiB per pageload (109 -> 58 KiB combined).
"""
from pathlib import Path
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont

FONTS_DIR = Path(__file__).resolve().parent.parent / "src" / "fonts"


def subset_inter() -> None:
    src = FONTS_DIR / "Inter-Variable.woff2"
    dst = FONTS_DIR / "Inter-Variable-subset.woff2"
    f = TTFont(src)
    instance = instantiateVariableFont(
        f,
        {"opsz": 14, "wght": (400, 700)},
        inplace=False,
        optimize=True,
    )
    instance.flavor = "woff2"
    instance.save(dst)
    src_size = src.stat().st_size
    dst_size = dst.stat().st_size
    print(
        f"Inter:    {src_size//1024} KiB -> {dst_size//1024} KiB  "
        f"({(1 - dst_size/src_size)*100:.0f}% reduction)"
    )


def subset_playfair() -> None:
    src = FONTS_DIR / "PlayfairDisplay-Variable.woff2"
    dst = FONTS_DIR / "PlayfairDisplay-Subset.woff2"
    f = TTFont(src)
    instance = instantiateVariableFont(
        f,
        {"wght": 600},
        inplace=False,
        optimize=True,
    )
    instance.flavor = "woff2"
    instance.save(dst)
    src_size = src.stat().st_size
    dst_size = dst.stat().st_size
    print(
        f"Playfair: {src_size//1024} KiB -> {dst_size//1024} KiB  "
        f"({(1 - dst_size/src_size)*100:.0f}% reduction)"
    )


if __name__ == "__main__":
    subset_inter()
    subset_playfair()
