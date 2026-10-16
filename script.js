// Sasa portfolio: the avatar, scroll reveals, the lit name, the image viewer and a small parallax.
(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---- reveal on enter (never replays, never leaves content hidden) ----
  const revealTargets = document.querySelectorAll('[data-reveal]');
  const once = (els, cb, margin) => {
    if (!('IntersectionObserver' in window)) { els.forEach((el) => cb(el)); return; }
    const io = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        cb(entry.target);
        io.unobserve(entry.target);
      }
    }, { rootMargin: margin || '0px 0px -10% 0px', threshold: 0.08 });
    els.forEach((el) => io.observe(el));
  };
  once(revealTargets, (el) => el.classList.add('is-in'));
  window.addEventListener('load', () => setTimeout(() => {
    revealTargets.forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.top < innerHeight && r.bottom > 0) el.classList.add('is-in');
    });
  }, 2500));

  // rows, strip frames and the footer wordmark
  document.querySelectorAll('.row').forEach((row, i) => row.style.setProperty('--i', i));
  document.querySelectorAll('.strip li').forEach((li, i) => li.style.setProperty('--i', Math.min(i, 9)));
  once(document.querySelectorAll('.row'), (el) => el.classList.add('is-in'), '0px 0px -6% 0px');
  once(document.querySelectorAll('.strip'), (el) => el.classList.add('is-in'), '0px 0px -5% 0px');
  once(document.querySelectorAll('.footer'), (el) => el.classList.add('is-in'), '0px 0px -25% 0px');

  // ---- the live thing: the last "a" is Sasa's own avatar ----
  const avatar = document.getElementById('avatar');
  if (avatar) {
    let happyTimer = 0;
    let glanceTimer = 0;
    let hovering = false;
    const set = (state) => { avatar.dataset.state = state; };

    const happy = (ms) => {
      clearTimeout(happyTimer);
      clearTimeout(glanceTimer);
      set('happy');
      happyTimer = setTimeout(() => { if (!hovering) { set('neutral'); scheduleGlance(); } }, ms);
    };

    const scheduleGlance = () => {
      if (reduced) return;
      clearTimeout(glanceTimer);
      glanceTimer = setTimeout(() => {
        if (avatar.dataset.state !== 'neutral') { scheduleGlance(); return; }
        set('glance');
        glanceTimer = setTimeout(() => { if (avatar.dataset.state === 'glance') set('neutral'); scheduleGlance(); }, 520 + Math.random() * 300);
      }, 2200 + Math.random() * 2600);
    };

    avatar.addEventListener('click', () => happy(1700));
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      avatar.addEventListener('pointerenter', () => { hovering = true; clearTimeout(happyTimer); clearTimeout(glanceTimer); set('happy'); });
      avatar.addEventListener('pointerleave', () => { hovering = false; happyTimer = setTimeout(() => { set('neutral'); scheduleGlance(); }, 500); });
    }
    scheduleGlance();
  }

  // ---- proof: one name at a time is lit ----
  const names = Array.from(document.querySelectorAll('#proofLine .n'));
  if (names.length) {
    let idx = 0;
    names[0].classList.add('is-lit');
    if (!reduced) {
      setInterval(() => {
        names[idx].classList.remove('is-lit');
        idx = (idx + 1) % names.length;
        names[idx].classList.add('is-lit');
      }, 2000);
    }
  }

  // ---- walk cycle video respects reduced motion ----
  const walk = document.getElementById('walk');
  if (walk && reduced) { walk.removeAttribute('autoplay'); walk.pause(); }

  // ---- gallery viewer ----
  const viewer = document.getElementById('viewer');
  const viewerImg = document.getElementById('viewerImg');
  const viewerCap = document.getElementById('viewerCap');
  if (viewer && typeof viewer.showModal === 'function') {
    document.querySelectorAll('.strip a').forEach((a) => {
      a.addEventListener('click', (e) => {
        e.preventDefault();
        const img = a.querySelector('img');
        viewerImg.src = a.getAttribute('href');
        viewerImg.alt = img ? img.alt : '';
        viewerCap.textContent = a.dataset.caption || '';
        viewer.showModal();
      });
    });
    viewer.addEventListener('click', (e) => { if (e.target === viewer) viewer.close(); });
  }

  // ---- phones drift a little with the scroll ----
  const phones = Array.from(document.querySelectorAll('.phones li'));
  if (phones.length && !reduced) {
    let ticking = false;
    const update = () => {
      ticking = false;
      const wide = window.innerWidth >= 768;
      phones.forEach((li, i) => {
        if (!wide) { li.style.transform = ''; return; }
        const r = li.getBoundingClientRect();
        const mid = (r.top + r.bottom) / 2 - innerHeight / 2;
        const base = i % 2 ? Math.min(80, Math.max(24, innerWidth * 0.05)) : 0;
        const drift = Math.max(-40, Math.min(40, mid * (i % 2 ? -0.06 : 0.06)));
        li.style.transform = `translateY(${base + drift}px)`;
      });
    };
    window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    window.addEventListener('resize', update);
    update();
  }
})();
