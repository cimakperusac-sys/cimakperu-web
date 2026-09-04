import { syncSiteHeaderHeight } from './siteHeader.js';

const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
const lerp = (a, b, t) => a + (b - a) * t;
/** Menos scroll = banner sube más rápido (~45% del viewport) */
const TRAVEL_FACTOR = 0.45;

/** Parallax hero fluido: sticky nativo + transforms en GPU (sin saltos fixed/absolute). */
export function initHeroParallax() {
  const scene = document.querySelector('[data-hero-parallax]');
  const header = document.querySelector('[data-site-header]');
  const rail = scene?.querySelector('.hero-parallax-scene__rail');
  const viewport = scene?.querySelector('.hero-parallax-scene__viewport');
  const sheet = scene?.querySelector('[data-hero-sheet]');
  const hero = document.getElementById('hero');
  const media = hero?.querySelector('.hero-home__media');
  const overlay = hero?.querySelector('.hero-home__overlay');
  const title = hero?.querySelector('.hero-home__title');
  const scrollHint = hero?.querySelector('.hero-home__scroll');

  if (!scene || !rail || !viewport || !sheet || !hero || !media) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let metrics = {
    headerH: 0,
    peek: 72,
    pinH: 1,
    travel: 1,
    hiddenBelow: 0,
  };

  let revealed = false;
  let settled = false;
  let ticking = false;

  const syncHeaderHeight = () => syncSiteHeaderHeight();

  const readPx = (name, fallback = 0) => {
    const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    const value = parseFloat(raw);
    return Number.isFinite(value) ? value : fallback;
  };

  const measure = () => {
    syncHeaderHeight();

    const headerH = readPx('--site-header-h', header?.getBoundingClientRect().height ?? 0);
    const peek = readPx('--hero-promo-peek', 72);
    const pinH = Math.max(window.innerHeight - headerH, 1);
    const sheetH = sheet.offsetHeight || peek;
    const hiddenBelow = Math.max(sheetH - peek, 0);
    const fullTravel = Math.max(pinH - peek, 1);
    const travel = Math.max(Math.round(fullTravel * TRAVEL_FACTOR), hiddenBelow * 0.85, 140);

    metrics = {
      headerH,
      peek,
      pinH,
      travel,
      hiddenBelow,
    };

    rail.style.setProperty('--hero-parallax-travel', `${travel}px`);
  };

  const update = () => {
    ticking = false;

    const { travel, hiddenBelow, headerH } = metrics;
    // Posición visual real (evita desfase con Lenis / sticky)
    const local = clamp(headerH - rail.getBoundingClientRect().top, 0, travel);
    const progress = local / travel;

    // Progreso lineal = va pegado al scroll (Lenis ya suaviza)
    const sheetY = lerp(hiddenBelow, 0, progress);
    const shadow = 0.18 + progress * 0.38;

    sheet.style.transform = `translate3d(0, ${sheetY.toFixed(2)}px, 0)`;
    sheet.style.setProperty('--hero-sheet-shadow', shadow.toFixed(3));
    sheet.style.setProperty('--hero-sheet-lift', (1 - progress).toFixed(3));

    scene.classList.toggle('is-scrolling', progress > 0 && progress < 1);

    if (!reduceMotion) {
      const mediaY = progress * 22;
      const mediaScale = 1 + progress * 0.14;
      media.style.transform = `translate3d(0, ${mediaY.toFixed(2)}%, 0) scale(${mediaScale.toFixed(4)})`;
      hero.style.setProperty('--hero-dim', (0.35 + progress * 0.45).toFixed(3));
    } else {
      media.style.transform = '';
      hero.style.setProperty('--hero-dim', '0.44');
    }

    if (overlay) {
      overlay.style.opacity = Math.max(0, 1 - progress * 1.5).toFixed(3);
      overlay.style.transform = reduceMotion
        ? ''
        : `translate3d(0, ${(progress * -10).toFixed(2)}vh, 0)`;
    }

    if (title) {
      title.style.opacity = Math.max(0, 1 - progress * 1.3).toFixed(3);
      title.style.transform = reduceMotion
        ? ''
        : `translate3d(0, ${(progress * -24).toFixed(2)}px, 0)`;
    }

    if (scrollHint) {
      scrollHint.style.opacity = Math.max(0, 1 - progress * 2.6).toFixed(3);
      scrollHint.style.transform = `translate3d(-50%, ${(progress * 12).toFixed(2)}px, 0)`;
    }

    // Animaciones de contenido: solo una vez (evita parpadeos al re-entrar)
    if (!revealed && progress > 0.68) {
      revealed = true;
      scene.classList.add('is-revealed');
    }

    if (!settled && progress >= 0.999) {
      settled = true;
      scene.classList.add('is-settled');
    }
  };

  const scheduleUpdate = () => {
    if (window.lenis) {
      update();
      return;
    }
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  };

  measure();
  update();

  window.addEventListener(
    'resize',
    () => {
      measure();
      scheduleUpdate();
    },
    { passive: true },
  );

  const bindLenis = () => {
    if (!window.lenis?.on) return false;
    window.lenis.on('scroll', scheduleUpdate);
    return true;
  };

  if (!bindLenis()) {
    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    const wait = window.setInterval(() => {
      if (bindLenis()) {
        window.removeEventListener('scroll', scheduleUpdate);
        window.clearInterval(wait);
      }
    }, 32);
    window.setTimeout(() => window.clearInterval(wait), 5000);
  }

  sheet.querySelectorAll('img').forEach((img) => {
    if (img.complete) return;
    img.addEventListener(
      'load',
      () => {
        measure();
        scheduleUpdate();
      },
      { once: true },
    );
  });
}
