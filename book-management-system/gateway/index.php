<?php
// API Gateway, routing front-end requests to different microservices

// CORS header settings to allow cross-origin requests
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

// Handle OPTIONS preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Retrieve the request method and path
$method = $_SERVER['REQUEST_METHOD'];
$path = explode('/', trim(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH), '/'));

// URL mapping for microservices
$services = [
    'users'  => 'http://user_service',  // User service
    'books'  => 'http://book_service',  // Book service
    'borrow' => 'http://borrow_service' // Borrowing service
];

// Check the request path and route to the corresponding microservice
if (isset($services[$path[0]])) {
    // Concatenate the remaining path parts to the service URL
    $url = $services[$path[0]] . '/' . implode('/', array_slice($path, 1));
    forwardRequest($method, $url);
} else {
    http_response_code(404);
    echo json_encode(['error' => 'Invalid API endpoint']);
}

// Function: Process and forward the request to the microservice
function forwardRequest($method, $url) {
    // Initialize cURL
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);

    // Set different cURL options based on the request method
    switch ($method) {
        case 'POST':
        case 'PUT':
            $inputData = file_get_contents('php://input');
            curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method); // POST 或 PUT
            curl_setopt($ch, CURLOPT_POSTFIELDS, $inputData);
            break;
        case 'DELETE':
            curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'DELETE');
            break;
        case 'GET':
        default:
            // No extra settings needed for GET requests
            break;
    }

    // Execute the cURL request
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

    if (curl_errno($ch)) {
        echo json_encode(['error' => 'Error communicating with microservice: ' . curl_error($ch)]);
    } else {
        // Check if the response is valid JSON
        $jsonDecoded = json_decode($response, true);
        if (json_last_error() === JSON_ERROR_NONE) {
            http_response_code($httpCode);
            echo json_encode($jsonDecoded);
        } else {
            http_response_code(500); // Server error
            echo json_encode(['error' => 'Invalid JSON response from microservice']);
        }
    }

    curl_close($ch);
}

