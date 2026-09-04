/** Apariciones al scroll — variantes, stagger y easing editorial. */
export function initScrollReveal() {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const singles = document.querySelectorAll('.reveal-on-scroll:not(.reveal-item)');
  const staggers = document.querySelectorAll('.reveal-stagger');
  const orphanItems = document.querySelectorAll('.reveal-item:not(.reveal-stagger .reveal-item)');

  const show = (el) => {
    el.classList.add('is-visible');
  };

  if (reduceMotion) {
    singles.forEach(show);
    staggers.forEach((group) => {
      group.querySelectorAll('.reveal-item').forEach(show);
    });
    orphanItems.forEach(show);
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const el = entry.target;

        if (el.classList.contains('reveal-stagger')) {
          const gap = Number.parseInt(el.dataset.revealGap || '85', 10);
          el.querySelectorAll('.reveal-item').forEach((child, index) => {
            child.style.setProperty('--reveal-delay', `${index * gap}ms`);
            show(child);
          });
          observer.unobserve(el);
          return;
        }

        show(el);
        observer.unobserve(el);
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -5% 0px' },
  );

  singles.forEach((el) => observer.observe(el));
  staggers.forEach((el) => observer.observe(el));
  orphanItems.forEach((el) => observer.observe(el));
}

/** Hint del hero: se oculta al salir del viewport */
export function initHeroScrollHint() {
  const hero = document.getElementById('hero');
  const scrollHint = hero?.querySelector('a[href="#promociones"]');
  if (!hero || !scrollHint || !('IntersectionObserver' in window)) return;

  const hintObserver = new IntersectionObserver(
    ([entry]) => {
      scrollHint.classList.toggle('opacity-0', !entry.isIntersecting);
      scrollHint.classList.toggle('pointer-events-none', !entry.isIntersecting);
    },
    { threshold: 0.55 },
  );

  hintObserver.observe(hero);
}
