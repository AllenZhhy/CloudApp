CREATE DATABASE IF NOT EXISTS demo_service CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
use demo_service;
CREATE USER IF NOT EXISTS 'user'@'%' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON demo_service.* TO 'user'@'%';
FLUSH PRIVILEGES;
-- User service database table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(10) NOT NULL
);
INSERT INTO users(username,password,role) VALUES("admin","$2y$10$NXq8XvDmmryHBL7vp3nMXO43OP40vllJeENNoJioLBbSdUmvHYBQ6","admin");
INSERT INTO users(username,password,role) VALUES("user1","$2y$10$NXq8XvDmmryHBL7vp3nMXO43OP40vllJeENNoJioLBbSdUmvHYBQ6","user");
INSERT INTO users(username,password,role) VALUES("user2","$2y$10$NXq8XvDmmryHBL7vp3nMXO43OP40vllJeENNoJioLBbSdUmvHYBQ6","user");
INSERT INTO users(username,password,role) VALUES("user3","$2y$10$NXq8XvDmmryHBL7vp3nMXO43OP40vllJeENNoJioLBbSdUmvHYBQ6","user");
INSERT INTO users(username,password,role) VALUES("user4","$2y$10$NXq8XvDmmryHBL7vp3nMXO43OP40vllJeENNoJioLBbSdUmvHYBQ6","user");
INSERT INTO users(username,password,role) VALUES("user5","$2y$10$NXq8XvDmmryHBL7vp3nMXO43OP40vllJeENNoJioLBbSdUmvHYBQ6","user");
-- Book service database table
CREATE TABLE books (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    author VARCHAR(100) NOT NULL
);
INSERT INTO books (title, author)
VALUES
('The Great Gatsby', 'F. Scott Fitzgerald'),
('1984', 'George Orwell'),
('To Kill a Mockingbird', 'Harper Lee'),
('Pride and Prejudice', 'Jane Austen'),
('The Catcher in the Rye', 'J.D. Salinger'),
('Moby Dick', 'Herman Melville'),
('War and Peace', 'Leo Tolstoy'),
('The Lord of the Rings', 'J.R.R. Tolkien'),
('Crime and Punishment', 'Fyodor Dostoevsky'),
('The Adventures of Huckleberry Finn', 'Mark Twain');

-- Lending service database table
CREATE TABLE borrows (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    book_id INT NOT NULL,
    borrow_date DATETIME NOT NULL,
    return_date DATETIME,
    status ENUM('borrowed', 'returned') DEFAULT 'borrowed', -- Borrowing status
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (book_id) REFERENCES books(id)
);
INSERT INTO borrows (user_id, book_id, borrow_date, return_date, status)
VALUES
(2, 2, '2024-10-10 14:30:00', '2024-10-20 14:30:00', 'returned'),
(2, 3, '2024-10-11 09:00:00', NULL, 'borrowed'),
(3, 5, '2024-10-12 11:15:00', '2024-10-15 11:15:00', 'returned'),
(5, 4, '2024-10-13 16:45:00', NULL, 'borrowed'),
(4, 1, '2024-10-14 10:30:00', NULL, 'borrowed'),
(2, 9, '2024-10-15 13:50:00', '2024-10-18 13:50:00', 'returned');

