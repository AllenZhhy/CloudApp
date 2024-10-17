const API_BASE_URL = 'http://microserivces_book:8000';
let editingUserId = null;  // Used to indicate if currently in edit mode

// Load user list
function loadUsers() {
    fetch(`${API_BASE_URL}/users/users`) // Get all users
    .then(response => response.json())
    .then(users => {
        const userList = document.getElementById('user-list');
        userList.innerHTML = '';
        users.forEach(user => {
            const li = document.createElement('li');
            li.classList.add('list-group-item');
            li.innerHTML = `Username: ${user.username} --- Role: ${user.role} 
                <button class="btn btn-sm btn-secondary float-right" onclick="editUser(${user.id})">Edit</button>`;
            userList.appendChild(li);
        });
    })
    .catch(error => {
        console.error(error);
        alert('Unable to load user list, please try again later.');
    });
}

// Edit user
function editUser(userId) {
    fetch(`${API_BASE_URL}/users/users/${userId}`) // Get single user
    .then(response => response.json())
    .then(user => {
        document.getElementById('user-id').value = user.id;
        document.getElementById('user-username').value = user.username;
        document.getElementById('user-role').value = user.role;
        document.getElementById('delete-user').classList.remove('d-none');
        editingUserId = userId;
    });
}

// Save user (add or edit)
document.getElementById('add-edit-user-form')?.addEventListener('submit', function (e) {
    e.preventDefault();
    const username = document.getElementById('user-username').value;
    const password = document.getElementById('user-password').value;
    const role = document.getElementById('user-role').value;
    const userId = document.getElementById('user-id').value;

    const method = userId ? 'PUT' : 'POST'; // If there is an ID, it means edit, otherwise add
    const url = userId ? `${API_BASE_URL}/users/users/${userId}` : `${API_BASE_URL}/users/register`; // Use /register to register new users

    const userData = { username, role };
    if (password) {
        userData.password = password; // If a password is entered, pass it
    }

    fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    })
    .then(response => response.json())
    .then(data => {
        alert(data.status);
        loadUsers(); // Reload user list
        resetForm(); // Reset the form
    })
    .catch(error => {
        console.error(error);
        alert('An error occurred while saving the user, please check the service.');
    });
});

// Delete user
document.getElementById('delete-user')?.addEventListener('click', function () {
    const userId = document.getElementById('user-id').value;
    if (confirm('Are you sure you want to delete this user?')) {
        fetch(`${API_BASE_URL}/users/users/${userId}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => {
            alert(data.status);
            loadUsers(); // Reload user list
            resetForm(); // Reset the form
        })
        .catch(error => {
            console.error(error);
            alert('An error occurred while deleting the user, please check the service.');
        });
    }
});

// Reset form
function resetForm() {
    document.getElementById('user-id').value = '';
    document.getElementById('user-username').value = '';
    document.getElementById('user-password').value = '';
    document.getElementById('user-role').value = 'user';
    document.getElementById('delete-user').classList.add('d-none');
}

// Call loadUsers on page load
document.addEventListener('DOMContentLoaded', loadUsers);
