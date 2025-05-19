document.addEventListener("DOMContentLoaded", function () {
  fetch('sidebar.html')
    .then(response => response.text())
    .then(data => {
      document.getElementById('sidebar').innerHTML = data;

      // ドロップダウンのイベントリスナーを設定
      const buttons = document.querySelectorAll(".dropdown-button");

      buttons.forEach(button => {
        button.addEventListener("click", function () {
          const content = this.nextElementSibling;

          if (content.classList.contains("open")) {
            content.classList.remove("open");
            content.style.maxHeight = null;
          } else {
            // すでに開いているものを閉じる
            document.querySelectorAll(".dropdown-content.open").forEach(c => {
              c.classList.remove("open");
              c.style.maxHeight = null;
            });

            content.classList.add("open");
            content.style.maxHeight = content.scrollHeight + "px";
          }
        });
      });
    });
});
