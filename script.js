/**
 * Shopping Cards Project — Interactive Controller
 * Simple, bulletproof card interactions (Wishlist, Size picker, Color changer, Add to Cart).
 */

document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.shop-card');

    cards.forEach((card) => {
        // 1. Wishlist Button Toggle
        const wishlistBtn = card.querySelector('.btn-wishlist');
        if (wishlistBtn) {
            wishlistBtn.addEventListener('click', (e) => {
                e.preventDefault();
                wishlistBtn.classList.toggle('active');
            });
        }

        // 2. Size Selector
        const sizeButtons = card.querySelectorAll('.size-options .size-btn');
        sizeButtons.forEach((btn) => {
            btn.addEventListener('click', () => {
                sizeButtons.forEach((b) => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });

        // 3. Color Swatches (Dynamically updates shoe color!)
        const colorButtons = card.querySelectorAll('.color-options .color-btn');
        const shoeBody = card.querySelector('.shoe-body');

        colorButtons.forEach((btn) => {
            btn.addEventListener('click', () => {
                colorButtons.forEach((b) => b.classList.remove('active'));
                btn.classList.add('active');

                // Update the SVG sneaker body fill color
                const selectedColor = btn.getAttribute('data-color');
                if (shoeBody && selectedColor) {
                    shoeBody.setAttribute('fill', selectedColor);
                }
            });
        });

        // 4. Add to Cart Feedback
        const addBtn = card.querySelector('.btn-add-cart');
        if (addBtn) {
            addBtn.addEventListener('click', () => {
                const originalHtml = addBtn.innerHTML;
                addBtn.classList.add('added');
                addBtn.disabled = true;
                addBtn.innerHTML = `
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    <span>Added!</span>
                `;

                setTimeout(() => {
                    addBtn.innerHTML = originalHtml;
                    addBtn.classList.remove('added');
                    addBtn.disabled = false;
                }, 1200);
            });
        }
    });
});
