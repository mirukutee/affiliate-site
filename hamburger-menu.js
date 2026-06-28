document.addEventListener("DOMContentLoaded", function () {
  const menuHTML = `
    <button class="tp-hamburger" id="tpHamburger" aria-label="メニューを開く">
      <span></span>
      <span></span>
      <span></span>
    </button>

    <nav class="tp-menu" id="tpMenu">
      <div class="tp-menu-inner">
        <p class="tp-menu-title">投資ポータル メニュー</p>

        <a href="/tousi-yougo.html">投資用語辞典</a>
        <a href="/syoukensyoukai.html">証券会社一覧比較</a>
        <a href="/FX-syoukai.html">FX会社一覧比較</a>
        <a href="/kasoutuuka-itiran.html">仮想通貨取引所一覧</a>
        <a href="/column.html">コラム一覧</a>
        <a href="/index.html">トップページ</a>
      </div>
    </nav>

    <div class="tp-menu-overlay" id="tpMenuOverlay"></div>
  `;

  document.body.insertAdjacentHTML("beforeend", menuHTML);

  const btn = document.getElementById("tpHamburger");
  const menu = document.getElementById("tpMenu");
  const overlay = document.getElementById("tpMenuOverlay");

  function toggleMenu() {
    btn.classList.toggle("is-open");
    menu.classList.toggle("is-open");
    overlay.classList.toggle("is-open");
  }

  btn.addEventListener("click", toggleMenu);
  overlay.addEventListener("click", toggleMenu);
});