/* ============================================
   Aurora Coffee — landing page interactions
   Vanilla JS: variables, functions, arrays,
   objects, DOM, events, localStorage,
   IntersectionObserver
   ============================================ */

"use strict";

const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

/* ---------- 1. Theme toggle (persisted in localStorage) ---------- */

const THEME_KEY = "aurora-theme";
const root = document.documentElement;

function applyTheme(theme) {
    root.dataset.theme = theme;
    try {
        localStorage.setItem(THEME_KEY, theme);
    } catch (e) {
        /* storage unavailable (private mode) — ignore */
    }
}

function savedTheme() {
    try {
        return localStorage.getItem(THEME_KEY);
    } catch (e) {
        return null;
    }
}

applyTheme(savedTheme() || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"));

$("#theme-toggle").addEventListener("click", () => {
    applyTheme(root.dataset.theme === "dark" ? "light" : "dark");
});

/* ---------- 2. Footer year ---------- */

$("#year").textContent = new Date().getFullYear();

/* ---------- 3. Scroll chrome: header state, progress bar, FAB ---------- */

const header = $(".header");
const progressBar = $("#scroll-progress");
const fabTop = $("#fab-top");
const toTopBtn = $("#to-top");
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

function onScroll() {
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;

    header.classList.toggle("scrolled", y > 24);
    fabTop.classList.toggle("show", y > 600);
    progressBar.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
}

window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
}
toTopBtn.addEventListener("click", scrollToTop);
fabTop.addEventListener("click", scrollToTop);

/* Close the mobile drawer after tapping a link */
$$(".nav-links a").forEach((link) => {
    link.addEventListener("click", () => {
        $("#nav-toggle").checked = false;
    });
});

/* ---------- 3b. Animated stat counters ---------- */

function animateCounter(el) {
    const target = Number(el.dataset.target);
    const prefix = el.dataset.prefix || "";
    const suffix = el.dataset.suffix || "";
    const duration = reduceMotion ? 0 : 1600;
    const start = performance.now();

    function tick(now) {
        const p = duration === 0 ? 1 : Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3); // ease-out cubic
        el.textContent = prefix + Math.round(target * eased).toLocaleString("en-US") + suffix;
        if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
}

const statNumbers = $$(".stat-number");
if ("IntersectionObserver" in window && !reduceMotion) {
    const statObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    statObserver.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.4 }
    );
    statNumbers.forEach((el) => statObserver.observe(el));
} else {
    statNumbers.forEach((el) => {
        el.textContent =
            (el.dataset.prefix || "") +
            Number(el.dataset.target).toLocaleString("en-US") +
            (el.dataset.suffix || "");
    });
}

/* ---------- 4. Coffee showcase: data array + filter ---------- */

const COFFEES = [
    {
        id: "ethiopia-yerga",
        name: "Ethiopia Yirgacheffe",
        roast: "light",
        region: "Yirgacheffe, Ethiopia",
        notes: "Jasmine, bergamot, stone fruit",
        price: 16,
        rating: 4.9,
        badge: "Bestseller",
        icon: "☕",
    },
    {
        id: "colombia-huila",
        name: "Colombia Huila",
        roast: "medium",
        region: "Huila, Colombia",
        notes: "Caramel, red apple, cocoa nib",
        price: 14,
        rating: 4.7,
        icon: "🥣",
    },
    {
        id: "kenya-aa",
        name: "Kenya AA Nyeri",
        roast: "light",
        region: "Nyeri, Kenya",
        notes: "Blackcurrant, tomato leaf, brown sugar",
        price: 17,
        rating: 4.8,
        badge: "Limited",
        icon: "🫘",
    },
    {
        id: "guatemala-antigua",
        name: "Guatemala Antigua",
        roast: "medium",
        region: "Antigua, Guatemala",
        notes: "Toffee, orange zest, spice",
        price: 14,
        rating: 4.6,
        icon: "🍫",
    },
    {
        id: "sumatra-mandheling",
        name: "Sumatra Mandheling",
        roast: "dark",
        region: "Lintong, Sumatra",
        notes: "Dark chocolate, cedar, molasses",
        price: 15,
        rating: 4.7,
        icon: "🖤",
    },
    {
        id: "brazil-cerrado",
        name: "Brazil Cerrado",
        roast: "dark",
        region: "Cerrado, Brazil",
        notes: "Hazelnut, milk chocolate, dried fig",
        price: 13,
        rating: 4.5,
        badge: "Value pick",
        icon: "🌰",
    },
    {
        id: "costa-rica-tarrazu",
        name: "Costa Rica Tarrazú",
        roast: "medium",
        region: "Tarrazú, Costa Rica",
        notes: "Honey, peach, almond",
        price: 15,
        rating: 4.8,
        icon: "🍑",
    },
    {
        id: "decaf-mexico",
        name: "Decaf — Chiapas",
        roast: "medium",
        region: "Chiapas, Mexico",
        notes: "Milk chocolate, vanilla, toasted almond",
        price: 14,
        rating: 4.6,
        icon: "🥛",
    },
];

