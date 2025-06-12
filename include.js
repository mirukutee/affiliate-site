

document.addEventListener("DOMContentLoaded", function () {
  const inject = (id, path) => {
    fetch(path)
      .then((res) => res.text())
      .then((data) => {
        const target = document.getElementById(id);
        if (target) target.innerHTML = data;
      })
      .catch((err) => console.error(`Error loading ${path}:`, err));
  };

  inject("header", "header.html");
  inject("footer", "footer.html");
});
