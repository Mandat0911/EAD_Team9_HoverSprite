let currentPage = 0;
const pageSize = 10;
let currentUserId;
let currentUserEmail;
let currentUserRole;
let apiUrl;
// Function to get user data from the HTML
function getUserData() {
    const userDataElement = document.getElementById('userData');
    if (userDataElement) {
        currentUserId = userDataElement.getAttribute('data-user-id');
        currentUserEmail = userDataElement.getAttribute('data-user-email');
        currentUserRole = userDataElement.getAttribute('data-user-role');

    }
}

function displayUserNotifications(page = 0) {
    if (!currentUserId) {
        console.error('User ID not available. Please ensure you are logged in.');
        return;
    }
    if(currentUserRole !== '[RECEPTIONIST]'){
         apiUrl = `/api/notifications/user/${currentUserId}?page=${page}&size=${pageSize}&sortBy=createdAt&sortDirection=DESC`;
    }
    console.log(apiUrl);
    if(apiUrl){
        fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                const notificationTable = document.getElementById('notificationTableBody');
                notificationTable.innerHTML = ''; // Clear existing rows

                data.content.forEach((notification, index) => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                    <td>${index + 1 + (page * pageSize)}</td>
                    <td>${new Date(notification.createdAt).toLocaleDateString('en-GB')}</td>
                    <td>${notification.message}</td>
                `;
                    notificationTable.appendChild(row);
                });

                updatePagination(data.totalPages, page);
            })
            .catch(error => {
                console.error('Error fetching notifications:', error);
                const notificationTable = document.getElementById('notificationTableBody');
                notificationTable.innerHTML = '<tr><td colspan="4">Error loading notifications. Please try again later.</td></tr>';
            });
    }
    else {
        const notificationTable = document.getElementById('notificationTableBody');
        notificationTable.innerHTML = '<tr><td colspan="4">There are no notifications.</td></tr>';
    }

}

function updatePagination(totalPages, currentPage) {
    const paginationContainer = document.getElementById('paginationContainer');
    paginationContainer.innerHTML = '';

    for (let i = 0; i < totalPages; i++) {
        const li = document.createElement('li');
        li.className = `page-item ${i === currentPage ? 'active' : ''}`;
        li.innerHTML = `<a class="page-link" href="#" onclick="displayUserNotifications(${i})">${i + 1}</a>`;
        paginationContainer.appendChild(li);
    }
}

function viewNotificationDetails(notificationId) {
    console.log(`Viewing details for notification ${notificationId}`);

}

// Initial load
document.addEventListener('DOMContentLoaded', () => {
    getUserData();
    if (!currentUserId) {
        console.error('User ID not available. Please ensure you are logged in.');
        return;
    }
    displayUserNotifications(0);
});
