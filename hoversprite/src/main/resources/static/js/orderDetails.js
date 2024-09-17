let allSprayers = [];
let apprenticeAdded = false;
let sprayerToRemove = null;

let sprayersToAssign = [];
function safeGetElement(id) {
    const element = document.getElementById(id);
    if (!element) {
        console.warn(`Element with id '${id}' not found.`);
    }
    return element;
}

const addSprayerButton = safeGetElement('addSprayerButton');
const sprayerSelectContainer = safeGetElement('sprayerSelectContainer');
const sprayerSelect = safeGetElement('sprayerSelect');
const sprayerError = safeGetElement('sprayerError');
const noSprayerMessage = safeGetElement('noSprayerMessage');
const assignedSprayerContainer = safeGetElement('assignedSprayerContainer');

// Function to update the sprayer select dropdown
function updateSprayerDropdown() {
    if (sprayerSelect) {
        sprayerSelect.innerHTML = '<option value="">Select a sprayer</option>';
        allSprayers.forEach(sprayer => {
            const option = document.createElement('option');
            option.value = JSON.stringify(sprayer);
            const fullName = sprayer.user.lastName + " " + sprayer.user.middleName + " " + sprayer.user.firstName;
            option.textContent = `${fullName} (${sprayer.level})`;

            if (!sprayer.available || (apprenticeAdded && sprayer.level === 'Apprentice')) {
                option.disabled = true;
            }

            sprayerSelect.appendChild(option);
        });
    }
}

