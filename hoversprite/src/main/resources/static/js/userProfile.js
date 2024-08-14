function logout() {
    alert('Logged out');
}

function updateInfo() {
    const fullName = document.getElementById('fullName').value;
    const email = document.getElementById('email').value;
    const mobile = document.getElementById('mobile').value;
    const address = document.getElementById('address').value;

    // Add your update logic here
    alert('Information updated: ' + fullName + ', ' + email + ', ' + mobile + ', ' + address);
}