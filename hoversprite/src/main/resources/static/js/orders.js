document.addEventListener('DOMContentLoaded', function () {
    let currentPage = 0;
    const pageSize = 10; // Number of items per page
    let currentSortField = 'createdAt'; // Default sort field
    let currentSortDirection = 'DESC'; // Default sort direction
    let currentUserId;
    let currentUserEmail;
    let currentRole;
    let apiUrl;
    // Initial fetch
    getUserData();
    fetchOrders(currentPage, currentSortField, currentSortDirection);

    // Add event listeners to sort dropdown items
    document.querySelectorAll('.dropdown-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            currentSortField = item.getAttribute('data-sort-field');
            currentSortDirection = item.getAttribute('data-sort-direction');
            fetchOrders(0, currentSortField, currentSortDirection, currentUserId); // Reset to first page when sorting
            updateSortDropdownText(item.textContent);
        });
    });


// Function to get user data from the HTML
    function getUserData() {
        const userDataElement = document.getElementById('userData');
        if (userDataElement) {
            currentUserId = userDataElement.getAttribute('data-user-id');
            currentUserEmail = userDataElement.getAttribute('data-user-email');
            currentRole = userDataElement.getAttribute('data-user-role');
            console.log(currentRole);
        }
    }

    function fetchOrders(page, sortBy, direction) {
        if (!currentUserId) {
            console.error('User ID not available. Please ensure you are logged in.');
            return;
        }
        if (currentRole === '[RECEPTIONIST]') {
            console.log('User is an receptionist');
            // Show admin-specific elements
            apiUrl = `/api/orders?page=${page}&size=${pageSize}&sortBy=${sortBy}&direction=${direction}`;
        }

        if (currentRole === '[FARMER]') {
            console.log('User is a regular user');
            // Show user-specific elements
             apiUrl = `/api/orders/user/${currentUserId}?page=${page}&size=${pageSize}&sortBy=${sortBy}&direction=${direction}`;

        }
        if(currentRole === '[SPRAYER]'){
           let  farmerApiUrl = `/api/sprayers/${currentUserId}/orders`;
            showMessage('Loading...', 'info');
            fetch(farmerApiUrl)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    console.log('Response data:', data); // Log the entire response for debugging
                    console.log(typeof data);
                    const tableBody = document.getElementById('ordersTableBody');
                    if (!tableBody) {
                        console.error('Table body element not found.');
                        return;
                    }

                    tableBody.innerHTML = ''; // Clear existing rows

                    if (data.length === 0) {
                        showMessage('No orders found.', 'info');
                    } else {
                        data.forEach((order, index) => {
                            const row = createOrderRow(order, (page * pageSize) + index + 1);
                            tableBody.appendChild(row);
                        });
                        hideMessage();
                    }

                    updatePagination(data);
                    addRowClickListeners();
                })
                .catch(error => {
                    console.error('Error fetching orders:', error);
                    showMessage('There was an error fetching orders. Please try again.', 'danger');
                });
        }

        showMessage('Loading...', 'info');
        fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log('Response data:', data); // Log the entire response for debugging
                console.log(typeof data);
                const tableBody = document.getElementById('ordersTableBody');
                if (!tableBody) {
                    console.error('Table body element not found.');
                    return;
                }

                tableBody.innerHTML = ''; // Clear existing rows

                if (data.length === 0) {
                    showMessage('No orders found.', 'info');
                } else {
                    let sortedOrders = data.content;
                    if (sortBy === 'status') {
                        sortedOrders = groupAndSortOrdersByStatus(sortedOrders);
                    }
                    sortedOrders.forEach((order, index) => {
                        const row = createOrderRow(order, (page * pageSize) + index + 1);
                        tableBody.appendChild(row);
                    });
                    hideMessage();
                }

                updatePagination(data);
                addRowClickListeners();
            })
            .catch(error => {
                console.error('Error fetching orders:', error);
                showMessage('There are no orders. Please try again.', 'danger');
            });
    }



    function groupAndSortOrdersByStatus(orders) {
        // Group orders by status
        const groupedOrders = orders.reduce((acc, order) => {
            if (!acc[order.status]) {
                acc[order.status] = [];
            }
            acc[order.status].push(order);
            return acc;
        }, {});

        // Sort statuses alphabetically, but ensure 'COMPLETED' is at the end
        const sortedStatuses = Object.keys(groupedOrders).sort((a, b) => {
            if (a === 'COMPLETED') return 1;
            if (b === 'COMPLETED') return -1;
            return a.localeCompare(b);
        });

        // Flatten the grouped and sorted orders
        return sortedStatuses.flatMap(status =>
            groupedOrders[status].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        );
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

    function showMessage(message, type = 'info') {
        let messageContainer = document.getElementById('messageContainer');
        if (!messageContainer) {
            messageContainer = document.createElement('div');
            messageContainer.id = 'messageContainer';
            document.querySelector('.table-responsive').after(messageContainer);
        }
        messageContainer.innerHTML = `
            <div class="alert alert-${type} mt-3" role="alert">
                ${message}
            </div>
        `;
    }

    function hideMessage() {
        const messageContainer = document.getElementById('messageContainer');
        if (messageContainer) {
            messageContainer.innerHTML = '';
        }
    }
});