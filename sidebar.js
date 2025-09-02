// クリック処理（抜粋：スクロール行為は一切しない）
root.addEventListener('click', (e) => {
  const btn = e.target.closest('.dropdown-button');
  if (!btn || !root.contains(btn)) return;

  const panel = btn.nextElementSibling;
  if (!panel || !panel.classList.contains('dropdown-content')) return;

  // 他パネルを閉じる
  root.querySelectorAll('.dropdown-content.open').forEach((el) => {
    if (el !== panel) {
      el.classList.remove('open');
      el.previousElementSibling?.setAttribute('aria-expanded', 'false');
      el.setAttribute('aria-hidden', 'true');
    }
  });

  const wasOpen = panel.classList.contains('open');
  panel.classList.toggle('open', !wasOpen);
  btn.setAttribute('aria-expanded', String(!wasOpen));
  panel.setAttribute('aria-hidden', String(wasOpen));

  // フォーカスによる自動スクロールも抑止
  if (typeof btn.focus === 'function') {
    try { btn.focus({ preventScroll: true }); } catch {}
  }
});
