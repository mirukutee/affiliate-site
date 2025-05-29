document.addEventListener("DOMContentLoaded", function () {
  fetch('sidebar.html')
    .then(response => response.text())
    .then(data => {
      document.getElementById('sidebar').innerHTML = data;

      const buttons = document.querySelectorAll(".dropdown-button");

      buttons.forEach(button => {
        button.addEventListener("click", function () {
          const content = this.nextElementSibling;

          // 他のドロップダウンを閉じる
          document.querySelectorAll(".dropdown-content.open").forEach(c => {
            if (c !== content) {
              c.classList.remove("open");
              c.style.maxHeight = null;
              c.style.display = "none";  // 追加
            }
          });

          if (content.classList.contains("open")) {
            content.classList.remove("open");
            content.style.maxHeight = null;
            content.style.display = "none";  // 追加
          } else {
            content.classList.add("open");
            content.style.maxHeight = content.scrollHeight + "px";
            content.style.display = "block";  // 追加
          }
        });
      });
    });
});
