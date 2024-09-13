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

    paymentOptions.forEach(option => {
        option.addEventListener('change', function () {
            if (this.value === 'Credit / Debit Card') {
                // Show the credit card form
                creditCardForm.classList.remove('slide-out-left');
                creditCardForm.classList.add('slide-in-left');
                creditCardForm.style.display = 'block'; 
            } else {
                // Hide the credit card form 
                creditCardForm.classList.remove('slide-in-left');
                creditCardForm.classList.add('slide-out-left');

                setTimeout(() => {
                    creditCardForm.style.display = 'none';
                }, 500);
            }
        });
    });
});

/* FORM VALIDATION */
const inputsStep1 = {
    name: document.getElementById('name'),
    email: document.getElementById('email'),
    phone: document.getElementById('phone'),
    address: document.getElementById('address'),
    area: document.getElementById('area'),
};

const inputsStep2 = {
    datePicker: document.getElementById('datePicker'),
};

function validateStep1() {
    let isValid = true;

    // Validate each field
    isValid = validateField(inputsStep1.name, isValidName) && isValid;
    isValid = validateField(inputsStep1.email, isValidEmail) && isValid;
    isValid = validateField(inputsStep1.phone, isValidPhone) && isValid;
    isValid = validateField(inputsStep1.address, isValidAddress) && isValid;
    isValid = validateField(inputsStep1.area, isValidArea) && isValid;
    return isValid;
}

