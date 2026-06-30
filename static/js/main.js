// ========================================
// MAIN.JS
// ========================================

let state = {
    cart: [],
    wishlist: [],
};

const themeToggle = document.getElementById('themeToggle');
const userAvatarBtn = document.getElementById('userAvatarBtn');
const userDropdown = document.getElementById('userDropdown');
const cartToggle = document.getElementById('cartToggle');
const cartSidebar = document.getElementById('cartSidebar');
const cartOverlay = document.getElementById('cartOverlay');
const closeCart = document.getElementById('closeCart');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const cartCount = document.getElementById('cartCount');
const checkoutBtn = document.getElementById('checkoutBtn');
const checkoutModal = document.getElementById('checkoutModal');
const closeModal = document.getElementById('closeModal');
const continueShopping = document.getElementById('continueShopping');
const orderSummary = document.getElementById('orderSummary');
const toast = document.getElementById('toast');

// ========================================
// THEME
// ========================================

function toggleTheme() {
    const isDark = !document.body.classList.contains('light-theme');
    document.body.classList.toggle('light-theme', !isDark);
    themeToggle.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    localStorage.setItem('theme', isDark ? 'light' : 'dark');
}

function loadTheme() {
    const saved = localStorage.getItem('theme');
    if (saved === 'light') {
        document.body.classList.add('light-theme');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
}

// ========================================
// USER DROPDOWN
// ========================================

function toggleDropdown(e) {
    if (e) e.stopPropagation();
    userDropdown.classList.toggle('show');
    userAvatarBtn.classList.toggle('active');
}

// ========================================
// CART
// ========================================

function addToCart(productId) {
    const card = document.querySelector(`.product-card[data-id="${productId}"]`);
    
    let name, price, icon;
    
    if (card) {
        name = card.querySelector('.product-title')?.textContent || 'Product';
        price = parseFloat(card.dataset.price) || 0;
        icon = card.querySelector('.product-image i')?.className || 'fa-box';
    } else {
        name = document.querySelector('h1')?.textContent || 'Product';
        const priceText = document.querySelector('.detail-price')?.textContent || '$0.00';
        price = parseFloat(priceText.replace('$', '').trim()) || 0;
        icon = document.querySelector('.detail-image i')?.className || 'fa-box';
    }

    const existing = state.cart.find(item => item.id === productId);

    if (existing) {
        existing.quantity += 1;
    } else {
        state.cart.push({ id: productId, name, price, icon, quantity: 1 });
    }

    renderCart();
    updateCartBadge();
    showToast(`${name} added to cart!`, 'success');

    const btn = card?.querySelector('.btn-add') || document.querySelector('.btn-add');
    if (btn) {
        const originalText = btn.innerHTML;
        btn.innerHTML = '✓ Added!';
        btn.classList.add('in-cart');
        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.classList.remove('in-cart');
        }, 1500);
    }
}

function removeFromCart(productId) {
    state.cart = state.cart.filter(item => item.id !== productId);
    renderCart();
    updateCartBadge();
}

function updateQuantity(productId, change) {
    const item = state.cart.find(i => i.id === productId);
    if (!item) return;
    item.quantity += change;
    if (item.quantity <= 0) {
        removeFromCart(productId);
        return;
    }
    renderCart();
    updateCartBadge();
}

