// ===== 調整パラメータ =====
const SCROLL_TOP_INSET_PC = 72;   // ヘッダー/コンテナ余白ぶん（PC）
const SCROLL_TOP_INSET_SP = 84;   // モバイルは少し多め
const SCROLL_BOTTOM_INSET = 24;
const HYSTERESIS = 12;            // 行き過ぎ防止のゆとり
const TRANSITION_TIMEOUT = 450;    // CSS .35s より少し長めの保険

// ユーザーがモーションを減らす設定ならアニメを切る
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const scrollBehavior = prefersReduced ? 'auto' : 'smooth';

document.addEventListener('DOMContentLoaded', async () => {
  const mount = document.getElementById('sidebar');
  if (!mount) return;

  // sidebar.html を一回だけ読み込んで挿入
  const html = await fetch('sidebar.html').then(r => r.text());
  mount.innerHTML = html;

  // 初期化（アコーディオン配線）
  wireAccordion(mount);

  // もし隠しクラスでFOUC対策しているならここで外す
  mount.classList?.remove('is-hydrating');
  mount.removeAttribute?.('aria-busy');
});

function getInsets() {
  const isMobile = window.innerWidth <= 768;
  return {
    topInset: isMobile ? SCROLL_TOP_INSET_SP : SCROLL_TOP_INSET_PC,
    bottomInset: SCROLL_BOTTOM_INSET
  };
}

// 「必要なときだけ」最小限スクロール
function smartAdjustScroll(el, extraTop = 0) {
  const { topInset, bottomInset } = getInsets();
  const rect = el.getBoundingClientRect();
  const vTop = topInset + extraTop + HYSTERESIS;
  const vBottom = window.innerHeight - (bottomInset + HYSTERESIS);

  if (rect.top >= vTop && rect.bottom <= vBottom) return; // 既に見えてる

  let targetY;
  if (rect.top < vTop) {
    targetY = window.scrollY + rect.top - vTop;
  } else {
    targetY = window.scrollY + (rect.bottom - vBottom);
  }
  window.scrollTo({ top: targetY, behavior: scrollBehavior });
}

function wireAccordion(root) {
  const buttons = root.querySelectorAll('.dropdown-button');
  let isAnimating = false;
  let lastClickAt = 0;

  buttons.forEach((btn) => {
    const panel = btn?.nextElementSibling;
    if (!panel || !panel.classList.contains('dropdown-content')) return; // 保険

    // A11y初期属性
    const panelId = panel.id || `sidebar-panel-${Math.random().toString(36).slice(2, 8)}`;
    panel.id = panelId;
    btn.setAttribute('aria-controls', panelId);
    btn.setAttribute('aria-expanded', 'false');
    panel.setAttribute('role', 'region');
    panel.setAttribute('aria-hidden', 'true');

    btn.addEventListener('click', () => {
      const now = Date.now();
      if (isAnimating || now - lastClickAt < 120) return; // 連打抑制
      lastClickAt = now;

      const opened = panel.classList.contains('open');

      // 他パネルを閉じる
      root.querySelectorAll('.dropdown-content.open').forEach((openEl) => {
        if (openEl !== panel) {
          openEl.classList.remove('open');
          openEl.previousElementSibling?.setAttribute('aria-expanded', 'false');
          openEl.setAttribute('aria-hidden', 'true');
        }
      });

      if (opened) {
        // 閉じる（必要なら近接スクロール）
        panel.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
        panel.setAttribute('aria-hidden', 'true');
        smartAdjustScroll(btn); // 省略可
        return;
      }

      // 先に開いて高さ確定 → トランジション完了後に微調整
      panel.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
      panel.setAttribute('aria-hidden', 'false');

      if (prefersReduced) {
        // アニメ無効環境では即座に調整
        smartAdjustScroll(btn);
        return;
      }

      isAnimating = true;
      let done = false;
      const finish = () => {
        if (done) return;
        done = true;
        isAnimating = false;
        smartAdjustScroll(btn);
      };

      const onEnd = (e) => {
        if (e.target !== panel) return;
        panel.removeEventListener('transitionend', onEnd);
        finish();
      };
      panel.addEventListener('transitionend', onEnd);

      // 取りこぼし保険
      setTimeout(() => {
        panel.removeEventListener('transitionend', onEnd);
        finish();
      }, TRANSITION_TIMEOUT);
    });

    // Enter/Spaceで開閉
    btn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        btn.click();
      }
    });
  });
}