/* ---------- small utilities ---------- */

function debounce(fn, ms) {
    let timer = null;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => fn(...args), ms);
    };
}

const store = {
    get(key, fallback) {
        try {
            const value = JSON.parse(localStorage.getItem(key));
            return value ?? fallback;
        } catch {
            return fallback;
        }
    },
    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch {
            /* storage unavailable — ignore */
        }
    },
};

const toastRegion = $("#toast-region");

function toast(message) {
    const el = document.createElement("div");
    el.className = "toast";
    el.innerHTML = `<span class="toast-dot" aria-hidden="true"></span><span></span>`;
    el.lastElementChild.textContent = message;
    toastRegion.appendChild(el);

    setTimeout(() => {
        el.classList.add("leaving");
        el.addEventListener("animationend", () => el.remove(), { once: true });
        setTimeout(() => el.remove(), 400); // fallback if animationend never fires
    }, 2800);
}

/* ---------- 4. Coffee showcase: filter + search + sort + favorites ---------- */

const coffeeState = { filter: "all", query: "", sort: "featured" };
const favorites = new Set(store.get("aurora-favs", []));

function matchesQuery(coffee) {
    const q = coffeeState.query.trim().toLowerCase();
    if (!q) return true;
    return `${coffee.name} ${coffee.notes} ${coffee.roast}`.toLowerCase().includes(q);
}

const SORTERS = {
    featured: (a, b) => COFFEES.indexOf(a) - COFFEES.indexOf(b),
    "price-asc": (a, b) => a.price - b.price,
    "price-desc": (a, b) => b.price - a.price,
    name: (a, b) => a.name.localeCompare(b.name),
};

function getVisibleCoffees() {
    return COFFEES.filter(
        (c) =>
            (coffeeState.filter === "all" || c.roast === coffeeState.filter) &&
            matchesQuery(c)
    ).sort(SORTERS[coffeeState.sort]);
}

const coffeeGrid = $("#coffee-grid");
const emptyState = $("#empty-state");
const filterCount = $("#filter-count");

