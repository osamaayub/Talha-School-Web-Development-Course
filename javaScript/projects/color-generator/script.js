const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

const paletteEl = $("#palette");
const harmonyEl = $("#harmony");
const favoritesSection = $("#favoritesSection");
const favoritesList = $("#favoritesList");
const toastRegion = $("#toastRegion");
const STORAGE_KEY = "chroma-favorites";

const HARMONIES = {
  random: null,
  analogous: [0, 30, 60, 90, 150],
  complementary: [0, 180, 20, 200, 340],
  triadic: [0, 120, 240, 60, 300],
  split: [0, 150, 210, 30, 330],
  tetradic: [0, 90, 180, 270, 45],
};

let palette = [];
let locked = new Set();
let favorites = loadFavorites();

function loadFavorites() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function saveFavorites() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
}

function hslToRgb(h, s, l) {
  h = ((h % 360) + 360) % 360;
  s /= 100;
  l /= 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0, g = 0, b = 0;
  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  return [r, g, b].map((v) => Math.round((v + m) * 255));
}

function rgbToHex([r, g, b]) {
  return "#" + [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("");
}

function hexToRgb(hex) {
  const clean = hex.replace("#", "");
  const value = parseInt(clean.length === 3 ? clean.split("").map((c) => c + c).join("") : clean, 16);
  return [(value >> 16) & 255, (value >> 8) & 255, value & 255];
}

function luminance(hex) {
  const [r, g, b] = hexToRgb(hex).map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function randomHsl() {
  return [Math.random() * 360, 58 + Math.random() * 30, 46 + Math.random() * 18];
}

function harmonyColor(index, base, offsets) {
  if (!offsets) return randomHsl();
  const variation = index % 3;
  const hue = (base[0] + offsets[index % offsets.length] + 360) % 360;
  const sat = Math.min(88, Math.max(42, base[1] + (variation - 1) * 7));
  const light = Math.min(68, Math.max(38, base[2] + ((index % 2) - 0.5) * 10));
  return [hue, sat, light];
}

function generatePalette() {
  const mode = harmonyEl.value;
  const offsets = HARMONIES[mode];
  const base = randomHsl();
  const next = Array.from({ length: 5 }, (_, i) => {
    if (locked.has(i) && palette[i]) return palette[i];
    return rgbToHex(hslToRgb(...harmonyColor(i, base, offsets)));
  });
  palette = next;
  renderPalette();
}

function renderPalette() {
  paletteEl.innerHTML = "";
  palette.forEach((hex, index) => {
    const [r, g, b] = hexToRgb(hex);
    const card = document.createElement("article");
    card.className = "swatch";
    card.style.background = hex;
    card.style.setProperty("--swatch-ink", luminance(hex) > 0.58 ? "#0f172a" : "#ffffff");
    card.innerHTML = `
      <div class="swatch-top">
        <button class="lock ${locked.has(index) ? "active" : ""}" type="button" data-action="lock" data-index="${index}" aria-label="Lock color ${index + 1}">${locked.has(index) ? "●" : "○"}</button>
        <button class="copy" type="button" data-action="copy" data-hex="${hex}" aria-label="Copy ${hex}">⧉</button>
      </div>
      <div class="swatch-info">
        <div class="hex">${hex}</div>
        <div class="rgb">rgb(${r}, ${g}, ${b})</div>
        <button class="copy-btn" type="button" data-action="copy" data-hex="${hex}">Copy hex</button>
      </div>`;
    paletteEl.appendChild(card);
  });
}

function toast(message) {
  const el = document.createElement("div");
  el.className = "toast";
  el.textContent = message;
  toastRegion.appendChild(el);
  setTimeout(() => el.remove(), 1800);
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    toast(`Copied ${text}`);
  } catch {
    toast("Copy failed");
  }
}

function renderFavorites() {
  favoritesSection.hidden = favorites.length === 0;
  favoritesList.innerHTML = "";
  favorites.forEach((colors, index) => {
    const item = document.createElement("div");
    item.className = "fav-item";
    item.innerHTML = `
      <div class="fav-colors">${colors.map((hex) => `<span style="background:${hex}"></span>`).join("")}</div>
      <div class="fav-meta">Palette ${index + 1} · ${colors.length} colors</div>
      <div class="fav-actions">
        <button type="button" data-action="load" data-index="${index}">Load</button>
        <button class="danger" type="button" data-action="delete" data-index="${index}">Delete</button>
      </div>`;
    favoritesList.appendChild(item);
  });
}

paletteEl.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;
  const action = button.dataset.action;
  if (action === "copy") {
    copyText(button.dataset.hex);
    return;
  }
  if (action === "lock") {
    const index = Number(button.dataset.index);
    locked.has(index) ? locked.delete(index) : locked.add(index);
    renderPalette();
  }
});

favoritesList.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;
  const index = Number(button.dataset.index);
  if (button.dataset.action === "load") {
    palette = [...favorites[index]];
    locked.clear();
    renderPalette();
    toast("Palette loaded");
  }
  if (button.dataset.action === "delete") {
    favorites.splice(index, 1);
    saveFavorites();
    renderFavorites();
    toast("Palette deleted");
  }
});

$("#generateBtn").addEventListener("click", () => {
  generatePalette();
  toast("New palette generated");
});

$("#saveBtn").addEventListener("click", () => {
  if (!palette.length) return;
  const key = palette.join(",");
  if (favorites.some((item) => item.join(",") === key)) {
    toast("Palette already saved");
    return;
  }
  favorites.unshift([...palette]);
  saveFavorites();
  renderFavorites();
  toast("Palette saved");
});

$("#clearFavorites").addEventListener("click", () => {
  favorites = [];
  saveFavorites();
  renderFavorites();
  toast("Favorites cleared");
});

generatePalette();
renderFavorites();
