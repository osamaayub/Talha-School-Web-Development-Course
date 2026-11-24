const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

const PLANTS = [
  { id: "monstera", name: "Monstera Deliciosa", botanical: "Monstera deliciosa", price: 42, rating: 4.9, tag: "Bestseller", art: "green", icon: "🪴", care: ["Bright indirect", "Weekly", "Pet toxic"], features: ["low-light", "easy"] },
  { id: "snake", name: "Snake Plant", botanical: "Sansevieria trifasciata", price: 28, rating: 4.8, tag: "Unkillable", art: "green", icon: "🌿", care: ["Low light", "Every 2 weeks", "Pet toxic"], features: ["low-light", "pet-safe", "easy"] },
  { id: "pothos", name: "Golden Pothos", botanical: "Epipremnum aureum", price: 24, rating: 4.7, tag: "Fast grower", art: "cream", icon: "🍃", care: ["Medium light", "Weekly", "Pet toxic"], features: ["easy"] },
  { id: "zz", name: "ZZ Plant", botanical: "Zamioculcas zamiifolia", price: 34, rating: 4.8, tag: "Low light", art: "purple", icon: "🌿", care: ["Low light", "Every 2 weeks", "Pet safe"], features: ["low-light", "pet-safe", "easy"] },
  { id: "peace", name: "Peace Lily", botanical: "Spathiphyllum wallisii", price: 38, rating: 4.6, tag: "Flowering", art: "white", icon: "🤍", care: ["Medium light", "Weekly", "Pet toxic"], features: ["flowering"] },
  { id: "succulent", name: "Echeveria Mix", botanical: "Echeveria spp.", price: 22, rating: 4.5, tag: "Drought friendly", art: "rose", icon: "🌵", care: ["Bright light", "Monthly", "Pet safe"], features: ["pet-safe", "easy"] },
  { id: "calathea", name: "Calathea Orbifolia", botanical: "Goeppertia orbifolia", price: 46, rating: 4.9, tag: "Statement", art: "blue", icon: "🌿", care: ["Medium light", "Weekly", "Pet safe"], features: ["pet-safe"] },
  { id: "fern", name: "Boston Fern", botanical: "Nephrolepis exaltata", price: 32, rating: 4.7, tag: "Humidity lover", art: "green", icon: "🌿", care: ["Medium light", "Twice weekly", "Pet safe"], features: ["pet-safe"] },
];

const state = { filter: "all", query: "", sort: "featured" };
const cart = loadCart();
const grid = $("#plantGrid");
const resultCount = $("#resultCount");
const emptyState = $("#emptyState");
const cartDrawer = $("#cartDrawer");
const cartOverlay = $("#cartOverlay");
const cartItemsEl = $("#cartItems");
const cartEmptyEl = $("#cartEmpty");
const cartCountEl = $("#cartCount");
const cartSubtotalEl = $("#cartSubtotal");

function loadCart() {
  try {
    return JSON.parse(localStorage.getItem("urban-plants-cart") || "{}");
  } catch {
    return {};
  }
}

function saveCart() {
  try {
    localStorage.setItem("urban-plants-cart", JSON.stringify(cart));
  } catch {}
}

function money(value) {
  return `$${value.toFixed(2)}`;
}

function toast(message) {
  const region = $("#toastRegion");
  const el = document.createElement("div");
  el.className = "toast";
  el.textContent = message;
  region.appendChild(el);
  setTimeout(() => el.remove(), 2600);
}

function getVisiblePlants() {
  const query = state.query.trim().toLowerCase();
  const sorters = {
    featured: (a, b) => PLANTS.indexOf(a) - PLANTS.indexOf(b),
    "price-asc": (a, b) => a.price - b.price,
    "price-desc": (a, b) => b.price - a.price,
    name: (a, b) => a.name.localeCompare(b.name),
  };

  return PLANTS.filter((plant) => {
    const matchesFilter = state.filter === "all" || plant.features.includes(state.filter);
    const haystack = `${plant.name} ${plant.botanical} ${plant.care.join(" ")}`.toLowerCase();
    return matchesFilter && (!query || haystack.includes(query));
  }).sort(sorters[state.sort]);
}

function renderPlants() {
  const visible = getVisiblePlants();
  grid.innerHTML = "";

  visible.forEach((plant) => {
    const card = document.createElement("article");
    card.className = "plant-card";
    card.innerHTML = `
      <div class="plant-art ${plant.art}" aria-hidden="true">
        <span class="plant-tag">${plant.tag}</span>
        <span>${plant.icon}</span>
      </div>
      <div class="plant-body">
        <h3 class="plant-name">${plant.name}</h3>
        <p class="plant-botanical">${plant.botanical}</p>
        <div class="plant-meta">
          <span>★ ${plant.rating.toFixed(1)}</span>
          <span>${plant.care[0]}</span>
        </div>
        <div class="plant-tags">${plant.features.map((f) => `<span>${f.replace("-", " ")}</span>`).join("")}</div>
        <div class="plant-foot">
          <span class="price">$${plant.price}.00 <small>potted</small></span>
          <button class="add-btn" type="button" data-id="${plant.id}">Add</button>
        </div>
      </div>`;
    grid.appendChild(card);
  });

  emptyState.hidden = visible.length > 0;
  resultCount.textContent = `${visible.length} plant${visible.length === 1 ? "" : "s"} shown`;
}

function cartEntries() {
  return Object.entries(cart)
    .map(([id, qty]) => ({ plant: PLANTS.find((p) => p.id === id), qty }))
    .filter((entry) => entry.plant && entry.qty > 0);
}

