document.addEventListener("DOMContentLoaded", function () {
  const buttons = document.querySelectorAll(".dropdown-button");

  buttons.forEach(button => {
    button.addEventListener("click", function () {
      const content = this.nextElementSibling;

      // 展開済みなら閉じる
      if (content.classList.contains("open")) {
        content.classList.remove("open");
        content.style.maxHeight = null;
      } else {
        // 一度すべて閉じる（状態リセット）
        document.querySelectorAll(".dropdown-content.open").forEach(c => {
          c.classList.remove("open");
          c.style.maxHeight = null;
        });

        // クリックされた項目だけ展開
        content.classList.add("open");

        // スクロール高さを設定（モバイルは max-height 無制限）
        if (window.innerWidth > 768) {
          content.style.maxHeight = content.scrollHeight + "px";
        } else {
          content.style.maxHeight = "none";
        }
      }
    });
  });
});

