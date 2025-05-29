document.addEventListener("DOMContentLoaded", function () {
  fetch('sidebar.html')
    .then(response => response.text())
    .then(data => {
      document.getElementById('sidebar').innerHTML = data;

      const buttons = document.querySelectorAll(".dropdown-button");

      buttons.forEach(button => {
        button.addEventListener("click", function () {
          const content = this.nextElementSibling;

          // 他を閉じる
          document.querySelectorAll(".dropdown-content.open").forEach(c => {
            if (c !== content) {
              c.classList.remove("open");
              c.style.maxHeight = null;
              c.previousElementSibling.classList.remove("active"); // 対応するボタンも非アクティブ
            }
          });

          if (content.classList.contains("open")) {
            content.classList.remove("open");
            content.style.maxHeight = null;
            this.classList.remove("active");
          } else {
            content.classList.add("open");
            content.style.maxHeight = content.scrollHeight + "px";
            this.classList.add("active");
          }
        });
      });
    });
});
