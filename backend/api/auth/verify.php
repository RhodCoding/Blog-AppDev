<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../../middleware/AuthMiddleware.php';

// Initialize auth middleware
$auth = new AuthMiddleware();

try {
    // Validate token and get user data
    $userData = $auth->validateToken();
    
    // Return user data if token is valid
    Response::json(true, "Token is valid", [
        "id" => $userData['userId'],
        "username" => $userData['username'],
        "role" => $userData['role']
    ]);
} catch (Exception $e) {
    Response::json(false, "Invalid token", null, 401);
}
