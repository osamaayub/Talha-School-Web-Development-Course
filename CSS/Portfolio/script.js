(() => {
  'use strict';

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const root = document.documentElement;

  const CONTACT_EMAIL = 'osama.ayubwebdev@gmail.com';

  /* ---------- Toast ---------- */
  const toastEl = $('#toast');
  let toastTimer;
  const toast = (msg) => {
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2200);
  };

  /* ---------- Theme toggle (saved choice, else system preference) ---------- */
  const themeBtn = $('#themeBtn');
  const themeMeta = $('meta[name="theme-color"]');
  const applyTheme = (theme, persist) => {
    root.setAttribute('data-theme', theme);
    themeBtn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
    if (themeMeta) themeMeta.setAttribute('content', theme === 'dark' ? '#0b0b0c' : '#f6f5f0');
    if (persist) { try { localStorage.setItem('theme', theme); } catch (e) { /* storage unavailable */ } }
  };
  applyTheme(root.getAttribute('data-theme') || 'dark', false);
  themeBtn.addEventListener('click', () => {
    applyTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark', true);
  });

  /* ---------- Scroll reveal (+ staggering within groups) ---------- */
  ['.projects', '.skill-grid', '.bento', '.hero-text', '.jobs'].forEach((sel) => {
    const group = $(sel);
    if (group) $$('.reveal', group).forEach((el, i) => el.style.setProperty('--d', `${i * 0.08}s`));
  });
  const heroVisual = $('.hero-visual');
  if (heroVisual) heroVisual.style.setProperty('--d', '0.35s');

  const countUp = (el) => {
    const target = Number(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    if (reducedMotion) { el.textContent = target + suffix; return; }
    const start = performance.now();
    const step = (now) => {
      const t = Math.min((now - start) / 1400, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - t, 3))) + suffix;
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const onReveal = (el) => {
    el.classList.add('in');
    $$('[data-count]', el).forEach(countUp);
    // drop the stagger delay once played so hover transitions respond instantly
    setTimeout(() => el.style.removeProperty('--d'), 1500);
  };

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        onReveal(entry.target);
        io.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    $$('.reveal').forEach((el) => io.observe(el));
  } else {
    $$('.reveal').forEach(onReveal);
  }

  /* ---------- Mobile menu ---------- */
  const menuBtn = $('#menuBtn');
  const navLinks = $('#navLinks');
  const menuOpen = () => menuBtn.getAttribute('aria-expanded') === 'true';
  const setMenu = (open) => {
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    navLinks.classList.toggle('open', open);
  };
  menuBtn.addEventListener('click', () => setMenu(!menuOpen()));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && menuOpen()) { setMenu(false); menuBtn.focus(); } });
  document.addEventListener('click', (e) => {
    if (menuOpen() && !navLinks.contains(e.target) && !menuBtn.contains(e.target)) setMenu(false);
  });

  /* ---------- Nav: scrolled / hide-on-scroll / progress / scroll-spy / sliding indicator ---------- */
  const nav = $('#nav');
  const progress = $('#scrollProgress');
  const indicator = $('#navIndicator');
  const links = $$('.nav-links a[href^="#"]');
  const sections = links.map((a) => $(a.getAttribute('href'))).filter(Boolean);
  let activeLink = null;
  let lastY = window.scrollY;
  let ticking = false;

  const moveIndicator = (link) => {
    if (!link || getComputedStyle(indicator).display === 'none') { indicator.style.opacity = '0'; return; }
    indicator.style.width = link.offsetWidth + 'px';
    indicator.style.transform = `translateX(${link.offsetLeft}px)`;
    indicator.style.opacity = '1';
  };
  links.forEach((a) => {
    a.addEventListener('mouseenter', () => moveIndicator(a));
    a.addEventListener('focus', () => moveIndicator(a));
    a.addEventListener('click', () => setMenu(false));
  });
  navLinks.addEventListener('mouseleave', () => moveIndicator(activeLink));
  window.addEventListener('resize', () => moveIndicator(activeLink));

  const onScroll = () => {
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
    nav.classList.toggle('scrolled', y > 24);
    nav.classList.toggle('hidden', y > lastY + 4 && y > 400 && !menuOpen());
    if (y < lastY - 4) nav.classList.remove('hidden');
    lastY = y;

    const probe = y + window.innerHeight * 0.35;
    let current = null;
    sections.forEach((s) => { if (s.offsetTop <= probe) current = s; });
    // when the page bottom is reached the last section (Contact) wins
    if (max > 0 && y >= max - 4) current = sections[sections.length - 1] || current;
    const next = current ? links.find((a) => a.getAttribute('href') === '#' + current.id) : null;
    if (next !== activeLink) {
      activeLink = next;
      links.forEach((a) => {
        const on = a === activeLink;
        a.classList.toggle('active', on);
        if (on) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
      });
      moveIndicator(activeLink);
    }
    ticking = false;
  };
  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
  }, { passive: true });
  onScroll();

  /* ---------- Cursor glow + subtle card tilt (mouse devices only) ---------- */
  if (finePointer && !reducedMotion) {
    const glow = $('#cursorGlow');
    window.addEventListener('mousemove', (e) => {
      glow.style.left = e.clientX + 'px';
      glow.style.top = e.clientY + 'px';
      glow.classList.add('on');
    }, { passive: true });
    document.addEventListener('mouseleave', () => glow.classList.remove('on'));

    $$('.tilt').forEach((card) => {
      card.addEventListener('mouseenter', () => card.classList.add('tilting'));
      card.addEventListener('mousemove', (e) => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width;
        const y = (e.clientY - r.top) / r.height;
        card.style.transform = `rotateX(${((0.5 - y) * 6).toFixed(2)}deg) rotateY(${((x - 0.5) * 6).toFixed(2)}deg) translateY(-4px)`;
      });
      card.addEventListener('mouseleave', () => {
        card.classList.remove('tilting');
        card.style.transform = '';
      });
    });
  }

  /* ---------- Project filter ---------- */
  const filterBtns = $$('.filter');
  const cards = $$('#projects-grid .card');
  const emptyMsg = $('#emptyMsg');
  const matches = (card, f) => f === 'all' || card.dataset.cats.split(' ').includes(f);

  const applyFilter = (f) => {
    let visible = 0;
    cards.forEach((card) => {
      if (matches(card, f)) {
        visible++;
        card.hidden = false;
        requestAnimationFrame(() => requestAnimationFrame(() => card.classList.remove('is-out')));
      } else {
        card.classList.add('is-out');
        setTimeout(() => { if (card.classList.contains('is-out')) card.hidden = true; }, reducedMotion ? 0 : 400);
      }
    });
    emptyMsg.hidden = visible > 0;
  };

  // show per-filter counts
  filterBtns.forEach((btn) => {
    const f = btn.dataset.filter;
    if (f === 'all') return;
    const n = cards.filter((c) => matches(c, f)).length;
    btn.insertAdjacentHTML('beforeend', ` <span class="count">${n}</span>`);
  });
  filterBtns.forEach((btn) => btn.addEventListener('click', () => {
    filterBtns.forEach((b) => {
      const on = b === btn;
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-pressed', String(on));
    });
    applyFilter(btn.dataset.filter);
  }));

  /* ---------- Copy email ---------- */
  const copyBtn = $('#copyEmail');
  copyBtn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(CONTACT_EMAIL);
    } catch (e) {
      const ta = document.createElement('textarea');
      ta.value = CONTACT_EMAIL;
      ta.style.cssText = 'position:fixed;opacity:0';
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); } catch (err) { /* ignore */ }
      ta.remove();
    }
    copyBtn.textContent = 'Copied ✓';
    toast('Email copied to clipboard');
    setTimeout(() => { copyBtn.textContent = 'Copy'; }, 2000);
  });

  /* ---------- Contact form: inline validation, then opens a prefilled email ---------- */
  const form = $('#contactForm');
  const note = $('#formStatus');
  const rules = {
    name: (v) => v.trim().length >= 2 ? '' : 'Please enter your name.',
    email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? '' : 'Enter a valid email, like you@example.com.',
    message: (v) => v.trim().length >= 10 ? '' : 'Write a short message (at least 10 characters).',
  };
  const check = (input, announce = true) => {
    const msg = rules[input.name](input.value);
    const field = input.closest('.field');
    const err = $('.err', field);
    if (!msg) {
      field.classList.remove('invalid');
      input.removeAttribute('aria-invalid');
      err.textContent = '';
    } else if (announce) {
      if (!field.classList.contains('invalid')) void field.offsetWidth;
      field.classList.add('invalid');
      input.setAttribute('aria-invalid', 'true');
      err.textContent = msg;
    }
    return !msg;
  };
  const inputs = $$('input, textarea', form);
  inputs.forEach((input) => {
    input.addEventListener('blur', () => { if (input.value) check(input); });
    input.addEventListener('input', () => { if (input.closest('.field').classList.contains('invalid')) check(input); });
  });
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    note.classList.remove('ok');
    const results = inputs.map((i) => check(i));
    const firstBad = inputs.find((_, idx) => !results[idx]);
    if (firstBad) { firstBad.focus(); note.textContent = 'Please fix the highlighted fields.'; return; }

    const data = new FormData(form);
    const body = `${data.get('message')}\n\n— ${data.get('name')} (${data.get('email')})`;
    const subject = 'Portfolio message from ' + data.get('name');
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    note.textContent = 'Opening your email app…';
    note.classList.add('ok');
    form.reset();
  });

  /* ---------- Footer year ---------- */
  $('#year').textContent = new Date().getFullYear();
})();