function assignSprayerToOrder(orderId, sprayerId) {
// Function to handle Add Sprayer Button Click
if(addSprayerButton) {
    addSprayerButton.addEventListener('click', function() {
        // If the select container is hidden, show it with animation
        if (sprayerSelectContainer.classList.contains('d-none')) {
            sprayerSelectContainer.classList.remove('d-none');
            sprayerSelectContainer.classList.add('fade-in'); // Add animation
        }
        // If the select container is visible, and a sprayer is selected, add the sprayer
        else {
            // const selectedSprayerText = sprayerSelect.options[sprayerSelect.selectedIndex].text;
            const selectedSprayerValue = sprayerSelect.value;

            if (selectedSprayerValue !== "") {
                // Show confirmation modal before adding sprayer
                const addSprayerConfirmationModal = new bootstrap.Modal(document.getElementById('addSprayerConfirmationModal'));
                addSprayerConfirmationModal.show();
            }
        }
    });
}

// Function to handle showing or hiding the 'no sprayer assigned' message, and other UI changes
function handleSprayerState() {
    if(sprayerError && addSprayerButton && noSprayerMessage) {
        // If there are no sprayers assigned, show the "no sprayer" message and reset apprentice state
        if (assignedSprayerContainer.childElementCount === 0) {
            noSprayerMessage.classList.remove('d-none');
            sprayerError.textContent = 'Please assign at least one sprayer to this order.';
            sprayerError.classList.remove('d-none');
            addSprayerButton.disabled = false;
            apprenticeAdded = false;
        } else {
            // Hide "no sprayer" message
            noSprayerMessage.classList.add('d-none');

            // Check if there's an apprentice in the assigned sprayers
            const hasApprentice = Array.from(assignedSprayerContainer.children).some(sprayerDiv => {
                return sprayerDiv.querySelector('h6').textContent === 'Apprentice';
            });

            // Check if there's an Adept or Expert in the assigned sprayers
            const hasAdeptOrExpert = Array.from(assignedSprayerContainer.children).some(sprayerDiv => {
                const type = sprayerDiv.querySelector('h6').textContent;
                return type === 'Adept' || type === 'Expert';
            });

            if (hasApprentice && !hasAdeptOrExpert) {
                sprayerError.classList.remove('d-none');
                sprayerError.textContent = 'An Adept or Expert sprayer is required when assigning an Apprentice.';
                apprenticeAdded = true;
                updateSprayerDropdown(); // Disable apprentice options
                addSprayerButton.disabled = false;
            } else {
                sprayerError.classList.add('d-none');
                addSprayerButton.disabled = true; // Disable adding more sprayers
            }
        }
    }
}

// Function to add a sprayer and handle the removal
function addSprayerToContainer(sprayerText) {

    // Add the selected sprayer to the assigned list
    const newSprayerDiv = document.createElement('div');
    newSprayerDiv.classList.add('new-sprayer-div', 'd-flex', 'flex-row', 'justify-content-between', 'align-items-center', 'my-2');
    newSprayerDiv.innerHTML = `
    <div class="d-flex flex-row align-items-center">
        <button class="btn btn-danger btn-sm remove-sprayer-btn">
            <i class="fa-solid fa-minus"></i>
        </button>
        <h5 class="m-0">${sprayerText.split('(')[0]}</h5>
    </div>
    <div class="badge bg-secondary">
        <h6 class="m-0">${sprayerText.split('(')[1].replace(')', '')}</h6>
    </div>
    `;
    assignedSprayerContainer.appendChild(newSprayerDiv);

    // Attach event listener to the remove button (minus icon)
    newSprayerDiv.querySelector('.remove-sprayer-btn').addEventListener('click', function () {
        sprayerToRemove = newSprayerDiv; // Store the sprayer to remove
        const removeSprayerConfirmationModal = new bootstrap.Modal(document.getElementById('removeSprayerConfirmationModal'));
        removeSprayerConfirmationModal.show(); // Show the remove confirmation modal
    });

    // Hide the select container and reset it
    sprayerSelectContainer.classList.add('d-none');
    sprayerSelectContainer.classList.remove('fade-in');
    sprayerSelect.value = ""; // Reset select box

    // Update the state after adding the sprayer
    handleSprayerState();
}

 // Handle the confirmation button click inside the modal
 document.getElementById('confirmAddSprayer').addEventListener('click', function () {
    const selectedSprayerText = sprayerSelect.options[sprayerSelect.selectedIndex].text;
    const selectedSprayerValue = sprayerSelect.value;

    if (selectedSprayerValue !== "") {
        addSprayerToContainer(selectedSprayerText);

        // Hide the confirmation modal for adding sprayer
        const addSprayerConfirmationModal = bootstrap.Modal.getInstance(document.getElementById('addSprayerConfirmationModal'));
        addSprayerConfirmationModal.hide();
    }
});

// Handle the confirmation button click inside the modal for removing sprayer
document.getElementById('confirmRemoveSprayer').addEventListener('click', function () {
    if (sprayerToRemove) {
        assignedSprayerContainer.removeChild(sprayerToRemove);
        sprayerToRemove = null; // Reset after removing

        // Recheck and update UI after removing a sprayer
        handleSprayerState();

        // Hide the remove confirmation modal
        const removeSprayerConfirmationModal = bootstrap.Modal.getInstance(document.getElementById('removeSprayerConfirmationModal'));
        removeSprayerConfirmationModal.hide();
    }
});

handleSprayerState();
updateSprayerDropdown();

function assignSprayerToOrder(orderId, sprayerId, sprayerName) {
    fetch(`/api/orders/${orderId}/assign-sprayer/${sprayerId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to assign sprayer to order');
            }
            return response.text();
        })
        .then(data => {
            console.log(data); // Log success message

            // Create notification for the sprayer
            const notificationData = {
                userId: sprayerId,
                message: `New order assigned: Order #${orderId}`,
                orderId: orderId
            };

            return createNotification(notificationData);
        })
        .then(createdNotification => {
            console.log('Notification sent to sprayer:', createdNotification);
        })
        .catch(error => {
            console.error('Error:', error);
            sprayerError.textContent = 'Failed to assign sprayer to order or send notification. Please try again.';
            sprayerError.classList.remove('d-none');
        });
}


function fetchSprayers() {
    fetch('/api/sprayers')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            allSprayers = data;
            updateSprayerDropdown();
        })
        .catch(error => {
            console.error('Error fetching sprayers:', error);
            sprayerError.textContent = 'Error loading sprayers. Please try again later.';
            sprayerError.classList.remove('d-none');
        });
}

//function to create notifications
function createNotification(notificationData) {
    return fetch('/api/notifications', {  // Adjust the URL if needed
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(notificationData)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to create notification');
            }
            return response.json();
        })
        .then(createdNotification => {
            console.log('Notification created successfully:', createdNotification);
            return createdNotification;
        })
        .catch(error => {
            console.error('Error creating notification:', error);
            throw error;
        });
}


const totalCost = 150000; // example total cost
const receiveAmountInput = safeGetElement('receiveAmount');
const changeContainer = safeGetElement('changeContainer');
const changeAmount = safeGetElement('changeAmount');

