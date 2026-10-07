# Lunar Blog images

Images for [Lunar Blog](https://github.com/nikolaiwu/lunar-blog), the Astro blog starter: its default link preview card and its Apple touch icon. They live here, not in the blog, so the template ships minimal.

The scripts write into a Lunar Blog checkout: `lunar-blog` next to this repo by default, or wherever `BLOG` points. Run them from anywhere:

```bash
BLOG=~/code/lunar-blog sh design/lunar-blog/apple-touch-icon.sh
```

## Social card

The blog's default `og:image`, used by pages without a hero image: `public/og-image.png` (1200×630). It matches the theme's own card ([../lunarcss-theme/](../lunarcss-theme/)): the same frame, heading, dotted rule and numbered list on the left, drawn from the theme's real geometry at about 1.6× in the dark theme's colours. On the right is the blog itself: a post card, split diagonally between the light and dark themes.

1. [og-image.py](og-image.py) writes [og-image.svg](og-image.svg) next to itself:

   ```bash
   python3 design/lunar-blog/og-image.py
   ```

2. Render it to the blog's `public/og-image.png`, either way:
   - Tweak in Figma and export at 1×, like the theme's card.
   - Or render it with headless Chrome and the fonts the blog installs with LunarCSS (run `pnpm install` in the blog first):

     ```bash
     sh design/lunar-blog/og-image-png.sh
     ```

3. If the picture changed, update `ogImageAlt` in the blog's `src/site.config.ts`.

Things to know:

- Pixel-snapped like the theme's card: straight lines are filled rectangles, the few stroked outlines have 2px strokes set 1px in from the edge, and there are no `<pattern>` fills.
- Mixed colours (muted, the link chip tints) are the theme's OKLCH mixes, worked out ahead of time, and text widths were measured with the real fonts. Change the theme's colours or the card's text, and those numbers need updating by hand.
- The text is the demo's: the blog's name, tagline and feature list, a sample post card ("Every Markdown element", its date and tags), and the demo's address, `nikolaiwu.github.io/lunar-blog`.

## Apple touch icon

[apple-touch-icon.sh](apple-touch-icon.sh) renders the blog's `public/apple-touch-icon.png` (180×180) from its `public/favicon.svg` with headless Chrome, the way the theme's touch icon is made: the favicon box at 4× (128px, so every edge stays on a whole pixel), centred on the dark page colour. iOS needs an opaque PNG and rounds the corners itself.

```bash
sh design/lunar-blog/apple-touch-icon.sh
```

Run it after changing the favicon. `CHROME` overrides the browser path, which defaults to the macOS one.
