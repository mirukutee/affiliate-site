// /affiliate-site/sidebar.js
(() => {
  // ドロップダウン開閉の初期化
  const initSidebar = (root) => {
    const container = root || document;
    const buttons = container.querySelectorAll(".dropdown-button");
    if (!buttons.length) return;

    buttons.forEach((btn) => {
      btn.addEventListener("click", (ev) => {
        ev.preventDefault();
        ev.stopPropagation();

        const content = btn.nextElementSibling;
        if (!content || !content.classList) return;

        const willOpen = !content.classList.contains("open");

        content.classList.toggle("open", willOpen);
        btn.setAttribute("aria-expanded", String(willOpen));
        content.setAttribute("aria-hidden", String(!willOpen));
      }, { passive: false });
    });
  };

  // #sidebar に sidebar.html を読み込んでマウント
  const mountAndLoad = async () => {
    const mount = document.querySelector("#sidebar");
    if (!mount) return;

    // 直貼り対応（既に子要素があればそのまま初期化）
    if (mount.children.length > 0) {
      initSidebar(mount);
      return;
    }

    try {
      const res = await fetch("sidebar.html", { credentials: "same-origin" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      mount.innerHTML = await res.text();

      // 読み込み後に初期化
      initSidebar(mount);

      // ※ sidebar.html 内 <script> を動かしたいならここで再挿入処理を書く
      // 今回は不要（スクロールしない方針）
    } catch (e) {
      console.error("Sidebar load error:", e);
    }
  };

  document.addEventListener("DOMContentLoaded", () => {
    initSidebar(document); // 直貼り対応
    mountAndLoad();        // 外部HTMLの読み込み

    // 将来の差し込みにも対応
    const mount = document.querySelector("#sidebar");
    if (!mount) return;
    const mo = new MutationObserver((muts) => {
      for (const m of muts) {
        m.addedNodes.forEach((node) => {
          if (node.nodeType === 1 && node.querySelector && node.querySelector(".dropdown-button")) {
            initSidebar(node);
          }
        });
      }
    });
    mo.observe(mount, { childList: true, subtree: true });
  });
})();
