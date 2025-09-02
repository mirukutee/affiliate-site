// シンプル開閉（スクロールしない）版
(() => {
  // サイドバー内の .dropdown-button に開閉イベントを付与
  const initSidebar = (root) => {
    const container = root || document;
    const buttons = container.querySelectorAll(".dropdown-button");
    if (!buttons.length) return;

    buttons.forEach((btn) => {
      // 既存のスクロール系リスナーがあっても、我々は開閉のみを行う
      btn.addEventListener("click", (ev) => {
        ev.preventDefault();
        ev.stopPropagation();

        const content = btn.nextElementSibling;
        if (!content || !content.classList) return;

        const willOpen = !content.classList.contains("open");

        // 「一度に複数開いてOK」→このままでOK
        // 「常にひとつだけ開く」にしたいなら以下2行のコメントアウトを外す
        // document.querySelectorAll(".dropdown-content.open").forEach((el) => {
        //   if (el !== content) el.classList.remove("open");
        // });

        content.classList.toggle("open", willOpen);

        // アクセシビリティ属性を同期
        btn.setAttribute("aria-expanded", String(willOpen));
        content.setAttribute("aria-hidden", String(!willOpen));
      }, { passive: false });
    });
  };

  // ① すでにサイドバーDOMがある場合（index直表示 or sidebar単体）
  document.addEventListener("DOMContentLoaded", () => {
    // index.html では #sidebar の中身が後から差し込まれるので、まずは現状に対して実行
    initSidebar(document);

    // ② 後から #sidebar に読み込まれる場合（fetchでの差し込みにも対応）
    const mount = document.querySelector("#sidebar");
    if (!mount) return;

    const mo = new MutationObserver((muts) => {
      for (const m of muts) {
        m.addedNodes.forEach((node) => {
          if (node.nodeType === 1) {
            // 追加された要素配下に .dropdown-button があれば初期化
            if (node.querySelector && node.querySelector(".dropdown-button")) {
              initSidebar(node);
            }
          }
        });
      }
    });
    mo.observe(mount, { childList: true, subtree: true });
  });
})();
