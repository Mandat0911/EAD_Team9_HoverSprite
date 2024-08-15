document.addEventListener("DOMContentLoaded", () => {
    const nextBtns = document.querySelectorAll(".btn-next");
    const backBtns = document.querySelectorAll(".btn-back");
    const formSteps = document.querySelectorAll(".form-step");
    const progressSteps = document.querySelectorAll(".progress-bar");
    const firstBoxContainer = document.querySelector(".box-container:first-child");
    const secondBoxContainer = document.querySelector(".box-container:nth-child(2)");

    let formStepNum = 0;

    nextBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
            if (formStepNum < formSteps.length - 1) {
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
