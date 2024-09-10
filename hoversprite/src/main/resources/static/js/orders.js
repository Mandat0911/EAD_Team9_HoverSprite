document.addEventListener('DOMContentLoaded', function () {
    const rows = document.querySelectorAll('.orders-container .table tbody tr');
    rows.forEach(row => {
        row.addEventListener('click', function() {
            const orderId = row.dataset.orderId; // each row has a data-order-id attribute
            window.location.href = `/orders/order_details?id=${orderId}`;
        });
    });
});
