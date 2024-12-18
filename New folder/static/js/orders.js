document.addEventListener('DOMContentLoaded', () => {
    fetchOrders();
});

function fetchOrders() {
    fetch('/api/orders')
        .then(response => response.json())
        .then(orders => {
            displayOrders(orders);
        })
        .catch(error => {
            console.error('Error:', error);
            alert('There was an error fetching your orders. Please try again.');
        });
}

function displayOrders(orders) {
    const orderHistoryElement = document.getElementById('order-history');
    if (orderHistoryElement) {
        orderHistoryElement.innerHTML = '';
        orders.forEach(order => {
            const orderElement = document.createElement('div');
            orderElement.classList.add('order-item');
            orderElement.innerHTML = `
                <h3>Order #${order.id}</h3>
                <p>Date: ${new Date(order.timestamp).toLocaleString()}</p>
                <p>Total: $${order.total.toFixed(2)}</p>
                <div class="order-details">
                    ${JSON.parse(order.items).map(item => `
                        <div>${item.name} - $${item.price.toFixed(2)}</div>
                    `).join('')}
                </div>
            `;
            orderHistoryElement.appendChild(orderElement);
        });
    }
}

