const API_BASE_URL = 'http://microserivces_book:8000'; // Base URL of the API gateway

// Common error handling function
function handleError(response) {
    if (!response.ok) {
        throw Error(`Error: ${response.statusText}`);
    }
    return response.json();
}

// Common fetch API request function
function fetchAPI(endpoint, method = 'GET', data = null) {
    const options = {
        method: method,
        headers: {
            'Content-Type': 'application/json' // Using JSON for data transfer
        }
    };

    if (data) {
        options.body = JSON.stringify(data);
    }

    return fetch(`${API_BASE_URL}${endpoint}`, options)
        .then(handleError);
}

// User login form submission handler
document.getElementById('login-form')?.addEventListener('submit', function (e) {
    e.preventDefault();
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    const loginButton = document.querySelector('button[type="submit"]');
    loginButton.disabled = true; // Disable button to prevent repeated submissions

    fetchAPI('/users/login', 'POST', { username, password })
    .then(data => {
        loginButton.disabled = false;
        if (data.status === 'Login successful') {
            // Store user's login status, role, and user_id
            sessionStorage.setItem('isLoggedIn', 'true');
            sessionStorage.setItem('role', data.role);
            sessionStorage.setItem('user_id', data.user_id); // Store user_id

            // Redirect to the appropriate page based on the role
            window.location.href = data.role === 'admin' ? 'admin_dashboard.html' : 'dashboard.html';
        } else {
            document.getElementById('login-message').textContent = 'Login failed, please check username and password.';
        }
    })
    .catch(error => {
        loginButton.disabled = false;
        console.error(error);
        document.getElementById('login-message').textContent = 'API issue, please check the service.';
    });
});

// Check if the user is already logged in
function checkLoginStatus() {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    const role = sessionStorage.getItem('role');
    
    // If the current page is not the login page, and not logged in, then redirect
    if (window.location.pathname !== '/index.html' && (!isLoggedIn || isLoggedIn !== 'true')) {
        window.location.href = 'index.html';
    }
}
// Check login status on page load
document.addEventListener('DOMContentLoaded', checkLoginStatus);
