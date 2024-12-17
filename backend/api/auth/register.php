<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../../config/database.php';
include_once '../../models/User.php';
include_once '../../config/Response.php';

// Get database connection
$database = new Database();
$db = $database->getConnection();

// Initialize user object
$user = new User($db);

// Get posted data
$data = json_decode(file_get_contents("php://input"));

// Validate input
if (empty($data->username) || empty($data->email) || empty($data->password)) {
    Response::json(false, "Missing required fields", null, 400);
}

// Set user properties
$user->username = $data->username;
$user->email = $data->email;
$user->password = $data->password;

// Create user
try {
    if ($user->create()) {
        $userData = [
            "id" => $db->lastInsertId(),
            "username" => $user->username,
            "email" => $user->email,
            "role" => $user->role
        ];
        Response::json(true, "User registered successfully", $userData, 201);
    } else {
        Response::json(false, "Unable to register user", null, 500);
    }
} catch (PDOException $e) {
    if ($e->getCode() == 23000) { // Duplicate entry error
        Response::json(false, "Email already exists", null, 409);
    } else {
        Response::json(false, "Database error: " . $e->getMessage(), null, 500);
    }
}
