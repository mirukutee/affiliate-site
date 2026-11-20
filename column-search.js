/* column.html 専用の記事カード検索。既存のグローバル変数・イベントには依存しない。 */
(() => {
  'use strict';

  function initColumnSearch() {
    const root = document.getElementById('column-search');
    if (!root || root.dataset.initialized === 'true') return;
    const input = root.querySelector('#column-search-input');
    const results = root.querySelector('#column-search-results');
    const status = root.querySelector('#column-search-status');
    const clear = root.querySelector('#column-search-clear');
    if (!input || !results || !status || !clear) return;
    root.dataset.initialized = 'true';

    const normalize = (value) => (value || '').normalize('NFKC').toLocaleLowerCase('ja-JP').replace(/\s+/g, ' ').trim();
    const entries = Array.from(document.querySelectorAll('section.clm-section article.clm-card'))
      .map((card) => {
        const link = card.querySelector('a.clm-card__link');
        const title = card.querySelector('.clm-card__title');
        const section = card.closest('section.clm-section');
        const category = section && section.querySelector('.clm-section-head__title');
        return (link && title && category) ? {
          card, title: title.textContent.trim(), category: category.textContent.trim(),
          matchText: normalize(title.textContent + ' ' + category.textContent + ' ' + (card.querySelector('.clm-card__sub')?.textContent || ''))
        } : null;
      }).filter(Boolean);

    const limit = 8;
    let shown = [];
    let selectedIndex = -1;
    let highlightTimeout = null;

    function hideResults() {
      results.hidden = true;
      input.setAttribute('aria-expanded', 'false');
      input.removeAttribute('aria-activedescendant');
      selectedIndex = -1;
    }
    function updateSelection(index) {
      const options = Array.from(results.querySelectorAll('[role="option"]'));
      if (!options.length) return;
      selectedIndex = (index + options.length) % options.length;
      options.forEach((option, i) => option.setAttribute('aria-selected', String(i === selectedIndex)));
      input.setAttribute('aria-activedescendant', options[selectedIndex].id);
      options[selectedIndex].scrollIntoView({ block: 'nearest' });
    }
    function goToArticle(entry) {
      const details = entry.card.closest('details.clm-more');
      if (details) details.open = true;
      hideResults();
      input.value = '';
      clear.hidden = true;
      status.textContent = `「${entry.title}」の位置へ移動しました。`;
      if (highlightTimeout !== null) window.clearTimeout(highlightTimeout);
      document.querySelectorAll('.column-search-target').forEach(el => el.classList.remove('column-search-target'));
      entry.card.classList.add('column-search-target');
      // details のレイアウト反映後に移動。ブラウザの縮小モーション設定にも対応。
      window.requestAnimationFrame(() => window.requestAnimationFrame(() => {
        entry.card.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'center' });
      }));
      highlightTimeout = window.setTimeout(() => entry.card.classList.remove('column-search-target'), 3500);
    }
    function render() {
      const query = normalize(input.value);
      clear.hidden = input.value.length === 0;
      results.replaceChildren();
      shown = [];
      selectedIndex = -1;
      input.removeAttribute('aria-activedescendant');
      if (!query) {
        hideResults();
        status.textContent = '記事名やキーワードで検索できます。';
        return;
      }
      const tokens = query.split(' ').filter(Boolean);
      const allMatches = entries.filter(entry => tokens.every(token => entry.matchText.includes(token)));
      shown = allMatches.slice(0, limit);
      const fragment = document.createDocumentFragment();
      for (const [index, entry] of shown.entries()) {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'column-search-option';
        button.id = `column-search-option-${index}`;
        button.setAttribute('role', 'option');
        button.setAttribute('aria-selected', 'false');
        const title = document.createElement('span');
        title.className = 'column-search-option__title';
        title.textContent = entry.title;
        const category = document.createElement('span');
        category.className = 'column-search-option__category';
        category.textContent = entry.category;
        button.append(title, category);
        button.addEventListener('click', () => goToArticle(entry));
        fragment.appendChild(button);
      }
      if (!allMatches.length) {
        const empty = document.createElement('p');
        empty.className = 'column-search-empty';
        empty.textContent = '該当する記事が見つかりませんでした。別のキーワードをお試しください。';
        fragment.appendChild(empty);
      }
      results.appendChild(fragment);
      results.hidden = false;
      input.setAttribute('aria-expanded', 'true');
      status.textContent = allMatches.length ? `${allMatches.length}件見つかりました。${allMatches.length > limit ? `候補は先頭${limit}件まで表示しています。` : ''}` : '該当記事なし';
    }

    input.addEventListener('input', render);
    input.addEventListener('focus', () => { if (normalize(input.value)) render(); });
    input.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') { hideResults(); return; }
      if (!shown.length || results.hidden) return;
      if (event.key === 'ArrowDown') { event.preventDefault(); updateSelection(selectedIndex + 1); }
      else if (event.key === 'ArrowUp') { event.preventDefault(); updateSelection(selectedIndex < 0 ? shown.length - 1 : selectedIndex - 1); }
      else if (event.key === 'Enter') { event.preventDefault(); goToArticle(shown[selectedIndex >= 0 ? selectedIndex : 0]); }
    });
    clear.addEventListener('click', () => { input.value = ''; render(); input.focus(); });
    document.addEventListener('pointerdown', (event) => { if (!root.contains(event.target)) hideResults(); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initColumnSearch, { once: true });
  else initColumnSearch();
})();
