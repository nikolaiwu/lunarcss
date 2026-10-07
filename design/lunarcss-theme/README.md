# LunarCSS theme images

Images for the theme's own site and README. Run the commands from the repo root.

## Social card

[og-image.py](og-image.py) writes [og-image.svg](og-image.svg), the source of `public/og-image.png` (1200×630), the showcase's `og:image`.

```bash
python3 design/lunarcss-theme/og-image.py
```

It draws the theme's components from their real geometry at about 1.6×, in the dark theme's colours, snapped to whole pixels so a 1× export stays crisp: straight lines are filled rectangles, the few stroked outlines have 2px strokes set 1px in from the edge, and there are no `<pattern>` fills, which Figma drops on import. The muted colour is the theme's 50% OKLCH mix of the two main colours, worked out ahead of time.

Then open the SVG in Figma, tweak if needed (with snap to pixel grid on), and export it at 1× as `public/og-image.png`.

## Before/after image

[before-after.mjs](before-after.mjs) writes `public/before-after.png`, the promo image for the README and posts: the classless demo page (`src/demo.html`) as the browser draws it with no stylesheets, beside the same markup with LunarCSS, split diagonally between the light and dark themes. The HTML is identical in every shot; only the `<link>` tags change.

```bash
pnpm build && node design/lunarcss-theme/before-after.mjs
```

Run it after changing the demo or the theme's look. How it works:

- It screenshots the built `dist/demo.html` with headless Chrome three times (stylesheets stripped, LunarCSS light, LunarCSS dark), then screenshots a composite page that frames the shots as the theme's own fieldsets.
- It serves `dist/` from an in-process server, because `file://` blocks the `crossorigin` stylesheets.
- It stops Chrome as soon as Chrome logs that the file is written, because headless Chrome can linger for minutes after a capture.
- `CHROME` overrides the browser path, which defaults to the macOS one.

Because the PNG is in `public/`, it also deploys to the site root, so `https://nikolaiwu.github.io/lunarcss/before-after.png` works as an absolute URL that npm can render.