function validateStep2() {
    let isValid = true;

    // Validate date picker in Step 2
    isValid = validateField(inputsStep2.datePicker, isValidDatePicker) && isValid;

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


/* UPDATE ORDER DETAILS SUMMARY */
const cropTypeInput = document.getElementById('crop-type');
const areaInput = document.getElementById('area');
const unitPrice = 30000; // Unit price per decare

let cropType;
let area;
let total;

// Summary fields
const summaryCropType = document.getElementById('summary-crop-type');
const summaryArea = document.getElementById('summary-area');
const summaryTotal = document.getElementById('summary-total');

function updateDetailsSummary() {
    cropType = cropTypeInput.value;
    area = parseFloat(areaInput.value);
    total = unitPrice * area;

    summaryCropType.textContent = cropType;
    summaryArea.textContent = `${area} decare`;
    summaryTotal.textContent = `${total.toLocaleString()} VND`;
}

// Update the summary whenever the inputs change
cropTypeInput.addEventListener('change', updateDetailsSummary);
areaInput.addEventListener('input', updateDetailsSummary);

// Call updateDetailsSummary on page load to set the initial values
updateDetailsSummary();

/* DATE PICKER */
const datepicker = document.querySelector(".datepicker");
const dateInput = document.querySelector(".date-input");
const yearInput = datepicker.querySelector(".year-input");
const monthInput = datepicker.querySelector(".month-input");
const cancelBtn = datepicker.querySelector(".cancel");
const applyBtn = datepicker.querySelector(".apply");
const nextBtn = datepicker.querySelector(".next");
const prevBtn = datepicker.querySelector(".prev");
const dates = datepicker.querySelector(".dates");

let selectedDate = new Date();
let year = selectedDate.getFullYear();
let month = selectedDate.getMonth();
let isLunar = false;

// Show datepicker
dateInput.addEventListener("click", () => {
    isLunar = false;
    datepicker.hidden = false;
});

// Hide datepicker
cancelBtn.addEventListener("click", () => {
  datepicker.hidden = true;
});

// Function to validate and update datepicker based on manual input
const validateDateInput = () => {
  const regex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
  const inputValue = dateInput.value;

  if (regex.test(inputValue)) {
    const [day, month, year] = inputValue.split("/").map(Number);

    // Set the selected date based on the user input
    selectedDate = new Date(year, month - 1, day);
    updateDatepicker(); // Update the datepicker UI
    dateInput.classList.remove("invalid");
  } else {
    dateInput.classList.add("invalid");
  }
};

// Event listener for manual date input
// (automatically add slashes '/' when typing)
dateInput.addEventListener('input', function(e) {
    let input = dateInput.value;
    
    input = input.replace(/\D/g, '');

    // Format the value into dd/mm/yyyy as the user types
    if (input.length >= 3 && input.length <= 4) {
        input = input.replace(/(\d{2})(\d+)/, '$1/$2'); // Add slash after day
    } else if (input.length >= 5) {
        input = input.replace(/(\d{2})(\d{2})(\d+)/, '$1/$2/$3'); // Add slash after day and month
    }

    dateInput.value = input;

    validateDateInput();
});


// Handle apply button click event
applyBtn.addEventListener("click", () => {
  // Check if the input is valid before applying
  validateDateInput();

  if (!dateInput.classList.contains("invalid")) {
    // dateInput.value = selectedDate.toLocaleDateString("en-GB", {
    //   year: "numeric",
    //   month: "2-digit",
    //   day: "2-digit",
    // });
    updateDateInput();

    datepicker.hidden = true;
    // updateDateSummary();
  }
});

// Handle next month navigation
nextBtn.addEventListener("click", () => {
  if (month === 11) year++;
  month = (month + 1) % 12;
  displayDates();
});

// Handle previous month navigation
prevBtn.addEventListener("click", () => {
  if (month === 0) year--;
  month = (month - 1 + 12) % 12;
  displayDates();
});

// Handle month input change event
monthInput.addEventListener("change", () => {
  month = monthInput.selectedIndex;
  displayDates();
});

// Handle year input change event
yearInput.addEventListener("change", () => {
  year = yearInput.value;
  displayDates();
});

// Update year and month inputs
const updateYearMonth = () => {
  monthInput.selectedIndex = month;
  yearInput.value = year;
};

// Update the datepicker UI to reflect the selected date
const updateDatepicker = () => {
  year = selectedDate.getFullYear();
  month = selectedDate.getMonth();
  displayDates();
};

// Handle date click event
const handleDateClick = (e) => {
  const button = e.target;

  // Remove the 'selected' class from other buttons
  const selected = dates.querySelector(".selected");
  selected && selected.classList.remove("selected");

  // Add the 'selected' class to the current button
  button.classList.add("selected");

  // Set the selected date
  selectedDate = new Date(year, month, parseInt(button.textContent));
  updateDateInput(); // Update the input field with the selected date
};

// Update the input field to reflect the selected date
const updateDateInput = () => {
  dateInput.value = selectedDate.toLocaleDateString("en-GB", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  updateDateSummary();
};

// Render the dates in the calendar interface
const displayDates = () => {
  // Update year & month whenever the dates are updated
  updateYearMonth();

  // Clear the dates
  dates.innerHTML = "";

  // Display the last week of the previous month
  const lastOfPrevMonth = new Date(year, month, 0);
  for (let i = 0; i <= lastOfPrevMonth.getDay(); i++) {
    const text = lastOfPrevMonth.getDate() - lastOfPrevMonth.getDay() + i;
    const button = createButton(text, true, -1);
    dates.appendChild(button);
  }

  // Display the current month
  const lastOfMonth = new Date(year, month + 1, 0);
  for (let i = 1; i <= lastOfMonth.getDate(); i++) {
    const button = createButton(i, false);
    button.addEventListener("click", handleDateClick);
    dates.appendChild(button);
  }

  // Display the first week of the next month
  const firstOfNextMonth = new Date(year, month + 1, 1);
  for (let i = firstOfNextMonth.getDay(); i < 7; i++) {
    const text = firstOfNextMonth.getDate() - firstOfNextMonth.getDay() + i;
    const button = createButton(text, true, 1);
    dates.appendChild(button);
  }
};

// Create a button for each date
const createButton = (text, isDisabled = false, type = 0) => {
  const currentDate = new Date();
  let comparisonDate = new Date(year, month + type, text);

  // Check if the current button is the date today
  const isToday =
    currentDate.getDate() === text &&
    currentDate.getFullYear() === year &&
    currentDate.getMonth() === month;

  // Check if the current button is selected
  const selected = selectedDate.getTime() === comparisonDate.getTime();

  const button = document.createElement("button");
  button.textContent = text;
  button.disabled = isDisabled;
  button.type = "button";
  button.classList.toggle("today", isToday);
  button.classList.toggle("selected", selected);
  return button;
};
const convertBtn = datepicker.querySelector(".convert-to-lunar");

// Convert solar date to lunar date
const convertToLunar = () => {
  const solarDate = selectedDate;
  
  // Convert to lunar using the Lunar object from lunar-javascript
  const lunar = Lunar.fromDate(solarDate);
  const lunarDay = String(lunar.getDay()).padStart(2, '0');
  const lunarMonth = String(lunar.getMonth()).padStart(2, '0');

  // Format the lunar date
  const lunarDateStr = `${lunarDay}/${lunarMonth}/${lunar.getYear()}`;
  
  // Display the lunar date in the input field
  dateInput.value = lunarDateStr;
  datepicker.hidden = true;
};

convertBtn.addEventListener("click", () => {
    convertToLunar();
    isLunar = true;
    updateDateSummary(); // Update the order summary after lunar conversion
});

displayDates();


/* UPDATE DATE & TIME IN ORDER SUMMARY */
const timeSlots = document.querySelectorAll('input[name="timePicker"]');

// Summary elements
const summaryGregDate = document.getElementById('summary-greg-date');
const summaryLunarDate = document.getElementById('summary-lunar-date');
const summaryTime = document.getElementById('summary-time');

let selectedTimeSlot;

function updateTimeSummary() {
    selectedTimeSlot = document.querySelector('input[name="timePicker"]:checked').value;
    summaryTime.textContent = selectedTimeSlot;
};

let gregorianDate;
let lunarDate;

function updateDateSummary() {
    if (!isLunar) {
        // gregorianDate = dateInput.value;
        const [day, month, year] = dateInput.value.split('/').map(Number);
        gregorianDate = new Date(year, month - 1, day);

        // Convert the Gregorian date to Lunar
        const lunar = Lunar.fromDate(selectedDate);
        // const lunarDay = String(lunar.getDay()).padStart(2, '0');
        // const lunarMonth = String(lunar.getMonth()).padStart(2, '0');
        // lunarDate = `${lunarDay}/${lunarMonth}/${lunar.getYear()}`;
        lunarDate = new Date(lunar.getYear(), lunar.getMonth() - 1, lunar.getDay());
    } else {
        gregorianDate = selectedDate;
        // lunarDate = dateInput.value;
        const [day, month, year] = dateInput.value.split('/').map(Number);
        lunarDate = new Date(year, month - 1, day);
    }
    summaryGregDate.textContent = gregorianDate.toLocaleDateString("en-GB", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    });
    summaryLunarDate.textContent = lunarDate.toLocaleDateString("en-GB", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    });
};

// Event listeners for time slot changes
timeSlots.forEach(timeSlot => {
    timeSlot.addEventListener('change', updateTimeSummary);
});

updateTimeSummary();
updateDateSummary();

document.getElementById('booking-form').addEventListener('submit', async function (e) {
    e.preventDefault();  // Prevent default form submission

    // Fetch user ID from session
    const userId = document.getElementById('user-id').value;

    const order = {
        user: {
            id: parseInt(userId), 
        },
        cropType: cropType,
        farmlandArea: parseInt(area),
        time: selectedTimeSlot,
        gregorianDate: gregorianDate,
        lunarDate: lunarDate,
        totalCost: total,
        status: 'PENDING', 
        createdAt: new Date(),
        updatedAt: new Date()
    };

    // Send the order to the backend
    try {
        const response = await fetch('/api/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(order),
        });

        if (response.ok) {
            const data = await response.json();
            alert('Order created successfully!');
            // Redirect or update the UI
            window.location.href = '/orders';
        } else {
            const errorData = await response.json();  // Get error response data
            console.log('Error details:', errorData);
            alert('Failed to create order.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while creating the order.');
    }
});