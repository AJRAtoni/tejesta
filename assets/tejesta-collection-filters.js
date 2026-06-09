(() => {
  const roots = document.querySelectorAll('[data-tejesta-collection-filters]');

  roots.forEach((root) => {
    const grid = document.getElementById('product-grid');
    if (!grid) return;

    const items = Array.from(grid.querySelectorAll('[data-tejesta-filter-card]'));
    const selects = Array.from(root.querySelectorAll('[data-filter-key]'));
    const openButton = root.querySelector('[data-tejesta-filter-open]');
    const closeButtons = root.querySelectorAll('[data-tejesta-filter-close]');
    const panel = root.querySelector('[data-tejesta-filter-panel]');
    const resetButton = root.querySelector('[data-tejesta-filter-reset]');
    const tagContainer = root.querySelector('[data-tejesta-filter-tags]');
    const resultCounts = root.querySelectorAll('[data-tejesta-result-count]');
    const resultLabel = root.querySelector('[data-tejesta-result-label]');

    const normalize = (value) => (value || '').toString().trim();

    const getState = () => selects.reduce((state, select) => {
      state[select.dataset.filterKey] = normalize(select.value);
      return state;
    }, {});

    const hasActiveFilters = (state) => Object.values(state).some((value) => value && value !== 'all');

    const setCount = (count) => {
      resultCounts.forEach((node) => {
        node.textContent = count;
      });
    };

    const renderTags = (state) => {
      if (!tagContainer) return;
      tagContainer.innerHTML = '';

      selects.forEach((select) => {
        const key = select.dataset.filterKey;
        const value = state[key];
        if (!value || value === 'all') return;

        const selectedOption = select.options[select.selectedIndex];
        const tag = document.createElement('button');
        tag.type = 'button';
        tag.className = 'tejesta-filter-tag';
        tag.dataset.filterKey = key;
        tag.textContent = `${select.closest('.tejesta-filter')?.querySelector('.tejesta-filter__label')?.textContent || key}: ${selectedOption.textContent}`;
        tag.addEventListener('click', () => {
          select.value = 'all';
          applyFilters();
        });
        tagContainer.appendChild(tag);
      });
    };

    function applyFilters() {
      const state = getState();
      let visibleCount = 0;

      items.forEach((item) => {
        const isVisible = Object.entries(state).every(([key, value]) => {
          if (!value || value === 'all') return true;
          const data = normalize(item.dataset[`tejestaFilter${key.charAt(0).toUpperCase()}${key.slice(1)}`]);
          return data.split('|').includes(value);
        });

        item.hidden = !isVisible;
        item.classList.toggle('tejesta-filter-card--hidden', !isVisible);
        if (isVisible) visibleCount += 1;
      });

      const active = hasActiveFilters(state);
      root.classList.toggle('has-filter', active);
      if (resetButton) resetButton.hidden = !active;
      if (resultLabel) resultLabel.hidden = !active;
      setCount(visibleCount);
      renderTags(state);
    }

    selects.forEach((select) => select.addEventListener('change', applyFilters));

    if (resetButton) {
      resetButton.addEventListener('click', () => {
        selects.forEach((select) => {
          select.value = 'all';
        });
        applyFilters();
      });
    }

    if (openButton && panel) {
      openButton.addEventListener('click', () => {
        panel.classList.add('is-active');
        document.documentElement.classList.add('tejesta-filter-open');
      });
    }

    closeButtons.forEach((button) => {
      button.addEventListener('click', () => {
        if (panel) panel.classList.remove('is-active');
        document.documentElement.classList.remove('tejesta-filter-open');
      });
    });

    applyFilters();
  });
})();