// Listen for input changes in the received amount
if (receiveAmountInput) {
    receiveAmountInput.addEventListener('input', function () {
        const receiveAmount = parseInt(receiveAmountInput.value);

        if (isNaN(receiveAmount) || receiveAmount < 0) {
            changeContainer.classList.add('d-none');
            return;
        }

        if (receiveAmount >= totalCost) {
            // Calculate the change
            const change = receiveAmount - totalCost;
            changeAmount.textContent = change.toLocaleString() + ' VND';
            changeContainer.classList.remove('d-none');
        } else {
            changeContainer.classList.add('d-none');
        }
    });
}

function updateFeedbackSection(status, hasFeedback) {
    const feedbackSection = safeGetElement('feedbackSection');
    const feedbackDisplaySection = document.getElementById('feedbackDisplaySection');

    if (status.toLowerCase() === 'completed') {
        if (hasFeedback) {
            if (feedbackSection) {
                feedbackSection.style.display = 'none';
            }

            feedbackDisplaySection.style.display = 'block';
        } else {
            feedbackSection.style.display = 'block';
            feedbackDisplaySection.style.display = 'none';
        }
    } else {
        if (feedbackSection) {
            feedbackSection.style.display = 'none';
        }
        feedbackDisplaySection.style.display = 'none';
    }
}

function fetchExistingFeedback(orderId) {
    console.log(`Checking feedback for order ID: ${orderId}`);
    return fetch(`/api/feedback/order/${orderId}`)
        .then(response => {
            if (response.status === 404) {
                console.log(`No feedback found for order ID: ${orderId}`);
                return null; // Feedback doesn't exist
            }
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log(`Feedback data for order ID ${orderId}:`, data);
            return data;
        })
        .catch(error => {
            console.error('Error fetching feedback:', error);
            return null;
        });
}


