// =========================================================
// GLOBAL STATE
// =========================================================
let cart = JSON.parse(localStorage.getItem('stylehubCart')) || [];

// =========================================================
// INITIALIZATION
// =========================================================
document.addEventListener('DOMContentLoaded', () => {
    initUIHelpers();
    initThemeToggle();
    initUserDropdown();
    initCartSystem();
    initSearch();
    initSmoothScrolling();
    initScrollSpy();
    initNewsletter();
});

// =========================================================
// UI HELPERS (Toasts & Image Fallbacks)
// =========================================================
function initUIHelpers() {
    // Inject Toast Container if missing
    if (!document.getElementById('toastContainer')) {
        const container = document.createElement('div');
        container.id = 'toastContainer';
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    // Handle broken images gracefully
    document.querySelectorAll('img').forEach(img => {
        img.onerror = function() {
            this.src = 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&h=800&fit=crop'; // Fallback image
            this.classList.add('img-error');
        };
    });
}

function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    // Basic inline styles for toast if CSS is missing
    toast.style.cssText = `
        background: ${type === 'success' ? '#10b981' : '#ef4444'};
        color: white;
        padding: 0.75rem 1.25rem;
        border-radius: 0.5rem;
        margin-top: 0.5rem;
        font-size: 0.9rem;
        font-weight: 500;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        opacity: 0;
        transform: translateY(10px);
        transition: all 0.3s ease;
    `;
    toast.textContent = message;
    container.appendChild(toast);

    // Animate in
    requestAnimationFrame(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateY(0)';
    });

    // Animate out and remove
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(-10px)';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// =========================================================
// THEME & DROPDOWNS
// =========================================================
function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    if (!themeToggle) return;

    // Load saved theme
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);

    themeToggle.addEventListener('click', () => {
        const activeTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = activeTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        showToast(`${newTheme.charAt(0).toUpperCase() + newTheme.slice(1)} mode enabled`, 'success');
    });
}

function initUserDropdown() {
    const userIcon = document.getElementById('userIcon');
    const userDropdown = document.getElementById('userDropdown');
    
    if (!userIcon || !userDropdown) return;

    userIcon.addEventListener('click', (e) => {
        e.stopPropagation();
        userDropdown.classList.toggle('active');
    });

    document.addEventListener('click', (e) => {
        if (!userDropdown.contains(e.target) && !userIcon.contains(e.target)) {
            userDropdown.classList.remove('active');
        }
    });
}