function renderCoffees() {
    const visible = getVisibleCoffees();
    coffeeGrid.innerHTML = "";

    visible.forEach((coffee) => {
        const li = document.createElement("li");
        li.className = "coffee-card";
        li.dataset.roast = coffee.roast;
        const isFav = favorites.has(coffee.id);
        const stars = "★".repeat(Math.round(coffee.rating)) + "☆".repeat(5 - Math.round(coffee.rating));
        li.innerHTML = `
            <div class="coffee-art ${coffee.roast}" aria-hidden="true">
                ${coffee.badge ? `<span class="coffee-badge${coffee.badge === "Value pick" ? " alt" : ""}">${coffee.badge}</span>` : ""}
                <span class="coffee-icon">${coffee.icon}</span>
                <span class="roast-tag ${coffee.roast}">${coffee.roast}</span>
                <button class="fav-btn${isFav ? " faved" : ""}" type="button"
                        data-id="${coffee.id}" aria-pressed="${isFav}"
                        aria-label="${isFav ? "Remove" : "Add"} ${coffee.name} ${isFav ? "from" : "to"} favorites"></button>
            </div>
            <div class="coffee-body">
                <h3 class="coffee-name">${coffee.name}</h3>
                <div class="coffee-meta">
                    <span class="coffee-region">${coffee.region}</span>
                    <span class="coffee-rating" title="Rated ${coffee.rating} out of 5"><span aria-hidden="true">${stars}</span> ${coffee.rating.toFixed(1)}</span>
                </div>
                <p>${coffee.notes}</p>
                <div class="coffee-foot">
                    <span class="price">$${coffee.price}.00<small>/ 12oz bag</small></span>
                    <button class="add-btn" type="button" data-id="${coffee.id}">Add to box</button>
                </div>
            </div>`;
        coffeeGrid.appendChild(li);
    });

    emptyState.hidden = visible.length > 0;
    const parts = [];
    if (coffeeState.query) parts.push(`matching “${coffeeState.query.trim()}”`);
    if (coffeeState.filter !== "all") parts.push(coffeeState.filter);
    filterCount.textContent = parts.length
        ? `${visible.length} coffee${visible.length === 1 ? "" : "s"} ${parts.join(" · ")}`
        : `${visible.length} coffee${visible.length === 1 ? "" : "s"} shown`;
}

renderCoffees();

/* Roast filter pills */
$$(".filter-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
        $$(".filter-btn").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        coffeeState.filter = btn.dataset.filter;
        renderCoffees();
    });
});

/* Debounced search + instant sort */
const searchInput = $("#coffee-search");
searchInput.addEventListener(
    "input",
    debounce(() => {
        coffeeState.query = searchInput.value;
        renderCoffees();
    }, 200)
);

$("#coffee-sort").addEventListener("change", (event) => {
    coffeeState.sort = event.target.value;
    renderCoffees();
});

/* "/" focuses search from anywhere (except while typing) */
document.addEventListener("keydown", (event) => {
    if (event.key !== "/") return;
    const tag = document.activeElement?.tagName;
    if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
    event.preventDefault();
    searchInput.focus();
});

/* Delegated clicks: favorites toggle + add-to-box */
coffeeGrid.addEventListener("click", (event) => {
    const favBtn = event.target.closest(".fav-btn");
    const addBtn = event.target.closest(".add-btn");
    if (!favBtn && !addBtn) return;

    const id = (favBtn || addBtn).dataset.id;
    const coffee = COFFEES.find((c) => c.id === id);

    if (favBtn) {
        const nowFav = !favorites.has(id);
        nowFav ? favorites.add(id) : favorites.delete(id);
        store.set("aurora-favs", [...favorites]);
        favBtn.classList.toggle("faved", nowFav);
        favBtn.setAttribute("aria-pressed", String(nowFav));
        favBtn.setAttribute("aria-label", `${nowFav ? "Remove" : "Add"} ${coffee.name} ${nowFav ? "from" : "to"} favorites`);
        toast(nowFav ? `♥ Saved ${coffee.name} to favorites` : `Removed ${coffee.name} from favorites`);
        return;
    }

    addToCart(id);
    addBtn.classList.add("added");
    addBtn.textContent = "Added ✓";
    setTimeout(() => {
        addBtn.classList.remove("added");
        addBtn.textContent = "Add to box";
    }, 1600);
});

/* ---------- 4b. Roast of the week: simulated async fetch ---------- */

function fetchRoastOfWeek() {
    // Simulates a network request; picks a coffee deterministically by ISO week
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const now = new Date();
            const start = new Date(now.getFullYear(), 0, 1);
            const week = Math.ceil(((now - start) / 86400000 + start.getDay() + 1) / 7);
            if (week % 9 === 0) {
                reject(new Error("Roast schedule unavailable"));
            } else {
                resolve({ coffee: COFFEES[week % COFFEES.length], week });
            }
        }, 1100);
    });
}

