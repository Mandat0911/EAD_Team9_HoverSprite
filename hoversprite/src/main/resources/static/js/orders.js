document.addEventListener('DOMContentLoaded', function () {
    let currentPage = 0;
    const pageSize = 5; // Number of items per page
    let currentSortField = 'createdAt'; // Default sort field
    let currentSortDirection = 'DESC'; // Default sort direction

    // Initial fetch
    fetchOrders(currentPage, currentSortField, currentSortDirection);

    // Add event listeners to sort dropdown items
    document.querySelectorAll('.dropdown-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            currentSortField = item.getAttribute('data-sort-field');
            currentSortDirection = item.getAttribute('data-sort-direction');
            fetchOrders(0, currentSortField, currentSortDirection); // Reset to first page when sorting
            updateSortDropdownText(item.textContent);
        });
    });

    function fetchOrders(page, sortBy, direction) {
        fetch(`/api/orders?page=${page}&size=${pageSize}&sortBy=${sortBy}&direction=${direction}`)
            .then(response => response.json())
            .then(data => {
                const tableBody = document.getElementById('ordersTableBody');
                tableBody.innerHTML = ''; // Clear existing rows

                data.content.forEach((order, index) => {
                    const row = createOrderRow(order, (page * pageSize) + index + 1);
                    tableBody.appendChild(row);
                });

                updatePagination(data);
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

    function updatePagination(pageData) {
        const paginationContainer = document.getElementById('paginationContainer');
        paginationContainer.innerHTML = '';

        // Previous button
        const prevButton = createPaginationButton('Previous', pageData.number > 0, () => fetchOrders(pageData.number - 1, currentSortField, currentSortDirection));
        paginationContainer.appendChild(prevButton);

        // Page numbers
        for (let i = 0; i < pageData.totalPages; i++) {
            const pageButton = createPaginationButton(i + 1, true, () => fetchOrders(i, currentSortField, currentSortDirection), i === pageData.number);
            paginationContainer.appendChild(pageButton);
        }

        // Next button
        const nextButton = createPaginationButton('Next', pageData.number < pageData.totalPages - 1, () => fetchOrders(pageData.number + 1, currentSortField, currentSortDirection));
        paginationContainer.appendChild(nextButton);
    }

    function createPaginationButton(text, enabled, onClick, isActive = false) {
        const li = document.createElement('li');
        li.className = `page-item ${!enabled ? 'disabled' : ''} ${isActive ? 'active' : ''}`;

        const a = document.createElement('a');
        a.className = 'page-link';
        a.href = '#';
        a.textContent = text;

        if (enabled) {
            a.addEventListener('click', (e) => {
                e.preventDefault();
                onClick();
            });
        }

        li.appendChild(a);
        return li;
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

    function updateSortDropdownText(text) {
        const dropdownButton = document.getElementById('sortDropdown');
        dropdownButton.textContent = `Sort by: ${text}`;
    }
});