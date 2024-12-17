<?php
class JwtHandler {
    private $secretKey = "your_secret_key_here"; // Change this to a secure secret key
    private $issuedAt;
    private $expire;

    public function __construct() {
        $this->issuedAt = time();
        // Set token to expire in 24 hours
        $this->expire = $this->issuedAt + (24 * 60 * 60);
    }

    public function generateToken($userId, $username, $role) {
        $data = [
            'iat' => $this->issuedAt,    // Issued at
            'exp' => $this->expire,       // Expire
            'data' => [
                'userId' => $userId,
                'username' => $username,
                'role' => $role
            ]
        ];

        return base64_encode(json_encode($data));
    }

    public function validateToken($token) {
        if (empty($token)) {
            return false;
        }

        try {
            $decoded = json_decode(base64_decode($token), true);
            
            // Check if token is expired
            if ($decoded['exp'] < time()) {
                return false;
            }

            return $decoded['data'];
        } catch (Exception $e) {
            return false;
        }
    }
}
