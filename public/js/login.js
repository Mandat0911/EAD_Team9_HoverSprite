//  Switch login and register interface
const signUp = document.querySelector("#signUp");
const signIn = document.querySelector("#signIn");
const passwordIcon = document.querySelectorAll('.password__icon');
const authPassword = document.querySelectorAll('.auth__password');
// const toggleBtn = document.querySelector("#themeToggleButton")

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

/*--------------------------Generate Password for Register----------------------*/

const passwordLength = 12;
const includeLowerCase = true;
const includeUpperCase = true;
const includeSymbols = true;
const includeLNumber = true;
const generateIcon = document.querySelector(".generate_icon");

function generateRandomPassword(length, lowerCase, upperCase, symbol, number) {
    const lowerCaseChars = "abcdefghijklmnopqrstuvwxyz";
    const upperCaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numberChars = "0123456789";
    const symbolChars = "!@#$%^&*()+><.?/";

    let availableChars ="";
    let password ="";

    availableChars += lowerCase ? lowerCaseChars : "";
    availableChars += upperCase ? upperCaseChars : "";
    availableChars += number ? numberChars : "";
    availableChars += symbol ? symbolChars : "";

    if(length <= 0){
        return (`Password should be more than 1 charater!`);
    }
    if(availableChars.length === 0){
        window.alert("Please set True at least 1 condition!");
    }

    for(let i = 0; i < length; i++){
        const randomIndex = Math.floor(Math.random() * availableChars.length);
        password += availableChars[randomIndex];
    }
    return password;
}

function suggesPassword(){
    const password = generateRandomPassword(passwordLength, includeLowerCase, includeUpperCase, includeSymbols, includeLNumber);
    const autoPassword = document.querySelector("#res_password");
    autoPassword.value = password;
}

generateIcon.addEventListener("click", event => {
    suggesPassword();
})