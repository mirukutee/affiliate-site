document.addEventListener("DOMContentLoaded", () => {
  const reveal = (el) => {
    if (!el) return;
    el.removeAttribute("hidden");
    el.removeAttribute("aria-busy");
  };

  const inject = (id, url) => {
    const mount = document.getElementById(id);
    if (!mount) return;
    fetch(url, { cache: "no-cache" })
      .then(res => res.text())
      .then(html => {
        mount.innerHTML = html;
        reveal(mount);
      })
      .catch(err => console.error(`[include] ${url} load error:`, err));
  };

  inject("header", "/header.html");
  inject("footer", "/footer.html");
});
