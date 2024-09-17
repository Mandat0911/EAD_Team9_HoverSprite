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

/* DATE PICKER (MONTH CALENDAR) */
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
// let isLunar = false;

// Show datepicker
dateInput.addEventListener("click", () => {
    // isLunar = false;
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
        updateDateInput();

        datepicker.hidden = true;
        handleCalendarUpdates();
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

    // Check if the date is in the past or is today
    const isPastOrToday = comparisonDate <= currentDate;

    // Check if the current button is selected
    const selected = selectedDate.getTime() === comparisonDate.getTime();

    const button = document.createElement("button");
    button.textContent = text;
    button.disabled = isDisabled || isPastOrToday;
    button.type = "button";
    button.classList.toggle("today", isToday);
    button.classList.toggle("selected", selected);
    return button;
};
// const convertBtn = datepicker.querySelector(".convert-to-lunar");

// Convert solar date to lunar date
// const convertToLunar = () => {
//   const solarDate = selectedDate;

//   // Convert to lunar using the Lunar object from lunar-javascript
//   const lunar = Lunar.fromDate(solarDate);
//   const lunarDay = String(lunar.getDay()).padStart(2, '0');
//   const lunarMonth = String(lunar.getMonth()).padStart(2, '0');

//   // Format the lunar date
//   const lunarDateStr = `${lunarDay}/${lunarMonth}/${lunar.getYear()}`;

//   // Display the lunar date in the input field
//   dateInput.value = lunarDateStr;
//   datepicker.hidden = true;
// };

// convertBtn.addEventListener("click", () => {
//     convertToLunar();
//     isLunar = true;
//     updateDateSummary(); // Update the order summary after lunar conversion
// });

displayDates();

/* TIME SLOT PICKER (WEEK CALENDAR) */
const weekCalendarContainer = document.getElementById('week-calendar-container');
const days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
const timeSlots = ['4:00', '5:00', '6:00', '7:00', '16:00', '17:00'];

// Function to manage calendar updates after date selection
function handleCalendarUpdates() {
    updateWeekCalendar();
    // highlightSelectedDay();
    renderWeekCalendarCells();
}

// Helper function to get the Monday of the week based on the selected date
function getMonday(date) {
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday (0)
    return new Date(date.setDate(diff));
}

// Function to update the week calendar
function updateWeekCalendar() {
    if (weekCalendarContainer.classList.contains('d-none')) {
        weekCalendarContainer.classList.remove('d-none');
        weekCalendarContainer.classList.add('fade-in'); // Add animation
    }

    const weekStart = getMonday(new Date(selectedDate)); // Get the Monday of the selected week

    days.forEach((dayId, index) => {
        const currentDate = new Date(weekStart);
        currentDate.setDate(weekStart.getDate() + index);

        // Update Gregorian date
        const gregorianDateEl = document.getElementById(dayId).querySelector('.gregorian-date');
        gregorianDateEl.textContent = `${currentDate.getDate()}/${currentDate.getMonth() + 1}`;

        // Convert to Lunar date (you already have Lunar.js or similar)
        const lunar = Lunar.fromDate(currentDate);
        const lunarDateEl = document.getElementById(dayId).querySelector('.lunar-date');
        lunarDateEl.textContent = `${lunar.getDay()}/${lunar.getMonth()}`;

    });
}

// Example backend data for available slots per time slot (fetch this dynamically from your API)
// const availableSlots = {
//     'mon': { '4:00': 2, '5:00': 1, '6:00': 1, '7:00': 2, '16:00': 2, '17:00': 2},
//     'tue': { '4:00': 1, '5:00': 2, '6:00': 2, '7:00': 1, '16:00': 2, '17:00': 2},
//     'wed': { '4:00': 0, '5:00': 0, '6:00': 2, '7:00': 1, '16:00': 2, '17:00': 2},
//     'thu': { '4:00': 2, '5:00': 2, '6:00': 2, '7:00': 0, '16:00': 2, '17:00': 2},
//     'fri': { '4:00': 2, '5:00': 1, '6:00': 0, '7:00': 2, '16:00': 2, '17:00': 2},
//     'sat': { '4:00': 0, '5:00': 2, '6:00': 2, '7:00': 2, '16:00': 2, '17:00': 2},
//     'sun': { '4:00': 1, '5:00': 2, '6:00': 1, '7:00': 1, '16:00': 2, '17:00': 2}
// };


// Function to fetch available slots from the backend
async function fetchAvailableSlotsForDate(weekStart) {
    // Initialize the availableSlots object for the week
    let availableSlots = {};

    // Loop through each day in the week
    for (let i = 0; i < days.length; i++) {
        const currentDay = new Date(weekStart);
        currentDay.setDate(weekStart.getDate() + i + 1);

        const formattedDate = currentDay.toISOString().split('T')[0]; // Convert to yyyy-mm-dd format
        availableSlots[days[i]] = {};  // Initialize day slot in availableSlots

        // Fetch available slots for each time slot from the backend
        for (const timeSlot of timeSlots) {
            const formattedTimeSlot = `${timeSlot} - ${parseInt(timeSlot) + 1}:00`;
            // console.log(`Requesting availability for Date: ${formattedDate}, Time: ${formattedTimeSlot}`);

            try {
                // Using GET method for checking availability
                const availabilityResponse = await fetch(`/api/timeslot/availability?date=${formattedDate}&time=${formattedTimeSlot}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });

                // Parse the response data
                const data = await availabilityResponse.json();
                // console.log(`Response for Date: ${formattedDate}, Time: ${formattedTimeSlot} -> Available Slots: ${data}`);

                // Store the available sessions in the correct day and time slot
                availableSlots[days[i]][timeSlot] = data;

            } catch (error) {
                console.error(`Failed to fetch timeslot for ${formattedDate} at ${timeSlot}`, error);
                // Default to 2 sessions if there's an error
                availableSlots[days[i]][timeSlot] = 2;
            }
        }
    }
    console.log("Final Available Slots for the Week:", availableSlots);  // Log the final availableSlots object
    // Return the structured available slots object
    return availableSlots;
}


// Function to render available slots in week calendar cell
async function renderWeekCalendarCells() {

    const weekStart = getMonday(selectedDate); // Get the start of the week from the selected date
    let availableSlots = await fetchAvailableSlotsForDate(weekStart); // Fetch slots from the backend

    // Clear the existing calendar content
    const calendarRows = document.querySelectorAll('.calendar-row:not(.header-row)');
    calendarRows.forEach(row => row.remove()); // Remove each row without touching the header

    timeSlots.forEach(timeSlot => {
        // Create a new row for each time slot
        const row = document.createElement('div');
        row.classList.add('calendar-row');

        // Create and append the time cell (leftmost column)
        const timeCell = document.createElement('div');
        timeCell.classList.add('calendar-cell', 'time-cell');
        timeCell.textContent = timeSlot; // Set the time slot text (e.g., '4:00')
        row.appendChild(timeCell); // Append the time cell to the row

        // For each day of the week
        days.forEach(dayId => {
            // Create a cell for each day (Monday to Sunday)
            const cell = document.createElement('div');
            cell.classList.add('calendar-cell');

            // Get the number of available slots for the given day and time slot
            const available = availableSlots[dayId][timeSlot];

            // Create the button element inside the cell
            const button = createSlotButton(available, dayId, timeSlot);

            // Append the button to the cell
            cell.appendChild(button);

            // Append the day cell to the row
            row.appendChild(cell);
        });

        // Append the entire row (with time cell + 7 day cells) to the week calendar container
        document.getElementById('week-calendar-container').appendChild(row);

        // Add a separation row after morning sessions
        if (timeSlot === '7:00') {
            const separationRow = document.createElement('div');
            separationRow.classList.add('calendar-row', 'separation-row');

            // Create the separation cells (empty row)
            const timeSeparator = document.createElement('div');
            timeSeparator.classList.add('calendar-cell', 'time-cell');
            timeSeparator.textContent = '--';
            separationRow.appendChild(timeSeparator); // Append separator for time cell

            days.forEach(() => {
                const emptyCell = document.createElement('div');
                emptyCell.classList.add('calendar-cell');
                separationRow.appendChild(emptyCell); // Append empty cells for each day
            });

            document.getElementById('week-calendar-container').appendChild(separationRow);
        }
    });
}

const createSlotButton = (availableSlots, dayId, timeSlot) => {
    const button = document.createElement('button');
    button.classList.add('select-btn');
    button.type = 'button';

    if (availableSlots > 0) {
        button.textContent = `${availableSlots} slot${availableSlots > 1 ? 's' : ''}`;
        button.classList.add('available');
    } else {
        button.textContent = '0 slot';
        button.classList.add('unavailable');
        button.disabled = true;
    }

    // Store the available slots in a data attribute for resetting later
    button.dataset.available = availableSlots;

    // Add the click handler for the slot selection
    if (availableSlots > 0) {
        button.addEventListener('click', () => handleSlotSelection(button, dayId, timeSlot));
    }

    return button;
};

// Function to highlight the selected day's column in the week calendar
function highlightSelectedDay() {
    let selectedDayIndex = selectedDate.getDay(); // 0 = Sunday, 1 = Monday, etc.

    // Since our calendar starts on Monday, we need to remap the days
    const dayMapping = [6, 0, 1, 2, 3, 4, 5]; // Mapping Sunday to index 6, Monday to index 0, etc.
    selectedDayIndex = dayMapping[selectedDayIndex];

    // Clear previous highlights
    document.querySelectorAll('.highlight').forEach(cell => {
        cell.classList.remove('highlight');
    });

    // Highlight the column for the selected day
    days.forEach((dayId, index) => {
        if (index === selectedDayIndex) {
            // // Highlight time slot cells + header for the selected day
            // const headerCell = document.getElementById(dayId);  // This highlights the header
            // headerCell.classList.add('highlight');

            // Highlight time slot cells
            const cells = document.querySelectorAll(`.calendar-row .calendar-cell:nth-child(${index + 2})`); // Adjusted index + 2 to skip the time column
            cells.forEach(cell => cell.classList.add('highlight'));
        }
    });
}

// let previouslySelectedTimeSlotButton = null;
let selectedTimeSlot = null;

// Function to handle the "Select" button click
function handleSlotSelection(button, dayId, timeSlot) {

    // If there was a previously selected button, reset it
    if (previouslySelectedTimeSlotButton) {
        previouslySelectedTimeSlotButton.classList.add('available');
        previouslySelectedTimeSlotButton.classList.remove('selected');
        previouslySelectedTimeSlotButton.textContent = `${previouslySelectedTimeSlotButton.dataset.available} slot${previouslySelectedTimeSlotButton.dataset.available > 1 ? 's' : ''}`;
        previouslySelectedTimeSlotButton.disabled = false; // Re-enable the button
    }

    // Update the current button to selected state
    button.classList.remove('available');
    button.classList.add('selected');
    button.textContent = "Selected";
    button.disabled = true; // Disable the selected button

    // Store the current button as the newly selected button
    previouslySelectedTimeSlotButton = button;

    // Update the selectedTimeSlot
    selectedTimeSlot = `${timeSlot} - ${parseInt(timeSlot) + 1}:00`;  // Example format: "4:00 - 5:00"

    // Get the day index for the selected day (starting from Monday)
    const dayIndex = days.indexOf(dayId);

    // Calculate the new date based on the clicked day
    const weekStart = getMonday(selectedDate); // Get the Monday of the selected week
    selectedDate = new Date(weekStart); // Reset selectedDate to Monday of the week
    selectedDate.setDate(weekStart.getDate() + dayIndex); // Adjust it to the clicked day

    // Now that selectedDate is updated, reflect the change
    updateDateInput(); // Update the input field
    highlightSelectedDay(); // Highlight the selected day in the week calendar
    displayDates(); // Update the calendar popup with the selected date highlighted
    updateTimeSummary();
}

/* UPDATE DATE & TIME IN ORDER SUMMARY */

// Summary elements
const summaryGregDate = document.getElementById('summary-greg-date');
const summaryLunarDate = document.getElementById('summary-lunar-date');
const summaryTime = document.getElementById('summary-time');


function updateTimeSummary() {
    if (selectedTimeSlot) {
        summaryTime.textContent = selectedTimeSlot;
    }
};

let gregorianDate;
let lunarDate;

function updateDateSummary() {
    // if (!isLunar) {
    // gregorianDate = dateInput.value;
    const [day, month, year] = dateInput.value.split('/').map(Number);
    gregorianDate = new Date(year, month - 1, day);

    // Convert the Gregorian date to Lunar
    const lunar = Lunar.fromDate(selectedDate);
    lunarDate = new Date(lunar.getYear(), lunar.getMonth() - 1, lunar.getDay());
    // } else {
    //     gregorianDate = selectedDate;
    //     // lunarDate = dateInput.value;
    //     const [day, month, year] = dateInput.value.split('/').map(Number);
    //     lunarDate = new Date(year, month - 1, day);
    // }
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
        const orderResponse = await fetch('/api/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(order)
        });

        if (orderResponse.ok) {
            const data = await orderResponse.json();
            alert('Order created successfully!');

            // Send a request to create or update the Timeslot
            await createOrUpdateTimeslot();

            // Redirect to orders list
            window.location.href = '/orders';
        } else {
            const errorData = await orderResponse.json();  // Get error response data
            if (errorData.message === 'No available sessions for the selected time slot.') {
                alert('The selected time slot is fully booked. Please choose another slot.');
            } else {
                alert('Failed to create order.');
                console.log('Error details:', errorData);
            }
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while creating the order.');
    }
});

// Function to create or update the Timeslot after the order is created
async function createOrUpdateTimeslot() {
    const timeslot = {
        gregorianDate: gregorianDate,
        time: selectedTimeSlot
    };

    try {
        const timeslotResponse = await fetch('/api/timeslot', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(timeslot)
        });

        if (timeslotResponse.ok) {
            console.log("Creating/Updating Timeslot for Date:", gregorianDate, "Time:", selectedTimeSlot);
        } else {
            console.error('Failed to create or update timeslot');

        }
    } catch (error) {
        console.error('Error creating/updating timeslot:', error);
    }
}
