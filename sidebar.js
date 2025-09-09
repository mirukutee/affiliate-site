document.addEventListener("DOMContentLoaded", async () => {
  const mount = document.getElementById("sidebar");
  if (!mount) return;

  // 1) サイドバーHTMLを注入
  const res = await fetch("sidebar.html", { cache: "no-cache" });
  if (!res.ok) { console.error("sidebar.html load failed"); return; }
  mount.innerHTML = await res.text();

  // 2) 初期化（全閉じ）
  const panels = mount.querySelectorAll(".dropdown-content");
  panels.forEach(p => {
    p.classList.remove("open");
    p.setAttribute("aria-hidden","true");
    p.style.maxHeight = "0px";
  });

  // 3) 委譲クリック
  mount.addEventListener("click", (e) => {
    const btn = e.target.closest(".dropdown-button");
    if (!btn) return;
    const panel = btn.nextElementSibling;
    if (!panel || !panel.classList.contains("dropdown-content")) return;

    const willOpen = !panel.classList.contains("open");
    panel.classList.toggle("open", willOpen);
    panel.setAttribute("aria-hidden", willOpen ? "false" : "true");
    panel.style.maxHeight = willOpen ? panel.scrollHeight + "px" : "0px";
    btn.setAttribute("aria-expanded", willOpen ? "true" : "false");
  });

  // 4) リサイズ時にmax-height再計算
  window.addEventListener("resize", () => {
    mount.querySelectorAll(".dropdown-content.open")
      .forEach(p => p.style.maxHeight = p.scrollHeight + "px");
  }, { passive: true });
});
