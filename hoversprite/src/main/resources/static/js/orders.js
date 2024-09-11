document.addEventListener('DOMContentLoaded', function () {
    fetchOrders();

    function fetchOrders() {
        fetch('/api/orders')
            .then(response => response.json())
            .then(orders => {
                const tableBody = document.getElementById('ordersTableBody');
                tableBody.innerHTML = ''; // Clear existing rows

                orders.forEach((order, index) => {
                    const row = createOrderRow(order, index + 1);
                    tableBody.appendChild(row);
                });

                addRowClickListeners();
            })
            .catch(error => console.error('Error fetching orders:', error));
    }

    function createOrderRow(order, rowNumber) {
        const row = document.createElement('tr');
        row.setAttribute('data-order-id', order.orderId);

        row.innerHTML = `
            <td>${rowNumber}</td>
            <td>${formatDate(order.createdAt)}</td>
            <td>${order.cropType}</td>
            <td>${formatCurrency(order.totalCost)} VND</td>
            <td class="status-${order.status.toLowerCase()}">${order.status}</td>
            <td><a href="/orders/order_details?id=${order.orderId}" class="detail-link"><i class="fa-solid fa-angle-right"></i></a></td>
        `;

        return row;
    }

    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB'); // Format as dd/mm/yyyy
    }

    function formatCurrency(amount) {
        return new Intl.NumberFormat('vi-VN').format(amount);
    }

    function addRowClickListeners() {

        const rows = document.querySelectorAll('#ordersTableBody tr');
        rows.forEach(row => {
            row.addEventListener('click', function(event) {
                // Check if the clicked element is the detail link or its child
                if (!event.target.closest('.detail-link')) {
                    const orderId = this.getAttribute('data-order-id');
                    window.location.href = `/orders/order_details?id=${orderId}`;
                }
            });
        });
    }
});