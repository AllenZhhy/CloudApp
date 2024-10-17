const API_BASE_URL = 'http://microserivces_book:8000'; // Base URL of the API gateway

// Handle the registration form submission
document.getElementById('register-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const username = document.getElementById('register-username').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    if (password !== confirmPassword) {
        document.getElementById('register-message').textContent = 'Passwords do not match';
        return;
    }

    fetch(`${API_BASE_URL}/users/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'User registered') {
            alert('Registration successful, redirecting to login page');
            window.location.href = 'index.html'; // Redirect to login page after successful registration
        } else {
            document.getElementById('register-message').textContent = data.error || 'Registration failed, please try again later';
        }
    })
    .catch(error => {
        console.error(error);
        document.getElementById('register-message').textContent = 'There was a problem with the registration interface, please try again later';
    });
});
