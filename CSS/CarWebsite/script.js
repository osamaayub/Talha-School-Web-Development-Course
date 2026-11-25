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
    { id: 'aero-s',   name: 'Aero S',     tagline: 'Coupe',      body: 'sport', cats: ['sport'],             price: 78900, power: '420 hp', zero: '3.9 s', range: '285 km/h', rangeLabel: 'Top speed', color: 0, isNew: true, engine: '3.0L V6 twin-turbo', gear: '8-speed auto', seats: '4', fuel: 'Petrol', image: 'https://images.unsplash.com/photo-1657147512939-a6a9db36838b?auto=format&fit=crop&w=900&q=80' },
    { id: 'nova-ev',  name: 'Nova EV',    tagline: 'Sedan',      body: 'sedan', cats: ['sedan', 'electric'], price: 52500, power: '340 hp', zero: '4.8 s', range: '520 km',   rangeLabel: 'Range',     color: 4, engine: 'Permanent magnet motor', gear: 'Single-speed', seats: '5', fuel: 'Electric', image: 'https://images.unsplash.com/photo-1641071260049-54519661d157?auto=format&fit=crop&w=900&q=80' },
    { id: 'terra-x',  name: 'Terra X',    tagline: 'Family SUV', body: 'suv',   cats: ['suv'],               price: 46900, power: '265 hp', zero: '7.2 s', range: '6.8 L/100', rangeLabel: 'Economy',  color: 3, engine: '2.5L turbo I4', gear: '8-speed auto', seats: '7', fuel: 'Petrol', image: 'https://images.unsplash.com/photo-1613397029426-82b0f0d9c045?auto=format&fit=crop&w=900&q=80' },
    { id: 'volt-cross', name: 'Volt Cross', tagline: 'Electric SUV', body: 'suv', cats: ['suv', 'electric'], price: 61200, power: '380 hp', zero: '5.1 s', range: '480 km',   rangeLabel: 'Range',     color: 2, isNew: true, engine: 'Dual motor AWD', gear: 'Single-speed', seats: '5', fuel: 'Electric', image: 'https://images.unsplash.com/photo-1740170512964-860b0f8c266a?auto=format&fit=crop&w=900&q=80' },
    { id: 'meridian', name: 'Meridian',   tagline: 'Executive',  body: 'sedan', cats: ['sedan'],             price: 41800, power: '210 hp', zero: '7.9 s', range: '5.9 L/100', rangeLabel: 'Economy',  color: 5, engine: '2.0L turbo I4', gear: '8-speed auto', seats: '5', fuel: 'Petrol', image: 'https://images.unsplash.com/photo-1571775145685-931acf18b912?auto=format&fit=crop&w=900&q=80' },
    { id: 'bolt-r',   name: 'Bolt R',     tagline: 'Electric GT', body: 'sport', cats: ['sport', 'electric'], price: 89500, power: '560 hp', zero: '3.2 s', range: '410 km',   rangeLabel: 'Range',     color: 1, engine: 'Dual motor AWD', gear: 'Single-speed', seats: '4', fuel: 'Electric', image: 'https://images.unsplash.com/photo-1619384557832-e67eb7ffa4d0?auto=format&fit=crop&w=900&q=80' },
  ];

  const swatchButtons = (activeIdx) => COLORS.map((c, i) =>
    `<button type="button" class="sw${i === activeIdx ? ' is-on' : ''}" style="--c:${c.hex}" data-i="${i}" aria-label="${c.name}" aria-pressed="${i === activeIdx}" title="${c.name}"></button>`
  ).join('');

  const FAV_KEY = 'velocity-saved-cars';
  let favs = new Set();
  try { favs = new Set(JSON.parse(localStorage.getItem(FAV_KEY) || '[]')); } catch { favs = new Set(); }
  const isFav = (id) => favs.has(id);
  const saveFavs = () => { try { localStorage.setItem(FAV_KEY, JSON.stringify([...favs])); } catch { /* storage unavailable */ } };
  const paintFav = (btn, on) => {
    btn.classList.toggle('is-on', on);
    btn.setAttribute('aria-pressed', String(on));
    btn.setAttribute('aria-label', `${on ? 'Remove' : 'Save'} ${btn.dataset.name || 'car'}`);
  };
  let activeFilter = 'all';
  const toggleFav = (id, btn) => {
    const on = !favs.has(id);
    if (on) favs.add(id); else favs.delete(id);
    saveFavs();
    paintFav(btn, on);
    const savedCount = $('.filter[data-filter="saved"] .count');
    if (savedCount) savedCount.textContent = favs.size;
    if (activeFilter === 'saved') applyFilter('saved');
    toast(on ? 'Saved to your garage' : 'Removed from saved');
  };

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
          ${car.isNew ? '<span class="badge new">New</span>' : ''}
        </div>
        <button type="button" class="fav${isFav(car.id) ? ' is-on' : ''}" data-action="fav" data-id="${car.id}" data-name="${car.name}" aria-pressed="${isFav(car.id)}" aria-label="Save ${car.name}" title="Save ${car.name}">♥</button>
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
            <button type="button" class="btn btn-sm btn-ghost" data-action="details" data-id="${car.id}">Details</button>
            <button type="button" class="btn btn-sm btn-ghost" data-action="finance" data-id="${car.id}">Finance</button>
            <button type="button" class="btn btn-sm btn-primary" data-action="enquire" data-id="${car.id}">Enquire</button>
            <button type="button" class="btn btn-sm btn-ghost cmp" data-action="compare" data-id="${car.id}" aria-pressed="false" title="Add ${car.name} to compare" aria-label="Add ${car.name} to compare">⇄</button>
          </div>
        </div>
      </div>
    </article>`).join('');

  const carById = (id) => CARS.find((c) => c.id === id);

  const modal = $('#carModal');
  const mImg = $('#modalImg'), mKicker = $('#modalKicker'), mName = $('#modalName'), mTag = $('#modalTagline'), mSpecs = $('#modalSpecs'), mColor = $('#modalColor'), mDots = $('#modalDots'), mPrice = $('#modalPrice');
  const closeModal = () => { modal.hidden = true; document.body.classList.remove('modal-open'); };
  const openCarModal = (id) => {
    const car = carById(id);
    if (!car) return;
    modal.dataset.id = car.id;
    mImg.src = car.image; mImg.alt = car.name;
    mKicker.textContent = car.cats.join(' · ').toUpperCase();
    mName.textContent = car.name;
    mTag.textContent = car.tagline;
    mSpecs.innerHTML = `<div><dt>Power</dt><dd>${car.power}</dd></div><div><dt>0–100</dt><dd>${car.zero}</dd></div><div><dt>${car.rangeLabel}</dt><dd>${car.range}</dd></div><div><dt>Engine</dt><dd>${car.engine}</dd></div><div><dt>Gearbox</dt><dd>${car.gear}</dd></div><div><dt>Seats</dt><dd>${car.seats}</dd></div><div><dt>Fuel</dt><dd>${car.fuel}</dd></div>`;
    mColor.textContent = COLORS[car.color].name;
    mDots.innerHTML = COLORS.map((c) => `<span class="dot" style="--c:${c.hex}" title="${c.name}"></span>`).join('');
    mPrice.textContent = money(car.price);
    modal.hidden = false;
    document.body.classList.add('modal-open');
    $('#modalClose').focus();
  };
  modal.addEventListener('click', (e) => { if (e.target.closest('[data-close]')) closeModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { if (!modal.hidden) closeModal(); if (!compareModal.hidden) closeCompareModal(); } });
  $('#modalFinance').addEventListener('click', () => { const car = carById(modal.dataset.id); closeModal(); calcCar.value = car.id; syncPriceFromCar(); compute(); scrollToEl('#finance'); toast(`${car.name} added to the finance calculator`); });
  $('#modalEnquire').addEventListener('click', () => { const car = carById(modal.dataset.id); closeModal(); if (car) { enqCar.value = car.id; scrollToEl('#contact'); toast(`Ask us about the ${car.name}`); } });

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
    if (btn.dataset.action === 'fav') { toggleFav(car.id, btn); return; }
    if (btn.dataset.action === 'details') { openCarModal(car.id); return; }
    if (btn.dataset.action === 'finance') {
      calcCar.value = car.id;
      syncPriceFromCar();
      compute();
      scrollToEl('#finance');
      toast(`${car.name} added to the finance calculator`);
      return;
    }
    if (btn.dataset.action === 'compare') { toggleCompare(car.id); return; }
    enqCar.value = car.id;
    scrollToEl('#contact');
    toast(`Ask us about the ${car.name}`);
  });

  /* ---------- Filter & sort ---------- */
  const filterBtns = $$('.filter');
  const cards = $$('.car-card', carsEl);
  const visibleCount = $('#visibleCount');
  const carSearch = $('#carSearch');
  const budgetSel = $('#budgetFilter');
  let query = '';
  carSearch.addEventListener('input', () => { query = carSearch.value.trim().toLowerCase(); applyFilter(activeFilter); });
  const inBudget = (c) => {
    const b = budgetSel.value;
    return b === 'any' || (b === 'under45' ? c.price < 45000 : b === 'mid' ? c.price >= 45000 && c.price <= 65000 : c.price > 65000);
  };
  budgetSel.addEventListener('change', () => applyFilter(activeFilter));
  const catMatch = (card, f) => {
    if (f === 'all') return true;
    if (f === 'saved') return isFav(card.dataset.id);
    const c = carById(card.dataset.id);
    if (f === 'petrol') return c.fuel === 'Petrol';
    return card.dataset.cats.split(' ').includes(f);
  };
  const matches = (card, f) => {
    if (query) {
      const c = carById(card.dataset.id);
      if (!(c.name + ' ' + c.tagline + ' ' + c.body + ' ' + c.fuel + ' ' + c.engine).toLowerCase().includes(query)) return false;
    }
    return catMatch(card, f) && inBudget(carById(card.dataset.id));
  };
  const applyFilter = (f) => {
    cards.forEach((card) => {
      const show = matches(card, f);
      if (show) {
        card.hidden = false;
        requestAnimationFrame(() => requestAnimationFrame(() => card.classList.remove('is-out')));
      } else {
        card.classList.add('is-out');
        setTimeout(() => { if (card.classList.contains('is-out')) card.hidden = true; }, reducedMotion ? 0 : 400);
      }
    });
    if (visibleCount) visibleCount.textContent = cards.filter((c) => matches(c, f)).length;
  };
  const sortSel = $('#sortCars');
  sortSel.addEventListener('change', () => {
    const mode = sortSel.value;
    const sorted = [...cards].sort((a, b) => {
      const ca = carById(a.dataset.id), cb = carById(b.dataset.id);
      if (mode === 'price-asc') return ca.price - cb.price;
      if (mode === 'price-desc') return cb.price - ca.price;
      if (mode === 'fast') return parseFloat(ca.zero) - parseFloat(cb.zero);
      return CARS.indexOf(ca) - CARS.indexOf(cb);
    });
    sorted.forEach((c) => carsEl.appendChild(c));
  });
  filterBtns.forEach((btn) => {
    const f = btn.dataset.filter;
    if (f !== 'all') btn.insertAdjacentHTML('beforeend', ` <span class="count">${f === 'saved' ? favs.size : cards.filter((c) => catMatch(c, f)).length}</span>`);
    btn.addEventListener('click', () => {
      activeFilter = f;
      filterBtns.forEach((b) => { const on = b === btn; b.classList.toggle('is-active', on); b.setAttribute('aria-pressed', String(on)); });
      applyFilter(f);
    });
  });

  /* ---------- Compare ---------- */
  const CMPR_KEY = 'velocity-compare';
  let compareSet = [];
  try { compareSet = JSON.parse(localStorage.getItem(CMPR_KEY) || '[]'); } catch { compareSet = []; }
  const saveCompare = () => { try { localStorage.setItem(CMPR_KEY, JSON.stringify(compareSet)); } catch { /* storage unavailable */ } };
  const compareBar = $('#compareBar');
  const compareCountEl = $('#compareCount');
  const compareModal = $('#compareModal');
  const compareTable = $('#compareTable');
  const compareHint = $('#compareHint');
  const closeCompareModal = () => { compareModal.hidden = true; document.body.classList.remove('modal-open'); };

  const syncCompareButtons = () => {
    $$('.car-card').forEach((card) => {
      const b = card.querySelector('[data-action="compare"]');
      if (!b) return;
      const car = carById(card.dataset.id);
      const on = compareSet.includes(car.id);
      b.classList.toggle('is-on', on);
      b.setAttribute('aria-pressed', String(on));
      b.title = `${on ? 'Remove' : 'Add'} ${car.name} ${on ? 'from' : 'to'} compare`;
    });
  };
  const syncCompareBar = () => {
    compareBar.hidden = compareSet.length === 0;
    compareCountEl.textContent = `${compareSet.length} selected`;
  };
  const toggleCompare = (id) => {
    const car = carById(id);
    const i = compareSet.indexOf(id);
    if (i > -1) { compareSet.splice(i, 1); toast(`${car.name} removed from compare`); }
    else if (compareSet.length >= 3) { toast('You can compare up to 3 cars'); return; }
    else { compareSet.push(id); toast(`${car.name} added to compare`); }
    saveCompare();
    syncCompareButtons();
    syncCompareBar();
  };

  const BODY_LABEL = { suv: 'SUV', sedan: 'Sedan', sport: 'Sport' };
  const CMP_ROWS = [
    { label: 'Price', val: (c) => money(c.price), num: (c) => c.price, best: 'min' },
    { label: 'Type', val: (c) => BODY_LABEL[c.body] || c.tagline },
    { label: 'Power', val: (c) => c.power, num: (c) => parseInt(c.power, 10), best: 'max' },
    { label: '0–100 km/h', val: (c) => c.zero, num: (c) => parseFloat(c.zero), best: 'min' },
    { label: 'Range', val: (c) => c.range },
    { label: 'Engine', val: (c) => c.engine },
    { label: 'Gearbox', val: (c) => c.gear },
    { label: 'Seats', val: (c) => c.seats },
    { label: 'Fuel', val: (c) => c.fuel },
  ];
  const openCompareModal = () => {
    const cars = compareSet.map(carById).filter(Boolean);
    if (!cars.length) { toast('Select cars to compare first'); return; }
    compareHint.hidden = true;
    let html = '<thead><tr><th></th>' + cars.map((c) => `<th><img class="cmp-img" src="${c.image}" alt="${c.name}"><strong>${c.name}</strong><span>${c.tagline}</span></th>`).join('') + '</tr></thead><tbody>';
    CMP_ROWS.forEach((row) => {
      let bestIdx = -1;
      if (row.num && row.best) {
        const nums = cars.map(row.num);
        bestIdx = nums.indexOf(Math[row.best](...nums));
      }
      html += `<tr><th scope="row">${row.label}</th>` + cars.map((c, i) => `<td${i === bestIdx ? ' class="best"' : ''}>${row.val(c)}</td>`).join('') + '</tr>';
    });
    html += '<tr><th scope="row"></th>' + cars.map((c) => `<td><button type="button" class="btn btn-sm btn-primary" data-cmp-enquire="${c.id}">Enquire</button></td>`).join('') + '</tr></tbody>';
    compareTable.innerHTML = html;
    compareModal.hidden = false;
    document.body.classList.add('modal-open');
  };
  compareModal.addEventListener('click', (e) => {
    if (e.target.closest('[data-close]')) { closeCompareModal(); return; }
    const btn = e.target.closest('[data-cmp-enquire]');
    if (btn) { enqCar.value = btn.dataset.cmpEnquire; closeCompareModal(); scrollToEl('#contact'); toast(`Ask us about the ${enqCarLabel(btn.dataset.cmpEnquire)}`); }
  });
  $('#compareOpen').addEventListener('click', openCompareModal);
  $('#compareClear').addEventListener('click', () => {
    compareSet = [];
    saveCompare();
    syncCompareButtons();
    syncCompareBar();
    toast('Compare list cleared');
  });
  syncCompareButtons();
  syncCompareBar();

  /* ==========================================================
     FINANCE CALCULATOR
     ========================================================== */
  const calcCar = $('#calcCar');
  const calcPrice = $('#calcPrice');
  const calcDown = $('#calcDown');
  const calcApr = $('#calcApr');
  const calcTerm = $('#calcTerm');
  const calcTrade = $('#calcTrade');
  calcCar.innerHTML = CARS.map((c) => `<option value="${c.id}">${c.name} — ${money(c.price)}</option>`).join('') + '<option value="custom">Custom price…</option>';
  const syncPriceFromCar = () => { const c = carById(calcCar.value); if (c) calcPrice.value = c.price; };
  syncPriceFromCar();

  let shownMonthly = 0;
  let lastLoan = 0, lastPay = 0, lastN = 0, lastR = 0;
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
    const trade = Math.min(Number(calcTrade.value) || 0, price);
    const down = price * pct / 100;
    const loan = Math.max(0, price - down - trade);
    const r = apr / 100 / 12;
    const pay = loan <= 0 ? 0 : r === 0 ? loan / n : (loan * r) / (1 - Math.pow(1 + r, -n));
    $('#downOut').textContent = pct + '%';
    $('#aprOut').textContent = apr.toFixed(1) + '%';
    $('#tradeOut').textContent = money(trade);
    $('#outDown').textContent = money(down);
    $('#outTrade').textContent = money(trade);
    $('#outLoan').textContent = money(loan);
    $('#outInterest').textContent = money(pay * n - loan);
    $('#outTotal').textContent = money(pay * n + down);
    lastLoan = loan; lastPay = pay; lastN = n; lastR = r;
    animateMonthly(pay);
    drawBalance();
  }

  const balanceChart = $('#balanceChart');
  function drawBalance() {
    if (!balanceChart || !lastN) return;
    const dpr = window.devicePixelRatio || 1;
    const w = balanceChart.clientWidth, hgt = balanceChart.clientHeight || 140;
    if (!w) return;
    balanceChart.width = w * dpr;
    balanceChart.height = hgt * dpr;
    const ctx = balanceChart.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, hgt);
    const padL = 8, padR = 8, padT = 12, padB = 24;
    const iw = w - padL - padR, ih = hgt - padT - padB;
    ctx.strokeStyle = 'rgba(255,255,255,0.08)';
    ctx.fillStyle = 'rgba(238,240,244,0.55)';
    ctx.font = '10px Inter, sans-serif';
    ctx.lineWidth = 1;
    for (let g = 0; g <= 4; g++) {
      const y = padT + (ih * g) / 4;
      ctx.beginPath(); ctx.moveTo(padL, y); ctx.lineTo(w - padR, y); ctx.stroke();
      ctx.fillText(money(lastLoan * (1 - g / 4)), padL + 2, y - 3);
    }
    const bal = (k) => lastR === 0
      ? lastLoan * (1 - k / lastN)
      : lastLoan * Math.pow(1 + lastR, k) - (lastPay * (Math.pow(1 + lastR, k) - 1)) / lastR;
    const pts = Array.from({ length: lastN + 1 }, (_, k) => Math.max(0, bal(k)));
    const max = Math.max(...pts, 1);
    const X = (k) => padL + (iw * k) / lastN;
    const Y = (v) => padT + ih * (1 - v / max);
    const grad = ctx.createLinearGradient(0, padT, 0, hgt - padB);
    grad.addColorStop(0, 'rgba(255,90,31,0.35)');
    grad.addColorStop(1, 'rgba(255,90,31,0.02)');
    ctx.beginPath();
    ctx.moveTo(X(0), Y(pts[0]));
    pts.forEach((v, k) => ctx.lineTo(X(k), Y(v)));
    ctx.lineTo(X(lastN), padT + ih); ctx.lineTo(X(0), padT + ih);
    ctx.closePath();
    ctx.fillStyle = grad; ctx.fill();
    ctx.beginPath();
    pts.forEach((v, k) => (k ? ctx.lineTo(X(k), Y(v)) : ctx.moveTo(X(k), Y(v))));
    ctx.strokeStyle = '#ff5a1f'; ctx.lineWidth = 2; ctx.lineJoin = 'round'; ctx.stroke();
    ctx.fillStyle = 'rgba(238,240,244,0.55)';
    [0, Math.round(lastN / 2), lastN].forEach((m) => ctx.fillText(m + 'mo', X(m) - 12, hgt - 8));
  }
  calcCar.addEventListener('change', () => { if (calcCar.value !== 'custom') syncPriceFromCar(); compute(); });
  calcPrice.addEventListener('input', () => {
    const match = CARS.find((c) => c.price === Number(calcPrice.value));
    calcCar.value = match ? match.id : 'custom';
    compute();
  });
  [calcDown, calcApr, calcTerm, calcTrade].forEach((el) => el.addEventListener('input', compute));
  window.addEventListener('resize', drawBalance);
  compute();

  /* ==========================================================
     CONTACT / ENQUIRY FORM
     ========================================================== */
  const enquiryForm = $('#enquiryForm');
  const enqCar = $('#e-car');
  const enquirySuccess = $('#enquirySuccess');
  enqCar.innerHTML = CARS.map((c) => `<option value="${c.id}">${c.name}</option>`).join('') + '<option value="general">General enquiry</option>';

  const EKEY = 'velocity-enquiries';
  let enquiries = [];
  try { enquiries = JSON.parse(localStorage.getItem(EKEY) || '[]'); } catch { enquiries = []; }
  const saveEnquiries = () => { try { localStorage.setItem(EKEY, JSON.stringify(enquiries)); } catch { /* storage unavailable */ } };
  const enquiriesEl = $('#enquiries');
  const enquiryListEl = $('#enquiryList');
  const enqCarLabel = (v) => v === 'general' ? 'General enquiry' : (carById(v) || {}).name || v;
  const renderEnquiries = () => {
    enquiriesEl.hidden = enquiries.length === 0;
    enquiryListEl.innerHTML = enquiries.map((q, i) => `
      <li class="booking">
        <div class="booking-info">
          <strong>${q.car}</strong>
          <span>${q.name} · ${q.date}</span>
          <small>${q.ref}</small>
        </div>
        <button type="button" class="btn btn-sm btn-ghost" data-del="${i}">Delete</button>
      </li>`).join('');
  };
  enquiriesEl.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-del]');
    if (!btn) return;
    enquiries.splice(Number(btn.dataset.del), 1);
    saveEnquiries();
    renderEnquiries();
    toast('Enquiry deleted');
  });
  renderEnquiries();

  const rules = {
    name: (v) => v.trim().length >= 2 ? '' : 'Please enter your name.',
    email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? '' : 'Enter a valid email, like you@example.com.',
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
  const validated = $$('input[name="name"], input[name="email"]', enquiryForm);
  validated.forEach((input) => {
    input.addEventListener('blur', () => { if (input.value) check(input); });
    input.addEventListener('input', () => { if (input.closest('.field').classList.contains('invalid')) check(input); });
  });
  enquiryForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const results = validated.map(check);
    const bad = validated.find((_, i) => !results[i]);
    if (bad) { bad.focus(); return; }
    const first = $('#e-name').value.trim().split(/\s+/)[0];
    const carLabel = enqCarLabel(enqCar.value);
    const ref = 'EN-' + Math.random().toString(36).slice(2, 6).toUpperCase();
    const date = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    enquiries.unshift({ ref, name: $('#e-name').value.trim(), email: $('#e-email').value.trim(), car: carLabel, message: $('#e-msg').value.trim(), date });
    saveEnquiries();
    renderEnquiries();
    $('#enquirySuccessText').textContent = `Thanks, ${first}! Your enquiry about the ${carLabel} has been noted. We'll reply to ${$('#e-email').value.trim()} within one business day.`;
    $('#enquiryRef').textContent = `Reference: ${ref}`;
    enquiryForm.hidden = true;
    enquirySuccess.hidden = false;
    scrollToEl('#contact');
  });
  $('#enquiryAgain').addEventListener('click', () => {
    enquiryForm.reset();
    $$('.field', enquiryForm).forEach((f) => f.classList.remove('invalid'));
    enquirySuccess.hidden = true;
    enquiryForm.hidden = false;
    $('#e-name').focus();
  });
  $('#financeEnquire').addEventListener('click', () => { if (calcCar.value !== 'custom') enqCar.value = calcCar.value; });

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

  const toTop = $('#toTop');
  toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' }));
  window.addEventListener('scroll', () => toTop.classList.toggle('show', window.scrollY > 600), { passive: true });

  $('#year').textContent = new Date().getFullYear();
})();