// =========================================================
// SHOPPING CART
// =========================================================
function initCartSystem() {
    // Inject Cart Modal if it doesn't exist in HTML
    if (!document.getElementById('cartModal')) {
        const cartHTML = `
            <div class="cart-modal" id="cartModal" style="display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 9999; align-items: center; justify-content: center;">
                <div style="background: var(--bg-surface, #fff); width: 90%; max-width: 400px; border-radius: 1rem; overflow: hidden; display: flex; flex-direction: column; max-height: 80vh;">
                    <div style="padding: 1.25rem; border-bottom: 1px solid var(--border, #eee); display: flex; justify-content: space-between; align-items: center;">
                        <h2 style="margin: 0; font-size: 1.25rem;">Your Cart</h2>
                        <button id="cartClose" style="background: none; border: none; font-size: 1.5rem; cursor: pointer;">&times;</button>
                    </div>
                    <div id="cartItems" style="padding: 1.25rem; overflow-y: auto; flex-grow: 1;"></div>
                    <div style="padding: 1.25rem; border-top: 1px solid var(--border, #eee);">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 1rem; font-weight: bold;">
                            <span>Total:</span>
                            <span id="cartTotal">$0.00</span>
                        </div>
                        <button id="checkoutBtn" style="width: 100%; padding: 0.75rem; background: var(--text-primary, #000); color: var(--bg-surface, #fff); border: none; border-radius: 0.5rem; cursor: pointer; font-weight: bold;">Checkout</button>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', cartHTML);
    }

    const cartIcon = document.getElementById('cartIcon');
    const cartModal = document.getElementById('cartModal');
    const cartClose = document.getElementById('cartClose');
    const checkoutBtn = document.getElementById('checkoutBtn');

    updateCartUI();

    // Toggle Cart
    cartIcon?.addEventListener('click', () => {
        cartModal.style.display = 'flex';
        renderCartItems();
    });

    cartClose?.addEventListener('click', () => cartModal.style.display = 'none');
    
    cartModal?.addEventListener('click', (e) => {
        if (e.target === cartModal) cartModal.style.display = 'none';
    });

    // Checkout
    checkoutBtn?.addEventListener('click', () => {
        if (cart.length === 0) {
            showToast('Your cart is empty', 'error');
            return;
        }
        showToast('Redirecting to secure checkout...', 'success');
        setTimeout(() => { cartModal.style.display = 'none'; }, 1500);
    });

    // Add to Cart Buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const card = this.closest('.product-card');
            const name = card.querySelector('h3').textContent;
            const price = card.querySelector('.product-price').textContent;
            const image = card.querySelector('img').src;

            addToCart({ name, price, image, quantity: 1 });
        });
    });
}

function addToCart(product) {
    const existing = cart.find(item => item.name === product.name);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push(product);
    }
    
    localStorage.setItem('stylehubCart', JSON.stringify(cart));
    updateCartUI();
    showToast(`${product.name} added to cart!`);
}

function updateCartUI() {
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
        cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
    }
}

function renderCartItems() {
    const cartItemsContainer = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    if (!cartItemsContainer || !cartTotal) return;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p style="text-align: center; color: var(--text-muted);">Your cart is empty</p>';
        cartTotal.textContent = '$0.00';
        return;
    }

    cartItemsContainer.innerHTML = cart.map(item => `
        <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;">
            <img src="${item.image}" alt="${item.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 0.25rem;">
            <div style="flex-grow: 1;">
                <h4 style="margin: 0; font-size: 0.9rem;">${item.name}</h4>
                <div style="color: var(--text-muted); font-size: 0.85rem;">${item.price} x ${item.quantity}</div>
            </div>
            <button onclick="removeFromCart('${item.name}')" style="background: none; border: none; color: #ef4444; cursor: pointer; font-size: 1.25rem;">&times;</button>
        </div>
    `).join('');

    const total = cart.reduce((sum, item) => {
        const priceNum = parseFloat(item.price.replace('$', ''));
        return sum + (priceNum * item.quantity);
    }, 0);

    cartTotal.textContent = `$${total.toFixed(2)}`;
}

// Global scope so inline onclick works
window.removeFromCart = function(productName) {
    cart = cart.filter(item => item.name !== productName);
    localStorage.setItem('stylehubCart', JSON.stringify(cart));
    updateCartUI();
    renderCartItems();
    showToast('Item removed', 'success');
};

// =========================================================
// SEARCH FUNCTIONALITY
// =========================================================
function initSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');

    if (!searchInput || !searchButton) return;

    const performSearch = () => {
        const query = searchInput.value.trim().toLowerCase();
        if (!query) return;

        const products = document.querySelectorAll('.product-card');
        let count = 0;

        products.forEach(card => {
            const text = card.textContent.toLowerCase();
            if (text.includes(query)) {
                card.style.display = 'flex';
                count++;
            } else {
                card.style.display = 'none';
            }
        });

        if (count > 0) {
            showToast(`Found ${count} matching items`, 'success');
            document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
        } else {
            showToast('No products found matching your search.', 'error');
        }
    };

    searchButton.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') performSearch();
    });

    // Reset when cleared
    searchInput.addEventListener('input', (e) => {
        if (e.target.value.trim() === '') {
            document.querySelectorAll('.product-card').forEach(c => c.style.display = 'flex');
        }
    });
}

// =========================================================
// NAVIGATION & SCROLLING
// =========================================================
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const target = document.querySelector(targetId);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

function initScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

    if (sections.length === 0 || navLinks.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${entry.target.id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, { threshold: 0.3 });

    sections.forEach(section => observer.observe(section));
}

// =========================================================
// NEWSLETTER
// =========================================================
function initNewsletter() {
    const form = document.querySelector('.newsletter-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = form.querySelector('input[type="email"]');
        const btn = form.querySelector('button');
        
        if (input && input.value) {
            const originalText = btn.textContent;
            btn.textContent = 'Joining...';
            btn.disabled = true;

            setTimeout(() => {
                showToast('Welcome to the StyleHub Club!', 'success');
                form.reset();
                btn.textContent = originalText;
                btn.disabled = false;
            }, 1000);
        }
    });
}
