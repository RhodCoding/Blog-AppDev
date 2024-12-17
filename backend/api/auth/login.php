<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../../config/database.php';
include_once '../../models/User.php';
include_once '../../config/Response.php';
include_once '../../config/JwtHandler.php';

// Get database connection
$database = new Database();
$db = $database->getConnection();

// Initialize user object
$user = new User($db);

// Get posted data
$data = json_decode(file_get_contents("php://input"));

// Validate input
if (empty($data->email) || empty($data->password)) {
    Response::json(false, "Missing required fields", null, 400);
}

// Set user properties
$user->email = $data->email;
$user->password = $data->password;

// Attempt login
if ($user->login()) {
    // Generate JWT token
    $jwt = new JwtHandler();
    $token = $jwt->generateToken($user->id, $user->username, $user->role);

    $userData = [
        "id" => $user->id,
        "username" => $user->username,
        "email" => $user->email,
        "role" => $user->role,
        "token" => $token
    ];
    Response::json(true, "Login successful", $userData);
} else {
    Response::json(false, "Invalid email or password", null, 401);
}
