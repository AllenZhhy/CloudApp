const API_BASE_URL = 'http://microserivces_book:8000';

// Load borrowing status
function loadBorrowStatus() {
    fetch(`${API_BASE_URL}/borrow/status`)
    .then(response => response.json())
    .then(borrows => {
        const borrowList = document.getElementById('borrow-status-list');
        borrowList.innerHTML = '';
        borrows.forEach(borrow => {
            const li = document.createElement('li');
            li.classList.add('list-group-item');
            li.textContent = `User: ${borrow.username} borrowed the book: ${borrow.title} on ${borrow.borrow_date} Return date: ${borrow.return_date || 'not returned'} (Status: ${borrow.status})`;
            borrowList.appendChild(li);
        });
    })
    .catch(error => {
        console.error(error);
        alert('Unable to load borrowing status, please try again later.');
    });
}

// Call loadBorrowStatus on page load
document.addEventListener('DOMContentLoaded', loadBorrowStatus);
