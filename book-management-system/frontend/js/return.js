const API_BASE_URL = 'http://microserivces_book:8000'; // Base URL of the API gateway
// Get the currently logged-in user's user_id
const user_id = sessionStorage.getItem('user_id');
// Load the list of borrowed books
function loadBorrowedBooks() {
    fetch(`${API_BASE_URL}/borrow/isstatus/${user_id}`)
    .then(response => response.json())
    .then(borrows => {
        const bookList = document.getElementById('borrowed-books');
        bookList.innerHTML = '';
        borrows.forEach(borrow => {
          const li = document.createElement('li');
          li.classList.add('list-group-item');
          li.textContent = `Title: ${borrow.title} (ID: ${borrow.id}) --- Author: ${borrow.author} --- Borrow Date: ${borrow.borrow_date}`;
          li.dataset.bookId = borrow.id; // Store book ID
          bookList.appendChild(li);
        });
    })
    .catch(error => {
        console.error(error);
        alert('Unable to load the list of borrowed books, please try again later.');
    });
}

// Handle the book return form submission
document.getElementById('return-form')?.addEventListener('submit', function (e) {
    e.preventDefault();

    const book_id = document.getElementById('return-book-id').value;

    if (!user_id) {
        alert('Please log in first.');
        window.location.href = 'index.html';
        return;
    }

    fetch(`${API_BASE_URL}/borrow/return`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ user_id, book_id })
    })
    .then(response => response.json())
    .then(data => {
        alert(data.status);
        loadBorrowedBooks(); // Reload the list of borrowed books
    })
    .catch(error => {
        console.error(error);
        alert('There is a problem with the return interface, please check the service.');
    });
});

// Call loadBorrowedBooks on page load
document.addEventListener('DOMContentLoaded', loadBorrowedBooks);
