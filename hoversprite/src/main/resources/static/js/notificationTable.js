let currentNotificationList = [];  // To hold the notifications
let sortDirection = 'asc';  // Default sort direction

// Function for loading notifications and rendering table
async function loadNotificationTable() {
    doneMsgLbl.style.display = "none";

    // Simulate fetching data (you'd replace this with your actual fetch logic)
    let response = await fetch('/api/notifications');
    currentNotificationList = await response.json();

    renderNotificationTable();  // Load and render the table
}

// Function to render the rows in the table
function renderNotificationRow(notification) {
    return `
        <tr id="notificationRow${notification.id}">
            <td>${notification.id}</td>
            <td>${notification.date}</td>
            <td>${notification.total} VND</td>
            <td class="status-${notification.status.toLowerCase()}">${notification.status}</td>
            <td><button class="btn btn-link" onclick="viewDetails(${notification.id})">→</button></td>
        </tr>
    `;
}

// Function to render the table with the current list of notifications
function renderNotificationTable() {
    let notificationTblBody = document.getElementById('customerTblBody');
    notificationTblBody.innerHTML = '';

    // Render all notifications in the list
    currentNotificationList.forEach(notification => {
        notificationTblBody.innerHTML += renderNotificationRow(notification);
    });
}

// Function to sort the table by the selected column
function sortTable(column) {
    // Toggle sort direction
    sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';

    // Sort the notifications based on the column
    currentNotificationList.sort((a, b) => {
        let valueA = a[column];
        let valueB = b[column];

        if (typeof valueA === 'string') {
            valueA = valueA.toLowerCase();
            valueB = valueB.toLowerCase();
        }

        if (valueA < valueB) {
            return sortDirection === 'asc' ? -1 : 1;
        }
        if (valueA > valueB) {
            return sortDirection === 'asc' ? 1 : -1;
        }
        return 0;
    });

    // Render the sorted table
    renderNotificationTable();

    // Update the sort indicators
    updateSortIndicators(column);
}

// Function to update the sort indicator for the sorted column
function updateSortIndicators(column) {
    // Reset all sort indicators
    document.querySelectorAll('.sort-indicator').forEach(indicator => {
        indicator.classList.remove('sort-asc', 'sort-desc');
        indicator.style.opacity = '0.5';
    });

    // Update the selected column indicator
    const indicator = document.getElementById(`sort-${column}`);
    indicator.classList.add(sortDirection === 'asc' ? 'sort-asc' : 'sort-desc');
    indicator.style.opacity = '1';
}

// Function to view details of a notification (placeholder)
function viewDetails(notificationId) {
    alert("View details for notification ID: " + notificationId);
}

// Call this function to load the table when the page is ready
document.addEventListener('DOMContentLoaded', loadNotificationTable);