async function loadRoastOfWeek() {
    const skeleton = $("#roast-skeleton");
    const content = $("#roast-content");

    try {
        const { coffee } = await fetchRoastOfWeek();
        const roastDate = new Date().toLocaleDateString("en-US", {
            weekday: "long",
            month: "short",
            day: "numeric",
        });

        content.innerHTML = `
            <span class="roast-bean" aria-hidden="true">${coffee.icon}</span>
            <div class="roast-copy">
                <p class="eyebrow">Roast of the week · ${roastDate}</p>
                <h2>${coffee.name}</h2>
                <p>${coffee.notes} — this week's small lot, roasted Tuesday and gone by Friday.</p>
                <div class="roast-meta">
                    <span>Roast: <strong>${coffee.roast}</strong></span>
                    <span>Left: <strong>40 bags</strong></span>
                    <span>Ships: <strong>within 48 hrs</strong></span>
                </div>
            </div>
            <div class="roast-cta">
                <span class="roast-price">$${coffee.price}.00 <span>/ 12oz</span></span>
                <button class="btn" type="button" data-id="${coffee.id}">Add to box</button>
            </div>`;

        skeleton.hidden = true;
        content.hidden = false;
    } catch (error) {
        skeleton.innerHTML = `
            <p style="color: var(--muted); font-size: var(--fs-sm);">
                Couldn't load this week's roast — check back Tuesday.
            </p>`;
    }
}

$("#roast-card").addEventListener("click", (event) => {
    const btn = event.target.closest(".btn");
    if (!btn) return;
    addToCart(btn.dataset.id);
    openCart();
});

loadRoastOfWeek();

/* ---------- 4c. Shopping cart: state, drawer, persistence ---------- */

const CART_KEY = "aurora-cart";
const cart = store.get(CART_KEY, {}); // { coffeeId: quantity }

const cartDrawer = $("#cart-drawer");
const cartOverlay = $("#cart-overlay");
const cartItemsEl = $("#cart-items");
const cartEmptyEl = $("#cart-empty");
const cartSubtotalEl = $("#cart-subtotal");
const cartCountEl = $("#cart-count");

const FREE_SHIPPING_THRESHOLD = 30;

function cartEntries() {
    return Object.entries(cart)
        .map(([id, qty]) => ({ coffee: COFFEES.find((c) => c.id === id), qty }))
        .filter((entry) => entry.coffee && entry.qty > 0);
}

function cartTotals() {
    const entries = cartEntries();
    const count = entries.reduce((sum, e) => sum + e.qty, 0);
    const subtotal = entries.reduce((sum, e) => sum + e.coffee.price * e.qty, 0);
    return { count, subtotal };
}

function saveCart() {
    store.set(CART_KEY, cart);
}

function renderCart() {
    const { count, subtotal } = cartTotals();
    const entries = cartEntries();

    cartItemsEl.innerHTML = "";
    entries.forEach(({ coffee, qty }) => {
        const li = document.createElement("li");
        li.className = "cart-item";
        li.innerHTML = `
            <span class="cart-item-art ${coffee.roast}" aria-hidden="true">${coffee.icon}</span>
            <div class="cart-item-info">
                <div class="cart-item-name">${coffee.name}</div>
                <div class="cart-item-price">$${coffee.price}.00 each</div>
            </div>
            <div class="cart-item-controls">
                <span class="cart-qty">
                    <button type="button" data-act="dec" data-id="${coffee.id}" aria-label="Decrease quantity">−</button>
                    <output>${qty}</output>
                    <button type="button" data-act="inc" data-id="${coffee.id}" aria-label="Increase quantity">+</button>
                </span>
                <button class="cart-remove" type="button" data-act="remove" data-id="${coffee.id}">Remove</button>
            </div>`;
        cartItemsEl.appendChild(li);
    });

    const isEmpty = entries.length === 0;
    cartEmptyEl.hidden = !isEmpty;
    cartItemsEl.hidden = isEmpty;
    cartSubtotalEl.textContent = `$${subtotal.toFixed(2)}`;

    cartCountEl.hidden = count === 0;
    cartCountEl.textContent = count > 99 ? "99+" : count;
    cartCountEl.setAttribute("aria-label", `${count} item${count === 1 ? "" : "s"} in cart`);
}

