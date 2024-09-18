document.addEventListener("DOMContentLoaded", () => {
    const nextBtns = document.querySelectorAll(".btn-next");
    const backBtns = document.querySelectorAll(".btn-back");
    const formSteps = document.querySelectorAll(".form-step");
    const progressSteps = document.querySelectorAll(".progress-bar");
    const firstBoxContainer = document.querySelector(".box-container:first-child");
    const secondBoxContainer = document.querySelector(".box-container:nth-child(2)");

    let formStepNum = 0;

    nextBtns.forEach((btn, index) => {
        btn.addEventListener("click", (e) => {
            if (index === 0 && !validateStep1()) {
                e.preventDefault();  // Prevent going to the next step if Step 1 is invalid
            } else if (index === 1 && !validateStep2()) {
                e.preventDefault();  // Prevent going to the next step if Step 2 is invalid
            } else {
            // if (formStepNum < formSteps.length - 1 && validateForm()) {
            // if (formStepNum < formSteps.length) {
                formStepNum++;
                updateFormSteps();
                updateProgressBar();
                if (formStepNum === formSteps.length - 1) {
                    firstBoxContainer.classList.add("slide-left");
                    secondBoxContainer.classList.remove("d-none");
                    setTimeout(() => {
                        secondBoxContainer.classList.add("slide-in");
                    }, 10);
                }
            }
        });
    });

    backBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
            if (formStepNum > 0) {
                formStepNum--;
                updateFormSteps();
                updateProgressBar();
                if (formStepNum < formSteps.length - 1) {
                    firstBoxContainer.classList.remove("slide-left");
                    secondBoxContainer.classList.remove("slide-in");
                    secondBoxContainer.classList.add("d-none");
                }
            }
        });
    });

    function updateFormSteps() {
        formSteps.forEach((formStep, index) => {
            if (index === formStepNum) {
                formStep.classList.add("form-step-active");
            } else {
                formStep.classList.remove("form-step-active");
            }
        });
    }

    function updateProgressBar() {
        progressSteps.forEach((progressStep, index) => {
            if (index === formStepNum) {
                progressStep.classList.add('progress-bar-active');
            } else {
                progressStep.classList.remove('progress-bar-active');
            }
        });
    }
    
    const paymentOptions = document.getElementsByName('payment');
    const creditCardForm = document.querySelector('.credit-card-form-wrapper');
    const creditCardInputs = creditCardForm.querySelectorAll('input');

    paymentOptions.forEach(option => {
        option.addEventListener('change', function () {
            if (this.value === 'Credit / Debit Card') {
                // Show the credit card form
                creditCardForm.classList.remove('slide-out-left');
                creditCardForm.classList.add('slide-in-left');
                creditCardForm.style.display = 'block'; 
                requireCreditCardInputs(true);
            } else {
                // Hide the credit card form 
                creditCardForm.classList.remove('slide-in-left');
                creditCardForm.classList.add('slide-out-left');

                setTimeout(() => {
                    creditCardForm.style.display = 'none';
                }, 500);
                requireCreditCardInputs(false);
            }
        });
    });

    // Function to toggle the "required" attribute for credit card inputs
    function requireCreditCardInputs(require) {
        creditCardInputs.forEach(input => {
            if (require) {
                input.setAttribute('required', 'required');
            } else {
                input.removeAttribute('required');
            }
        });
    }
});

/* FORM VALIDATION */
const inputsStep1 = {
    name: document.getElementById('name'),
    email: document.getElementById('email'),
    phone: document.getElementById('phone'),
    address: document.getElementById('address'),
    name: document.getElementById('name'),
    email: document.getElementById('email'),
    phone: document.getElementById('phone'),
    address: document.getElementById('address'),
    area: document.getElementById('area'),
};

const inputsStep2 = {
    datePicker: document.getElementById('datePicker')
};

const inputsStep3 = {
    cardName: document.getElementById('card_name'),
    cardNumber: document.getElementById('card_number'),
    expiryDate: document.getElementById('expiry_date'),
    cvv: document.getElementById('cvv')
};

function validateStep1() {
    let isValid = true;

    // Validate each field
    isValid = validateField(inputsStep1.name, isValidName) && isValid;
    isValid = validateField(inputsStep1.email, isValidEmail) && isValid;
    isValid = validateField(inputsStep1.phone, isValidPhone) && isValid;
    isValid = validateField(inputsStep1.address, isValidAddress) && isValid;
    isValid = validateField(inputsStep1.name, isValidName) && isValid;
    isValid = validateField(inputsStep1.email, isValidEmail) && isValid;
    isValid = validateField(inputsStep1.phone, isValidPhone) && isValid;
    isValid = validateField(inputsStep1.address, isValidAddress) && isValid;
    isValid = validateField(inputsStep1.area, isValidArea) && isValid;
    return isValid;
}

function validateStep2() {
    let isValid = true;

    isValid = validateField(inputsStep2.datePicker, isValidDatePicker) && isValid;
    isValid = validateTimeSlot() && isValid;

    return isValid;
}

function validateStep3() {
    let isValid = true;

    isValid = validateField(inputsStep3.cardName, isValidName) && isValid;
    isValid = validateField(inputsStep3.cardNumber, isValidCardNumber) && isValid;
    isValid = validateField(inputsStep3.expiryDate, isValidExpiryDate) && isValid;
    isValid = validateField(inputsStep3.cvv, isValidCVV) && isValid;

    return isValid;
}

function validateField(field, validationFunction) {
    // const value = field.value.trim();
    const value = field ? field.value.trim() : '';
    const isValid = validationFunction(value);

    if (!isValid) {
        showError(field);
    } else {
        hideError(field);
    }

    return isValid;
}

let previouslySelectedTimeSlotButton = null;
let selectedTimeSlot = null;

function validateTimeSlot() {
    const errorMessage = document.getElementById('invalid-time-slot');
    if (!previouslySelectedTimeSlotButton) {
        errorMessage.classList.remove('d-none');
        errorMessage.classList.add('d-block');
        return false;
    } else {
        errorMessage.classList.add('d-none');
        errorMessage.classList.remove('d-block');
        return true;
    }
}

function showError(field) {
    field.classList.add('is-invalid');
    const parent = field.closest('.input-group');
    let errorMessage = parent.querySelector('.invalid-feedback');

    if (!errorMessage) {
        const div = document.createElement('div');
        div.className = 'invalid-feedback d-block';

        // Custom message for datePicker
        if (field.id === 'datePicker') {
            div.textContent = 'Please enter a valid date OR select from the calendar.';
        } else {
            div.textContent = `Please enter a valid ${field.id}.`;
        }
        parent.appendChild(div);
    }
}

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
function isValidArea(area) {
    const areaValue = parseFloat(area);
    return !isNaN(areaValue) && areaValue > 0;
}

function isValidDatePicker(date) {
    const dateRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
    return dateRegex.test(date);  
}
// Add real-time validation
Object.values(inputsStep1).forEach(input => {
    input.addEventListener('blur', function() {
        validateField(this, eval(`isValid${this.id.charAt(0).toUpperCase() + this.id.slice(1)}`));
    });
});

