// sidebar.js
document.addEventListener("DOMContentLoaded", () => {
  const SIDEBAR_ID = "sidebar";
  const URL = "sidebar.html";

  const mount = document.getElementById(SIDEBAR_ID);
  if (!mount) return;

  // サイドバー読込
  fetch(URL, { cache: "no-cache" })
    .then((res) => res.text())
    .then((html) => {
      mount.innerHTML = html;

      // 挿入後に表示（FOUC防止 & クリック復帰）
      mount.removeAttribute("hidden");
      mount.removeAttribute("aria-busy");

      // 初期化
      initDropdowns(mount);
      markActiveByLocation(mount);
      guardOutsideScrollOnOpen(mount);
    })
    .catch((err) => console.error(`[sidebar] ${URL} load error:`, err));

  /**
   * ドロップダウン（アコーディオン）初期化
   * - .dropdown-toggle をクリックで .dropdown-content を開閉
   * - 開くときは max-height に scrollHeight をセット（CSSトランジション有効化）
   */
  function initDropdowns(root) {
    const toggles = root.querySelectorAll(".dropdown-toggle");
    toggles.forEach((btn) => {
      const content = btn.nextElementSibling;
      if (!content || !content.classList.contains("dropdown-content")) return;

      // 初期状態
      content.style.maxHeight = "0";

      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const isOpen = content.classList.contains("open");

        // いったん全部閉じたい場合は以下を解除（アコーディオン1つだけ開閉）
        // closeAll(root);

        if (isOpen) {
          // 閉じる
          content.classList.remove("open");
          content.style.maxHeight = "0";
          btn.setAttribute("aria-expanded", "false");
        } else {
          // 開く
          content.classList.add("open");
          content.style.maxHeight = content.scrollHeight + "px";
          btn.setAttribute("aria-expanded", "true");
        }
      }, { passive: true });
    });

    // ウィンドウリサイズ時に開いている項目の max-height を再計算
    window.addEventListener("resize", () => {
      root.querySelectorAll(".dropdown-content.open").forEach((el) => {
        el.style.maxHeight = el.scrollHeight + "px";
      });
    }, { passive: true });
  }

  function closeAll(root) {
    root.querySelectorAll(".dropdown-content.open").forEach((el) => {
      el.classList.remove("open");
      el.style.maxHeight = "0";
    });
    root.querySelectorAll(".dropdown-toggle[aria-expanded='true']").forEach((btn) => {
      btn.setAttribute("aria-expanded", "false");
    });
  }

  /**
   * 現在URL/ハッシュに応じてメニューを強調
   * - a[href] が location に合致したら .is-active を付与
   * - 階層下なら親のドロップダウンも展開
   */
  function markActiveByLocation(root) {
    const here = location.pathname.replace(/\/+$/, "");
    const hash = location.hash || "";

    const links = root.querySelectorAll("a[href]");
    let activated = false;

    links.forEach((a) => {
      const href = a.getAttribute("href") || "";
      if (!href || href.startsWith("javascript:")) return;

      // 相対リンクを雑に比較（href の末尾スラッシュ除去）
      const norm = href.replace(/\/+$/, "");
      const isSamePage = norm && here.endsWith(norm);
      const isHashHit = hash && norm === hash;

      if (isSamePage || isHashHit) {
        a.classList.add("is-active");
        // 親のドロップダウンを展開
        const content = a.closest(".dropdown-content");
        if (content && !content.classList.contains("open")) {
          content.classList.add("open");
          content.style.maxHeight = content.scrollHeight + "px";
          const toggle = content.previousElementSibling;
          if (toggle && toggle.classList.contains("dropdown-toggle")) {
            toggle.setAttribute("aria-expanded", "true");
          }
        }
        activated = true;
      }
    });

    // 何もヒットしない場合、トップ相当をハイライト（任意）
    if (!activated) {
      const topLink = root.querySelector('a[href="index.html"], a[href="/"], a[href="./"]');
      topLink?.classList.add("is-active");
    }
  }

  /**
   * スマホ時、開いているドロップダウンの中だけスクロール可能にして
   * 背景の誤スクロールを軽減（必要に応じて有効化）
   */
  function guardOutsideScrollOnOpen(root) {
    root.addEventListener("wheel", (e) => {
      const open = root.querySelector(".dropdown-content.open");
      if (!open) return;
      // open内のスクロールは許可、外は軽く抑制（強制はしない）
      if (!open.contains(e.target)) {
        // コメントアウトしたい場合はここを無効化
        // e.preventDefault();
      }
    }, { passive: false });
  }
});
