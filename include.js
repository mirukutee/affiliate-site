document.addEventListener("DOMContentLoaded", function () {
  const reveal = (el) => { el?.removeAttribute("hidden"); el?.removeAttribute("aria-busy"); };

  const inject = (id, path) => {
    const target = document.getElementById(id);
    if (!target) return;
    fetch(path)
      .then(res => res.text())
      .then(html => {
        target.innerHTML = html;
        reveal(target); // ← 読み込み完了後に表示
      })
      .catch(err => console.error(`Error loading ${path}:`, err));
  };

  inject("header", "header.html");
  inject("footer", "footer.html");
});
