<?php
class User {
    private $conn;
    private $table_name = "users";

    // User properties
    public $id;
    public $username;
    public $email;
    public $password;
    public $role;
    public $created_at;

    // Constructor
    public function __construct($db) {
        $this->conn = $db;
    }

    // Register user
    public function create() {
        $query = "INSERT INTO " . $this->table_name . " 
                (username, email, password, role) 
                VALUES 
                (:username, :email, :password, :role)";

        $stmt = $this->conn->prepare($query);

        // Sanitize input
        $this->username = htmlspecialchars(strip_tags($this->username));
        $this->email = htmlspecialchars(strip_tags($this->email));
        
        // Hash password
        $this->password = password_hash($this->password, PASSWORD_BCRYPT);
        $this->role = "user";

        // Bind parameters
        $stmt->bindParam(":username", $this->username);
        $stmt->bindParam(":email", $this->email);
        $stmt->bindParam(":password", $this->password);
        $stmt->bindParam(":role", $this->role);

        // Execute query
        if($stmt->execute()) {
            return true;
        }
        return false;
    }

    // Login check
    public function login() {
        $query = "SELECT id, username, password, role 
                FROM " . $this->table_name . " 
                WHERE email = :email 
                LIMIT 1";

        $stmt = $this->conn->prepare($query);

        $this->email = htmlspecialchars(strip_tags($this->email));
        $stmt->bindParam(":email", $this->email);
        $stmt->execute();

        if($stmt->rowCount() > 0) {
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            if(password_verify($this->password, $row['password'])) {
                $this->id = $row['id'];
                $this->username = $row['username'];
                $this->role = $row['role'];
                return true;
            }
        }
        return false;
    }
}
