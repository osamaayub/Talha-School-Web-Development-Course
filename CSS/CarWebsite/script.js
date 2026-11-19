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

  const CARS = [
    { id: 'aero-s',   name: 'Aero S',     tagline: 'Coupe',      body: 'sport', cats: ['sport'],             price: 78900, power: '420 hp', zero: '3.9 s', range: '285 km/h', rangeLabel: 'Top speed', color: 0 },
    { id: 'nova-ev',  name: 'Nova EV',    tagline: 'Sedan',      body: 'sedan', cats: ['sedan', 'electric'], price: 52500, power: '340 hp', zero: '4.8 s', range: '520 km',   rangeLabel: 'Range',     color: 4 },
    { id: 'terra-x',  name: 'Terra X',    tagline: 'Family SUV', body: 'suv',   cats: ['suv'],               price: 46900, power: '265 hp', zero: '7.2 s', range: '6.8 L/100', rangeLabel: 'Economy',  color: 3 },
    { id: 'volt-cross', name: 'Volt Cross', tagline: 'Electric SUV', body: 'suv', cats: ['suv', 'electric'], price: 61200, power: '380 hp', zero: '5.1 s', range: '480 km',   rangeLabel: 'Range',     color: 2 },
    { id: 'meridian', name: 'Meridian',   tagline: 'Executive',  body: 'sedan', cats: ['sedan'],             price: 41800, power: '210 hp', zero: '7.9 s', range: '5.9 L/100', rangeLabel: 'Economy',  color: 5 },
    { id: 'bolt-r',   name: 'Bolt R',     tagline: 'Electric GT', body: 'sport', cats: ['sport', 'electric'], price: 89500, power: '560 hp', zero: '3.2 s', range: '410 km',   rangeLabel: 'Range',     color: 1 },
  ];

  /* ==========================================================
     CAR ILLUSTRATION — inline SVG, faces right (viewBox 400×150)
     ========================================================== */
  const BODIES = {
    sedan: {
      body: 'M28,118 C28,106 38,100 58,96 L108,90 C130,68 160,56 200,56 L252,56 C284,58 304,76 320,92 L360,99 C372,103 376,110 376,118 L376,124 L28,124 Z',
      glass: 'M122,90 C140,72 164,63 194,63 L202,63 L202,90 Z M212,63 L250,63 C272,65 288,78 300,90 L212,90 Z',
      wheels: [96, 306], head: [364, 104], tail: [28, 104], seam: 'M206,92 L206,119',
    },
    suv: {
      body: 'M26,118 L26,102 C26,94 34,90 52,86 L96,82 L124,52 L296,52 C314,52 322,66 332,82 L364,90 C374,94 378,102 378,110 L378,124 L26,124 Z',
      glass: 'M132,58 L196,58 L196,82 L110,82 Z M206,58 L286,58 C298,60 306,70 314,82 L206,82 Z',
      wheels: [98, 308], head: [366, 98], tail: [26, 98], seam: 'M201,84 L201,119',
    },
    sport: {
      body: 'M22,118 C22,108 36,102 66,98 L136,90 C162,70 194,64 226,64 C258,66 282,78 298,92 L352,98 C372,102 380,110 380,118 L380,124 L22,124 Z',
      glass: 'M150,90 C170,74 196,69 222,69 C248,71 268,80 282,90 Z',
      wheels: [92, 312], head: [368, 104], tail: [22, 104], seam: 'M214,93 L214,119',
    },
  };

  const wheelSVG = (cx) => {
    const spokes = [0, 1, 2, 3, 4].map((i) => {
      const a = (i * 72 * Math.PI) / 180;
      return `<line class="spoke" x1="${cx}" y1="120" x2="${(cx + Math.cos(a) * 12).toFixed(1)}" y2="${(120 + Math.sin(a) * 12).toFixed(1)}"/>`;
    }).join('');
    return `<g class="wheel"><circle class="tire" cx="${cx}" cy="120" r="22"/><circle class="rim" cx="${cx}" cy="120" r="14"/>${spokes}<circle class="hub" cx="${cx}" cy="120" r="4"/></g>`;
  };

  const carSVG = (bodyKey, label) => {
    const b = BODIES[bodyKey];
    const arch = (cx) => `<path class="arch" d="M${cx - 28},124 L${cx - 28},120 A28,28 0 0 1 ${cx + 28},120 L${cx + 28},124 Z"/>`;
    return `
      <svg class="car-svg" viewBox="0 0 400 150" role="img" aria-label="${label}">
        <ellipse class="shadow" cx="200" cy="143" rx="168" ry="6"/>
        <path class="body" d="${b.body}"/>
        <path d="${b.body}" fill="url(#carShade)"/>
        <path class="glass" d="${b.glass}"/>
        <path class="line" d="${b.seam}"/>
        <rect class="head" x="${b.head[0]}" y="${b.head[1]}" width="12" height="5" rx="2"/>
        <rect class="tail" x="${b.tail[0]}" y="${b.tail[1]}" width="9" height="5" rx="2"/>
        ${b.wheels.map(arch).join('')}
        ${b.wheels.map(wheelSVG).join('')}
      </svg>`;
  };

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
  const heroSwatches = $('#heroSwatches');
  let heroIdx = 0;
  let heroAuto = true;
  heroCar.innerHTML = carSVG('sport', 'Illustration of a red sports car');
  heroSwatches.innerHTML = swatchButtons(heroIdx);
  const setHeroColor = (i) => {
    heroIdx = i;
    heroCar.style.setProperty('--car', COLORS[i].hex);
    $$('.sw', heroSwatches).forEach((s, n) => { s.classList.toggle('is-on', n === i); s.setAttribute('aria-pressed', String(n === i)); });
  };
  setHeroColor(0);
  heroSwatches.addEventListener('click', (e) => {
    const sw = e.target.closest('.sw');
    if (!sw) return;
    heroAuto = false;
    setHeroColor(Number(sw.dataset.i));
  });
  if (!reducedMotion) setInterval(() => { if (heroAuto && !document.hidden) setHeroColor((heroIdx + 1) % COLORS.length); }, 3800);

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
        ${carSVG(car.body, car.name + ' illustration')}
      </div>
      <div class="car-body">
        <div class="car-title"><h3>${car.name}</h3><span>${car.tagline}</span></div>
        <dl class="specs">
          <div><dt>Power</dt><dd>${car.power}</dd></div>
          <div><dt>0–100</dt><dd>${car.zero}</dd></div>
          <div><dt>${car.rangeLabel}</dt><dd>${car.range}</dd></div>
        </dl>
        <div class="swatch-row" role="group" aria-label="${car.name} colors"><small>Color</small>${swatchButtons(car.color)}</div>
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
