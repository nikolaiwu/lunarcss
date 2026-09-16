// Theme toggle shared by the showcase (index.html) and the demo page.
// The saved theme is applied by a tiny inline script in each page's <head>,
// before first paint; this module only handles the toggle button.

function toggleTheme() {
  const html = document.documentElement;
  const current =
    html.getAttribute("data-theme") ??
    (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  const next = current === "dark" ? "light" : "dark";

  html.setAttribute("data-theme", next);
  localStorage.setItem("theme", next);
}

for (const button of document.querySelectorAll("[data-theme-toggle]")) {
  button.addEventListener("click", toggleTheme);
}
