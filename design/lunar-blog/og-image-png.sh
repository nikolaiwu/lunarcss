#!/bin/sh
# Renders og-image.svg (next to this file) to the blog's public/og-image.png
# with headless Chrome, using the fonts the blog installs with LunarCSS.
# BLOG is the blog checkout (default: lunar-blog next to this repo); CHROME
# overrides the browser path. See README.md.
set -e

here="$(cd "$(dirname "$0")" && pwd)"
blog="${BLOG:-$here/../../../lunar-blog}"
[ -d "$blog/public" ] || { echo "No blog checkout at $blog (set BLOG)" >&2; exit 1; }
blog="$(cd "$blog" && pwd)"
chrome="${CHROME:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}"
fonts="$blog/node_modules/@nikolaiwu/lunarcss/dist/lunarcss-fonts.min.css"
[ -f "$fonts" ] || { echo "No fonts at $fonts (run pnpm install in the blog)" >&2; exit 1; }
tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT

# The SVG goes inline, so its text can use the page's web fonts
{
  printf '<!doctype html><html><head><link rel="stylesheet" href="file://%s">' "$fonts"
  printf '<style>html,body{margin:0}svg{display:block}</style></head><body>'
  cat "$here/og-image.svg"
  printf '</body></html>'
} > "$tmp/og-image.html"

"$chrome" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 \
  --window-size=1200,630 --virtual-time-budget=5000 --allow-file-access-from-files \
  --screenshot="$blog/public/og-image.png" "file://$tmp/og-image.html" 2>/dev/null

echo "Wrote $blog/public/og-image.png"
