const signUp = document.querySelector("#signUp");
const signIn = document.querySelector("#signIn");
const passwordIcon = document.querySelectorAll('.password__icon')
const authPassword = document.querySelectorAll('.auth__password')
const toggleBtn = document.querySelector("#themeToggleButton")

// when click sign up button
signUp.addEventListener('click', () => {
    document.querySelector('.login__form').classList.remove('active')
    document.querySelector('.register__form').classList.add('active')
   
});

// when click sign in button
signIn.addEventListener('click', () => {
    document.querySelector('.login__form').classList.add('active')
    document.querySelector('.register__form').classList.remove('active')
    
});

// change hidden password to visible password
for (var i = 0; i < passwordIcon.length; ++i) {
    passwordIcon[i].addEventListener('click', (i) => {
        const lastArray = i.target.classList.length - 1
        if (i.target.classList[lastArray] == 'bi-eye-slash') {
            i.target.classList.remove('bi-eye-slash')
            i.target.classList.add('bi-eye')
            i.currentTarget.parentNode.querySelector('input').type = 'text'
        } else {
            i.target.classList.add('bi-eye-slash')
            i.target.classList.remove('bi-eye')
            i.currentTarget.parentNode.querySelector('input').type = 'password'
        }
    });
}

// Function to update the full name display
function updateFullName() {
    const lastName = document.querySelector('#lastname').value.trim();
    const middleName = document.querySelector('#middlename').value.trim();
    const firstName = document.querySelector('#firstname').value.trim();
    
    const fullName = `  ${lastName} ${middleName} ${firstName}`.trim();
    document.querySelector('#full-name-display').textContent = fullName;
}

// Add event listeners to each input field
document.querySelector('#lastname').addEventListener('input', updateFullName);
document.querySelector('#middlename').addEventListener('input', updateFullName);
document.querySelector('#firstname').addEventListener('input', updateFullName);

// Function to check if passwords match 

function checkPasswordMatch() {
    const submitBtn = document.querySelector('#submit-btn');
    let password = document.querySelector('#register_password').value;
    let confirmPassword = document.querySelector('#confirm-password').value;
    let passwordMatchMessage = document.querySelector('#password-match-message');

    if(password.length != 0){
        if(password == confirmPassword){
            passwordMatchMessage.textContent = "Password match";
            passwordMatchMessage.style.color = "#5ce65c";
            submitBtn.disabled = false;
            
        }else{
            passwordMatchMessage.textContent = "Password don't match";
            passwordMatchMessage.style.color = "#c91b00";
            submitBtn.disabled = true;
        }
    }
}

// Add event listeners for real-time password confirmation
document.querySelector('#register_password').addEventListener('input', checkPasswordMatch);
document.querySelector('#confirm-password').addEventListener('input', checkPasswordMatch);


document.getElementById('login_username').addEventListener('blur', function() {
    const usernameField = document.getElementById('login_username');
    const usernameValue = usernameField.value.trim();

    // Regular expressions
    const isNumeric = /^\d+$/; // Matches only digits
    const isPhone = /^(0|\+84)\d{9,10}$/; // Matches Vietnamese phone numbers
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Matches email addresses

    if (isNumeric.test(usernameValue)) {
        console.log('Input is a number.');
        // Additional logic for numeric input (e.g., phone number)
        if (isPhone.test(usernameValue)) {
            usernameField.setCustomValidity("");
        } else {
            usernameField.setCustomValidity("Invalid phone number format. Must start with 0 or +84 and be followed by 9 or 10 digits.");
        }
    } else if (isEmail.test(usernameValue)) {
        console.log('Input is an email address.');
        usernameField.setCustomValidity(""); // Valid email, no errors
    } else {
        console.log('Input is a text string but not a valid email.');
        usernameField.setCustomValidity("Please enter a valid email address or phone number.");
    }
});


document.getElementById('login_password', 'register_password').addEventListener('input', function() {
    const passwordField = document.getElementById('login_password', 'register_password');
    const passwordValue = passwordField.value.trim();

    // Check if the password meets the required pattern
    const passwordPattern = /^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/;
    
    if (!passwordPattern.test(passwordValue)) {
        passwordField.setCustomValidity("Password must contain at least one capital letter, one special character, and be at least 8 characters long.");
    } else {
        passwordField.setCustomValidity("");
    }
});
