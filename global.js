// Initialize Stripe
const stripe = Stripe('your_publishable_key'); // Replace with your actual Stripe publishable key

let cart = [];

// Load cart and update display on page load
document.addEventListener('DOMContentLoaded', () => {
    loadCart();
    updateCartCount();
    
    // Only run cart display update if we're on the cart page
    if (document.querySelector('.cart-items')) {
        updateCartDisplay();
    }
});

function loadCart() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCounts = document.querySelectorAll('.cart-count');
    cartCounts.forEach(count => {
        count.textContent = totalItems;
    });
}

function updateCartDisplay() {
    const cartItemsContainer = document.querySelector('.cart-items');
    const emptyCartMessage = document.getElementById('empty-cart-message');
    const cartContainer = document.querySelector('.cart-container');

    if (cart.length === 0) {
        emptyCartMessage.style.display = 'block';
        cartContainer.style.display = 'none';
        return;
    }

    emptyCartMessage.style.display = 'none';
    cartContainer.style.display = 'grid';

    cartItemsContainer.innerHTML = cart.map((item, index) => `
        <article class="cart-item">
            <img src="${item.image}" alt="${item.name}">
            <section class="item-details">
                <h3>${item.name}</h3>
                <p>${item.scientificName}</p>
                <section class="quantity-controls">
                    <button onclick="updateQuantity(${index}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="updateQuantity(${index}, 1)">+</button>
                </section>
                <button class="remove-item" onclick="removeItem(${index})">Remove</button>
            </section>
            <section class="item-price">$${(item.price * item.quantity).toFixed(2)}</section>
        </article>
    `).join('');

    updateTotals();
}

function updateTotals() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = cart.length > 0 ? 4.99 : 0;
    const total = subtotal + shipping;

    document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('shipping').textContent = `$${shipping.toFixed(2)}`;
    document.getElementById('total').textContent = `$${total.toFixed(2)}`;
    
    saveCart();
}

function updateQuantity(index, change) {
    const item = cart[index];
    const newQuantity = item.quantity + change;
    
    if (newQuantity < 1) {
        removeItem(index);
        return;
    }
    
    cart[index].quantity = newQuantity;
    saveCart();
    updateCartDisplay();
}

function removeItem(index) {
    cart.splice(index, 1);
    saveCart();
    updateCartDisplay();
}

// Add to cart function (for shop page)
function addToCart(product) {
    const existingItemIndex = cart.findIndex(item => item.name === product.name);
    
    if (existingItemIndex !== -1) {
        cart[existingItemIndex].quantity += 1;
    } else {
        cart.push({...product, quantity: 1});
    }
    
    saveCart();
}
