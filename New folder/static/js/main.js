// Wait for the DOM to be fully loaded before executing any scripts
document.addEventListener('DOMContentLoaded', async () => {
    // Add smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Add animation to dish cards
    const dishCards = document.querySelectorAll('.dish-card');
    dishCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'scale(1.05)';
            card.style.transition = 'transform 0.3s ease';
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'scale(1)';
        });
    });

    // Set image placeholders
    setImagePlaceholders();

    // Initialize the cart
    initializeCart();

    // Update cart display
    updateCartDisplay();
});

// Function to set image placeholders
function setImagePlaceholders() {
    const imagePlaceholders = document.querySelectorAll('.dish-image');
    const imageUrls = [
        'http://www.mygreekdish.com/wp-content/uploads/2014/02/Crispy-Fried-Squid-Calamari-recipe-Kalamarakia-Tiganita-1.jpg',
        'https://tse3.mm.bing.net/th?id=OIP.gY9rdXQRA5sDfsquPcvinAHaFj&pid=Api&P=0&h=180',
        'https://tse1.mm.bing.net/th?id=OIP.fheAIiZm-ASUtmFZ8_AyDgAAAA&pid=Api&P=0&h=180',
        'https://tse2.mm.bing.net/th?id=OIP.S9imZdY3HNGSwYXhfraaGQHaFj&pid=Api&P=0&h=180',
        'https://tse2.mm.bing.net/th?id=OIP.zRiChJidtyojfOMLnBIN9AHaFj&pid=Api&P=0&h=180',
        'https://tse4.mm.bing.net/th?id=OIP.S_e92_m3N1M3AeS88uLS5gHaE8&pid=Api&P=0&h=180'
    ];

    imagePlaceholders.forEach((placeholder, index) => {
        if (index < imageUrls.length) {
            placeholder.style.backgroundImage = `url('${imageUrls[index]}')`;
        } else {
            placeholder.style.backgroundImage = `url('https://via.placeholder.com/400x300?text=Food+Image')`;
        }
    });
}

// Function to initialize the cart
function initializeCart() {
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', () => {
            const dishCard = button.closest('.dish-card');
            const dishName = dishCard.querySelector('h3').textContent;
            const dishPrice = parseFloat(button.getAttribute('data-price') || '0');
            addToCart(dishName, dishPrice);
        });
    });
}

// Function to add item to cart
function addToCart(name, price) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.push({ name, price });
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartDisplay();
    alert(`${name} added to cart!`);
}

// Function to update cart display
function updateCartDisplay() {
    const cartItemsElement = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');
    if (cartItemsElement && cartTotalElement) {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        cartItemsElement.innerHTML = '';
        let total = 0;

        cart.forEach((item, index) => {
            const itemElement = document.createElement('div');
            itemElement.classList.add('cart-item');
            itemElement.innerHTML = `
                <span>${item.name}</span>
                <span>$${item.price.toFixed(2)}</span>
                <button onclick="removeFromCart(${index})">Remove</button>
            `;
            cartItemsElement.appendChild(itemElement);
            total += item.price;
        });

        cartTotalElement.textContent = total.toFixed(2);
    }
}

// Function to remove item from cart
function removeFromCart(index) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartDisplay();
}

function addToCart(name, price) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.push({ name, price });
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartDisplay();
    alert(`${name} added to cart!`);
}

// Function to update cart display
function updateCartDisplay() {
    const cartItemsElement = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');
    if (cartItemsElement && cartTotalElement) {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        cartItemsElement.innerHTML = '';
        let total = 0;

        cart.forEach((item, index) => {
            const itemElement = document.createElement('div');
            itemElement.classList.add('cart-item');
            itemElement.innerHTML = `
                <span>${item.name}</span>
                <span>$${item.price.toFixed(2)}</span>
                <button onclick="removeFromCart(${index})">Remove</button>
            `;
            cartItemsElement.appendChild(itemElement);
            total += item.price;
        });

        cartTotalElement.textContent = total.toFixed(2);
    }
}

// Function to remove item from cart
function removeFromCart(index) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartDisplay();
}

// Call updateCartDisplay when the page loads
window.addEventListener('load', updateCartDisplay);



