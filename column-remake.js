document.addEventListener("DOMContentLoaded", () => {
  const menuButton = document.querySelector(".columnremake-menu-button");
  const menuPanel = document.querySelector(".columnremake-menu-panel");
  const menuOverlay = document.querySelector(".columnremake-menu-overlay");
  const menuClose = document.querySelector(".columnremake-menu-close");
  const menuLinks = document.querySelectorAll(".columnremake-menu-link");

  if (!menuButton || !menuPanel || !menuOverlay || !menuClose) return;

  const openMenu = () => {
    menuPanel.hidden = false;
    menuOverlay.hidden = false;
    document.body.classList.add("columnremake-menu-is-open");
    menuButton.setAttribute("aria-expanded", "true");
    menuClose.focus();
  };

  const closeMenu = () => {
    menuPanel.hidden = true;
    menuOverlay.hidden = true;
    document.body.classList.remove("columnremake-menu-is-open");
    menuButton.setAttribute("aria-expanded", "false");
  };

  menuButton.addEventListener("click", openMenu);
  menuClose.addEventListener("click", closeMenu);
  menuOverlay.addEventListener("click", closeMenu);

  menuLinks.forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menuButton.getAttribute("aria-expanded") === "true") {
      closeMenu();
      menuButton.focus();
    }
  });
});