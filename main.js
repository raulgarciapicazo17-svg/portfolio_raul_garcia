function init() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.word').forEach(word => word.classList.add('is-lit'));
    document.querySelectorAll('[data-reveal]').forEach(element => element.classList.add('is-visible'));
    initNav();
  } else {
    initNav();
    initReveal();
    initManifesto();
    initHeroScroll();
  }
}

function initNav() {
  const nav = document.querySelector('.nav');
  if (!nav) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      nav.classList.add('nav--solid');
    } else {
      nav.classList.remove('nav--solid');
    }
  }, { passive: true });
}

function initReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -10% 0px'
  });

  document.querySelectorAll('[data-reveal]').forEach(element => observer.observe(element));
}

function initManifesto() {
  const manifesto = document.querySelector('.manifesto');
  if (!manifesto) return;
  const words = manifesto.querySelectorAll('.word');
  if (!words.length) return;

  let ticking = false;

  function onScroll() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(updateManifesto);
    }
  }

  function updateManifesto() {
    const vh = window.innerHeight;
    const rect = manifesto.getBoundingClientRect();
    const progress = clamp((vh - rect.top) / (vh / 2 + rect.height / 2), 0, 1);
    const litCount = Math.ceil(progress * words.length);

    words.forEach((word, index) => {
      if (index < litCount) {
        word.classList.add('is-lit');
      } else {
        word.classList.remove('is-lit');
      }
    });

    ticking = false;
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  updateManifesto(); // Initial state
}

function initHeroScroll() {
  const hero = document.querySelector('.hero');
  const heroImg = document.querySelector('.hero__img');
  const heroContent = document.querySelector('.hero__content');
  if (!hero || !heroImg || !heroContent) return;

  let ticking = false;

  function onScroll() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(updateHero);
    }
  }

  function updateHero() {
    const heroHeight = hero.offsetHeight;
    const p = clamp(window.scrollY / heroHeight, 0, 1);
    heroImg.style.transform = `scale(${1 + 0.12 * p})`;
    heroContent.style.transform = `translateY(${-80 * p}px)`;
    heroContent.style.opacity = String(clamp(1 - p * 1.2, 0, 1));

    ticking = false;
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  updateHero(); // Initial state
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

init();
