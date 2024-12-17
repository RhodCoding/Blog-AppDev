<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Include configuration files
include_once 'config/Response.php';

// Get the requested endpoint
$request_uri = $_SERVER['REQUEST_URI'];
$path = parse_url($request_uri, PHP_URL_PATH);
$path = ltrim($path, '/');
$segments = explode('/', $path);

// Remove 'api' from the beginning if present
if ($segments[0] === 'api') {
    array_shift($segments);
}

// Route the request
if (count($segments) >= 2) {
    $controller = $segments[0];
    $action = $segments[1];
    
    switch ($controller) {
        case 'auth':
            switch ($action) {
                case 'register':
                    require_once 'api/auth/register.php';
                    break;
                case 'login':
                    require_once 'api/auth/login.php';
                    break;
                case 'verify':
                    require_once 'api/auth/verify.php';
                    break;
                default:
                    Response::json(false, "Invalid auth endpoint", null, 404);
            }
            break;
            
        default:
            Response::json(false, "Invalid endpoint", null, 404);
    }
} else {
    // API documentation
    $api_docs = [
        'name' => 'Blog Platform API',
        'version' => '1.0.0',
        'endpoints' => [
            'auth' => [
                'POST /api/auth/register' => 'Register a new user',
                'POST /api/auth/login' => 'Login user',
                'GET /api/auth/verify' => 'Verify JWT token and get user info'
            ]
        ]
    ];
    
    Response::json(true, "Blog Platform API", $api_docs);
}
