document.addEventListener("DOMContentLoaded", async () => {
  const mount = document.getElementById("sidebar");
  if (!mount) return;

  // 1) サイドバーHTMLを注入
  const res = await fetch("sidebar.html", { cache: "no-cache" });
  if (!res.ok) {
    console.error("sidebar.html load failed");
    return;
  }

  mount.innerHTML = await res.text();

  // 2) 初期化（全閉じ）
  const panels = mount.querySelectorAll(".dropdown-content");

  panels.forEach(panel => {
    panel.classList.remove("open");
    panel.setAttribute("aria-hidden", "true");
    panel.setAttribute("inert", "");
    panel.style.maxHeight = "0px";

    const btn = panel.previousElementSibling;

    if (btn?.classList.contains("dropdown-button")) {
      btn.setAttribute("aria-expanded", "false");
    }
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

    if (willOpen) {
      panel.removeAttribute("inert");
    } else {
      panel.setAttribute("inert", "");
    }

    panel.style.maxHeight = willOpen
      ? panel.scrollHeight + "px"
      : "0px";

    btn.setAttribute("aria-expanded", willOpen ? "true" : "false");
  });

  // 4) リサイズ時にmax-height再計算
  window.addEventListener("resize", () => {
    mount.querySelectorAll(".dropdown-content.open")
      .forEach(panel => {
        panel.style.maxHeight = panel.scrollHeight + "px";
      });
  }, { passive: true });
});