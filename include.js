window.addEventListener('DOMContentLoaded', () => {
  const loadHTML = (selector, url) => {
    fetch(url)
      .then(res => res.text())
      .then(data => {
        document.querySelector(selector).innerHTML = data;
      })
      .catch(err => console.error(`Error loading ${url}:`, err));
  };

  loadHTML('#header', '/partials/header.html');
  loadHTML('#footer', '/partials/footer.html');
});
