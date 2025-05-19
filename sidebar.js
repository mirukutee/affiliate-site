function toggleDropdown(id) {
  const allDropdowns = document.querySelectorAll('.dropdown-content');

  allDropdowns.forEach(drop => {
    if (drop.id !== id) {
      drop.classList.remove('open');
    }
  });

  const current = document.getElementById(id);
  current.classList.toggle('open');
}
