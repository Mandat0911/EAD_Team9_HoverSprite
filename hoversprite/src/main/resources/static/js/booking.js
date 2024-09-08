document.addEventListener("DOMContentLoaded", () => {
    const nextBtns = document.querySelectorAll(".btn-next");
    const backBtns = document.querySelectorAll(".btn-back");
    const formSteps = document.querySelectorAll(".form-step");
    const progressSteps = document.querySelectorAll(".progress-bar");
    const firstBoxContainer = document.querySelector(".box-container:first-child");
    const secondBoxContainer = document.querySelector(".box-container:nth-child(2)");
    const form = document.querySelector('form');
    const inputs = {
        name: document.getElementById('name'),
        email: document.getElementById('email'),
        phone: document.getElementById('phone'),
        address: document.getElementById('address'),
        area: document.getElementById('area')
    };

    let formStepNum = 0;

    nextBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
            if (formStepNum < formSteps.length - 1 && validateForm()) {
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
    function validateForm() {
        let isValid = true;

        // Validate each field
        isValid = validateField(inputs.name, isValidName) && isValid;
        isValid = validateField(inputs.email, isValidEmail) && isValid;
        isValid = validateField(inputs.phone, isValidPhone) && isValid;
        isValid = validateField(inputs.address, isValidAddress) && isValid;
        isValid = validateField(inputs.area, isValidArea) && isValid;
        return isValid;
    }

    function validateField(field, validationFunction) {
        const value = field.value.trim();
        const isValid = validationFunction(value);

        if (!isValid) {
            showError(field);
        } else {
            hideError(field);
        }

        return isValid;
    }

    function showError(field) {
        field.classList.add('is-invalid');
        const errorMessage = field.nextElementSibling;
        if (!errorMessage || !errorMessage.classList.contains('invalid-feedback')) {
            const div = document.createElement('div');
            div.className = 'invalid-feedback';
            div.textContent = `Please enter a valid ${field.id}`;
            field.parentNode.insertBefore(div, field.nextSibling);
        }
    }

    function hideError(field) {
        field.classList.remove('is-invalid');
        const errorMessage = field.nextElementSibling;
        if (errorMessage && errorMessage.classList.contains('invalid-feedback')) {
            errorMessage.remove();
        }
    }

    // Validation functions
    function isValidName(name) {
        return name.length >= 2;
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function isValidPhone(phone) {
        const phoneRegex = /^\d{10}$/;
        return phoneRegex.test(phone);
    }

    function isValidAddress(address) {
        return address.length >= 5;
    }
    function isValidArea(area) {
        const areaValue = parseFloat(area);
        return !isNaN(areaValue) && areaValue > 0;
    }
    // Add real-time validation
    Object.values(inputs).forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this, eval(`isValid${this.id.charAt(0).toUpperCase() + this.id.slice(1)}`));
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

    // DateTimePicker Initialization
    const datePicker = document.querySelector('#date-picker');
    const calendarContainer = document.querySelector('.calendar-container');

    datePicker.addEventListener('change', () => {
        const selectedDate = new Date(datePicker.value);
        generateCalendar(selectedDate);
    });

    function generateCalendar(selectedDate) {
        const daysOfWeek = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
        const lunarDates = ['1', '2', '3', '4', '5', '6', '7']; // Placeholder for Lunar dates
        const calendarRowHeaders = calendarContainer.querySelectorAll('.header-cell');
        const calendarRows = calendarContainer.querySelectorAll('.calendar-row');

        // Update the Date Header
        for (let i = 0; i < 7; i++) {
            const currentDay = new Date(selectedDate);
            currentDay.setDate(selectedDate.getDate() + i);
            const gregorianDate = currentDay.getDate();
            const dayName = daysOfWeek[currentDay.getDay()];

            calendarRowHeaders[i].innerHTML = `${dayName}<br>${gregorianDate}<br><small>${lunarDates[i]}</small>`;
        }

        // Handle Selection of Time Slots
        calendarRows.forEach((row, rowIndex) => {
            const buttons = row.querySelectorAll('.select-btn');

            buttons.forEach((button, buttonIndex) => {
                button.classList.remove('selected');
                button.classList.add('available');
                button.removeAttribute('disabled');

                button.addEventListener('click', function () {
                    // Reset other selections
                    const allButtons = calendarContainer.querySelectorAll('.select-btn');
                    allButtons.forEach(btn => {
                        btn.classList.remove('selected');
                        btn.classList.add('available');
                    });

                    // Select the clicked button
                    button.classList.add('selected');
                    button.classList.remove('available');
                });
            });
        });
    }

    // Initialize the calendar on load with the current date
    generateCalendar(new Date());
});
