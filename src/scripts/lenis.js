import Lenis from 'lenis';

// Arranca siempre (si lo bloqueabas por "reducir movimiento" de Windows, no se notaba nada)
const lenis = new Lenis({
  autoRaf: true,
  lerp: 0.09, // más bajo = más lento / más inercia
  wheelMultiplier: 0.6,
  touchMultiplier: 1.5,
  syncTouch: true,
});

window.lenis = lenis;
console.log('[CIMAK] Lenis activo', lenis);

document.documentElement.classList.add('lenis', 'lenis-smooth');

document.addEventListener('click', (event) => {
  const target = event.target;
  if (!(target instanceof Element)) return;

  const link = target.closest('a[href^="#"]');
  if (!(link instanceof HTMLAnchorElement)) return;

  const id = link.getAttribute('href');
  if (!id || id === '#') return;

  const el = document.querySelector(id);
  if (!el) return;

  event.preventDefault();
  lenis.scrollTo(el, { offset: 0, lerp: 0.04 });
});