function addToCart(id, qty = 1) {
    cart[id] = Math.min(12, (cart[id] || 0) + qty);
    saveCart();
    renderCart();
    const coffee = COFFEES.find((c) => c.id === id);
    toast(`Added ${coffee.name} to your box`);
}

function changeCartQty(id, delta) {
    cart[id] = (cart[id] || 0) + delta;
    if (cart[id] <= 0) delete cart[id];
    saveCart();
    renderCart();
}

function removeFromCart(id) {
    delete cart[id];
    saveCart();
    renderCart();
    const coffee = COFFEES.find((c) => c.id === id);
    toast(`Removed ${coffee.name} from your box`);
}

/* Delegated controls inside the drawer */
cartItemsEl.addEventListener("click", (event) => {
    const btn = event.target.closest("button[data-act]");
    if (!btn) return;
    const { act, id } = btn.dataset;
    if (act === "inc") changeCartQty(id, 1);
    if (act === "dec") changeCartQty(id, -1);
    if (act === "remove") removeFromCart(id);
});

/* Drawer open / close */
function openCart() {
    cartDrawer.hidden = false;
    cartOverlay.hidden = false;
    requestAnimationFrame(() => {
        cartDrawer.classList.add("open");
        cartOverlay.classList.add("open");
    });
    $(".cart-close").focus();
}

function closeCart() {
    cartDrawer.classList.remove("open");
    cartOverlay.classList.remove("open");
    setTimeout(() => {
        cartDrawer.hidden = true;
        cartOverlay.hidden = true;
    }, 400);
}

$("#cart-toggle").addEventListener("click", openCart);
$("#cart-close").addEventListener("click", closeCart);
cartOverlay.addEventListener("click", closeCart);
document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && cartDrawer.classList.contains("open")) closeCart();
});

/* Checkout: demo confirmation, then clears the cart */
$("#cart-checkout").addEventListener("click", () => {
    const { count, subtotal } = cartTotals();
    if (count === 0) {
        toast("Your box is empty — add some coffees first.");
        return;
    }
    const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 5;
    const total = subtotal + shipping;

    for (const key of Object.keys(cart)) delete cart[key];
    saveCart();
    renderCart();
    closeCart();
    toast(`✓ Order placed — ${count} bag${count === 1 ? "" : "s"}, $${total.toFixed(2)} total. Roasting Tuesday!`);
});

renderCart();

/* ---------- 5. Box builder: price calculator ---------- */

const BASE_PRICE = 14; // $ per 12oz bag
const TWO_LB_EXTRA = 4;
const GRIND_EXTRA = 1; // cold brew bags only
const DISCOUNT_THRESHOLD = 3;
const DISCOUNT_RATE = 0.10;

const builderForm = $("#builder-form");
const qtyOutput = $("#qty-value");
const BOX_KEY = "aurora-box";
let quantity = 1;

function money(value) {
    return `$${value.toFixed(2)}`;
}

function calculateBox() {
    const sizeValue = builderForm.querySelector('input[name="size"]:checked').value;
    const grindValue = Number(builderForm.querySelector('input[name="grind"]:checked').value);
    const isTwoLb = sizeValue === "2lb";

    const bagPrice = BASE_PRICE + (isTwoLb ? TWO_LB_EXTRA : 0) + grindValue * GRIND_EXTRA;
    const subtotal = bagPrice * quantity;
    const discount = quantity >= DISCOUNT_THRESHOLD ? subtotal * DISCOUNT_RATE : 0;
    const total = subtotal - discount;

    $("#sum-bags").textContent = `${quantity} × ${money(bagPrice)}`;
    $("#sum-extras").textContent = money((isTwoLb ? TWO_LB_EXTRA : 0) + grindValue * GRIND_EXTRA);
    $("#sum-discount").textContent = discount > 0 ? `−${money(discount)}` : "$0.00";
    $("#sum-total").textContent = money(total);
    qtyOutput.textContent = quantity;
}

