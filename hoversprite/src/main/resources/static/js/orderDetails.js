// mock data for list of all sprayers (fetch all sprayers from backend here)
const allSprayers = [
    { name: 'Nguyen Van B', type: 'Adept', available: true },
    { name: 'Tran Van C', type: 'Expert', available: false },
    { name: 'Le Van D', type: 'Expert', available: true },
    { name: 'Nguyen Van A', type: 'Apprentice', available: true },
    { name: 'Phan Van E', type: 'Apprentice', available: false }
];
function safeGetElement(id) {
    const element = document.getElementById(id);
    if (!element) {
        console.warn(`Element with id '${id}' not found.`);
    }
    return element;
}
function updateFeedbackSection(status, hasFeedback) {
    const feedbackSection = safeGetElement('feedbackSection');
    const feedbackDisplaySection = document.getElementById('feedbackDisplaySection');

    if (status.toLowerCase() === 'completed') {
        if (hasFeedback) {
            if(feedbackSection){
                feedbackSection.style.display = 'none';
            }

            feedbackDisplaySection.style.display = 'block';
        } else {
            feedbackSection.style.display = 'block';
            feedbackDisplaySection.style.display = 'none';
        }
    } else {
        if(feedBackSection){
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


document.addEventListener('DOMContentLoaded', function() {
    // Get the order ID from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get('id');
    let currentUserId;

    // Fetch order details
    fetch(`/api/orders/${orderId}`)
        .then(response => response.json())
        .then(order => {
            // Populate order details
            displayOrderDetails(order);

            // Check if the order status is 'completed' before proceeding with feedback
            if (order.status.toLowerCase() === 'completed') {
                return fetchExistingFeedback(orderId).then(existingFeedback => {
                    return { order, existingFeedback };
                });
            } else {
                updateFeedbackSection(order.status, false);
                return { order, existingFeedback: null };
            }
        })
        .then(({ order, existingFeedback }) => {
            if (existingFeedback) {
                // Feedback exists, display it
                displayFeedback(existingFeedback);
            } else if (order.status.toLowerCase() === 'completed') {
                // No feedback exists and order is completed, show the feedback form
                document.getElementById('feedbackSection').style.display = 'block';
            }
        })
        .catch(error => console.error('Error fetching order details:', error));
    function displayOrderDetails(order) {
        document.getElementById('orderNumber').textContent = `Order #${order.orderId}`;
        document.getElementById('orderStatus').textContent = order.status;
        document.getElementById('orderStatus').classList.add(`bg-${getStatusColor(order.status)}`);

        document.getElementById('farmerName').textContent = order.user.lastName + " " + order.user.middleName + " " + order.user.firstName;
        document.getElementById('farmerPhone').textContent = order.user.phone;
        document.getElementById('farmerAddress').textContent = order.user.address;

        document.getElementById('cropType').textContent = order.cropType;
        document.getElementById('farmlandArea').textContent = `${order.farmlandArea} decare`;
        document.getElementById('gregorian-date').textContent = formatDate(order.gregorianDate);
        document.getElementById('lunar-date').textContent = formatDate(order.lunarDate);
        document.getElementById('timeSlot').textContent = order.time;

        // Update total cost in the payment section
        document.getElementById('totalCost').textContent = `${order.totalCost.toLocaleString()} VND`;
    }
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

        return { isValid, errorMessages };
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
        feedbackForm.addEventListener('submit', function(event) {
            event.preventDefault();
            clearErrorMessages();

            const { isValid, errorMessages } = validateFeedbackForm();

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
        additionalFeedbackField.addEventListener('input', function() {
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
        if(feedbackSection){
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
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

// Helper function to get status color
function getStatusColor(status) {
    switch(status.toLowerCase()) {
        case 'completed': return 'success';
        case 'pending': return 'warning';
        case 'cancelled': return 'danger';
        case 'confirmed': return 'primary';
        default: return 'secondary';
    }
}