function getCartTotal() {
    return state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function getCartCount() {
    return state.cart.reduce((sum, item) => sum + item.quantity, 0);
}

function renderCart() {
    if (state.cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <p>Your cart is empty</p>
                <span>Start shopping now!</span>
            </div>
        `;
        cartTotal.textContent = '$0.00';
        return;
    }

    cartItems.innerHTML = state.cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-icon">
                <i class="${item.icon}"></i>
            </div>
            <div class="cart-item-info">
                <div class="cart-item-title">${item.name}</div>
                <div class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
                <div class="cart-item-quantity">
                    <button onclick="updateQuantity(${item.id}, -1)">−</button>
                    <span>${item.quantity}</span>
                    <button onclick="updateQuantity(${item.id}, 1)">+</button>
                    <button class="cart-item-remove" onclick="removeFromCart(${item.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');

    cartTotal.textContent = `$${getCartTotal().toFixed(2)}`;
}

function updateCartBadge() {
    const count = getCartCount();
    cartCount.textContent = count;
    cartCount.style.display = count > 0 ? 'flex' : 'none';
}

// ========================================
// WISHLIST
// ========================================

function toggleWishlist(productId) {
    const index = state.wishlist.indexOf(productId);
    const btns = document.querySelectorAll(`.btn-wishlist[data-id="${productId}"]`);

    if (index > -1) {
        state.wishlist.splice(index, 1);
        btns.forEach(b => b.classList.remove('liked'));
        showToast('Removed from wishlist', 'info');
    } else {
        state.wishlist.push(productId);
        btns.forEach(b => b.classList.add('liked'));
        showToast('Added to wishlist ❤️', 'success');
    }
}

// ========================================
// CART SIDEBAR
// ========================================

function openCart() {
    cartSidebar.classList.add('open');
    cartOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeCartSidebar() {
    cartSidebar.classList.remove('open');
    cartOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

// ========================================
// CHECKOUT
// ========================================

function handleCheckout() {
    if (state.cart.length === 0) {
        showToast('Your cart is empty!', 'error');
        return;
    }

    orderSummary.innerHTML = state.cart.map(item => `
        <div class="item">
            <span>${item.name} × ${item.quantity}</span>
            <span>$${(item.price * item.quantity).toFixed(2)}</span>
        </div>
    `).join('');

    orderSummary.innerHTML += `
        <div class="item total">
            <span>Total</span>
            <span>$${getCartTotal().toFixed(2)}</span>
        </div>
    `;

    checkoutModal.classList.add('active');
    closeCartSidebar();
}

function handleContinueShopping() {
    checkoutModal.classList.remove('active');
    state.cart = [];
    renderCart();
    updateCartBadge();
    showToast('🎉 Thank you for your order!', 'success');
}

// ========================================
// TOAST
// ========================================

let toastTimeout;

function showToast(message, type = 'info') {
    toast.textContent = message;
    toast.className = 'toast';
    toast.classList.add(type);

    void toast.offsetWidth;
    toast.classList.add('show');

    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// ========================================
// EVENT LISTENERS
// ========================================

themeToggle.addEventListener('click', toggleTheme);

userAvatarBtn.addEventListener('click', toggleDropdown);

document.addEventListener('click', function(e) {
    if (!e.target.closest('.user-menu')) {
        userDropdown.classList.remove('show');
        userAvatarBtn.classList.remove('active');
    }
});

document.addEventListener('click', function(e) {
    const btn = e.target.closest('.btn-add');
    if (btn) {
        const id = parseInt(btn.dataset.id);
        if (id) addToCart(id);
    }
});

document.addEventListener('click', function(e) {
    const btn = e.target.closest('.btn-wishlist');
    if (btn) {
        const id = parseInt(btn.dataset.id);
        if (id) toggleWishlist(id);
    }
});

cartToggle.addEventListener('click', openCart);
closeCart.addEventListener('click', closeCartSidebar);
cartOverlay.addEventListener('click', closeCartSidebar);

checkoutBtn.addEventListener('click', handleCheckout);
closeModal.addEventListener('click', () => checkoutModal.classList.remove('active'));
continueShopping.addEventListener('click', handleContinueShopping);

checkoutModal.addEventListener('click', (e) => {
    if (e.target === checkoutModal) checkoutModal.classList.remove('active');
});

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        if (checkoutModal.classList.contains('active')) checkoutModal.classList.remove('active');
        if (cartSidebar.classList.contains('open')) closeCartSidebar();
        if (userDropdown.classList.contains('show')) {
            userDropdown.classList.remove('show');
            userAvatarBtn.classList.remove('active');
        }
    }
});

// ========================================
// INIT
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    loadTheme();
    renderCart();
    updateCartBadge();
});