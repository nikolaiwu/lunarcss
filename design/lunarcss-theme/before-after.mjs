#!/usr/bin/env node
// =============================================================================
// LunarCSS - before/after image generator
// =============================================================================
// Writes public/before-after.png from the built demo page. Plain Node, no
// dependencies; build first (pnpm build). See README.md.
// =============================================================================

import { spawn } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, copyFileSync } from "node:fs";
import { createServer } from "node:http";
import { tmpdir } from "node:os";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const CHROME =
  process.env.CHROME ??
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
// The repo root, two folders up, so it runs from anywhere
const ROOT = fileURLToPath(new URL("../../", import.meta.url));
const DIST = join(ROOT, "dist");
const OUT = join(ROOT, "public/before-after.png");

// Page viewport for each shot, in CSS pixels (captured at 2x)
const SHOT = { width: 1200, height: 1000 };

const demo = readFileSync(join(DIST, "demo.html"), "utf8");
const pages = {
  "/_before.html": demo.replace(/\s*<link rel="stylesheet"[^>]*>/g, ""),
  "/_light.html": demo.replace("<html", '<html data-theme="light"'),
  "/_dark.html": demo.replace("<html", '<html data-theme="dark"'),
};

const tmp = mkdtempSync(join(tmpdir(), "lunar-before-after-"));
const types = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "text/javascript",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".woff2": "font/woff2",
};

const server = createServer((req, res) => {
  const path = decodeURIComponent(new URL(req.url, "http://x").pathname);
  let body = pages[path];
  if (body === undefined) {
    const file = path.startsWith("/_shots/")
      ? join(tmp, path.slice("/_shots/".length))
      : join(DIST, normalize(path));
    try {
      body = readFileSync(file);
    } catch {
      res.writeHead(404).end();
      return;
    }
  }
  res.writeHead(200, { "Content-Type": types[extname(path)] ?? "text/plain" });
  res.end(body);
});
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const origin = `http://127.0.0.1:${server.address().port}`;

// Async on purpose: a sync call would block the server Chrome is loading from.
// Headless Chrome can linger long after writing the file, so stop it as soon
// as it logs the write rather than waiting for it to exit.
function screenshot(path, file, { width, height }) {
  const chrome = spawn(CHROME, [
    "--headless",
    // Own profile, so it never hands off to a running Chrome
    `--user-data-dir=${join(tmp, "profile")}`,
    "--disable-gpu",
    "--no-first-run",
    "--no-default-browser-check",
    "--hide-scrollbars",
    "--force-device-scale-factor=2",
    `--window-size=${width},${height}`,
    // Let web fonts finish loading before the capture
    "--virtual-time-budget=5000",
    `--screenshot=${join(tmp, file)}`,
    origin + path,
  ]);
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      chrome.kill();
      reject(new Error(`Timed out capturing ${path}`));
    }, 60_000);
    let log = "";
    chrome.stderr.on("data", (chunk) => {
      log += chunk;
      if (!/written to file/.test(log)) return;
      clearTimeout(timer);
      // Resolve once it's gone, so the next run and the cleanup don't race it
      chrome.once("exit", () => resolve());
      chrome.kill();
    });
    chrome.on("error", reject);
  });
}

// The composite: two panels framed as the theme's own fieldsets, on the dark
// page color. The After panel stacks the dark shot on the light one and clips
// it along a diagonal.
const PANEL = 760;
const panelHeight = Math.round((PANEL * SHOT.height) / SHOT.width);
const COMPOSITE = { width: 1640, height: panelHeight + 150 };
pages["/_composite.html"] = `<!doctype html>
<html lang="en" data-theme="dark">
  <head>
    <meta charset="UTF-8" />
    <link rel="stylesheet" href="/lunarcss-fonts.min.css" />
    <link rel="stylesheet" href="/lunarcss.min.css" />
    <style>
      html, body { margin: 0; height: 100%; }
      body {
        display: grid;
        grid-template-columns: repeat(2, ${PANEL}px);
        gap: 40px;
        place-content: center;
      }
      fieldset { margin: 0; padding: 20px 20px 22px; }
      img { width: ${PANEL - 40}px; height: auto; margin: 0; }
      fieldset > div { position: relative; }
      img + img {
        position: absolute;
        inset: 0;
        /* Past the box, so anti-aliasing leaves no light edge */
        clip-path: polygon(62.24% -1%, 101% -1%, 101% 101%, 37.76% 101%);
      }
    </style>
  </head>
  <body>
    <fieldset>
      <legend>Before: no CSS</legend>
      <img src="/_shots/before.png" alt="" />
    </fieldset>
    <fieldset>
      <legend>After: same HTML + LunarCSS</legend>
      <div>
        <img src="/_shots/light.png" alt="" />
        <img src="/_shots/dark.png" alt="" />
      </div>
    </fieldset>
  </body>
</html>`;

try {
  await screenshot("/_before.html", "before.png", SHOT);
  await screenshot("/_light.html", "light.png", SHOT);
  await screenshot("/_dark.html", "dark.png", SHOT);
  await screenshot("/_composite.html", "composite.png", COMPOSITE);
  copyFileSync(join(tmp, "composite.png"), OUT);
  console.log(`Wrote ${OUT}`);
} finally {
  server.close();
  rmSync(tmp, { recursive: true, force: true });
}
