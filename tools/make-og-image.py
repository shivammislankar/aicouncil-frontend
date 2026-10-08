"""Generates public/og-image.png (1200x630) - the Open Graph share card for Veritas.

Re-run with:  python tools/make-og-image.py
Replace the output file if you ever redesign the brand.
"""
from PIL import Image, ImageDraw, ImageFont
import os

W, H = 1200, 630

BG = (17, 24, 39)        # #111827  (dark --background)
CARD = (31, 41, 55)      # #1F2937
BORDER = (55, 65, 81)    # #374151
FG = (243, 244, 246)     # #F3F4F6  (dark --foreground)
MUTED = (156, 163, 175)  # #9CA3AF
DIM = (107, 114, 128)    # #6B7280

FONT_DIR = r"C:\Windows\Fonts"


def font(name, size):
    return ImageFont.truetype(os.path.join(FONT_DIR, name), size)


def tracked(draw, xy, text, f, fill, spacing=0, anchor="la"):
    """draw.text with letter-spacing (PIL has no native tracking)."""
    x, y = xy
    if anchor[0] == "m":
        widths = [draw.textlength(c, font=f) + spacing for c in text]
        total = sum(widths) - spacing
        x -= total / 2
    elif anchor[0] == "r":
        widths = [draw.textlength(c, font=f) + spacing for c in text]
        total = sum(widths) - spacing
        x -= total
    for c in text:
        draw.text((x, y), c, font=f, fill=fill, anchor="l" + anchor[1])
        x += draw.textlength(c, font=f) + spacing
    return x


def wrap(draw, text, f, max_width):
    words, lines, cur = text.split(), [], ""
    for w in words:
        trial = (cur + " " + w).strip()
        if draw.textlength(trial, font=f) <= max_width:
            cur = trial
        else:
            lines.append(cur)
            cur = w
    if cur:
        lines.append(cur)
    return lines


img = Image.new("RGB", (W, H), BG)
d = ImageDraw.Draw(img, "RGBA")

# --- soft radial glow, top right (keeps the flat monochrome brand from looking dead) ---
glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
gd = ImageDraw.Draw(glow)
for r in range(520, 0, -10):
    a = int(46 * (1 - r / 520) ** 2)
    gd.ellipse([1040 - r, -60 - r, 1040 + r, -60 + r], fill=(255, 255, 255, a))
img = Image.alpha_composite(img.convert("RGBA"), glow).convert("RGB")
d = ImageDraw.Draw(img, "RGBA")

# --- card frame ---
d.rounded_rectangle([48, 48, W - 48, H - 48], radius=28, outline=BORDER, width=2, fill=(255, 255, 255, 4))

# --- badge pill ---
badge_f = font("segoeuib.ttf", 17)
badge = "MULTI-PERSPECTIVE AI REASONING"
TRACK = 1.6
# tracked() adds TRACK after every glyph, so the pill must be sized on
# glyph widths + tracking, not on the plain textlength.
bw = d.textlength(badge, font=badge_f) + TRACK * len(badge) + 44
d.rounded_rectangle([84, 96, 84 + bw, 142], radius=23, outline=BORDER, width=2)
tracked(d, (84 + bw / 2, 111), badge, badge_f, MUTED, spacing=TRACK, anchor="ma")

# --- headline ---
title_f = font("segoeuib.ttf", 78)
d.text((84, 178), "The Veritas Approach", font=title_f, fill=FG, anchor="la")
d.text((84, 266), "to AI", font=title_f, fill=FG, anchor="la")

# --- subtitle ---
sub_f = font("segoeui.ttf", 27)
sub = "Five specialized AI roles work together to solve problems better."
for i, line in enumerate(wrap(d, sub, sub_f, 940)):
    d.text((84, 376 + i * 38), line, font=sub_f, fill=MUTED, anchor="la")

# --- the five roles, as chips ---
roles = ["Analyst", "Strategist", "Critic", "Optimizer", "Synthesizer"]
chip_f = font("segoeuib.ttf", 21)
x = 84
for r in roles:
    cw = d.textlength(r, font=chip_f) + 40
    d.rounded_rectangle([x, 464, x + cw, 512], radius=14, fill=CARD, outline=BORDER, width=1)
    d.text((x + cw / 2, 477), r, font=chip_f, fill=FG, anchor="ma")
    x += cw + 14

# --- url (clear of the card frame, whose bottom edge sits at H-48) ---
d.text((84, 542), "ai-council-one-livid.vercel.app", font=font("segoeui.ttf", 22), fill=DIM, anchor="la")

out = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "public", "og-image.png")
img.save(out, "PNG", optimize=True)
print("wrote", out, img.size, os.path.getsize(out), "bytes")
