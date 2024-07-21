<?php
// Database credentials
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "user";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Retrieve email and password from POST request
$email = $_POST['email'];
$password = $_POST['password'];

// Prepare and bind
$stmt = $conn->prepare("SELECT * FROM registration WHERE email = ? AND password = ?");
$stmt->bind_param("ss", $email, $password);

// Execute the statement
$stmt->execute();

// Store the result
$stmt->store_result();

if ($stmt->num_rows > 0) {
    echo "Login successful!";
} else {
    echo "Invalid email or password.";
}

// Close the statement and connection
$stmt->close();
$conn->close();
?>
