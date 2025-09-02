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

        // ※同時に1つだけ開きたい場合は以下の2行のコメントアウトを外す
        // document.querySelectorAll(".dropdown-content.open").forEach((el) => {
        //   if (el !== content) el.classList.remove("open");
        // });

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

    // 直貼り（すでに子要素あり）の場合はそのまま初期化
    if (mount.children.length > 0) {
      initSidebar(mount);
      return;
    }

    try {
      // index.html と同階層に sidebar.html がある前提
      const res = await fetch("sidebar.html", { credentials: "same-origin" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const html = await res.text();
      mount.innerHTML = html;

      // 取り込んだ要素に対して初期化
      initSidebar(mount);

      // （任意）sidebar.html 内の <script> を実行したい場合だけ実装
      // 今回は「スクロールしない方針」なので実行しないままでOK
      // mount.querySelectorAll("script").forEach((old) => {
      //   const s = document.createElement("script");
      //   if (old.src) s.src = old.src; else s.textContent = old.textContent;
      //   document.head.appendChild(s);
      //   old.remove();
      // });
    } catch (e) {
      console.error("Sidebar load error:", e);
    }
  };

  document.addEventListener("DOMContentLoaded", () => {
    // 既存DOMに対して一度初期化（直貼り対応）
    initSidebar(document);

    // その後、外部HTMLを読み込み
    mountAndLoad();

    // 将来 #sidebar にノードが追加されても自動初期化
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
