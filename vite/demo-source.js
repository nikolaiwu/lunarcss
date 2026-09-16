// =============================================================================
// Vite plugin: demo source previews (showcase only)
// =============================================================================
// Shows each showcase demo's own markup next to it, so the code can never
// drift from what's rendered. For every `.demo-box` in src/index.html it:
//
//   1. takes the element's inner HTML,
//   2. formats it with Prettier,
//   3. highlights it with Shiki (Catppuccin Latte / Mocha),
//   4. wraps demo + code in `.demo` for the side-by-side layout.
//
// Shiki would repeat both themes' hex colors inline on every token, so instead
// each distinct light/dark color pair becomes one class, and a small <style>
// block with `light-dark()` rules is injected into <head>. That keeps the page
// small and switches with the theme, with no highlighting JS at runtime.
// =============================================================================

import { parse } from "node-html-parser";
import prettier from "prettier";
import { createHighlighter } from "shiki";

const THEMES = { light: "catppuccin-latte", dark: "catppuccin-mocha" };

const CLASS_PREFIX = "ct";
const SPAN = /<span style="([^"]*)">/g;

// "--shiki-light:#179299;--shiki-dark:#94E2D5" -> "color: light-dark(…)" rules
function toDeclarations(style) {
  const value = (name) =>
    style.match(new RegExp(`--shiki-${name}:([^;"]*)`))?.[1];
  const light = value("light");
  const dark = value("dark");
  const italic =
    style.includes("--shiki-light-font-style:italic") ||
    style.includes("--shiki-dark-font-style:italic");

  if (!light && !dark) return null;

  return [
    `color:light-dark(${light ?? "inherit"},${dark ?? "inherit"})`,
    italic ? "font-style:italic" : null,
  ]
    .filter(Boolean)
    .join(";");
}

export function demoSource() {
  let highlighter;

  return {
    name: "lunarcss-demo-source",

    async transformIndexHtml(html) {
      highlighter ??= await createHighlighter({
        themes: Object.values(THEMES),
        langs: ["html"],
      });

      const root = parse(html, { comment: true });
      const demos = root.querySelectorAll(".demo-box");

      // Shared across every demo, so a color pair costs one rule for the page
      const classNames = new Map();

      for (const demo of demos) {
        const formatted = await prettier.format(demo.innerHTML, {
          parser: "html",
        });

        const highlighted = highlighter.codeToHtml(formatted.trim(), {
          lang: "html",
          themes: THEMES,
          defaultColor: false,
          // Drop Shiki's own colors on <pre> so the theme styles the block
          transformers: [
            {
              pre(node) {
                delete node.properties.style;
              },
            },
          ],
        });

        const code = highlighted.replace(SPAN, (span, style) => {
          const declarations = toDeclarations(style);
          if (!declarations) return span;

          if (!classNames.has(declarations)) {
            classNames.set(declarations, `${CLASS_PREFIX}${classNames.size}`);
          }
          return `<span class="${classNames.get(declarations)}">`;
        });

        // `demo-wide` on the box (e.g. the card grid, which needs room to show
        // its columns) puts the demo full width with the code underneath
        const wide = demo.classList.contains("demo-wide") ? " demo-wide" : "";

        demo.replaceWith(
          `<div class="demo${wide}">${demo.outerHTML}<div class="demo-code">${code}</div></div>`,
        );
      }

      if (classNames.size) {
        const rules = [...classNames]
          .map(([declarations, name]) => `.${name}{${declarations}}`)
          .join("");

        root
          .querySelector("head")
          .insertAdjacentHTML(
            "beforeend",
            `<style>/* Syntax colors: Catppuccin Latte / Mocha */${rules}</style>`,
          );
      }

      return root.toString();
    },
  };
}
