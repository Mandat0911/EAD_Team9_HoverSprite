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
});
