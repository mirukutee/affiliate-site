function toggleDropdown(id) {
  document.querySelectorAll('.dropdown-content').forEach(el => {
    if (el.id !== id) el.classList.remove('open');
  });
  document.getElementById(id).classList.toggle('open');
}