document.addEventListener('DOMContentLoaded', function () {
    // Get the order ID from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get('id');
    let currentUserId;
    const cancelOrderButton = safeGetElement('cancelOrderButton');
    const confirmOrderButton = safeGetElement('confirmOrderButton');
    const statusUpdateButtons = safeGetElement('statusUpdateButtons');
    fetchSprayers();

    function updateOrderStatus(newStatus) {
        // Fetch the current order details first
        fetch(`/api/orders/${orderId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch order details');
                }
                return response.json();
            })
            .then(currentOrder => {
                // Update the status in the order object
                currentOrder.status = newStatus;
                console.log(currentOrder);
                // Send the updated order object to the server
                return fetch(`/api/orders/${orderId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(currentOrder)
                });
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to update order status');
                }
                return response.json();
            })
            .then(updatedOrder => {
                // Create a notification for the status update
                const notificationData = {
                    message: `Order #${orderId} status updated to ${newStatus}`,
                    userId: updatedOrder.user.id, // Assuming the order has a userId field
                    orderId: orderId
                };

                return createNotification(notificationData)
                    .then(() => updatedOrder);
            })
            .then(() => {
                // Immediately reload the page after successful update and notification creation
                location.reload();
            })
            .catch(error => {
                console.error('Error updating order status or creating notification:', error);
                alert('Failed to update order status. Please try again.');
            });
    }

    if (cancelOrderButton) {
        cancelOrderButton.addEventListener('click', function () {
            if (confirm('Are you sure you want to cancel this order?')) {
                updateOrderStatus('CANCELLED');
            }
        });
    }

    if (confirmOrderButton) {
        confirmOrderButton.addEventListener('click', function () {
            updateOrderStatus('CONFIRMED');
        });
    }
    // Fetch order details
    fetch(`/api/orders/${orderId}`)
        .then(response => response.json())
        .then(order => {
            // Populate order details
            displayOrderDetails(order);
            // Check if the order status is 'completed' before proceeding with feedback
            if (order.status.toLowerCase() === 'completed') {
                return fetchExistingFeedback(orderId).then(existingFeedback => {
                    return {order, existingFeedback};
                });
            } else {
                updateFeedbackSection(order.status, false);
                return {order, existingFeedback: null};
            }
        })
        .then(({order, existingFeedback}) => {
            if (existingFeedback) {
                // Feedback exists, display it
                displayFeedback(existingFeedback);
            } else if (order.status.toLowerCase() === 'completed') {
                // No feedback exists and order is completed, show the feedback form
                document.getElementById('feedbackSection').style.display = 'block';
            }
        })
        .catch(error => console.error('Error fetching order details:', error));

    function handleAddSprayer() {
        if (sprayerSelectContainer.classList.contains('d-none')) {
            sprayerSelectContainer.classList.remove('d-none');
            sprayerSelectContainer.classList.add('fade-in');
        } else {
            const selectedSprayerValue = sprayerSelect.value;
            if (selectedSprayerValue !== "") {
                const selectedSprayer = JSON.parse(selectedSprayerValue);
                // console.log(selectedSprayer);
                // Call the API to assign the sprayer to the order
                // assignSprayerToOrder(orderId, selectedSprayer.user.id);
                // updateOrderStatus('ASSIGNED');
                const newSprayerDiv = document.createElement('div');
                newSprayerDiv.classList.add('d-flex', 'flex-row', 'justify-content-between', 'align-items-center', 'my-2');
                const fullName = selectedSprayer.user.lastName + " " + selectedSprayer.user.middleName + " " + selectedSprayer.user.firstName;
                newSprayerDiv.innerHTML = `
                <h5 class="m-0">${fullName}</h5>
                <div class="badge bg-secondary">
                    <h6 class="m-0">${selectedSprayer.level}</h6>
                </div>
            `;
                assignedSprayerContainer.appendChild(newSprayerDiv);

                sprayerSelectContainer.classList.add('d-none');
                sprayerSelectContainer.classList.remove('fade-in');
                sprayerSelect.value = "";

                if (selectedSprayer.level === 'Apprentice') {
                    sprayerError.classList.remove('d-none');
                    sprayerError.textContent = 'An Adept or Expert sprayer is required when assigning an Apprentice.';
                    apprenticeAdded = true;
                    updateSprayerDropdown();
                } else {
                    sprayerError.classList.add('d-none');
                    addSprayerButton.disabled = true;
                }
                noSprayerMessage.classList.add('d-none');

                // Update the allSprayers array to mark this sprayer as unavailable
                const sprayerIndex = allSprayers.findIndex(s => s.id === selectedSprayer.id);
                if (sprayerIndex !== -1) {
                    allSprayers[sprayerIndex].available = false;
                }
                updateSprayerDropdown();
            }
        }
    }


    function updateSprayerDisplay(order) {
        const noSprayerMessage = safeGetElement('noSprayerMessage');
        const assignedSprayerContainer = safeGetElement('assignedSprayerContainer');
        const sprayerSection = safeGetElement('sprayerSection');
        const addSprayerButton = safeGetElement('addSprayerButton');
        const sprayerSelectContainer = safeGetElement('sprayerSelectContainer');

        // Clear previous content
        if (assignedSprayerContainer) {
            assignedSprayerContainer.innerHTML = '';
        }

        if ((!order.sprayerIds || order.sprayerIds.length === 0) && order.status.toLowerCase() === 'confirmed') {
            if (noSprayerMessage) {
                noSprayerMessage.classList.remove('d-none');
            }
            // Show add sprayer section when sprayer list is empty
            if (sprayerSection) {
                sprayerSection.classList.remove('d-none');
            }
            if (addSprayerButton) {
                addSprayerButton.onclick = () => {
                    console.log('clicked');
                    if (sprayerSelectContainer) {
                        sprayerSelectContainer.classList.remove('d-none');
                    }
                    handleAddSprayer();
                };
            }
        } else {
            if (noSprayerMessage) {
                noSprayerMessage.classList.add('d-none');
            }
            if (assignedSprayerContainer) {
                assignedSprayerContainer.classList.remove('d-none');
            }
            // Hide add sprayer section when sprayers are assigned
            if (sprayerSection) {
                sprayerSection.classList.add('d-none');
            }

            // Fetch and display assigned sprayers
            const sprayerPromises = order.sprayerIds.map(sprayerId =>
                fetch(`/api/sprayers/${sprayerId}`)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Sprayer not found');
                        }
                        return response.json();
                    })
                    .catch(error => {
                        console.error(`Error fetching sprayer ${sprayerId}:`, error);
                        return null;
                    })
            );

            Promise.all(sprayerPromises).then(sprayers => {
                sprayers.forEach((sprayer, index) => {
                    if (sprayer && assignedSprayerContainer) {
                        console.log(sprayer)
                        const sprayerElement = document.createElement('div');
                        sprayerElement.className = 'd-flex flex-row justify-content-between align-items-center my-2';
                        const fullName = `${sprayer.user.lastName} ${sprayer.user.middleName} ${sprayer.user.firstName}`;
                        sprayerElement.innerHTML = `
                    <h5 class="m-0">${fullName}</h5>
                    <div class="badge bg-secondary">
                        <h6 class="m-0">${sprayer.level}</h6>
                    </div>
                `;
                        assignedSprayerContainer.appendChild(sprayerElement);
                    } else if (assignedSprayerContainer) {
                        const errorElement = document.createElement('div');
                        errorElement.className = 'mb-2 text-danger';
                        errorElement.textContent = `Error loading Sprayer ${index + 1}`;
                        assignedSprayerContainer.appendChild(errorElement);
                    }
                });
            });
        }

        // Return a promise to satisfy the warning
        return Promise.resolve();
    }


    //Function to display detail of order
    function displayOrderDetails(order) {
        document.getElementById('orderNumber').textContent = `Order #${order.orderId}`;
        document.getElementById('orderStatus').textContent = order.status;
        document.getElementById('orderStatus').classList.add(`bg-${getStatusColor(order.status)}`);

        document.getElementById('farmerName').textContent = order.user.lastName + " " + order.user.middleName + " " + order.user.firstName;
        document.getElementById('farmerPhone').textContent = order.user.phone;
        document.getElementById('farmerEmail').textContent = order.user.email;
        document.getElementById('farmerAddress').textContent = order.user.address;

        document.getElementById('cropType').textContent = order.cropType;
        document.getElementById('farmlandArea').textContent = `${order.farmlandArea} decare`;
        document.getElementById('gregorian-date').textContent = formatDate(order.gregorianDate);
        document.getElementById('lunar-date').textContent = formatDate(order.lunarDate);
        document.getElementById('timeSlot').textContent = order.time;

        // Update total cost in the payment section
        document.getElementById('totalCost').textContent = `${order.totalCost.toLocaleString()} VND`;
        if (order.status.toLowerCase() === 'pending') {
            if (statusUpdateButtons) {
                statusUpdateButtons.style.display = 'block';
            }
        } else {
            if (statusUpdateButtons) {
                statusUpdateButtons.style.display = 'none';
            }
        }
        // Show/hide sprayer section based on order status
        const sprayerSection = document.getElementById('sprayerSection');
        // if (order.status.toLowerCase() === 'confirmed') {
        //     sprayerSection.classList.remove('d-none');
        // } else {
        //     sprayerSection.classList.add('d-none');
        // }
        updateSprayerDisplay(order).then(() => {
            console.log('Sprayer display updated');
        });

    }

    //Feedback section
    const feedbackForm = safeGetElement('feedbackSection');
    const feedbackErrorContainer = safeGetElement('feedbackErrorContainer');
    const additionalFeedbackField = safeGetElement('feedback');
    const MAX_FEEDBACK_LENGTH = 100; // Maximum characters allowed for additional feedback

    function validateFeedbackForm() {
        const attentiveness = document.querySelector('input[name="attentive"]:checked');
        const friendliness = document.querySelector('input[name="friendly"]:checked');
        const professionalism = document.querySelector('input[name="professional"]:checked');
        let isValid = true;
        let errorMessages = [];

        if (!attentiveness) {
            isValid = false;
            errorMessages.push('Please rate the sprayer\'s attentiveness.');
        }

        if (!friendliness) {
            isValid = false;
            errorMessages.push('Please rate the sprayer\'s friendliness.');
        }

        if (!professionalism) {
            isValid = false;
            errorMessages.push('Please rate the sprayer\'s professionalism.');
        }

        if (additionalFeedbackField) {
            const additionalFeedback = additionalFeedbackField.value.trim();

            if (additionalFeedback.length === 0) {
                isValid = false;
                errorMessages.push('Please provide additional feedback.');
            } else if (additionalFeedback.length > MAX_FEEDBACK_LENGTH) {
                isValid = false;
                errorMessages.push(`Additional feedback must not exceed ${MAX_FEEDBACK_LENGTH} characters.`);
            }
        } else {
            isValid = false;
            errorMessages.push('Additional feedback field is missing.');
        }

        return {isValid, errorMessages};
    }

    function displayErrorMessages(messages) {
        feedbackErrorContainer.innerHTML = messages.map(msg => `<p class="mb-0">${msg}</p>`).join('');
        feedbackErrorContainer.classList.remove('d-none');
    }

    function clearErrorMessages() {
        feedbackErrorContainer.innerHTML = '';
        feedbackErrorContainer.classList.add('d-none');
    }

    if (feedbackForm) {
        feedbackForm.addEventListener('submit', function (event) {
            event.preventDefault();
            clearErrorMessages();

            const {isValid, errorMessages} = validateFeedbackForm();

            if (!isValid) {
                displayErrorMessages(errorMessages);
                return;
            }

            createFeedback()
                .then(feedback => {
                    console.log('Feedback submitted successfully:', feedback);
                    displayFeedback(feedback);
                    feedbackForm.reset();
                    updateFeedbackSection('completed', true);
                })
                .catch(error => {
                    console.error('Error submitting feedback:', error);
                    displayErrorMessages(['There was an error submitting your feedback. Please try again.']);
                });
        });
    }

    if (additionalFeedbackField) {
        additionalFeedbackField.addEventListener('input', function () {
            const remainingChars = MAX_FEEDBACK_LENGTH - this.value.length;
            const charCountElement = document.getElementById('charCount');
            if (charCountElement) {
                charCountElement.textContent = `${Math.abs(remainingChars)} characters ${remainingChars >= 0 ? 'remaining' : 'over limit'}`;
                if (remainingChars < 0) {
                    charCountElement.classList.add('text-danger');
                    charCountElement.classList.remove('text-muted');
                } else {
                    charCountElement.classList.remove('text-danger');
                    charCountElement.classList.add('text-muted');
                }
            }
        });
    }

    function getUserData() {
        const userDataElement = document.getElementById('userData');
        if (userDataElement) {
            currentUserId = userDataElement.getAttribute('data-user-id');
            console.log(currentUserId);
        }
    }

    function createFeedback() {
        const attentiveness = document.querySelector('input[name="attentive"]:checked').value;
        const friendliness = document.querySelector('input[name="friendly"]:checked').value;
        const professionalism = document.querySelector('input[name="professional"]:checked').value;
        const additionalFeedbackField = document.getElementById('feedback');
        const additionalFeedback = additionalFeedbackField.value.trim();
        getUserData();
        if (!currentUserId) {
            console.error('User ID not available. Please ensure you are logged in.');
            return;
        }
        const feedbackData = {
            orderId: parseInt(orderId),
            userId: currentUserId,
            attentiveRating: parseInt(attentiveness),
            friendlyRating: parseInt(friendliness),
            professionalRating: parseInt(professionalism),
            feedback: additionalFeedback
        };

        return fetch('/api/feedback', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(feedbackData)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            });
    }

    function displayFeedback(feedback) {
        const feedbackDisplaySection = document.getElementById('feedbackDisplaySection');
        const feedbackSection = safeGetElement('feedbackSection');

        // Hide both the feedback form and the display section initially
        if (feedbackSection) {
            feedbackSection.style.display = 'none';
        }
        feedbackDisplaySection.style.display = 'none';

        // If feedback exists, show the display section
        if (feedback) {
            feedbackDisplaySection.style.display = 'block';

            // Display ratings
            displayRating('attentiveRatingDisplay', feedback.attentiveRating);
            displayRating('friendlyRatingDisplay', feedback.friendlyRating);
            displayRating('professionalRatingDisplay', feedback.professionalRating);

            // Display additional feedback
            const additionalFeedbackDisplay = document.getElementById('additionalFeedbackDisplay');
            additionalFeedbackDisplay.textContent = feedback.feedback || 'No additional feedback provided.';
        }
    }

    function displayRating(elementId, rating) {
        const ratingElement = document.getElementById(elementId);
        ratingElement.innerHTML = generateStarRating(rating);
    }

    function generateStarRating(rating) {
        let stars = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                stars += '<span class="star filled">★</span>';
            } else {
                stars += '<span class="star">☆</span>';
            }
        }
        return stars;
    }
});

// Helper function to format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {day: '2-digit', month: '2-digit', year: 'numeric'});
}

// Helper function to get status color
function getStatusColor(status) {
    switch (status.toLowerCase()) {
        case 'completed':
            return 'success';
        case 'pending':
            return 'warning';
        case 'cancelled':
            return 'danger';
        case 'confirmed':
            return 'primary';
        default:
            return 'secondary';
    }
}