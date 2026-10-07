#!/bin/sh
# Renders the blog's public/apple-touch-icon.png (180x180) from its
# public/favicon.svg with headless Chrome. BLOG is the blog checkout
# (default: lunar-blog next to this repo); CHROME overrides the browser
# path. See README.md.
set -e

here="$(cd "$(dirname "$0")" && pwd)"
blog="${BLOG:-$here/../../../lunar-blog}"
[ -f "$blog/public/favicon.svg" ] || { echo "No public/favicon.svg in $blog (set BLOG)" >&2; exit 1; }
blog="$(cd "$blog" && pwd)"
chrome="${CHROME:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}"
tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT

# The favicon box at 4x (128px, so every edge stays on a whole pixel),
# centred on the dark page colour. iOS needs an opaque PNG and rounds the
# corners itself.
{
  printf '<!doctype html><html><head><style>'
  printf 'html,body{margin:0;background:#2a2c2f}'
  printf 'svg{display:block;width:128px;height:128px;margin:26px}'
  printf '</style></head><body>'
  cat "$blog/public/favicon.svg"
  printf '</body></html>'
} > "$tmp/icon.html"

"$chrome" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 \
  --window-size=180,180 --screenshot="$blog/public/apple-touch-icon.png" \
  "file://$tmp/icon.html" 2>/dev/null

echo "Wrote $blog/public/apple-touch-icon.png"
