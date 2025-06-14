document.addEventListener("DOMContentLoaded", function () {
  fetch('sidebar.html')
    .then(response => response.text())
    .then(data => {
      document.getElementById('sidebar').innerHTML = data;

      const buttons = document.querySelectorAll(".dropdown-button");

      buttons.forEach(button => {
        button.addEventListener("click", function () {
          const content = this.nextElementSibling;

          // スクロールして中央に表示
          button.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          });

          // 他を閉じる
          document.querySelectorAll(".dropdown-content.open").forEach(c => {
            if (c !== content) {
              c.classList.remove("open");
              c.style.maxHeight = null;
              c.style.display = "none";
              c.style.opacity = "0";
            }
          });

          // 自分をトグル開閉
          if (content.classList.contains("open")) {
            content.classList.remove("open");
            content.style.maxHeight = null;
            content.style.display = "none";
            content.style.opacity = "0";
          } else {
            content.style.display = "block";
            requestAnimationFrame(() => {
              content.classList.add("open");
              content.style.maxHeight = content.scrollHeight + "px";
              content.style.opacity = "1";
            });
          }
        });
      });
    });
});
