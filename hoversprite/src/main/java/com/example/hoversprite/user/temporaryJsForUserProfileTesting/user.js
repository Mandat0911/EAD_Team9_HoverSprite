async function loadUserTable() {
    doneMsgLbl.style.display = "none";
    
    let response = await sendHttpRequest(USER_SERVICE_URL_ALL_USERS);
    let userList = await response.json();

    currentCustomerList = userList;
    renderUserTable(currentPage);  // Load the first page
    renderPagination();            // Render the pagination controls
}

async function createUser() {
    let fullName = document.querySelector("#fullName").value;
    let email = document.querySelector("#email").value;
    let mobile = document.querySelector("#mobile").value;
    let address = document.querySelector("#address").value;

    if (fullName.trim() && email.trim()) {
        let newUser = {
            fullName: fullName,
            email: email,
            phoneNumber: mobile,
            address: address
        };

        let response = await sendHttpRequest(USER_SERVICE_URL, "POST", JSON.stringify(newUser));

        if (response.status == 200) {
            doneMsgLbl.style.display = "block";
            loadUserTable();
            hideModal();  // Close the modal if using one
        }
    }
}

async function updateUser() {
    let fullName = document.querySelector("#fullName").value;
    let email = document.querySelector("#email").value;
    let mobile = document.querySelector("#mobile").value;
    let address = document.querySelector("#address").value;

    if (fullName.trim() && email.trim()) {
        let updatedUser = {
            fullName: fullName,
            email: email,
            phoneNumber: mobile,
            address: address
        };

        let response = await sendHttpRequest(`${USER_SERVICE_URL}/${currentUserId}`, "PUT", JSON.stringify(updatedUser));

        if (response.status == 200) {
            doneMsgLbl.style.display = "block";
            loadUserTable();
            hideModal();  // Close the modal
        }
    }
}

async function deleteUser(userId) {
    let response = await sendHttpRequest(`${USER_SERVICE_URL}/${userId}`, "DELETE");
    
    if (response.status == 200) {
        loadUserTable();  // Refresh the table after deletion
    }
}

function confirmDeleteUser(userId) {
    if (confirm("Are you sure you want to delete this user?")) {
        deleteUser(userId);  // Call delete function if confirmed
    }
}
async function sendHttpRequest(url, method = "GET", body = null) {
    const options = {
        method: method,
        headers: {
            "Content-Type": "application/json"
        },
        body: body
    };

    if (method === "GET" || method === "DELETE") {
        delete options.body;  // No need for a body on GET or DELETE requests
    }

    let response = await fetch(url, options);
    return response;
}

function renderUserTable(page) {
    let userTblBody = document.getElementById('userTblBody');
    userTblBody.innerHTML = '';

    const startIndex = (page - 1) * usersPerPage;
    const endIndex = startIndex + usersPerPage;
    const usersOnPage = currentCustomerList.slice(startIndex, endIndex);

    usersOnPage.forEach(user => {
        userTblBody.innerHTML += renderUserRow(user);
    });
}
function loadUser(userId) {
    currentUserId = userId;
    let user = currentCustomerList.find(user => user.id === userId);

    if (user) {
        document.querySelector("#fullName").value = user.fullName;
        document.querySelector("#email").value = user.email;
        document.querySelector("#mobile").value = user.phoneNumber;
        document.querySelector("#address").value = user.address;
    }

    $('#userModal').modal('show');  // Show the modal when loading the user data
}

