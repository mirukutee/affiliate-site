<script>
  document.addEventListener("DOMContentLoaded", function () {
    const buttons = document.querySelectorAll(".dropdown-button");

    buttons.forEach(function (button) {
      button.addEventListener("click", function () {
        const content = this.nextElementSibling;

        if (content.classList.contains("open")) {
          content.classList.remove("open");
        } else {
          document.querySelectorAll(".dropdown-content.open").forEach(function (c) {
            c.classList.remove("open");
          });

          content.classList.add("open");

          if (window.innerWidth > 768) {
            content.style.maxHeight = content.scrollHeight + "px";
          } else {
            content.style.maxHeight = "none";
          }
        }
      });
    });
  });
</script>
