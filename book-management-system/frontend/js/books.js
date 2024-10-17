const API_BASE_URL = 'http://microserivces_book:8000'; // Base URL of the API gateway

// Load book list
function loadBooks() {
    fetch(`${API_BASE_URL}/books/books`)
    .then(response => response.json())
    .then(books => {
        const bookList = document.getElementById('book-list');
        bookList.innerHTML = '';
        books.forEach(book => {
            const li = document.createElement('li');
            li.classList.add('list-group-item');
            li.innerHTML = `ID: ${book.id}  Title: ${book.title} --- Author: ${book.author}
                <button class="btn btn-sm btn-secondary float-right" onclick="editBook(${book.id})">Edit</button>`;
            bookList.appendChild(li);
        });
    })
    .catch(error => {
        console.error(error);
        alert('Unable to load the book list, please try again later.');
    });
}

// Edit book
function editBook(bookId) {
    fetch(`${API_BASE_URL}/books/books/${bookId}`)
    .then(response => response.json())
    .then(book => {
        document.getElementById('book-id').value = book.id;
        document.getElementById('book-title').value = book.title;
        document.getElementById('book-author').value = book.author;
        document.getElementById('delete-book').classList.remove('d-none');
    })
    .catch(error => {
        console.error(error);
        alert('Unable to load book details, please try again later.');
    });
}

// Save book (add or edit)
document.getElementById('add-edit-book-form')?.addEventListener('submit', function (e) {
    e.preventDefault();
    const title = document.getElementById('book-title').value;
    const author = document.getElementById('book-author').value;
    const bookId = document.getElementById('book-id').value;

    const method = bookId ? 'PUT' : 'POST'; // If there is an ID, it means edit, otherwise add
    const url = bookId ? `${API_BASE_URL}/books/books/${bookId}` : `${API_BASE_URL}/books/books`;

    fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title, author })
    })
    .then(response => response.json())
    .then(data => {
        alert(data.status);
        loadBooks(); // Reload the book list
        resetForm(); // Reset the form
    })
    .catch(error => {
        console.error(error);
        alert('An error occurred while saving the book, please check the service.');
    });
});

// Delete book
document.getElementById('delete-book')?.addEventListener('click', function () {
    const bookId = document.getElementById('book-id').value;
    if (confirm('Are you sure you want to delete this book?')) {
        fetch(`${API_BASE_URL}/books/books/${bookId}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => {
            alert(data.status);
            loadBooks(); // Reload the book list
            resetForm(); // Reset the form
        })
        .catch(error => {
            console.error(error);
            alert('An error occurred while deleting the book, please check the service.');
        });
    }
});

// Reset form
function resetForm() {
    document.getElementById('book-id').value = '';
    document.getElementById('book-title').value = '';
    document.getElementById('book-author').value = '';
    document.getElementById('delete-book').classList.add('d-none');
}

// Call loadBooks on page load
document.addEventListener('DOMContentLoaded', loadBooks);
