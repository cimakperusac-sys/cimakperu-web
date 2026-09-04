/** Sincroniza --site-header-h en todas las páginas (sidebar sticky, hero, etc.). */
let bound = false;

export function syncSiteHeaderHeight() {
  const header = document.querySelector('[data-site-header]');
  if (!header) return;

  document.documentElement.style.setProperty(
    '--site-header-h',
    `${Math.round(header.getBoundingClientRect().height)}px`,
  );

  if (bound) return;
  bound = true;

  window.addEventListener(
    'resize',
    () => {
      document.documentElement.style.setProperty(
        '--site-header-h',
        `${Math.round(header.getBoundingClientRect().height)}px`,
      );
    },
    { passive: true },
  );
}
