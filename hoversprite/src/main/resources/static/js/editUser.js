/* FORM VALIDATION */
const inputsUpdateForm = {
    phone: document.getElementById('phone'),
    firstName: document.getElementById('firstName'),
    middleName: document.getElementById('middleName'),
    lastName: document.getElementById('lastName'),
    email: document.getElementById('email'),
    address: document.getElementById('address'),
};

// Function to validate the update form
function validateUpdateForm() {
    let isValid = true;

    // Validate each field
    isValid = validateField(inputsUpdateForm.phone, isValidPhone) && isValid;
    isValid = validateField(inputsUpdateForm.firstName, isValidName) && isValid;
    isValid = validateField(inputsUpdateForm.middleName, isValidName) && isValid;
    isValid = validateField(inputsUpdateForm.lastName, isValidName) && isValid;
    isValid = validateField(inputsUpdateForm.email, isValidEmail) && isValid;
    isValid = validateField(inputsUpdateForm.address, isValidAddress) && isValid;

    return isValid;
}

// Function to validate individual fields
function validateField(field, validationFunction) {
    const value = field ? field.value.trim() : '';
    const isValid = validationFunction(value);

    if (!isValid) {
        showError(field);
    } else {
        hideError(field);
    }

    return isValid;
}

// Show error messages
function showError(field) {
    field.classList.add('is-invalid');
    const parent = field.closest('.input-group');
    let errorMessage = parent.querySelector('.invalid-feedback');

    if (!errorMessage) {
        const div = document.createElement('div');
        div.className = 'invalid-feedback d-block';
        div.textContent = `Please enter a valid ${field.name}.`;
        parent.appendChild(div);
    }
}

// Hide error messages
function hideError(field) {
    field.classList.remove('is-invalid');
    const parent = field.closest('.input-group');
    const errorMessage = parent.querySelector('.invalid-feedback');
    if (errorMessage) {
        errorMessage.remove();
    }
}

// Validation functions
function isValidName(name) {
    return name.length >= 2;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.(com|vn)$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^(0|\+84)[0-9\s]{9,10}$/;
    return phoneRegex.test(phone);
}

function isValidAddress(address) {
    return address.length >= 5;
}

// Add real-time validation on blur for each field
Object.values(inputsUpdateForm).forEach(input => {
    input.addEventListener('blur', function() {
        validateField(this, eval(`isValid${this.id.charAt(0).toUpperCase() + this.id.slice(1)}`));
    });
});

// Form submission event
document.getElementById('booking-form').addEventListener('submit', function(event) {
    if (!validateUpdateForm()) {
        event.preventDefault(); // Prevent form submission if validation fails
    }
});