function cartTotals() {
  const entries = cartEntries();
  return {
    count: entries.reduce((sum, entry) => sum + entry.qty, 0),
    subtotal: entries.reduce((sum, entry) => sum + entry.plant.price * entry.qty, 0),
  };
}

function renderCart() {
  const { count, subtotal } = cartTotals();
  const entries = cartEntries();

  cartItemsEl.innerHTML = "";
  entries.forEach(({ plant, qty }) => {
    const item = document.createElement("div");
    item.className = "cart-item";
    item.innerHTML = `
      <span class="cart-thumb" aria-hidden="true">${plant.icon}</span>
      <div class="cart-item-info">
        <div class="cart-item-name">${plant.name}</div>
        <div class="cart-item-price">$${plant.price}.00 each</div>
      </div>
      <div style="display:grid;gap:6px;justify-items:end">
        <span class="cart-qty">
          <button type="button" data-act="dec" data-id="${plant.id}" aria-label="Decrease quantity">−</button>
          <output>${qty}</output>
          <button type="button" data-act="inc" data-id="${plant.id}" aria-label="Increase quantity">+</button>
        </span>
        <button class="cart-remove" type="button" data-act="remove" data-id="${plant.id}">Remove</button>
      </div>`;
    cartItemsEl.appendChild(item);
  });

  const isEmpty = entries.length === 0;
  cartEmptyEl.hidden = !isEmpty;
  cartItemsEl.style.display = isEmpty ? "none" : "grid";
  cartSubtotalEl.textContent = money(subtotal);
  cartCountEl.hidden = count === 0;
  cartCountEl.textContent = count > 99 ? "99+" : count;
}

function openCart() {
  cartDrawer.hidden = false;
  cartOverlay.hidden = false;
  requestAnimationFrame(() => cartDrawer.classList.add("open"));
}

function closeCart() {
  cartDrawer.classList.remove("open");
  cartOverlay.classList.remove("open");
  setTimeout(() => {
    cartDrawer.hidden = true;
    cartOverlay.hidden = true;
  }, 350);
}

$("#cartButton").addEventListener("click", openCart);
$("#cartClose").addEventListener("click", closeCart);
cartOverlay.addEventListener("click", closeCart);
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && cartDrawer.classList.contains("open")) closeCart();
});

grid.addEventListener("click", (event) => {
  const btn = event.target.closest(".add-btn");
  if (!btn) return;
  const id = btn.dataset.id;
  cart[id] = Math.min(12, (cart[id] || 0) + 1);
  saveCart();
  renderCart();
  btn.classList.add("added");
  btn.textContent = "Added ✓";
  toast(`${PLANTS.find((p) => p.id === id).name} added to cart`);
  setTimeout(() => {
    btn.classList.remove("added");
    btn.textContent = "Add";
  }, 1400);
});

cartItemsEl.addEventListener("click", (event) => {
  const btn = event.target.closest("button[data-act]");
  if (!btn) return;
  const { act, id } = btn.dataset;
  if (act === "inc") cart[id] = Math.min(12, (cart[id] || 0) + 1);
  if (act === "dec") cart[id] = (cart[id] || 0) - 1;
  if (cart[id] <= 0) delete cart[id];
  if (act === "remove") delete cart[id];
  saveCart();
  renderCart();
});

$("#checkoutButton").addEventListener("click", () => {
  const { count, subtotal } = cartTotals();
  if (count === 0) {
    toast("Your cart is empty — add a plant first.");
    return;
  }
  const shipping = subtotal >= 30 ? 0 : 5;
  for (const key of Object.keys(cart)) delete cart[key];
  saveCart();
  renderCart();
  closeCart();
  toast(`✓ Order placed — ${count} plant${count === 1 ? "" : "s"}, ${money(subtotal + shipping)} total.`);
});

$("#filterRow").addEventListener("click", (event) => {
  const btn = event.target.closest(".filter");
  if (!btn) return;
  $$(".filter").forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");
  state.filter = btn.dataset.filter;
  renderPlants();
});

$("#plantSearch").addEventListener("input", (event) => {
  state.query = event.target.value;
  renderPlants();
});

$("#plantSort").addEventListener("change", (event) => {
  state.sort = event.target.value;
  renderPlants();
});

$("#joinForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const email = form.elements.email;
  const msg = $("#joinMessage");
  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());
  if (!valid) {
    msg.className = "form-message err";
    msg.textContent = "Please enter a valid email address.";
    email.focus();
    return;
  }
  try {
    const members = JSON.parse(localStorage.getItem("urban-plants-members") || "[]");
    members.push({ email: email.value.trim(), at: new Date().toISOString() });
    localStorage.setItem("urban-plants-members", JSON.stringify(members));
  } catch {}
  msg.className = "form-message ok";
  msg.textContent = "✓ Welcome to the plant club — check your inbox for 10% off.";
  form.reset();
});

$("#year").textContent = new Date().getFullYear();

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = Number(el.dataset.count);
      const decimals = Number(el.dataset.decimals || 0);
      const prefix = el.dataset.prefix || "";
      const suffix = el.dataset.suffix || "";
      const duration = 1200;
      const start = performance.now();
      function tick(now) {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = `${prefix}${(target * eased).toFixed(decimals)}${suffix}`;
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
      observer.unobserve(el);
    });
  }, { threshold: 0.4 });
  $$("[data-count]").forEach((el) => observer.observe(el));
}

renderPlants();
renderCart();
