// /affiliate-site/sidebar.js でも相対でもOK。indexと同じ階層なら相対参照でOK。
(() => {
  // ▼ 汎用：開閉処理（アニメ安定化：max-height を実高さで制御）
  const toggleDropdown = (btn) => {
  const content = btn && btn.nextElementSibling;
  if (!content || !content.classList) return;

  const willOpen = !content.classList.contains("open");

  if (willOpen) {
    // ▼ 開く処理
    content.classList.add("open");
    content.setAttribute("aria-hidden", "false");
    btn.setAttribute("aria-expanded", "true");

    content.style.setProperty("max-height", content.scrollHeight + "px", "important");
  } else {
    // ▼ 閉じる処理
    content.style.setProperty("max-height", content.scrollHeight + "px", "important");
    requestAnimationFrame(() => {
      content.style.setProperty("max-height", "0px", "important");
      content.classList.remove("open");
      content.setAttribute("aria-hidden", "true");
      btn.setAttribute("aria-expanded", "false");
    });
  }
};


  // ▼ イベント委任（後から差し込まれた要素にも効く）
  const setupDelegation = (root) => {
    const mount = root || document;
    mount.addEventListener("click", (ev) => {
      const target = ev.target.closest(".dropdown-button");
      if (!target) return;
      ev.preventDefault();
      ev.stopPropagation();
      toggleDropdown(target);
    }, { passive: false });
  };

  // ▼ sidebar.html を #sidebar に流し込み
  const loadSidebar = async () => {
    const mount = document.querySelector("#sidebar");
    if (!mount) return;

    // 直貼り/既に中身がある場合はそのまま委任のみ
    if (mount.children.length > 0) return;

    try {
      // index.html と同階層にsidebar.htmlがある前提
      const res = await fetch("sidebar.html", { credentials: "same-origin" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const html = await res.text();
      mount.innerHTML = html;

      // アクセシビリティ初期値
      mount.querySelectorAll(".dropdown-button").forEach((btn) => {
        btn.setAttribute("aria-expanded", "false");
        const content = btn.nextElementSibling;
        if (content) content.setAttribute("aria-hidden", "true");
      });

    } catch (e) {
      console.error("[Sidebar] load error:", e);
      // デバッグヒント（画面にも表示）
      const pre = document.createElement("pre");
      pre.textContent = "Sidebar load error: " + e.message + "\n" +
        "→ fetchパスを確認してください（例: 'sidebar.html' or '/affiliate-site/sidebar.html'）。";
      pre.style.color = "crimson";
      pre.style.padding = "8px";
      pre.style.background = "#fff3f3";
      pre.style.border = "1px solid #f5c2c2";
      document.body.prepend(pre);
    }
  };

  document.addEventListener("DOMContentLoaded", () => {
    setupDelegation(document); // まず委任
    loadSidebar();             // 次に読み込み
  });
})();
