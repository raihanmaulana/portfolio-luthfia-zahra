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

  // ---- scroll progress and active nav link ----
  const progress = document.querySelector('.progress');
  if (progress) {
    let pt = false;
    const setP = () => {
      pt = false;
      const max = document.documentElement.scrollHeight - innerHeight;
      progress.style.setProperty('--p', max > 0 ? Math.min(1, scrollY / max).toFixed(4) : 0);
    };
    addEventListener('scroll', () => { if (!pt) { pt = true; requestAnimationFrame(setP); } }, { passive: true });
    addEventListener('resize', setP);
    setP();
  }
  const navLinks = Array.from(document.querySelectorAll('.nav a'));
  if ('IntersectionObserver' in window && navLinks.length) {
    const byId = new Map(navLinks.map((a) => [a.getAttribute('href').slice(1), a]));
    const navIO = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        navLinks.forEach((a) => a.removeAttribute('aria-current'));
        const a = byId.get(e.target.id);
        if (a) a.setAttribute('aria-current', 'true');
      }
    }, { rootMargin: '-45% 0px -50% 0px' });
    byId.forEach((_, id) => { const el = document.getElementById(id); if (el) navIO.observe(el); });
  }

  // ---- count-up numbers ----
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length && !reduced) {
    once(counters, (el) => {
      const to = Number(el.dataset.count);
      const t0 = performance.now();
      const run = (now) => {
        const k = Math.min(1, (now - t0) / 900);
        el.textContent = String(Math.round(to * (1 - Math.pow(1 - k, 3))));
        if (k < 1) requestAnimationFrame(run);
      };
      el.textContent = '0';
      requestAnimationFrame(run);
    }, '0px 0px -15% 0px');
  }

  // ---- design work: tiles enter once, pop again on filter ----
  document.querySelectorAll('#tiles li').forEach((li, i) => li.style.setProperty('--i', Math.min(i, 14)));
  once(document.querySelectorAll('#tiles'), (el) => el.classList.add('is-in'), '0px 0px -5% 0px');

  // ---- design work: filter chips ----
  const tiles = Array.from(document.querySelectorAll('#tiles li'));
  const chips = Array.from(document.querySelectorAll('.chip'));
  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      const f = chip.dataset.filter;
      chips.forEach((c) => c.setAttribute('aria-pressed', String(c === chip)));
      let n = 0;
      tiles.forEach((li) => {
        li.hidden = f !== 'all' && li.dataset.cat !== f;
        li.classList.remove('pop');
        if (!li.hidden) { li.style.setProperty('--j', n++); void li.offsetWidth; li.classList.add('pop'); }
      });
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
