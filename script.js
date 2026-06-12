(() => {
  const menuData = window.ahopMenu || [];
  const tabs = document.getElementById('menu-tabs');
  const results = document.getElementById('menu-results');
  const search = document.getElementById('menu-search');
  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.getElementById('site-nav');
  let activeCategory = 'All';

  const escapeHtml = (value = '') => String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

  function makeTabs() {
    const categories = ['All', ...menuData.map(section => section.category)];
    tabs.innerHTML = categories.map(category => (
      `<button class="menu-tab${category === activeCategory ? ' active' : ''}" type="button" role="tab" aria-selected="${category === activeCategory}" data-category="${escapeHtml(category)}">${escapeHtml(category)}</button>`
    )).join('');
  }

  function menuItemTemplate(item) {
    return `
      <article class="menu-item">
        <div>
          <h4>${escapeHtml(item.name)}</h4>
          ${item.description ? `<p>${escapeHtml(item.description)}</p>` : ''}
        </div>
        <strong>${escapeHtml(item.price)}</strong>
      </article>
    `;
  }

  function menuSectionTemplate(section, items) {
    return `
      <section class="menu-category">
        <div class="menu-category-heading">
          <h3>${escapeHtml(section.category)}</h3>
          ${section.note ? `<p>${escapeHtml(section.note)}</p>` : ''}
        </div>
        <div class="menu-items">${items.map(menuItemTemplate).join('')}</div>
        ${section.extras ? `<p class="menu-extras">${escapeHtml(section.extras)}</p>` : ''}
      </section>
    `;
  }

  function renderMenu() {
    const query = search.value.trim().toLowerCase();
    const sections = menuData
      .filter(section => activeCategory === 'All' || section.category === activeCategory)
      .map(section => {
        const items = section.items.filter(item => {
          const haystack = `${item.name} ${item.description || ''} ${section.category}`.toLowerCase();
          return !query || haystack.includes(query);
        });
        return { ...section, items };
      })
      .filter(section => section.items.length);

    results.innerHTML = sections.length
      ? sections.map(section => menuSectionTemplate(section, section.items)).join('')
      : '<div class="no-results"><h3>No menu items found.</h3><p>Try a different search term.</p></div>';
  }

  tabs.addEventListener('click', event => {
    const button = event.target.closest('[data-category]');
    if (!button) return;
    activeCategory = button.dataset.category;
    makeTabs();
    renderMenu();
  });

  search.addEventListener('input', renderMenu);

  navToggle.addEventListener('click', () => {
    const open = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!open));
    nav.classList.toggle('open', !open);
  });

  nav.addEventListener('click', event => {
    if (!event.target.closest('a')) return;
    nav.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });

  document.getElementById('download-menu').addEventListener('click', window.ahopMenuPdf.download);

  document.getElementById('year').textContent = new Date().getFullYear();
  makeTabs();
  renderMenu();
})();
