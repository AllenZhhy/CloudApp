const API_BASE_URL = 'http://microserivces_book:8000'; // Base URL of the API gateway
const user_id = sessionStorage.getItem('user_id'); // Retrieve the currently logged-in user's ID from sessionStorage

// Load the list of books available for borrowing
function loadAvailableBooks() {
    fetch(`${API_BASE_URL}/books/available`) // Assume this endpoint returns all books available for borrowing
    .then(response => response.json())
    .then(books => {
        const bookList = document.getElementById('available-books');
        bookList.innerHTML = '';
        books.forEach(book => {
            const li = document.createElement('li');
            li.classList.add('list-group-item');
            li.textContent = `Title: ${book.title} --- Author: ${book.author} (ID: ${book.id})`;
            bookList.appendChild(li);
        });
    })
    .catch(error => {
        console.error(error);
        alert('Unable to load the list of available books, please try again later.');
    });
}

// Handle the book borrowing form submission
document.getElementById('borrow-form')?.addEventListener('submit', function (e) {
    e.preventDefault();

    const book_id = document.getElementById('borrow-book-id').value;

    if (!user_id) {
        alert('Please log in first.');
        window.location.href = 'index.html';
        return;
    }

    fetch(`${API_BASE_URL}/borrow/borrow`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ user_id, book_id })
    })
    .then(response => response.json())
    .then(data => {
        alert(data.status);
        loadAvailableBooks(); // Reload the list of books available for borrowing
        loadBorrowStatus(); // Reload borrowing status
    })
    .catch(error => {
        console.error(error);
        alert('There is a problem with the borrowing interface, please check the service.');
    });
});

// Load the borrowing status of the current user
function loadBorrowStatus() {
    fetch(`${API_BASE_URL}/borrow/isstatus/${user_id}`)
    .then(response => response.json())
    .then(borrows => {
        const borrowList = document.getElementById('borrow-status-list');
        borrowList.innerHTML = '';
        borrows.forEach(borrow => {
            const li = document.createElement('li');
            li.classList.add('list-group-item');
            li.textContent = `ID: ${borrow.id} Title: ${borrow.title} Author: ${borrow.author} Borrow Date: ${borrow.borrow_date}`;
            borrowList.appendChild(li);
        });
    })
    .catch(error => {
        console.error(error);
        alert('Unable to load borrowing status, please try again later.');
    });
}

// Call on page load
document.addEventListener('DOMContentLoaded', function () {
    loadAvailableBooks();
    loadBorrowStatus();
});
