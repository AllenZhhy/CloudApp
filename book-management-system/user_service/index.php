<?php
class UserService {
    private $db;

    public function __construct() {
        // Initialize database connection
        $this->db = new mysqli(
            getenv('MYSQL_HOST'), 
            getenv('MYSQL_USER'), 
            getenv('MYSQL_PASSWORD'), 
            getenv('MYSQL_DATABASE')
        );

        // Check if the database connection was successful
        if ($this->db->connect_error) {
            http_response_code(500);
            echo json_encode(['status' => 'Database connection failed', 'error' => $this->db->connect_error]);
            exit();
        }
    }

    // User registration method
    public function register($data) {
        // Prepare and bind parameters to prevent SQL injection
        $stmt = $this->db->prepare("INSERT INTO users (username, password, role) VALUES (?, ?, ?)");
        $password = password_hash($data['password'], PASSWORD_DEFAULT);
        $role = isset($data['role']) ? $data['role'] : 'user'; // Default user role is 'user'
        $stmt->bind_param('sss', $data['username'], $password, $role);

        // Execute the query and check if it was successful
        if ($stmt->execute()) {
            http_response_code(201); // 201 Created
            return json_encode(['status' => 'User registered']);
        } else {
            http_response_code(500);
            return json_encode(['status' => 'Registration failed', 'error' => $this->db->error]);
        }
    }

    // User login method
    public function login($data) {
        // Use prepared statements to prevent SQL injection
        $stmt = $this->db->prepare("SELECT * FROM users WHERE username = ?");
        $stmt->bind_param('s', $data['username']);
        $stmt->execute();
        $result = $stmt->get_result();
        $user = $result->fetch_assoc();

        // Check if the user exists
        if (!$user) {
            http_response_code(401);
            return json_encode(['status' => 'Login failed', 'message' => 'User not found']);
        }

        // Validate the password
        if (password_verify($data['password'], $user['password'])) {
            http_response_code(200);
            return json_encode(['status' => 'Login successful', 'user_id' => $user['id'], 'role' => $user['role']]);
        } else {
            http_response_code(401);
            return json_encode(['status' => 'Login failed', 'message' => 'Incorrect password']);
        }
    }

    // Get all users
    public function getUsers() {
        $result = $this->db->query("SELECT id, username, role FROM users");
        $users = [];

        while ($user = $result->fetch_assoc()) {
            $users[] = $user;
        }

        return json_encode($users);
    }

    // Get a specific user
    public function getUser($id) {
        $stmt = $this->db->prepare("SELECT id, username, role FROM users WHERE id = ?");
        $stmt->bind_param('i', $id);
        $stmt->execute();
        $result = $stmt->get_result();
        $user = $result->fetch_assoc();

        if ($user) {
            return json_encode($user);
        } else {
            http_response_code(404); // 404 Not Found
            return json_encode(['status' => 'User not found']);
        }
    }

    // Update user information
    public function updateUser($id, $data) {
        // If a password is provided, update the password
        if (isset($data['password']) && !empty($data['password'])) {
            $stmt = $this->db->prepare("UPDATE users SET username = ?, password = ?, role = ? WHERE id = ?");
            $password = password_hash($data['password'], PASSWORD_DEFAULT);
            $stmt->bind_param('sssi', $data['username'], $password, $data['role'], $id);
        } else {
            $stmt = $this->db->prepare("UPDATE users SET username = ?, role = ? WHERE id = ?");
            $stmt->bind_param('ssi', $data['username'], $data['role'], $id);
        }

        if ($stmt->execute()) {
            http_response_code(200);
            return json_encode(['status' => 'User updated']);
        } else {
            http_response_code(500);
            return json_encode(['status' => 'Error updating user', 'error' => $this->db->error]);
        }
    }

    // Delete a user
    public function deleteUser($id) {
        $stmt = $this->db->prepare("DELETE FROM users WHERE id = ?");
        $stmt->bind_param('i', $id);

        if ($stmt->execute()) {
            http_response_code(200);
            return json_encode(['status' => 'User deleted']);
        } else {
            http_response_code(500);
            return json_encode(['status' => 'Error deleting user', 'error' => $this->db->error]);
        }
    }
}

// API handling logic
header('Content-Type: application/json');
$method = $_SERVER['REQUEST_METHOD'];
$path = explode('/', trim(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH), '/'));

// Create an instance of UserService
$userService = new UserService();

// Handle different API requests
if ($method === 'POST' && $path[0] === 'register') {
    // Retrieve and parse input data
    $input = json_decode(file_get_contents('php://input'), true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid JSON input']);
        exit();
    }
    echo $userService->register($input); // User registration
} elseif ($method === 'POST' && $path[0] === 'login') {
    // Retrieve and parse input data
    $input = json_decode(file_get_contents('php://input'), true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid JSON input']);
        exit();
    }
    echo $userService->login($input); // User login
} elseif ($method === 'GET' && $path[0] === 'users') {
    if (isset($path[1])) {
        echo $userService->getUser($path[1]); // Get a single user
    } else {
        echo $userService->getUsers(); // Get all users
    }
} elseif ($method === 'PUT' && $path[0] === 'users' && isset($path[1])) {
    // Retrieve and parse input data
    $input = json_decode(file_get_contents('php://input'), true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid JSON input']);
        exit();
    }
    echo $userService->updateUser($path[1], $input); // Update user
} elseif ($method === 'DELETE' && $path[0] === 'users' && isset($path[1])) {
    echo $userService->deleteUser($path[1]); // Delete user
} else {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid API request']);
}

