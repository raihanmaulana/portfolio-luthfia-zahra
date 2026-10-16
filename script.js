// Sasa portfolio: the avatar, scroll reveals, the lit name, gallery filters and the image viewer.
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
  // the hero avatar is clipped shut until revealed, so an observer cannot see it: open it directly
  const avatarEl = document.getElementById('avatar');
  if (avatarEl) requestAnimationFrame(() => requestAnimationFrame(() => avatarEl.classList.add('is-in')));
  once(Array.from(revealTargets).filter((el) => el !== avatarEl), (el) => el.classList.add('is-in'));
  window.addEventListener('load', () => setTimeout(() => {
    revealTargets.forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.top < innerHeight && r.bottom > 0) el.classList.add('is-in');
    });
  }, 2500));

  // rows, strip frames and the footer wordmark
  document.querySelectorAll('.row').forEach((row, i) => row.style.setProperty('--i', i));
  once(document.querySelectorAll('.row'), (el) => el.classList.add('is-in'), '0px 0px -6% 0px');
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

  // ---- design work: filter chips ----
  const tiles = Array.from(document.querySelectorAll('#tiles li'));
  const chips = Array.from(document.querySelectorAll('.chip'));
  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      const f = chip.dataset.filter;
      chips.forEach((c) => c.setAttribute('aria-pressed', String(c === chip)));
      tiles.forEach((li) => { li.hidden = f !== 'all' && li.dataset.cat !== f; });
    });
  });

  // ---- gallery viewer with prev / next over the visible pieces ----
  const viewer = document.getElementById('viewer');
  const viewerImg = document.getElementById('viewerImg');
  const viewerCap = document.getElementById('viewerCap');
  if (viewer && typeof viewer.showModal === 'function') {
    let current = null;
    const visible = () => tiles.filter((li) => !li.hidden).map((li) => li.querySelector('a'));
    const show = (a) => {
      const img = a.querySelector('img');
      current = a;
      viewerImg.src = a.getAttribute('href');
      viewerImg.alt = img ? img.alt : '';
      viewerCap.textContent = a.dataset.caption || '';
    };
    const step = (dir) => {
      const list = visible();
      if (!list.length || !current) return;
      const i = list.indexOf(current);
      show(list[(i + dir + list.length) % list.length]);
    };
    tiles.forEach((li) => {
      const a = li.querySelector('a');
      a.addEventListener('click', (e) => { e.preventDefault(); show(a); viewer.showModal(); });
    });
    document.getElementById('viewerPrev').addEventListener('click', () => step(-1));
    document.getElementById('viewerNext').addEventListener('click', () => step(1));
    viewer.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') step(-1);
      if (e.key === 'ArrowRight') step(1);
    });
    viewer.addEventListener('click', (e) => { if (e.target === viewer) viewer.close(); });
  }
})();
