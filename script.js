// Mobile menu toggle.
(() => {
  const toggle = document.getElementById('nav-toggle');
  const menu = document.getElementById('mobile-menu');
  if (!toggle || !menu) return;
  const close = () => { menu.classList.remove('is-open'); toggle.setAttribute('aria-expanded', 'false'); };
  toggle.addEventListener('click', () => {
    const open = menu.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', close));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
})();

// Reveal once when an element enters the viewport.
(() => {
  const targets = document.querySelectorAll('[data-reveal]');
  if (!targets.length) return;
  if (!('IntersectionObserver' in window)) { targets.forEach((el) => el.classList.add('is-in')); return; }
  const io = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add('is-in');
      io.unobserve(entry.target);
    }
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });
  targets.forEach((el) => io.observe(el));
  window.addEventListener('load', () => setTimeout(() => {
    targets.forEach((el) => { const r = el.getBoundingClientRect(); if (r.top < innerHeight && r.bottom > 0) el.classList.add('is-in'); });
  }, 2500));
})();

// Seamless marquee — each track holds a card set followed by an identical duplicate set.
// Looping via "-50%" only lines up when the two halves are exactly equal width, which isn't
// true once a flex `gap` sits at the seam between them. Measure the real pixel distance to the
// duplicate's first card instead, so the loop point is pixel-perfect and never visibly jumps.
(() => {
  const tracks = [...document.querySelectorAll('.carousel-track')];
  if (!tracks.length) return;
  const measure = (track) => {
    const items = track.children;
    const half = items.length / 2;
    const first = items[0];
    const second = items[half];
    if (!first || !second) return;
    const dist = second.getBoundingClientRect().left - first.getBoundingClientRect().left;
    if (dist > 0) track.style.setProperty('--loop-dist', `${dist}px`);
  };
  const measureAll = () => tracks.forEach(measure);
  measureAll();
  window.addEventListener('load', measureAll);
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(measureAll, 150);
  });
})();

// Sector filter — pauses the auto-scrolling product carousel and shows only the matching cards.
(() => {
  const group = document.getElementById('filters');
  const carousel = document.getElementById('carousel');
  const track = document.getElementById('carousel-track');
  if (!group || !carousel || !track) return;
  const buttons = [...group.querySelectorAll('button')];
  const items = [...track.querySelectorAll('.p-card')];
  group.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;
    const filter = btn.dataset.filter;
    buttons.forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
    if (filter === 'all') {
      carousel.classList.remove('is-filtered');
      track.style.animation = '';
      track.style.transform = '';
    } else {
      carousel.classList.add('is-filtered');
      items.forEach((it) => it.classList.toggle('is-match', !it.hasAttribute('aria-hidden') && it.dataset.sector === filter));
      track.style.animation = 'none';
      track.style.transform = 'translateX(0)';
    }
  });
})();

// Contact form — no backend: opens a mailto: with the message filled in.
(() => {
  const form = document.getElementById('contact-form');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const nombre = form.nombre.value.trim();
    const empresa = form.empresa.value.trim();
    const mensaje = form.mensaje.value.trim();
    const quien = empresa ? `soy ${nombre} de la empresa ${empresa}` : `soy ${nombre}`;
    const subject = encodeURIComponent('Consulta desde tekroy.cl');
    const body = encodeURIComponent(`Estimado equipo de Tekroy Electrónica, ${quien},\n\n${mensaje}`);
    window.location.href = `mailto:contacto@tekroy.cl?subject=${subject}&body=${body}`;
  });
})();

// Contact form (educación) — same pattern, with "institución" instead of "empresa".
(() => {
  const form = document.getElementById('contact-form-edu');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const nombre = form.nombre.value.trim();
    const institucion = form.institucion.value.trim();
    const mensaje = form.mensaje.value.trim();
    const quien = institucion ? `soy ${nombre} de la institución ${institucion}` : `soy ${nombre}`;
    const subject = encodeURIComponent('Programa educativo Tekroy');
    const body = encodeURIComponent(`Estimado equipo de Tekroy Electrónica, ${quien},\n\n${mensaje}`);
    window.location.href = `mailto:contacto@tekroy.cl?subject=${subject}&body=${body}`;
  });
})();
