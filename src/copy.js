// Copy buttons in the showcase: a button with data-copy="<id>" copies that
// field's value, then says so for a moment. The Clipboard API needs a secure
// context (https or localhost); where it fails, the text is selected instead,
// ready to copy by hand.

for (const button of document.querySelectorAll("[data-copy]")) {
  const field = document.getElementById(button.dataset.copy);
  const label = button.textContent;

  button.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(field.value);
      button.textContent = "Copied";
    } catch {
      field.select();
      button.textContent = "Selected";
    }

    setTimeout(() => {
      button.textContent = label;
    }, 1500);
  });
}
