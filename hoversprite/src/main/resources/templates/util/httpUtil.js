// Update order status and handle notifications
async function updateOrderStatus(orderId, newStatus) {
    try {
        // Update the order status via PUT request
        let response = await fetch(`/orders/${orderId}/status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status: newStatus })
        });

        // Check response status
        if (response.status === 200) {
            // Notify the user about the successful update
            alert('Order status updated successfully!');

            // Update the UI to reflect the new status
            document.getElementById(`order-status-${orderId}`).innerText = newStatus;
            
            // Fetch and update notifications
            await fetchNotifications();
        } else {
            // Handle error response
            alert('Failed to update order status. Please try again.');
        }
    } catch (error) {
        console.error('Error updating order status:', error);
        alert('An error occurred while updating the order status.');
    }
}

// Function to fetch notifications
async function fetchNotifications() {
    try {
        let response = await fetch('/notifications');
        if (response.ok) {
            let notifications = await response.json();
            updateNotificationBox(notifications);
        } else {
            console.error('Failed to fetch notifications');
        }
    } catch (error) {
        console.error('Error fetching notifications:', error);
    }
}

// Function to update notification box
function updateNotificationBox(notifications) {
    const notificationBox = document.getElementById('notification-box');
    notificationBox.innerHTML = ''; // Clear existing notifications

    notifications.forEach(notification => {
        const notificationElement = document.createElement('div');
        notificationElement.classList.add('notification');
        notificationElement.innerText = notification.message;
        notificationBox.appendChild(notificationElement);
    });
}
