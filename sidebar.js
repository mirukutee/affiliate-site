// sidebar.js (全置き換え用)
document.addEventListener("DOMContentLoaded", async () => {
  const mount = document.getElementById("sidebar");
  if (!mount) return;

  // ---- 1) サイドバーHTMLを注入 -----------------------------------------
  // 302/キャッシュ残りで崩れや「勝手に開く」誤判定を避けるため no-cache
  const res = await fetch("sidebar.html", { cache: "no-cache" });
  if (!res.ok) {
    console.error("Failed to load sidebar.html:", res.status, res.statusText);
    return;
  }
  const html = await res.text();
  mount.innerHTML = html;

  // ---- 2) 初期化：全パネルを閉じる ---------------------------------------
  const panels = mount.querySelectorAll(".dropdown-content");
  panels.forEach(p => {
    p.classList.remove("open");
    p.setAttribute("aria-hidden", "true");
    p.style.maxHeight = "0px";
  });

  // ---- 3) クリック委譲：.dropdown-button → 直後の .dropdown-content ----
  mount.addEventListener("click", (e) => {
    const btn = e.target.closest(".dropdown-button");
    if (!btn) return;

    const panel = btn.nextElementSibling;
    if (!panel || !panel.classList.contains("dropdown-content")) return;

    const willOpen = !panel.classList.contains("open");

    // アコーディオン（同時に1つだけ開く）にしたい場合はここで全閉じ
    // panels.forEach(p => {
    //   if (p !== panel) {
    //     p.classList.remove("open");
    //     p.setAttribute("aria-hidden", "true");
    //     p.style.maxHeight = "0px";
    //   }
    // });

    if (willOpen) {
      panel.classList.add("open");
      panel.setAttribute("aria-hidden", "false");
      // scrollHeight を使ってスムーズに展開
      panel.style.maxHeight = panel.scrollHeight + "px";
    } else {
      panel.classList.remove("open");
      panel.setAttribute("aria-hidden", "true");
      panel.style.maxHeight = "0px";
    }
  });

  // ---- 4) リサイズ時：開いてるパネルの max-height を再計算 -------------
  window.addEventListener("resize", () => {
    const opened = mount.querySelectorAll(".dropdown-content.open");
    opened.forEach(p => {
      p.style.maxHeight = p.scrollHeight + "px";
    });
  }, { passive: true });

  // ---- 5) キーボード対応（Enter/Spaceで開閉） --------------------------
  mount.addEventListener("keydown", (e) => {
    if (e.key !== "Enter" && e.key !== " ") return;
    const btn = e.target.closest(".dropdown-button");
    if (!btn) return;
    e.preventDefault();
    btn.click();
  });
});
