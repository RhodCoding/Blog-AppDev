<?php
include_once __DIR__ . '/../config/JwtHandler.php';
include_once __DIR__ . '/../config/Response.php';

class AuthMiddleware {
    private $jwt;

    public function __construct() {
        $this->jwt = new JwtHandler();
    }

    public function validateToken() {
        $headers = getallheaders();
        
        // Check if Authorization header exists
        if (!isset($headers['Authorization'])) {
            Response::json(false, "Authorization header not found", null, 401);
        }

        $authHeader = $headers['Authorization'];
        
        // Check if token format is valid
        if (substr($authHeader, 0, 7) !== 'Bearer ') {
            Response::json(false, "Invalid token format", null, 401);
        }

        // Extract token
        $token = substr($authHeader, 7);
        
        // Validate token
        $userData = $this->jwt->validateToken($token);
        if (!$userData) {
            Response::json(false, "Invalid or expired token", null, 401);
        }

        return $userData;
    }

    public function requireRole($requiredRole) {
        $userData = $this->validateToken();
        
        if ($userData['role'] !== $requiredRole && $userData['role'] !== 'admin') {
            Response::json(false, "Insufficient permissions", null, 403);
        }

        return $userData;
    }
}
