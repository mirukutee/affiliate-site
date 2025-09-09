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

  inject("header", "header.html");
  inject("footer", "footer.html");
});
// ▼ ヘッダー高さを測って --header-h に反映（固定ヘッダーでも重ならない）
const applyHeaderHeight = () => {
  const header = document.getElementById("header");
  if (!header) return;
  const h = header.getBoundingClientRect().height || 0;
  document.documentElement.style.setProperty("--header-h", `${h}px`);
};

// 既存のinject完了後に反映
setTimeout(applyHeaderHeight, 0);
window.addEventListener("resize", applyHeaderHeight);
