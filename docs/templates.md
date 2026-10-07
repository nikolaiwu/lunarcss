# Templates

LunarCSS is the base for a family of templates: real projects styled only by the theme. Each template lives in its own repo and ships minimal, while the tooling around it (image generators, icons) stays here, versioned with the theme.

| Template                                              | Stack   | Status                                                     |
| ----------------------------------------------------- | ------- | ---------------------------------------------------------- |
| [Lunar Blog](https://github.com/nikolaiwu/lunar-blog) | Astro   | In progress. Demo: https://nikolaiwu.github.io/lunar-blog/ |
| A dashboard                                           | Next.js | Planned                                                    |

## How a template uses the theme

- It installs the published package, `@nikolaiwu/lunarcss`, and imports the three stylesheets in order: fonts, theme, layout. Cascade layers are ordered by first appearance, so the theme's `lunarcss` layer has to come before `lunarcss-layout`.
- Its markup is classless, like the Acme demo: structure comes from semantic elements and the patterns the layout stylesheet expects (page shell, card grid, full-page article, control groups).
- Its own CSS stays small, unlayered (so it beats the theme), and written in `--lunar-*` tokens. Each rule says why the theme can't do it.
- Its own docs live in its repo (README, CONTRIBUTING.md). This file only covers how it connects to the theme.

## Templates are the theme's test

A template is the theme's first real-world use, so it's where gaps show up: real content that the showcase never had, such as long post titles in a card grid, Markdown tables or generated footnotes. The flow:

1. The template logs the gap (Lunar Blog keeps `docs/theme-gaps.md`) and, if it has to, works around it in its own CSS.
2. The fix lands here, generic enough for every user of the theme, never shaped around one template. A change that only makes sense for one template stays in that template.
3. The template develops against the fix with **local theme mode** before anything is released: it compiles the theme from this checkout's SCSS source instead of the package, with live reload. In Lunar Blog: `LUNARCSS_LOCAL=../lunarcss pnpm dev`. Each template documents its own version of this in its CONTRIBUTING.md.
4. **The theme is released first.** A template's `main` is what its users install, so it must keep working with the published theme: it bumps `@nikolaiwu/lunarcss` and drops its workaround only after the release.

When changing an element a template uses, check the template's pages too, in local theme mode.

## Repo layout

Templates are checked out next to this repo, so the relative paths in local theme mode and the design tools work without setup:

```
Developer/
├── lunarcss/      # this repo
├── lunar-blog/    # a template
└── …              # the next ones
```

With Claude Code, a session started in a template with `claude --add-dir ../lunarcss` can edit both. Commit in each repo separately.

## Design tools

Each template's image tooling lives in [design/](../design/), in a folder named after its repo, next to the theme's own ([design/lunarcss-theme/](../design/lunarcss-theme/)). Each folder's README says what its tools make and how to run them. Templates draw their images from the theme's geometry and colours, so when the theme's look changes, regenerate their images too.

## Adding a template

1. Create its repo, and build it on the published package.
2. Give it local theme mode, and a place to log theme gaps.
3. Add its image tools under `design/<repo-name>/`, with a README.
4. Add it to the table above, and to the README's starters once it's released.
