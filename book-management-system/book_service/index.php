<?php
class BookService {
    private $db;

    public function __construct() {
        // Initializing a database connection
        $this->db = new mysqli(
            getenv('MYSQL_HOST'), 
            getenv('MYSQL_USER'), 
            getenv('MYSQL_PASSWORD'), 
            getenv('MYSQL_DATABASE')
        );

        // Check whether the database connection is successful
        if ($this->db->connect_error) {
            http_response_code(500);
            echo json_encode(['status' => 'Database connection failed', 'error' => $this->db->connect_error]);
            exit();
        }
    }

    // Add book method
    public function addBook($data) {
        $stmt = $this->db->prepare("INSERT INTO books (title, author) VALUES (?, ?)");
        $stmt->bind_param('ss', $data['title'], $data['author']);

        if ($stmt->execute()) {
            http_response_code(201); // 201 Created
            $stmt->close();
            return json_encode(['status' => 'Book added']);
        } else {
            http_response_code(500);
            return json_encode(['status' => 'Error adding book', 'error' => $this->db->error]);
        }
    }

    // Get all book methods
    public function getBooks() {
        $result = $this->db->query("SELECT id, title, author FROM books");

        if (!$result) {
            http_response_code(500);
            return json_encode(['status' => 'Error retrieving books', 'error' => $this->db->error]);
        }

        $books = [];
        while ($book = $result->fetch_assoc()) {
            $books[] = $book;
        }
        return json_encode($books);
    }

    // Get a single book method
    public function getBook($id) {
        $stmt = $this->db->prepare("SELECT id, title, author FROM books WHERE id = ?");
        $stmt->bind_param('i', $id);
        $stmt->execute();
        $result = $stmt->get_result();
        $book = $result->fetch_assoc();

        if ($book) {
            return json_encode($book);
        } else {
            http_response_code(404); // 404 Not Found
            return json_encode(['status' => 'Book not found']);
        }
    }

    // Update book method
    public function updateBook($id, $data) {
        $stmt = $this->db->prepare("UPDATE books SET title = ?, author = ? WHERE id = ?");
        $stmt->bind_param('ssi', $data['title'], $data['author'], $id);

        if ($stmt->execute()) {
            http_response_code(200);
            $stmt->close();
            return json_encode(['status' => 'Book updated']);
        } else {
            http_response_code(500);
            return json_encode(['status' => 'Error updating book', 'error' => $this->db->error]);
        }
    }

    // Book deletion method
    public function deleteBook($id) {
        $stmt = $this->db->prepare("DELETE FROM books WHERE id = ?");
        $stmt->bind_param('i', $id);

        if ($stmt->execute()) {
            http_response_code(200);
            $stmt->close();
            return json_encode(['status' => 'Book deleted']);
        } else {
            http_response_code(500);
            return json_encode(['status' => 'Error deleting book', 'error' => $this->db->error]);
        }
    }
    public function getAvailableBooks() {
        $query = "
            SELECT books.id, books.title, books.author, 
                   COALESCE(MAX(borrows.status), 'available') AS status
            FROM books
            LEFT JOIN borrows ON books.id = borrows.book_id
            GROUP BY books.id
        ";
        $result = $this->db->query($query);
    
        if (!$result) {
            http_response_code(500);
            return json_encode(['status' => 'Error retrieving available books', 'error' => $this->db->error]);
        }
    
        $books = [];
        while ($book = $result->fetch_assoc()) {
            $books[] = $book;
        }
    
        return json_encode($books);
    }

}

// API processing logic
header('Content-Type: application/json');
$method = $_SERVER['REQUEST_METHOD'];

// Use REQUEST_URI to parse the path
$path = explode('/', trim(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH), '/'));

// Create the BookService instance
$bookService = new BookService();

// Get input data
$input = json_decode(file_get_contents('php://input'), true);

// Handle different API requests
if ($method === 'POST' && $path[0] === 'books') {
    echo $bookService->addBook($input); // Add books
} elseif ($method === 'GET' && $path[0] === 'books') {
    if (isset($path[1])) {
        echo $bookService->getBook($path[1]); // Get a single book
    } else {
        echo $bookService->getBooks(); // Get all Books
    }
} elseif ($method === 'PUT' && $path[0] === 'books' && isset($path[1])) {
    echo $bookService->updateBook($path[1], $input); // Update books
} elseif ($method === 'DELETE' && $path[0] === 'books' && isset($path[1])) {
    echo $bookService->deleteBook($path[1]); // Delete books
} elseif ($method === 'GET' && $path[0] === 'available') {
    echo $bookService->getAvailableBooks(); // Get all available books
}else {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid API request']);
}

