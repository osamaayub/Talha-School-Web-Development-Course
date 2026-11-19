(() => {
  'use strict';

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const money = (cents) => '$' + (cents / 100).toFixed(2);
  const scrollToEl = (sel) => $(sel).scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });

  /* ==========================================================
     DATA (fictional demo restaurant) — prices are in cents
     ========================================================== */
  const CATS = [
    { id: 'all', label: 'All' },
    { id: 'starters', label: 'Starters' },
    { id: 'mains', label: 'Mains' },
    { id: 'pizza', label: 'Pizza' },
    { id: 'desserts', label: 'Desserts' },
    { id: 'drinks', label: 'Drinks' },
  ];

  // diet: v = vegetarian, vg = vegan, gf = gluten-free; spicy is shown as a tag only
  const DISHES = [
    { id: 'burrata',  name: 'Heirloom Tomato Burrata', cat: 'starters', price: 1250, diet: ['v', 'gf'],        art: 'burrata',  desc: 'Creamy burrata, sun-ripened tomatoes, basil oil and flaky sea salt.' },
    { id: 'calamari', name: 'Golden Calamari Fritti',           cat: 'starters', price: 1150, diet: [],                 art: 'calamari', desc: 'Lightly dusted, flash-fried, with charred lemon and garlic aioli.' },
    { id: 'soup',     name: 'Fire-Roasted Tomato Soup',       cat: 'starters', price: 850,  diet: ['v'],              art: 'soup',     desc: 'Tomatoes roasted over the fire and simmered with garlic, finished with basil cream and sourdough croutons.' },
    { id: 'corn',     name: 'Smoky Chili-Lime Corn Ribs',          cat: 'starters', price: 950,  diet: ['vg', 'gf'], spicy: true, art: 'corn', desc: 'Oak-smoked corn ribs with a chili-lime glaze and fresh cilantro.' },
    { id: 'steak',    name: 'Oak-Fired Ribeye',        cat: 'mains',    price: 3400, diet: ['gf'],             art: 'steak',    desc: 'Thick-cut ribeye grilled over oak, with rosemary potatoes and charred green beans.' },
    { id: 'pasta',    name: 'Forest Mushroom Tagliatelle', cat: 'mains',    price: 1900, diet: ['v'],              art: 'pasta',    desc: 'Handmade tagliatelle, wild mushrooms, thyme butter and parmesan.' },
    { id: 'salmon',   name: 'Lemon-Butter Herb Salmon',       cat: 'mains',    price: 2700, diet: ['gf'],             art: 'salmon',   desc: 'Herb-crusted roasted salmon with grilled asparagus and a bright lemon butter sauce.' },
    { id: 'salad',    name: 'Market Garden Salad',      cat: 'mains',    price: 1400, diet: ['vg', 'gf'],       art: 'salad',    desc: 'Crisp greens, cherry tomatoes, cucumber, olives and citrus vinaigrette.' },
    { id: 'margherita', name: 'Classic Margherita',              cat: 'pizza',    price: 1500, diet: ['v'],              art: 'margherita', desc: 'San Marzano tomato, fior di latte, fresh basil and olive oil.' },
    { id: 'salami',   name: 'Spicy Salami & Hot Honey',              cat: 'pizza',    price: 1750, diet: [], spicy: true,    art: 'salami',   desc: 'Spicy salami, a drizzle of hot honey, mozzarella and a sprinkle of oregano.' },
    { id: 'cake',     name: 'Dark Chocolate Molten Cake',     cat: 'desserts', price: 1000, diet: ['v'],              art: 'cake',     desc: 'Warm chocolate cake with a liquid center, raspberries and vanilla cream.' },
    { id: 'panna',    name: 'Silky Lemon Panna Cotta',         cat: 'desserts', price: 900,  diet: ['v', 'gf'],        art: 'panna',    desc: 'Silky panna cotta with lemon glaze, fresh berries and mint.' },
    { id: 'lemonade', name: 'Fresh Mint Lemonade',             cat: 'drinks',   price: 500,  diet: ['vg', 'gf'],       art: 'lemonade', desc: 'Fresh-squeezed lemonade over ice with muddled mint.' },
    { id: 'coldbrew', name: 'Slow-Steeped Cold Brew',                 cat: 'drinks',   price: 550,  diet: ['vg', 'gf'],       art: 'coldbrew', desc: 'Slow-steeped for 18 hours, served over ice.' },
  ];
  const dishById = (id) => DISHES.find((d) => d.id === id);

  // Day of week (0 = Sunday) → today's special
  const SPECIAL_BY_DAY = ['steak', 'pasta', 'salami', 'salmon', 'corn', 'steak', 'cake'];

  // 24h opening hours per weekday (0 = Sunday)
  const HOURS = [
    { day: 'Sunday',    open: 12, close: 21 },
    { day: 'Monday',    open: 12, close: 22 },
    { day: 'Tuesday',   open: 12, close: 22 },
    { day: 'Wednesday', open: 12, close: 22 },
    { day: 'Thursday',  open: 12, close: 22 },
    { day: 'Friday',    open: 12, close: 23 },
    { day: 'Saturday',  open: 12, close: 23 },
  ];
  const TAX_RATE = 0.08;

  /* ==========================================================
     SVG DISH ART — drawn top-down on a plate (viewBox 200×200)
     ========================================================== */
  const rad = (d) => (d * Math.PI) / 180;
  const deg = (a) => (a * 180) / Math.PI;
  const f1 = (n) => +n.toFixed(1);
  const pol = (a, r) => [100 + r * Math.cos(a), 100 + r * Math.sin(a)];
  const circ = (x, y, r, fill, extra = '') => `<circle cx="${f1(x)}" cy="${f1(y)}" r="${r}" fill="${fill}" ${extra}/>`;
  const ell = (x, y, rx, ry, fill, rot = 0, extra = '') =>
    `<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${rx}" ry="${ry}" fill="${fill}" transform="rotate(${f1(rot)} ${f1(x)} ${f1(y)})" ${extra}/>`;
  const leaf = (x, y, s, rot, fill = '#4f8a3a') =>
    `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)}) scale(${s})"><path d="M0 0C8-11 24-9 30 0 24 9 8 11 0 0Z" fill="${fill}"/><path d="M2 0H26" stroke="rgba(0,0,0,.25)" stroke-width="1.4" fill="none"/></g>`;
  const ring = (n, r, fn, a0 = 0) =>
    Array.from({ length: n }, (_, i) => {
      const a = a0 + (i * 2 * Math.PI) / n;
      const [x, y] = pol(a, r);
      return fn(x, y, a, i);
    }).join('');
  const line = (x1, y1, x2, y2, stroke, w, extra = '') =>
    `<line x1="${f1(x1)}" y1="${f1(y1)}" x2="${f1(x2)}" y2="${f1(y2)}" stroke="${stroke}" stroke-width="${w}" stroke-linecap="round" ${extra}/>`;

  const plate = (inner, label) => `
    <svg class="plate-svg" viewBox="0 0 200 200" role="img" aria-label="${label}">
      <circle cx="103" cy="108" r="92" fill="rgba(70,35,10,.18)"/>
      <circle cx="100" cy="100" r="92" fill="url(#plateGrad)" stroke="#e3d6bd" stroke-width="2"/>
      <path d="M30 68A76 76 0 0 1 100 24" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".85"/>
      <circle cx="100" cy="100" r="78" fill="none" stroke="#eadfca" stroke-width="2"/>
      <circle cx="100" cy="100" r="68" fill="url(#plateWell)" stroke="#efe4cf" stroke-width="1.5"/>
      <g filter="url(#foodShadow)">${inner}</g>
    </svg>`;

  const pizzaBase = () =>
    circ(100, 100, 69, '#e3ac55') +
    ring(14, 64, (x, y) => circ(x, y, 3, '#b9722a', 'opacity=".55"')) +
    circ(100, 100, 56, '#cf4128') +
    circ(100, 100, 56, 'none', 'stroke="#b5331f" stroke-width="2"');
  const sliceLines = () =>
    [0, 45, 90, 135].map((a) => {
      const [x1, y1] = pol(rad(a), 68);
      const [x2, y2] = pol(rad(a + 180), 68);
      return line(x1, y1, x2, y2, 'rgba(110,50,15,.38)', 1.6);
    }).join('');
  const glassBase = (liquid) =>
    circ(100, 100, 62, '#eef4f2', 'stroke="#cfdcd8" stroke-width="5"') +
    circ(100, 100, 54, liquid) +
    circ(100, 100, 54, 'none', 'stroke="rgba(255,255,255,.35)" stroke-width="3"');
  const ice = () =>
    [[62, 66, 18], [96, 56, -12], [118, 100, 30], [70, 112, 8]].map(([x, y, r]) =>
      `<rect x="${x}" y="${y}" width="26" height="26" rx="6" fill="#fff" opacity=".5" transform="rotate(${r} ${x + 13} ${y + 13})"/>`).join('');
  const lemonSlice = (cx, cy, r) => {
    let s = circ(cx, cy, r, '#f7d046', 'stroke="#e0b52a" stroke-width="3"') + circ(cx, cy, r - 5, '#fbe98a');
    for (let i = 0; i < 8; i++) { const a = (i * Math.PI) / 4; s += line(cx, cy, cx + Math.cos(a) * (r - 6), cy + Math.sin(a) * (r - 6), '#f3d255', 1.6); }
    return s + circ(cx, cy, 2.6, '#f7d046');
  };
  const cob = (cy, rot) =>
    `<g transform="rotate(${rot} 100 ${cy})"><rect x="52" y="${cy - 11}" width="96" height="22" rx="11" fill="#f4c430"/>` +
    line(62, cy - 4, 138, cy - 4, '#d99a12', 3, 'stroke-dasharray="4 5"') +
    line(62, cy + 4, 138, cy + 4, '#d99a12', 3, 'stroke-dasharray="4 5"') +
    [70, 92, 114, 130].map((x) => circ(x, cy, 2.2, '#c2410c', 'opacity=".75"')).join('') + '</g>';

  const ART = {
    burrata: () =>
      ring(6, 46, (x, y) => circ(x, y, 16, '#d23b27') + circ(x, y, 11, '#ee6a4f') + circ(x - 4, y - 4, 3.5, '#ffa08c')) +
      ring(6, 54, (x, y, a) => leaf(x, y, 0.5, deg(a) + 90), Math.PI / 6) +
      circ(100, 100, 27, '#fffaf0', 'stroke="#e8dcc0" stroke-width="2"') + circ(92, 92, 8, '#fff') +
      circ(108, 110, 2.2, '#d9a62e') + circ(112, 104, 1.8, '#d9a62e') + circ(96, 112, 2, '#d9a62e'),

    calamari: () =>
      ring(8, 34, (x, y) => circ(x, y, 11, 'none', 'stroke="#e3a24d" stroke-width="7"') + circ(x, y, 11, 'none', 'stroke="#f6c477" stroke-width="2" opacity=".7"')) +
      ring(5, 15, (x, y) => circ(x, y, 9, 'none', 'stroke="#d98f3b" stroke-width="6"')) +
      `<path d="M120 142a20 20 0 0 1 40 0z" fill="#f7d046" stroke="#e2b92a" stroke-width="2"/>` +
      circ(58, 60, 17, '#fff', 'stroke="#e8dcc0" stroke-width="2"') + circ(58, 60, 12, '#f3e6c2') +
      leaf(76, 120, 0.45, -30) + leaf(120, 54, 0.4, 40),

    soup: () =>
      circ(100, 100, 62, '#f6efe1', 'stroke="#e8dcc6" stroke-width="2"') + circ(100, 100, 52, '#c9472b') + circ(100, 100, 46, '#da5a3b') +
      `<path d="M66 100C76 76 126 80 134 100C124 124 78 122 66 100Z" fill="none" stroke="#fff1db" stroke-width="7" stroke-linecap="round"/>` +
      leaf(86, 98, 0.7, -20) +
      [[126, 82, 20], [76, 122, -15], [122, 120, 35]].map(([x, y, r]) => `<rect x="${x}" y="${y}" width="11" height="11" rx="2" fill="#d9a05b" transform="rotate(${r} ${x + 5} ${y + 5})"/>`).join(''),

    corn: () =>
      cob(70, -8) + cob(100, 4) + cob(130, -4) +
      circ(152, 54, 14, '#8bc34a') + circ(152, 54, 9, '#c9e47f') + leaf(52, 60, 0.5, -50) + leaf(136, 152, 0.5, 30) +
      [[80, 86], [118, 114], [92, 142], [140, 84]].map(([x, y]) => circ(x, y, 1.8, '#b91c1c')).join(''),

    steak: () =>
      ell(100, 98, 52, 37, '#6b3220', -12) + ell(100, 96, 45, 31, '#8a4527', -12) +
      line(78, 80, 96, 110, 'rgba(60,20,10,.7)', 3.2) + line(94, 74, 112, 104, 'rgba(60,20,10,.7)', 3.2) + line(110, 70, 126, 98, 'rgba(60,20,10,.7)', 3.2) +
      ell(100, 90, 20, 6, 'rgba(255,255,255,.12)', -12) +
      [0, 7, 14].map((o) => `<path d="M${116 + o} ${140 - o}C${132 + o} ${128 - o} ${148 + o} ${132 - o} ${160 + o} ${144 - o}" stroke="#5f9a3a" stroke-width="5" stroke-linecap="round" fill="none"/>`).join('') +
      ell(54, 134, 14, 9, '#e8c88a', 20) + ell(70, 150, 13, 9, '#dcb972', -10) + ell(42, 152, 12, 8, '#e8c88a', 40) +
      line(58, 56, 108, 66, '#3f6b2e', 2.5) + [66, 78, 90, 102].map((x, i) => line(x, 58 + i * 2.6, x + 6, 50 + i * 2.6, '#3f6b2e', 2.2)).join(''),

    pasta: () =>
      [46, 38, 30, 22, 14].map((r, i) => ell(100, 100, r, r * 0.93, 'none', i * 37, 'stroke="#f2c85b" stroke-width="6.5"')).join('') +
      [46, 38, 30, 22, 14].map((r, i) => ell(100, 100, r, r * 0.93, 'none', i * 37 + 8, 'stroke="#ffe39a" stroke-width="1.5" opacity=".8"')).join('') +
      ring(5, 22, (x, y, a) => ell(x, y, 10, 6.5, '#8a6a49', deg(a)) + ell(x, y - 1, 7, 3.5, '#a88a67', deg(a)), 0.4) +
      ring(10, 34, (x, y) => circ(x, y, 1.9, '#3f8a3a')) + leaf(94, 96, 0.55, -30),

    salmon: () =>
      `<g transform="rotate(-12 100 100)"><rect x="46" y="74" width="108" height="50" rx="22" fill="#ee8466"/><rect x="50" y="78" width="100" height="42" rx="19" fill="#f59c80"/>` +
      ['M60 90Q100 80 140 90', 'M58 100Q100 92 142 100', 'M60 110Q100 104 140 110'].map((d) => `<path d="${d}" stroke="#fbc3b0" stroke-width="3" fill="none" stroke-linecap="round"/>`).join('') +
      [[70, 92], [88, 102], [110, 90], [128, 102], [96, 113], [122, 114]].map(([x, y]) => circ(x, y, 3.2, '#4f8a3a')).join('') + '</g>' +
      lemonSlice(150, 138, 17) +
      [0, 8, 16, 24].map((o) => line(46 + o * 0.5, 144 + o * 0.3, 104 + o * 0.5, 152 + o * 0.3, '#6aa84f', 5)).join(''),

    salad: () =>
      ring(9, 42, (x, y, a) => ell(x, y, 23, 10, '#5b9b3e', deg(a) + 25) + ell(x, y, 16, 3, '#79b552', deg(a) + 25)) +
      ring(7, 26, (x, y, a) => ell(x, y, 18, 8, '#7dbf52', deg(a) - 30), 0.3) +
      ring(5, 34, (x, y) => circ(x, y, 8.5, '#d63a28') + circ(x - 2.5, y - 2.5, 2.5, '#ff8f7c'), 0.5) +
      ring(5, 52, (x, y) => circ(x, y, 9, '#d7ecb0', 'stroke="#8db85d" stroke-width="2.5"') + circ(x, y, 3.5, '#b8d98b'), 0.9) +
      ring(4, 17, (x, y) => circ(x, y, 5, '#3b2f2f') + circ(x, y, 1.8, '#d9a62e'), 0.2),

    margherita: () =>
      pizzaBase() +
      ring(7, 32, (x, y) => circ(x, y, 12, '#fff4cf') + circ(x - 2, y - 2, 5, '#fffbe8'), 0.2) +
      circ(100, 100, 13, '#fff4cf') + ring(5, 40, (x, y, a) => leaf(x, y, 0.55, deg(a) + 40), 0.7) + sliceLines(),

    salami: () =>
      pizzaBase() +
      ring(7, 40, (x, y) => circ(x, y, 7, '#f6e3a6', 'opacity=".8"'), 0.3) +
      ring(6, 33, (x, y) => circ(x, y, 10, '#9f2a1c') + circ(x, y, 7.5, '#bf3a2a') + circ(x - 2, y - 2, 1.6, '#e8a08f') + circ(x + 2, y + 1, 1.3, '#e8a08f')) +
      circ(100, 100, 10, '#9f2a1c') + circ(100, 100, 7.5, '#bf3a2a') +
      ring(6, 48, (x, y, a) => ell(x, y, 6, 2.6, '#e11d2e', deg(a) + 60), 0.6) +
      ring(12, 24, (x, y) => circ(x, y, 1.4, '#6b8e23'), 0.1) + sliceLines(),

    cake: () =>
      circ(100, 100, 41, '#3e1f12') + circ(100, 100, 35, '#55291a') +
      `<path d="M100 104C122 96 146 106 148 124C150 142 122 148 108 134C100 126 96 112 100 104Z" fill="#2a120a"/>` +
      ell(86, 86, 16, 5, 'rgba(255,255,255,.1)', -30) +
      ring(14, 44, (x, y) => circ(x, y, 1.4, '#fff', 'opacity=".7"'), 0.2) +
      [[76, 80], [90, 68], [68, 96]].map(([x, y]) => circ(x, y, 8, '#c2185b') + circ(x - 2, y - 2, 2, '#f0709f') + circ(x + 2, y + 2, 1.6, '#8e0f40')).join('') +
      leaf(96, 78, 0.5, -50) + ell(140, 72, 16, 10, '#fff6df', -20) + ell(136, 69, 8, 4, '#fff', -20),

    panna: () =>
      circ(100, 100, 42, '#fbf3df', 'stroke="#eadcb8" stroke-width="2"') + circ(100, 100, 32, '#fff8ea') + circ(100, 100, 25, '#f6d365') + ell(92, 92, 10, 5, 'rgba(255,255,255,.45)', -30) +
      ring(5, 50, (x, y) => circ(x, y, 7, '#6b2d8e') + circ(x - 2, y - 2, 2, '#b46bc6'), 0.3) +
      ring(3, 54, (x, y, a) => leaf(x, y, 0.4, deg(a) + 90), 1) +
      ring(6, 12, (x, y, a) => ell(x, y, 4, 1.4, '#e0a91f', deg(a))),

    lemonade: () =>
      glassBase('#f6e27a') + ice() + lemonSlice(112, 108, 22) + leaf(64, 100, 0.5, -20) + leaf(82, 130, 0.45, 40) +
      line(70, 138, 142, 60, '#e2574c', 7) + line(74, 134, 138, 66, '#fff', 2, 'stroke-dasharray="6 8" opacity=".8"'),

    coldbrew: () =>
      glassBase('#3a2314') + circ(100, 100, 44, 'none', 'stroke="#5a3a24" stroke-width="5"') +
      `<path d="M62 100C78 78 118 84 138 104C120 124 80 122 62 100Z" fill="none" stroke="#e9d3b0" stroke-width="6" stroke-linecap="round" opacity=".85"/>` +
      ice() + line(70, 138, 142, 60, '#2f6f4e', 7) + line(74, 134, 138, 66, '#fff', 2, 'stroke-dasharray="6 8" opacity=".7"'),
  };

  const dishSVG = (key, label = '') => plate(ART[key](), label);

  // loose ingredients that float around the hero plate
  const BITS = {
    leaf: '<svg viewBox="0 0 60 60"><path d="M8 52C6 28 24 8 52 8 54 36 36 54 8 52Z" fill="#4f8a3a"/><path d="M10 50C22 36 34 24 48 12" stroke="rgba(0,0,0,.25)" stroke-width="2" fill="none"/></svg>',
    tomato: '<svg viewBox="0 0 60 60"><circle cx="30" cy="34" r="22" fill="#d63a28"/><circle cx="22" cy="26" r="6" fill="#ff8f7c" opacity=".7"/><path d="M30 14l5 7 8-2-5 7 6 6-9-1-5 7-5-7-9 1 6-6-5-7 8 2z" fill="#4f8a3a"/></svg>',
    olive: '<svg viewBox="0 0 60 60"><ellipse cx="30" cy="30" rx="17" ry="13" fill="#3b2f2f" transform="rotate(-25 30 30)"/><ellipse cx="24" cy="25" rx="5" ry="3" fill="rgba(255,255,255,.35)" transform="rotate(-25 24 25)"/><circle cx="40" cy="36" r="3" fill="#d9a62e"/></svg>',
    lemon: '<svg viewBox="0 0 60 60"><circle cx="30" cy="30" r="24" fill="#f7d046" stroke="#e0b52a" stroke-width="3"/><circle cx="30" cy="30" r="18" fill="#fbe98a"/><g stroke="#f3d255" stroke-width="2" stroke-linecap="round"><path d="M30 30L30 14M30 30L44 22M30 30L46 30M30 30L44 38M30 30L30 46M30 30L16 38M30 30L14 30M30 30L16 22"/></g><circle cx="30" cy="30" r="3" fill="#f7d046"/></svg>',
  };

  /* ---------- Toast ---------- */
  const toastEl = $('#toast');
  let toastTimer;
  const toast = (msg) => {
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2200);
  };

  /* ==========================================================
     HERO + STORY ART, OPEN STATUS, HOURS TABLE
     ========================================================== */
  $('#heroPlate').innerHTML = dishSVG('margherita');
  $('#storyPlate').innerHTML = dishSVG('pasta');
  $('#tastingArt').innerHTML = [['salmon', 'tp-1'], ['steak', 'tp-2'], ['cake', 'tp-3']]
    .map(([key, cls]) => `<div class="tp ${cls}">${dishSVG(key, '')}</div>`).join('');
  $('#bit1').innerHTML = BITS.leaf;
  $('#bit2').innerHTML = BITS.tomato;
  $('#bit3').innerHTML = BITS.olive;
  $('#bit4').innerHTML = BITS.lemon;

  const fmtHour = (h) => `${((h + 11) % 12) + 1} ${h < 12 || h === 24 ? 'AM' : 'PM'}`;
  const slotLabel = (mins) => {
    const h = Math.floor(mins / 60), m = mins % 60;
    return `${((h + 11) % 12) + 1}:${String(m).padStart(2, '0')} ${h < 12 ? 'AM' : 'PM'}`;
  };

  const updateStatus = () => {
    const now = new Date();
    const t = HOURS[now.getDay()];
    const h = now.getHours() + now.getMinutes() / 60;
    const el = $('#openStatus');
    let open = false, text;
    if (h >= t.open && h < t.close) { open = true; text = `Open now · until ${fmtHour(t.close)}`; }
    else if (h < t.open) text = `Closed · opens today at ${fmtHour(t.open)}`;
    else text = `Closed · opens tomorrow at ${fmtHour(HOURS[(now.getDay() + 1) % 7].open)}`;
    el.classList.toggle('open', open);
    el.classList.toggle('closed', !open);
    $('#openText').textContent = text;
  };
  updateStatus();
  setInterval(updateStatus, 60000);

  const todayIdx = new Date().getDay();
  $('#hours').insertAdjacentHTML('beforeend',
    '<tbody>' + [1, 2, 3, 4, 5, 6, 0].map((d) => {
      const t = HOURS[d];
      return `<tr class="${d === todayIdx ? 'today' : ''}"><td>${t.day}${d === todayIdx ? ' (today)' : ''}</td><td>${fmtHour(t.open)} – ${fmtHour(t.close)}</td></tr>`;
    }).join('') + '</tbody>');

  /* ==========================================================
     CART (persisted in localStorage when available)
     ========================================================== */
  const CART_KEY = 'ember-oak-cart';
  let cart = {};
  try {
    const saved = JSON.parse(localStorage.getItem(CART_KEY) || '{}');
    Object.keys(saved).forEach((id) => { if (dishById(id) && saved[id] > 0) cart[id] = Math.min(99, saved[id] | 0); });
  } catch (e) { cart = {}; }
  const saveCart = () => { try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch (e) { /* storage unavailable */ } };

  const cartBtn = $('#cartBtn');
  const cartEl = $('#cart');
  const overlay = $('#overlay');
  const cartBody = $('#cartBody');
  const cartFoot = $('#cartFoot');
  let cartView = 'cart';
  let lastOpener = cartBtn;

  const itemCount = () => Object.values(cart).reduce((a, b) => a + b, 0);
  const subtotal = () => Object.entries(cart).reduce((s, [id, q]) => s + dishById(id).price * q, 0);

  function renderCart() {
    const count = itemCount();
    const countEl = $('#cartCount');
    countEl.textContent = count;
    countEl.classList.toggle('has', count > 0);
    cartBtn.setAttribute('aria-label', `Open order, ${count} item${count === 1 ? '' : 's'}`);

    if (cartView === 'done') return;
    if (!count) {
      cartBody.innerHTML = '<div class="cart-empty"><span class="big" aria-hidden="true">🍽️</span><h3>Your order is empty</h3><p>Add something delicious from the menu.</p><button type="button" class="btn btn-ghost btn-sm" data-action="browse">Browse the menu</button></div>';
      cartFoot.hidden = true;
      return;
    }
    cartFoot.hidden = false;
    cartBody.innerHTML = Object.entries(cart).map(([id, q]) => {
      const d = dishById(id);
      return `<div class="line" data-id="${id}">
        ${dishSVG(d.art, '')}
        <div><h3>${d.name}</h3><small>${money(d.price)} each</small>
          <div class="qty"><button type="button" data-action="dec" aria-label="Remove one ${d.name}">−</button><span aria-live="polite">${q}</span><button type="button" data-action="inc" aria-label="Add one ${d.name}">+</button></div></div>
        <div class="line-total">${money(d.price * q)}</div>
      </div>`;
    }).join('');
    const sub = subtotal();
    const tax = Math.round(sub * TAX_RATE);
    $('#subtotal').textContent = money(sub);
    $('#tax').textContent = money(tax);
    $('#total').textContent = money(sub + tax);
  }

  const setQty = (id, q) => {
    if (q <= 0) delete cart[id]; else cart[id] = Math.min(99, q);
    saveCart();
    renderCart();
  };
  const bumpBadge = () => {
    const el = $('#cartCount');
    el.classList.remove('bump');
    void el.offsetWidth;
    el.classList.add('bump');
  };

  const focusables = () => $$('button, a[href], input, select', cartEl).filter((el) => !el.disabled && el.offsetParent !== null);
  function openCart(opener) {
    lastOpener = opener || cartBtn;
    renderCart();
    overlay.hidden = false;
    requestAnimationFrame(() => overlay.classList.add('show'));
    cartEl.classList.add('open');
    cartEl.setAttribute('aria-hidden', 'false');
    cartBtn.setAttribute('aria-expanded', 'true');
    document.body.classList.add('lock');
    setTimeout(() => $('#cartClose').focus(), 60);
  }
  function closeCart() {
    if (!cartEl.classList.contains('open')) return;
    cartEl.classList.remove('open');
    cartEl.setAttribute('aria-hidden', 'true');
    cartBtn.setAttribute('aria-expanded', 'false');
    overlay.classList.remove('show');
    setTimeout(() => { overlay.hidden = true; }, reducedMotion ? 0 : 350);
    document.body.classList.remove('lock');
    if (cartView === 'done') { cartView = 'cart'; renderCart(); }
    lastOpener.focus();
  }
  cartBtn.addEventListener('click', () => openCart(cartBtn));
  $('#openCartBtn').addEventListener('click', (e) => openCart(e.currentTarget));
  $('#cartClose').addEventListener('click', closeCart);
  overlay.addEventListener('click', closeCart);
  document.addEventListener('keydown', (e) => {
    if (!cartEl.classList.contains('open')) return;
    if (e.key === 'Escape') { closeCart(); return; }
    if (e.key === 'Tab') {
      const f = focusables();
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  cartBody.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;
    const line = btn.closest('.line');
    if (btn.dataset.action === 'inc') setQty(line.dataset.id, cart[line.dataset.id] + 1);
    else if (btn.dataset.action === 'dec') setQty(line.dataset.id, cart[line.dataset.id] - 1);
    else if (btn.dataset.action === 'browse' || btn.dataset.action === 'back') { closeCart(); scrollToEl('#menu'); }
  });
  $('#clearCart').addEventListener('click', () => { cart = {}; saveCart(); renderCart(); toast('Order cleared'); });
  $('#placeOrder').addEventListener('click', () => {
    if (!itemCount()) return;
    const total = subtotal() + Math.round(subtotal() * TAX_RATE);
    const num = 1000 + Math.floor(Math.random() * 9000);
    cart = {}; saveCart();
    cartView = 'done';
    cartFoot.hidden = true;
    cartBody.innerHTML = `<div class="cart-done"><div class="check" aria-hidden="true"><svg viewBox="0 0 52 52"><circle cx="26" cy="26" r="24"/><path d="M14 27l8 8 16-17"/></svg></div><h3>Order #${num} placed!</h3><p>Total ${money(total)}. Your food would be ready in about 25 minutes. (This is a demo, so nothing was actually ordered.)</p><button type="button" class="btn btn-ghost" data-action="back">Back to the menu</button></div>`;
    renderCart();
  });

  /* ==========================================================
     MENU: category tabs + dietary toggles
     ========================================================== */
  const state = { cat: 'all', diets: new Set() };
  const catsEl = $('#cats');
  catsEl.innerHTML = CATS.map((c) => `<button type="button" class="cat${c.id === 'all' ? ' is-active' : ''}" data-cat="${c.id}" aria-pressed="${c.id === 'all'}">${c.label}</button>`).join('');

  const SIGNATURE = new Set(['steak', 'margherita', 'cake']);
  const tagHTML = (d) => [
    SIGNATURE.has(d.id) ? '<span class="tag sig">★ Signature</span>' : '',
    d.diet.includes('vg') ? '<span class="tag vg">Vegan</span>' : d.diet.includes('v') ? '<span class="tag v">Vegetarian</span>' : '',
    d.diet.includes('gf') ? '<span class="tag">Gluten-free</span>' : '',
    d.spicy ? '<span class="tag spicy">🌶 Spicy</span>' : '',
  ].join('');

  const dishesEl = $('#dishes');
  dishesEl.innerHTML = DISHES.map((d) => `
    <article class="dish reveal" data-id="${d.id}" data-cat="${d.cat}">
      <div class="dish-art"><div class="tags">${tagHTML(d)}</div>${dishSVG(d.art, d.name)}</div>
      <div class="dish-body">
        <div class="dish-top"><h3>${d.name}</h3><b>${money(d.price)}</b></div>
        <p>${d.desc}</p>
        <button type="button" class="add-btn" data-add="${d.id}">Add to order</button>
      </div>
    </article>`).join('');
  const dishEls = $$('.dish', dishesEl);

  const matchesDiet = (d) => [...state.diets].every((f) => f === 'v' ? (d.diet.includes('v') || d.diet.includes('vg')) : d.diet.includes(f));
  const matches = (d) => (state.cat === 'all' || d.cat === state.cat) && matchesDiet(d);

  let filterRun = 0; // guards delayed callbacks from an earlier click against a newer one
  function applyFilters() {
    let shown = 0;
    const run = ++filterRun;
    dishEls.forEach((el) => {
      const show = matches(dishById(el.dataset.id));
      if (show) {
        shown++;
        el.hidden = false;
        requestAnimationFrame(() => requestAnimationFrame(() => { if (run === filterRun) el.classList.remove('is-out'); }));
      } else {
        el.classList.add('is-out');
        setTimeout(() => { if (run === filterRun) el.hidden = true; }, reducedMotion ? 0 : 400);
      }
    });
    $('#emptyMsg').hidden = shown > 0;
    $('#resultCount').textContent = shown ? `Showing ${shown} ${shown === 1 ? 'dish' : 'dishes'}` : '';
  }
  catsEl.addEventListener('click', (e) => {
    const b = e.target.closest('.cat');
    if (!b) return;
    state.cat = b.dataset.cat;
    $$('.cat', catsEl).forEach((x) => { const on = x === b; x.classList.toggle('is-active', on); x.setAttribute('aria-pressed', String(on)); });
    applyFilters();
  });
  $('#diets').addEventListener('click', (e) => {
    const b = e.target.closest('.diet');
    if (!b) return;
    const k = b.dataset.diet;
    if (state.diets.has(k)) state.diets.delete(k); else state.diets.add(k);
    b.setAttribute('aria-pressed', String(state.diets.has(k)));
    applyFilters();
  });
  applyFilters();

  function addToCart(id, btn) {
    setQty(id, (cart[id] || 0) + 1);
    bumpBadge();
    toast(`Added ${dishById(id).name}`);
    if (btn) {
      const old = btn.dataset.label || btn.textContent;
      btn.dataset.label = old;
      btn.textContent = 'Added ✓';
      btn.classList.add('added');
      clearTimeout(btn._t);
      btn._t = setTimeout(() => { btn.textContent = old; btn.classList.remove('added'); }, 1300);
    }
  }
  dishesEl.addEventListener('click', (e) => {
    const b = e.target.closest('[data-add]');
    if (b) addToCart(b.dataset.add, b);
  });

  /* ---------- Today's special ---------- */
  const sp = dishById(SPECIAL_BY_DAY[todayIdx]);
  $('#special').innerHTML = `
    <div class="mini">${dishSVG(sp.art, '')}</div>
    <div><small>Today's special</small><b>${sp.name}</b><span>${money(sp.price)}</span></div>
    <button type="button" class="btn btn-sm btn-primary" data-add-special="${sp.id}">Add</button>`;
  $('#special').addEventListener('click', (e) => {
    const b = e.target.closest('[data-add-special]');
    if (b) addToCart(b.dataset.addSpecial);
  });

  renderCart();

  /* ==========================================================
     RESERVATIONS
     ========================================================== */
  const resForm = $('#resForm');
  const dateEl = $('#r-date');
  const timeEl = $('#r-time');
  const guestsEl = $('#r-guests');
  const pad = (n) => String(n).padStart(2, '0');
  const toISO = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const todayStr = toISO(new Date());
  dateEl.min = todayStr;
  guestsEl.innerHTML = Array.from({ length: 12 }, (_, i) => `<option value="${i + 1}"${i + 1 === 2 ? ' selected' : ''}>${i + 1}</option>`).join('');

  function buildSlots() {
    if (!dateEl.value) { timeEl.innerHTML = '<option value="">Pick a date</option>'; return; }
    const [y, m, d] = dateEl.value.split('-').map(Number);
    const day = new Date(y, m - 1, d).getDay();
    const t = HOURS[day];
    const now = new Date();
    const nowMins = now.getHours() * 60 + now.getMinutes() + 30;
    const isToday = dateEl.value === todayStr;
    const slots = [];
    for (let mins = t.open * 60; mins <= (t.close - 1) * 60; mins += 30) {
      if (!isToday || mins >= nowMins) slots.push(mins);
    }
    const prev = timeEl.value;
    timeEl.innerHTML = slots.length
      ? '<option value="">Select a time</option>' + slots.map((s) => `<option value="${pad(Math.floor(s / 60))}:${pad(s % 60)}">${slotLabel(s)}</option>`).join('')
      : '<option value="">No tables left today</option>';
    if (slots.length && [...timeEl.options].some((o) => o.value === prev)) timeEl.value = prev;
  }
  dateEl.addEventListener('change', () => { buildSlots(); if (dateEl.closest('.field').classList.contains('invalid')) check(dateEl); });

  const rules = {
    name: (v) => v.trim().length >= 2 ? '' : 'Please enter your name.',
    email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? '' : 'Enter a valid email, like you@example.com.',
    date: (v) => !v ? 'Pick a date.' : v < todayStr ? 'Please choose today or a future date.' : '',
    time: (v) => v ? '' : 'Choose a time slot.',
  };
  function check(input) {
    const msg = rules[input.name](input.value);
    const field = input.closest('.field');
    if (!msg) { field.classList.remove('invalid'); input.removeAttribute('aria-invalid'); $('.err', field).textContent = ''; }
    else {
      if (!field.classList.contains('invalid')) void field.offsetWidth;
      field.classList.add('invalid'); input.setAttribute('aria-invalid', 'true'); $('.err', field).textContent = msg;
    }
    return !msg;
  }
  const checked = [$('#r-name'), $('#r-email'), dateEl, timeEl];
  checked.forEach((input) => {
    input.addEventListener('blur', () => { if (input.value) check(input); });
    input.addEventListener('input', () => { if (input.closest('.field').classList.contains('invalid')) check(input); });
  });

  resForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const results = checked.map(check);
    const bad = checked.find((_, i) => !results[i]);
    if (bad) { bad.focus(); return; }
    const [y, m, d] = dateEl.value.split('-').map(Number);
    const pretty = new Date(y, m - 1, d).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
    const [hh, mm] = timeEl.value.split(':').map(Number);
    const n = Number(guestsEl.value);
    const large = n >= 9 ? ' Because your party is large, we will confirm by email.' : '';
    $('#resText').textContent = `Thanks, ${$('#r-name').value.trim().split(/\s+/)[0]}! We've noted a table for ${n} guest${n === 1 ? '' : 's'} on ${pretty} at ${slotLabel(hh * 60 + mm)}.${large} (This is a demo, so nothing was actually sent.)`;
    resForm.hidden = true;
    $('#resSuccess').hidden = false;
  });
  $('#resAgain').addEventListener('click', () => {
    resForm.reset();
    guestsEl.value = '2';
    buildSlots();
    $$('.field', resForm).forEach((f) => f.classList.remove('invalid'));
    $('#resSuccess').hidden = true;
    resForm.hidden = false;
    $('#r-name').focus();
  });

  /* ==========================================================
     REVEAL, COUNTERS, NAV
     ========================================================== */
  ['.hero-copy', '.values', '.story-copy'].forEach((sel) => {
    const g = $(sel);
    if (g) $$('.reveal', g).forEach((el, i) => el.style.setProperty('--d', `${i * 0.09}s`));
  });
  $('.hero-visual').style.setProperty('--d', '0.2s');

  const countUp = (el) => {
    const target = Number(el.dataset.count), suffix = el.dataset.suffix || '';
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
    setTimeout(() => el.style.removeProperty('--d'), 1500);
  };
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      onReveal(entry.target);
      io.unobserve(entry.target);
    }), { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    $$('.reveal').forEach((el) => io.observe(el));
  } else {
    $$('.reveal').forEach(onReveal);
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

  let lastY = window.scrollY, ticking = false;
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
