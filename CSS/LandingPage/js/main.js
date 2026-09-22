// Global cart state
let cart = JSON.parse(localStorage.getItem('stylehubCart')) || [];

// DOM Elements
const cartIcon = document.getElementById('cartIcon');
const cartModal = document.getElementById('cartModal');
const cartClose = document.getElementById('cartClose');
const cartItems = document.getElementById('cartItems');
const cartCount = document.getElementById('cartCount');
const cartTotal = document.getElementById('cartTotal');
const checkoutBtn = document.getElementById('checkoutBtn');
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const navLinks = document.getElementById('navLinks');
const toastContainer = document.getElementById('toastContainer');
const themeToggle = document.getElementById('themeToggle');
const userIcon = document.getElementById('userIcon');
const userDropdown = document.getElementById('userDropdown');
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const mobileSearchToggle = document.getElementById('mobileSearchToggle');
const mobileSearchOverlay = document.getElementById('mobileSearchOverlay');
const mobileSearchInput = document.getElementById('mobileSearchInput');
const mobileSearchClose = document.getElementById('mobileSearchClose');
const mobileBackdrop = document.getElementById('mobileBackdrop');

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    handleImageErrors();
    initSmoothScrolling();
    initCart();
    initMobileMenu();
    initScrollSpy();
    initCTAButtons();
    initNewsletterForm();
    initDarkMode();
    initUserDropdown();
    initSearch();
    initMobileSearch();
    updateCartCount();
    renderCart();
});

// Handle image loading errors
function handleImageErrors() {
    const images = document.querySelectorAll('.product-image img, .about-image img');
    images.forEach(img => {
        img.onerror = function() {
            this.classList.add('error');
            this.parentElement.classList.add('has-error');
        };
    });
}

// Toast Notification System
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    toastContainer.appendChild(toast);

    // Trigger animation
    setTimeout(() => toast.classList.add('show'), 10);

    // Auto dismiss
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Shopping Cart System
function initCart() {
    // Cart icon click - open modal
    cartIcon.addEventListener('click', () => {
        cartModal.classList.add('open');
        renderCart();
    });

    // Close modal
    cartClose.addEventListener('click', () => {
        cartModal.classList.remove('open');
    });

    // Close modal when clicking outside
    cartModal.addEventListener('click', (e) => {
        if (e.target === cartModal) {
            cartModal.classList.remove('open');
        }
    });

    // Checkout button
    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            showToast('Your cart is empty', 'error');
            return;
        }
        showToast('Proceeding to checkout...', 'success');
        // Here you would redirect to checkout page
    });

    // Add to cart buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const productCard = this.closest('.product-card');
            const productName = productCard.querySelector('h3').textContent;
            const productPrice = productCard.querySelector('.product-price').textContent;
            const productImage = productCard.querySelector('img').src;

            addToCart({
                name: productName,
                price: productPrice,
                image: productImage,
                quantity: 1
            });
        });
    });
}

function addToCart(product) {
    const existingItem = cart.find(item => item.name === product.name);

    if (existingItem) {
        existingItem.quantity += 1;
        showToast(`${product.name} quantity updated in cart`, 'success');
    } else {
        cart.push(product);
        showToast(`${product.name} added to cart`, 'success');
    }

    saveCart();
    updateCartCount();
    renderCart();
}

function removeFromCart(productName) {
    cart = cart.filter(item => item.name !== productName);
    saveCart();
    updateCartCount();
    renderCart();
    showToast('Item removed from cart', 'info');
}

function updateQuantity(productName, change) {
    const item = cart.find(item => item.name === productName);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productName);
        } else {
            saveCart();
            renderCart();
        }
    }
}

function saveCart() {
    localStorage.setItem('stylehubCart', JSON.stringify(cart));
}

function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
}

