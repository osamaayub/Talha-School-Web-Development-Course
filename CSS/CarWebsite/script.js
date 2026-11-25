(() => {
  'use strict';

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const money = (n) => '$' + Math.round(n).toLocaleString('en-US');

  /* ==========================================================
     DATA — fictional models, prices and specs (demo only)
     ========================================================== */
  const COLORS = [
    { name: 'Racing red', hex: '#ef4444' },
    { name: 'Solar orange', hex: '#f97316' },
    { name: 'Ocean blue', hex: '#3b82f6' },
    { name: 'Forest green', hex: '#22a06b' },
    { name: 'Pearl white', hex: '#e5e7eb' },
    { name: 'Midnight', hex: '#374151' },
  ];

  const HERO_IMAGE = 'https://images.unsplash.com/photo-1652992253402-15729d9b97fc?auto=format&fit=crop&w=1400&q=80';

  const CARS = [
    { id: 'aero-s',   name: 'Aero S',     tagline: 'Coupe',      body: 'sport', cats: ['sport'],             price: 78900, power: '420 hp', zero: '3.9 s', range: '285 km/h', rangeLabel: 'Top speed', color: 0, image: 'https://images.unsplash.com/photo-1657147512939-a6a9db36838b?auto=format&fit=crop&w=900&q=80' },
    { id: 'nova-ev',  name: 'Nova EV',    tagline: 'Sedan',      body: 'sedan', cats: ['sedan', 'electric'], price: 52500, power: '340 hp', zero: '4.8 s', range: '520 km',   rangeLabel: 'Range',     color: 4, image: 'https://images.unsplash.com/photo-1641071260049-54519661d157?auto=format&fit=crop&w=900&q=80' },
    { id: 'terra-x',  name: 'Terra X',    tagline: 'Family SUV', body: 'suv',   cats: ['suv'],               price: 46900, power: '265 hp', zero: '7.2 s', range: '6.8 L/100', rangeLabel: 'Economy',  color: 3, image: 'https://images.unsplash.com/photo-1613397029426-82b0f0d9c045?auto=format&fit=crop&w=900&q=80' },
    { id: 'volt-cross', name: 'Volt Cross', tagline: 'Electric SUV', body: 'suv', cats: ['suv', 'electric'], price: 61200, power: '380 hp', zero: '5.1 s', range: '480 km',   rangeLabel: 'Range',     color: 2, image: 'https://images.unsplash.com/photo-1740170512964-860b0f8c266a?auto=format&fit=crop&w=900&q=80' },
    { id: 'meridian', name: 'Meridian',   tagline: 'Executive',  body: 'sedan', cats: ['sedan'],             price: 41800, power: '210 hp', zero: '7.9 s', range: '5.9 L/100', rangeLabel: 'Economy',  color: 5, image: 'https://images.unsplash.com/photo-1571775145685-931acf18b912?auto=format&fit=crop&w=900&q=80' },
    { id: 'bolt-r',   name: 'Bolt R',     tagline: 'Electric GT', body: 'sport', cats: ['sport', 'electric'], price: 89500, power: '560 hp', zero: '3.2 s', range: '410 km',   rangeLabel: 'Range',     color: 1, image: 'https://images.unsplash.com/photo-1619384557832-e67eb7ffa4d0?auto=format&fit=crop&w=900&q=80' },
  ];

  const swatchButtons = (activeIdx) => COLORS.map((c, i) =>
    `<button type="button" class="sw${i === activeIdx ? ' is-on' : ''}" style="--c:${c.hex}" data-i="${i}" aria-label="${c.name}" aria-pressed="${i === activeIdx}" title="${c.name}"></button>`
  ).join('');

  /* ---------- Toast ---------- */
  const toastEl = $('#toast');
  let toastTimer;
  const toast = (msg) => {
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2400);
  };

  const scrollToEl = (sel) => $(sel).scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });

  /* ==========================================================
     HERO CAR
     ========================================================== */
  const heroCar = $('#heroCar');
  heroCar.innerHTML = `<img class="hero-photo" src="${HERO_IMAGE}" alt="Red sports car" loading="eager" decoding="async">`;

  /* ==========================================================
     SHOWROOM
     ========================================================== */
  const carsEl = $('#cars');
  carsEl.innerHTML = CARS.map((car) => `
    <article class="car-card reveal" data-cats="${car.cats.join(' ')}" data-id="${car.id}" style="--car:${COLORS[car.color].hex}">
      <div class="car-stage">
        <div class="badges">
          <span class="badge">${car.cats.includes('suv') ? 'SUV' : car.cats.includes('sedan') ? 'Sedan' : 'Sport'}</span>
          ${car.cats.includes('electric') ? '<span class="badge ev">⚡ Electric</span>' : ''}
        </div>
        <img class="car-photo" src="${car.image}" alt="${car.name}" loading="lazy" decoding="async">
      </div>
      <div class="car-body">
        <div class="car-title"><h3>${car.name}</h3><span>${car.tagline}</span></div>
        <dl class="specs">
          <div><dt>Power</dt><dd>${car.power}</dd></div>
          <div><dt>0–100</dt><dd>${car.zero}</dd></div>
          <div><dt>${car.rangeLabel}</dt><dd>${car.range}</dd></div>
        </dl>
        <div class="swatch-row" role="group" aria-label="${car.name} available colors"><small>Color</small><span class="color-name">${COLORS[car.color].name}</span>${swatchButtons(car.color)}</div>
        <div class="car-foot">
          <div class="price"><small>From</small><b>${money(car.price)}</b></div>
          <div class="car-actions">
            <button type="button" class="btn btn-sm btn-ghost" data-action="finance" data-id="${car.id}">Finance</button>
            <button type="button" class="btn btn-sm btn-primary" data-action="drive" data-id="${car.id}">Test drive</button>
          </div>
        </div>
      </div>
    </article>`).join('');

  const carById = (id) => CARS.find((c) => c.id === id);

  carsEl.addEventListener('click', (e) => {
    const sw = e.target.closest('.sw');
    if (sw) {
      const card = sw.closest('.car-card');
      const i = Number(sw.dataset.i);
      card.style.setProperty('--car', COLORS[i].hex);
      const nameEl = card.querySelector('.color-name');
      if (nameEl) nameEl.textContent = COLORS[i].name;
      $$('.sw', card).forEach((s) => { const on = s === sw; s.classList.toggle('is-on', on); s.setAttribute('aria-pressed', String(on)); });
      return;
    }
    const btn = e.target.closest('[data-action]');
    if (!btn) return;
    const car = carById(btn.dataset.id);
    if (btn.dataset.action === 'finance') {
      calcCar.value = car.id;
      syncPriceFromCar();
      compute();
      scrollToEl('#finance');
      toast(`${car.name} added to the finance calculator`);
    } else {
      bookCar.value = car.id;
      scrollToEl('#book');
      toast(`${car.name} selected for a test drive`);
    }
  });

  /* ---------- Filter ---------- */
  const filterBtns = $$('.filter');
  const cards = $$('.car-card', carsEl);
  const applyFilter = (f) => {
    cards.forEach((card) => {
      const show = f === 'all' || card.dataset.cats.split(' ').includes(f);
      if (show) {
        card.hidden = false;
        requestAnimationFrame(() => requestAnimationFrame(() => card.classList.remove('is-out')));
      } else {
        card.classList.add('is-out');
        setTimeout(() => { if (card.classList.contains('is-out')) card.hidden = true; }, reducedMotion ? 0 : 400);
      }
    });
  };
  filterBtns.forEach((btn) => {
    const f = btn.dataset.filter;
    if (f !== 'all') btn.insertAdjacentHTML('beforeend', ` <span class="count">${cards.filter((c) => c.dataset.cats.split(' ').includes(f)).length}</span>`);
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => { const on = b === btn; b.classList.toggle('is-active', on); b.setAttribute('aria-pressed', String(on)); });
      applyFilter(f);
    });
  });

  /* ==========================================================
     FINANCE CALCULATOR
     ========================================================== */
  const calcCar = $('#calcCar');
  const calcPrice = $('#calcPrice');
  const calcDown = $('#calcDown');
  const calcApr = $('#calcApr');
  const calcTerm = $('#calcTerm');
  calcCar.innerHTML = CARS.map((c) => `<option value="${c.id}">${c.name} — ${money(c.price)}</option>`).join('') + '<option value="custom">Custom price…</option>';
  const syncPriceFromCar = () => { const c = carById(calcCar.value); if (c) calcPrice.value = c.price; };
  syncPriceFromCar();

  let shownMonthly = 0;
  let tween;
  const animateMonthly = (to) => {
    const el = $('#monthly');
    cancelAnimationFrame(tween);
    if (reducedMotion) { el.textContent = money(to); shownMonthly = to; return; }
    const from = shownMonthly;
    const start = performance.now();
    const step = (now) => {
      const t = Math.min((now - start) / 450, 1);
      shownMonthly = from + (to - from) * (1 - Math.pow(1 - t, 3));
      el.textContent = money(shownMonthly);
      if (t < 1) tween = requestAnimationFrame(step);
    };
    tween = requestAnimationFrame(step);
  };

  function compute() {
    const price = Math.max(0, Number(calcPrice.value) || 0);
    const pct = Number(calcDown.value);
    const apr = Number(calcApr.value);
    const n = Number(calcTerm.value);
    const down = price * pct / 100;
    const loan = price - down;
    const r = apr / 100 / 12;
    const pay = loan <= 0 ? 0 : r === 0 ? loan / n : (loan * r) / (1 - Math.pow(1 + r, -n));
    $('#downOut').textContent = pct + '%';
    $('#aprOut').textContent = apr.toFixed(1) + '%';
    $('#outDown').textContent = money(down);
    $('#outLoan').textContent = money(loan);
    $('#outInterest').textContent = money(pay * n - loan);
    $('#outTotal').textContent = money(pay * n + down);
    animateMonthly(pay);
  }
  calcCar.addEventListener('change', () => { if (calcCar.value !== 'custom') syncPriceFromCar(); compute(); });
  calcPrice.addEventListener('input', () => {
    const match = CARS.find((c) => c.price === Number(calcPrice.value));
    calcCar.value = match ? match.id : 'custom';
    compute();
  });
  [calcDown, calcApr, calcTerm].forEach((el) => el.addEventListener('input', compute));
  compute();

  /* ==========================================================
     BOOKING FORM
     ========================================================== */
  const bookForm = $('#bookForm');
  const bookCar = $('#b-car');
  const bookDate = $('#b-date');
  const success = $('#bookSuccess');
  bookCar.innerHTML = CARS.map((c) => `<option value="${c.id}">${c.name}</option>`).join('');

  const pad = (n) => String(n).padStart(2, '0');
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;
  bookDate.min = todayStr;

  const rules = {
    name: (v) => v.trim().length >= 2 ? '' : 'Please enter your name.',
    email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? '' : 'Enter a valid email, like you@example.com.',
    date: (v) => !v ? 'Pick a date for your test drive.' : v < todayStr ? 'Please choose today or a future date.' : '',
  };
  const check = (input) => {
    const msg = rules[input.name](input.value);
    const field = input.closest('.field');
    if (!msg) { field.classList.remove('invalid'); input.removeAttribute('aria-invalid'); $('.err', field).textContent = ''; }
    else {
      if (!field.classList.contains('invalid')) void field.offsetWidth;
      field.classList.add('invalid'); input.setAttribute('aria-invalid', 'true'); $('.err', field).textContent = msg;
    }
    return !msg;
  };
  const validated = $$('input[name="name"], input[name="email"], input[name="date"]', bookForm);
  validated.forEach((input) => {
    input.addEventListener('blur', () => { if (input.value) check(input); });
    input.addEventListener('input', () => { if (input.closest('.field').classList.contains('invalid')) check(input); });
  });
  bookForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const results = validated.map(check);
    const bad = validated.find((_, i) => !results[i]);
    if (bad) { bad.focus(); return; }
    const car = carById(bookCar.value);
    const first = $('#b-name').value.trim().split(/\s+/)[0];
    const [y, m, d] = bookDate.value.split('-').map(Number);
    const pretty = new Date(y, m - 1, d).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
    $('#successText').textContent = `Thanks, ${first}! We've noted a test drive for the ${car.name} on ${pretty}. (This is a demo, so nothing was actually sent.)`;
    bookForm.hidden = true;
    success.hidden = false;
  });
  $('#bookAgain').addEventListener('click', () => {
    bookForm.reset();
    $$('.field', bookForm).forEach((f) => f.classList.remove('invalid'));
    success.hidden = true;
    bookForm.hidden = false;
    $('#b-name').focus();
  });

  /* ==========================================================
     REVEAL, COUNTERS, NAV
     ========================================================== */
  ['.cars', '.features', '.hero-copy'].forEach((sel) => {
    const g = $(sel);
    if (g) $$('.reveal', g).forEach((el, i) => el.style.setProperty('--d', `${i * 0.08}s`));
  });

  const countUp = (el) => {
    const target = Number(el.dataset.count);
    const dec = Number(el.dataset.decimals || 0);
    const suffix = el.dataset.suffix || '';
    if (reducedMotion) { el.textContent = target.toFixed(dec) + suffix; return; }
    const start = performance.now();
    const step = (now) => {
      const t = Math.min((now - start) / 1500, 1);
      el.textContent = (target * (1 - Math.pow(1 - t, 3))).toFixed(dec) + suffix;
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  const statsEl = $('.hero-stats');
  const onReveal = (el) => {
    el.classList.add('in');
    setTimeout(() => el.style.removeProperty('--d'), 1500);
  };
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      onReveal(entry.target);
      io.unobserve(entry.target);
    }), { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    $$('.reveal').forEach((el) => io.observe(el));
    const sio = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      $$('[data-count]', entry.target).forEach(countUp);
      sio.disconnect();
    }), { threshold: 0.4 });
    sio.observe(statsEl);
  } else {
    $$('.reveal').forEach(onReveal);
    $$('[data-count]').forEach(countUp);
  }

  const nav = $('#nav');
  const menuBtn = $('#menuBtn');
  const navLinks = $('#navLinks');
  const links = $$('.nav-links a');
  const sections = links.map((a) => $(a.getAttribute('href')));
  const menuOpen = () => menuBtn.getAttribute('aria-expanded') === 'true';
  const setMenu = (open) => {
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    navLinks.classList.toggle('open', open);
  };
  menuBtn.addEventListener('click', () => setMenu(!menuOpen()));
  links.forEach((a) => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && menuOpen()) { setMenu(false); menuBtn.focus(); } });
  document.addEventListener('click', (e) => { if (menuOpen() && !navLinks.contains(e.target) && !menuBtn.contains(e.target)) setMenu(false); });

  let lastY = window.scrollY;
  let ticking = false;
  const onScroll = () => {
    const y = window.scrollY;
    nav.classList.toggle('scrolled', y > 24);
    nav.classList.toggle('hidden', y > lastY + 4 && y > 500 && !menuOpen());
    if (y < lastY - 4) nav.classList.remove('hidden');
    lastY = y;
    const probe = y + window.innerHeight * 0.35;
    let cur = null;
    sections.forEach((s) => { if (s && s.offsetTop <= probe) cur = s.id; });
    links.forEach((a) => a.classList.toggle('active', a.getAttribute('href') === '#' + cur));
    ticking = false;
  };
  window.addEventListener('scroll', () => { if (!ticking) { requestAnimationFrame(onScroll); ticking = true; } }, { passive: true });
  onScroll();

  $('#year').textContent = new Date().getFullYear();
})();
