
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
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        return res.text();
      })
      .then(html => {
        mount.innerHTML = html;
        reveal(mount);
      })
      .catch(err => console.error(`[include] ${url} load error:`, err));
  };

  // ヘッダーは従来どおり読み込む
  inject("header", "/header.html");

  // フッターだけページ読み込み完了後に1秒遅延
  const loadFooter = () => {
    setTimeout(() => {
      inject("footer", "/footer.html");
    }, 1000);
  };

  if (document.readyState === "complete") {
    loadFooter();
  } else {
    window.addEventListener("load", loadFooter, { once: true });
  }
});
