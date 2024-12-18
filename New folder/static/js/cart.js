document.addEventListener('DOMContentLoaded', () => {
    updateCartDisplay();

    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            checkout();
        });
    }
});

function checkout() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }

    const total = cart.reduce((sum, item) => sum + item.price, 0);

    fetch('/api/order', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            items: cart,
            total: total
        }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Thank you for your order!');
            localStorage.removeItem('cart');
            updateCartDisplay();
            window.location.href = '/orders';
        } else {
            alert('There was an error processing your order. Please try again.');
        }
    })
    .catch((error) => {
        console.error('Error:', error);
        alert('There was an error processing your order. Please try again.');
    });
}