function setQuantity(next) {
    quantity = Math.min(12, Math.max(1, next));
    saveBoxConfig();
    calculateBox();
}

/* Persist the whole box configuration (size, grind, quantity) */
function saveBoxConfig() {
    const sizeValue = builderForm.querySelector('input[name="size"]:checked').value;
    const grindValue = builderForm.querySelector('input[name="grind"]:checked').value;
    store.set(BOX_KEY, { size: sizeValue, grind: grindValue, quantity });
}

function restoreBoxConfig() {
    const saved = store.get(BOX_KEY, null);
    if (!saved) return;

    const sizeRadio = builderForm.querySelector(`input[name="size"][value="${saved.size}"]`);
    const grindRadio = builderForm.querySelector(`input[name="grind"][value="${saved.grind}"]`);
    if (sizeRadio) sizeRadio.checked = true;
    if (grindRadio) grindRadio.checked = true;
    if (Number.isInteger(saved.quantity)) quantity = Math.min(12, Math.max(1, saved.quantity));
}

$("#qty-minus").addEventListener("click", () => setQuantity(quantity - 1));
$("#qty-plus").addEventListener("click", () => setQuantity(quantity + 1));

builderForm.addEventListener("change", () => {
    saveBoxConfig();
    calculateBox();
});
builderForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const msg = $("#builder-message");
    msg.className = "form-message ok";
    msg.textContent = `✓ Box saved — ${quantity} bag${quantity === 1 ? "" : "s"}, ${money(calculateTotal())} per shipment. Check your inbox to confirm.`;
    toast("Your box configuration is saved — welcome back anytime!");
});

function calculateTotal() {
    const sizeValue = builderForm.querySelector('input[name="size"]:checked').value;
    const grindValue = Number(builderForm.querySelector('input[name="grind"]:checked').value);
    const bagPrice = BASE_PRICE + (sizeValue === "2lb" ? TWO_LB_EXTRA : 0) + grindValue * GRIND_EXTRA;
    const subtotal = bagPrice * quantity;
    return subtotal - (quantity >= DISCOUNT_THRESHOLD ? subtotal * DISCOUNT_RATE : 0);
}

restoreBoxConfig();
calculateBox();

/* ---------- 6. Testimonials carousel ---------- */

const TESTIMONIALS = [
    {
        quote: "The Yirgacheffe alone is worth the subscription. Tastes like the café in Copenhagen I miss.",
        name: "Maya R.",
        role: "Subscriber for 2 years",
    },
    {
        quote: "I cancelled three other coffee subscriptions. Aurora is the only one that never disappoints.",
        name: "Daniel K.",
        role: "Home espresso nerd",
    },
    {
        quote: "The brew guide in every box taught me more about pour-over than any YouTube video.",
        name: "Priya S.",
        role: "New to specialty coffee",
    },
    {
        quote: "Paused for a month while travelling, resumed with one tap. Genuinely effortless.",
        name: "Tom W.",
        role: "Frequent flyer",
    },
];

let currentSlide = 0;
const testimonial = $("#testimonial");
const dotsWrap = $("#carousel-dots");
let autoTimer = null;

TESTIMONIALS.forEach((_, i) => {
    const dot = document.createElement("button");
    dot.className = "dot" + (i === 0 ? " active" : "");
    dot.type = "button";
    dot.setAttribute("role", "tab");
    dot.setAttribute("aria-label", `Review ${i + 1}`);
    dot.addEventListener("click", () => goToSlide(i));
    dotsWrap.appendChild(dot);
});

const dots = $$(".dot");

function goToSlide(index) {
    currentSlide = (index + TESTIMONIALS.length) % TESTIMONIALS.length;
    const t = TESTIMONIALS[currentSlide];

    testimonial.classList.add("fade");
    setTimeout(() => {
        $(".testimonial-quote", testimonial).textContent = t.quote;
        $(".testimonial-name", testimonial).textContent = t.name;
        $(".testimonial-role", testimonial).textContent = t.role;
        dots.forEach((d, i) => d.classList.toggle("active", i === currentSlide));
        testimonial.classList.remove("fade");
    }, 200);

    restartAuto();
}

