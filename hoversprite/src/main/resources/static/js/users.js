const HOST_URL = "http://localhost:8080";
const USER_SERVICE_URL = `${HOST_URL}/users`;
const USER_SERVICE_URL_ALL_USERS = `${USER_SERVICE_URL}/all`;

function renderUserRow(user) {
    return `
        <tr id="userRow${user.id}">
            <th scope="row">${user.id}</th>
            <td>${user.lastName} ${user.middleName} ${user.firstName}</td>
            <td>${user.email}</td>
            <td>${user.phone}</td>
            <td>${user.address}</td>
        </tr>
    `
}

async function loadUserTable() {
    // Get User Data
    let userResponse = await sendHttpRequest(USER_SERVICE_URL_ALL_USERS);

    console.log(userResponse);

    let userData = await userResponse;
            
    // Re-render the User Table
    let userTableBody = document.getElementById('userTableBody');
    
    userTableBody.innerHTML = '';

    userData.forEach(user => {
        userTableBody.innerHTML += renderUserRow(user);
    });
}

async function sendHttpRequest(url, method = 'GET', toJson = true, body = null) {
    let headers = {
        'Content-Type': 'application/json'
    };

    let response = await fetch(url, {
        method: method,
        headers: headers,
        body: body
    })

    if (toJson) {
        return response.json();
    } else {
        return response;
    }
}

loadUserTable();