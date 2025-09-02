// ===== sidebar.js（最終版） =====

// 読み込み先（ルート相対で固定）
const SIDEBAR_URL = '/affiliate-site/sidebar.html';

// 調整パラメータ
const SCROLL_TOP_INSET_PC = 72;   // 固定ヘッダー/上部余白ぶん
const SCROLL_TOP_INSET_SP = 84;   // モバイルは少し多め
const SCROLL_BOTTOM_INSET = 24;
const HYSTERESIS = 12;            // 行き過ぎ防止のゆとり
const TRANSITION_TIMEOUT = 450;   // CSSの .35s より少し長めの保険

// ユーザーの設定に応じてアニメ抑制
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const scrollBehavior = prefersReduced ? 'auto' : 'smooth';

// 起動（初回＆bfcache復帰の両方に対応）
document.addEventListener('DOMContentLoaded', hydrate);
window.addEventListener('pageshow', hydrate);

async function hydrate() {
  const mount = document.getElementById('sidebar');
  if (!mount || mount.dataset.hydrated) return;

  // sidebar.html を読み込んで挿入
  const html = await fetch(SIDEBAR_URL).then(r => r.text());
  mount.innerHTML = html;

  // 初期化（A11y付与・イベント配線）
  initSidebar(mount);

  // 表示切替（FOUC対策用クラスを外す）
  mount.dataset.hydrated = '1';
  mount.classList?.remove('is-hydrating');
  mount.removeAttribute?.('aria-busy');
}

function initSidebar(root) {
  // A11y初期属性
  root.querySelectorAll('.dropdown-button').forEach((btn) => {
    const panel = btn?.nextElementSibling;
    if (!panel || !panel.classList.contains('dropdown-content')) return;
    const id = panel.id || `sidebar-panel-${Math.random().toString(36).slice(2, 8)}`;
    panel.id = id;
    btn.setAttribute('aria-controls', id);
    btn.setAttribute('aria-expanded', 'false');
    panel.setAttribute('role', 'region');
    panel.setAttribute('aria-hidden', 'true');
  });

  // クリックはルート委譲（差し替えや遅延にも強い）
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

    if (wasOpen) {
      // 閉じる
      panel.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
      panel.setAttribute('aria-hidden', 'true');
      smartAdjustScroll(btn); // 省略可
      return;
    }

    // 開く（高さが確定してから位置調整）
    panel.classList.add('open');
    btn.setAttribute('aria-expanded', 'true');
    panel.setAttribute('aria-hidden', 'false');

    if (prefersReduced) {
      smartAdjustScroll(btn);
      return;
    }

    const onEnd = (ev) => {
      if (ev.target !== panel) return;
      panel.removeEventListener('transitionend', onEnd);
      smartAdjustScroll(btn);
    };
    panel.addEventListener('transitionend', onEnd);
    // 取りこぼし保険
    setTimeout(() => {
      panel.removeEventListener('transitionend', onEnd);
      smartAdjustScroll(btn);
    }, TRANSITION_TIMEOUT);
  });

  // キーボード操作（Enter/Spaceで開閉）
  root.addEventListener('keydown', (e) => {
    if ((e.key === 'Enter' || e.key === ' ') && e.target.closest('.dropdown-button')) {
      e.preventDefault();
      e.target.click();
    }
  });
}

// 必要なときだけ最小限スクロール（“上に行き過ぎ”防止）
function smartAdjustScroll(el, extraTop = 0) {
  const isMobile = window.innerWidth <= 768;
  const topInset = (isMobile ? SCROLL_TOP_INSET_SP : SCROLL_TOP_INSET_PC) + extraTop + HYSTERESIS;
  const bottomInset = SCROLL_BOTTOM_INSET + HYSTERESIS;

  const rect = el.getBoundingClientRect();
  const vTop = topInset;
  const vBottom = window.innerHeight - bottomInset;

  // 既に十分見えているなら動かない
  if (rect.top >= vTop && rect.bottom <= vBottom) return;

  const top = (rect.top < vTop)
    ? window.scrollY + rect.top - vTop
    : window.scrollY + (rect.bottom - vBottom);

  window.scrollTo({ top, behavior: scrollBehavior });
}
