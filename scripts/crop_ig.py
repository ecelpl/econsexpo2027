# Crops the circular portrait from each Instagram Meet the Team slide.
# These slides are the identification source; the crops are interim headshots until the
# full-resolution files from the Drive headshot folder are matched.
import sys, numpy as np
from PIL import Image
src, out = sys.argv[1], sys.argv[2]
slides = {
 "kaya": "9f5ef0c2", "richelle": "073b0ba3", "alysa": "592fc6a7", "avinash": "47388374",
 "en": "cbbd9440", "christian": "52a94670", "aarav": "b38b8a02", "miguel": "0379eaa0",
 "marcel": "64859e98", "nathan": "19cdb730", "nicholas": "c76ca57d", "gopal": "ea115b1c",
}
def fit(xs, ys):
    A = np.c_[2 * xs, 2 * ys, np.ones(len(xs))]; b = xs**2 + ys**2
    cx, cy, c = np.linalg.lstsq(A, b, rcond=None)[0]
    return cx, cy, np.sqrt(c + cx**2 + cy**2)
for slug, h in slides.items():
    im = Image.open(f"{src}/{h}-image.png").convert("RGB"); a = np.asarray(im).astype(int)
    W, H = im.size; r_, g_, b_ = a[..., 0], a[..., 1], a[..., 2]
    ring = (g_ > r_ + 35) & (g_ > b_ + 25) & (g_ < 140) & (r_ < 90)
    ring[:, : int(W * 0.3)] = False
    ys, xs = np.nonzero(ring); xs = xs.astype(float); ys = ys.astype(float)
    # RANSAC: the slide titles use the same green as the ring, so a plain fit drifts.
    rng = np.random.default_rng(0); best = (0, None)
    for _ in range(3000):
        i = rng.choice(len(xs), 3, replace=False)
        try: cx, cy, r = fit(xs[i], ys[i])
        except Exception: continue
        if not (150 < r < 700): continue
        n = int((np.abs(np.hypot(xs - cx, ys - cy) - r) < 3).sum())
        if n > best[0]: best = (n, (cx, cy, r))
    cx, cy, r = best[1]
    k = np.abs(np.hypot(xs - cx, ys - cy) - r) < 3
    cx, cy, r = fit(xs[k], ys[k])
    s = r * 1.36  # inscribed square (r*sqrt2) minus the ring
    box = tuple(int(v) for v in (cx - s / 2, cy - s * 0.54, cx + s / 2, cy + s * 0.46))
    im.crop(box).resize((480, 480), Image.LANCZOS).save(f"{out}/{slug}.jpg", quality=86)
    print(slug, round(cx), round(cy), round(r))