function nextSlide() { goToSlide(currentSlide + 1); }
function prevSlide() { goToSlide(currentSlide - 1); }

function restartAuto() {
    clearInterval(autoTimer);
    autoTimer = setInterval(nextSlide, 6000);
}

$("#next-btn").addEventListener("click", nextSlide);
$("#prev-btn").addEventListener("click", prevSlide);

/* Pause auto-advance while hovering or using keyboard */
const carousel = $("#carousel");
carousel.addEventListener("mouseenter", () => clearInterval(autoTimer));
carousel.addEventListener("mouseleave", restartAuto);
carousel.addEventListener("focusin", () => clearInterval(autoTimer));
carousel.addEventListener("focusout", restartAuto);

/* Arrow-key navigation when the carousel has focus */
carousel.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight") nextSlide();
    if (event.key === "ArrowLeft") prevSlide();
});

goToSlide(0);

/* ---------- 7. Subscribe form: validation + feedback ---------- */

const subscribeForm = $("#subscribe-form");
const subscribeMsg = $("#subscribe-message");

subscribeForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const { name, email, brew, terms } = subscribeForm.elements;

    /* Clear previous error styling */
    [name, email, brew, terms].forEach((field) => field.classList.remove("user-error"));

    const errors = [];
    const badName = name.value.trim().length < 2;
    const badEmail = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());
    const badBrew = !brew.value;
    const badTerms = !terms.checked;

    if (badName) { errors.push("Please enter your name (2+ characters)."); name.classList.add("user-error"); }
    if (badEmail) { errors.push("Please enter a valid email address."); email.classList.add("user-error"); }
    if (badBrew) { errors.push("Tell us what you're brewing."); brew.classList.add("user-error"); }
    if (badTerms) { errors.push("Please accept the emails checkbox."); terms.classList.add("user-error"); }

    if (errors.length > 0) {
        subscribeMsg.className = "form-message err";
        subscribeMsg.textContent = errors[0];
        return;
    }

    try {
        const subscribers = JSON.parse(localStorage.getItem("aurora-subscribers") || "[]");
        subscribers.push({
            name: name.value.trim(),
            email: email.value.trim(),
            brew: brew.value,
            at: new Date().toISOString(),
        });
        localStorage.setItem("aurora-subscribers", JSON.stringify(subscribers));
    } catch (e) {
        /* storage full or unavailable — still show success */
    }

    subscribeMsg.className = "form-message ok";
    subscribeMsg.textContent = `✓ Welcome aboard, ${name.value.trim().split(" ")[0]}! Check ${email.value.trim()} for your 15% code.`;
    subscribeForm.reset();
});

/* ---------- 8. Scroll reveal (IntersectionObserver) ---------- */

const revealTargets = $$(".section, .stats");
revealTargets.forEach((el) => el.classList.add("reveal"));

/* Stagger siblings inside each revealed block */
revealTargets.forEach((section) => {
    $$(".feature-card, .plan, .stat, .coffee-card", section).forEach((card, i) => {
        card.style.setProperty("--reveal-delay", `${Math.min(i * 70, 420)}ms`);
        card.classList.add("reveal");
    });
});

if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.12 }
    );
    $$(".reveal").forEach((el) => observer.observe(el));
} else {
    $$(".reveal").forEach((el) => el.classList.add("visible"));
}

/* ---------- 9. Active nav link ---------- */

const navAnchors = $$(".nav-links a[href^='#']");
const sections = navAnchors
    .map((a) => $(a.getAttribute("href")))
    .filter(Boolean);

function updateActiveLink() {
    const chrome = header.offsetHeight + 40;
    const pos = window.scrollY + chrome;
    let current = sections[0];
    sections.forEach((sec) => {
        if (sec.offsetTop <= pos) current = sec;
    });
    navAnchors.forEach((a) =>
        a.classList.toggle("active", a.getAttribute("href") === `#${current.id}`)
    );
}

window.addEventListener("scroll", updateActiveLink, { passive: true });
updateActiveLink();