function renderCart() {
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        cartTotal.textContent = '$0.00';
        return;
    }

    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-details">
                <h4>${item.name}</h4>
                <p class="cart-item-price">${item.price}</p>
                <div class="cart-item-quantity">
                    <button class="quantity-btn" data-action="decrease" data-name="${item.name}">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn" data-action="increase" data-name="${item.name}">+</button>
                </div>
            </div>
            <button class="remove-item" data-action="remove" data-name="${item.name}">&times;</button>
        </div>
    `).join('');

    // Add event listeners to dynamically created buttons
    cartItems.querySelectorAll('.quantity-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const name = e.target.dataset.name;
            const action = e.target.dataset.action;
            if (action === 'increase') {
                updateQuantity(name, 1);
            } else {
                updateQuantity(name, -1);
            }
        });
    });

    cartItems.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const name = e.target.dataset.name;
            removeFromCart(name);
        });
    });

    const total = cart.reduce((sum, item) => {
        const price = parseFloat(item.price.replace('$', ''));
        return sum + (price * item.quantity);
    }, 0);

    cartTotal.textContent = `$${total.toFixed(2)}`;
}

// Mobile Navigation
function initMobileMenu() {
    mobileMenuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        mobileMenuToggle.classList.toggle('active');
        mobileBackdrop.classList.toggle('active');
    });

    // Close menu when clicking on nav links
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            mobileMenuToggle.classList.remove('active');
            mobileBackdrop.classList.remove('active');
        });
    });

    // Close menu when clicking backdrop
    mobileBackdrop.addEventListener('click', () => {
        navLinks.classList.remove('active');
        mobileMenuToggle.classList.remove('active');
        mobileBackdrop.classList.remove('active');
    });

    // Close menu on window resize
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            navLinks.classList.remove('active');
            mobileMenuToggle.classList.remove('active');
            mobileBackdrop.classList.remove('active');
        }
    });
}

// Scroll Spy Navigation
function initScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinksList = document.querySelectorAll('.nav-links a[href^="#"]');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.3
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinksList.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));
}

// Smooth Scrolling
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// CTA Buttons
function initCTAButtons() {
    const exploreBtn = document.getElementById('exploreCollectionBtn');
    const learnMoreBtn = document.getElementById('learnMoreBtn');
    const shopNowBtn = document.getElementById('shopNowBtn');

    if (exploreBtn) {
        exploreBtn.addEventListener('click', () => {
            const productsSection = document.getElementById('products');
            if (productsSection) {
                productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    }

    if (learnMoreBtn) {
        learnMoreBtn.addEventListener('click', () => {
            const contactSection = document.getElementById('contact');
            if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    }

    if (shopNowBtn) {
        shopNowBtn.addEventListener('click', () => {
            const productsSection = document.getElementById('products');
            if (productsSection) {
                productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    }
}

// Newsletter Form
function initNewsletterForm() {
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showToast('Please enter a valid email address', 'error');
                return;
            }

            // Simulate form submission
            const submitBtn = this.querySelector('button');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Subscribing...';
            submitBtn.disabled = true;

            setTimeout(() => {
                showToast('Thank you for subscribing!', 'success');
                this.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 1000);
        });
    }
}

// Dark Mode Toggle
function initDarkMode() {
    // Check for saved theme preference or default to light
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        document.documentElement.setAttribute('data-theme', 'dark');
    }

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        showToast(`${newTheme.charAt(0).toUpperCase() + newTheme.slice(1)} mode enabled`, 'info');
    });
}

// User Dropdown
function initUserDropdown() {
    userIcon.addEventListener('click', (e) => {
        e.stopPropagation();
        userDropdown.classList.toggle('active');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!userIcon.contains(e.target) && !userDropdown.contains(e.target)) {
            userDropdown.classList.remove('active');
        }
    });

    // Handle dropdown item clicks
    userDropdown.querySelectorAll('.dropdown-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const action = item.textContent.trim();
            showToast(`${action} - Feature coming soon!`, 'info');
            userDropdown.classList.remove('active');
        });
    });
}

// Search Functionality
function initSearch() {
    searchButton.addEventListener('click', () => {
        const query = searchInput.value.trim();
        if (query) {
            performSearch(query);
        } else {
            searchInput.focus();
        }
    });

    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const query = searchInput.value.trim();
            if (query) {
                performSearch(query);
            }
        }
    });

    // Reset search when input is cleared
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.trim();
        if (query === '') {
            resetSearch();
        }
    });

    // Keyboard shortcut for search (Ctrl/Cmd + K)
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            searchInput.focus();
        }
    });
}

function performSearch(query) {
    showToast(`Searching for "${query}"...`, 'info');
    
    // Filter products based on search query
    const productCards = document.querySelectorAll('.product-card');
    let foundCount = 0;
    
    productCards.forEach(card => {
        const productName = card.querySelector('h3').textContent.toLowerCase();
        const productDesc = card.querySelector('.product-description').textContent.toLowerCase();
        
        if (productName.includes(query.toLowerCase()) || productDesc.includes(query.toLowerCase())) {
            card.style.display = 'block';
            foundCount++;
        } else {
            card.style.display = 'none';
        }
    });
    
    if (foundCount === 0) {
        showToast(`No products found for "${query}"`, 'error');
    } else {
        showToast(`Found ${foundCount} product(s)`, 'success');
        // Scroll to products section
        const productsSection = document.getElementById('products');
        if (productsSection) {
            productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
}

function resetSearch() {
    // Show all products again
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        card.style.display = 'block';
    });
}

// Mobile Search
function initMobileSearch() {
    mobileSearchToggle.addEventListener('click', () => {
        mobileSearchOverlay.classList.add('active');
        mobileSearchInput.focus();
    });

    mobileSearchClose.addEventListener('click', () => {
        mobileSearchOverlay.classList.remove('active');
        mobileSearchInput.value = '';
        resetSearch();
    });

    mobileSearchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const query = mobileSearchInput.value.trim();
            if (query) {
                performSearch(query);
                mobileSearchOverlay.classList.remove('active');
                mobileSearchInput.value = '';
            }
        }
    });

    // Reset search when mobile input is cleared
    mobileSearchInput.addEventListener('input', (e) => {
        const query = e.target.value.trim();
        if (query === '') {
            resetSearch();
        }
    });

    // Close overlay when clicking outside
    mobileSearchOverlay.addEventListener('click', (e) => {
        if (e.target === mobileSearchOverlay) {
            mobileSearchOverlay.classList.remove('active');
            mobileSearchInput.value = '';
            resetSearch();
        }
    });

    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileSearchOverlay.classList.contains('active')) {
            mobileSearchOverlay.classList.remove('active');
            mobileSearchInput.value = '';
            resetSearch();
        }
    });
}