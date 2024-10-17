// Check if the user is already logged in
function checkLoginStatus() {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    if (!isLoggedIn || isLoggedIn !== 'true') {
        // If not logged in, redirect to the login page
        window.location.href = 'index.html';
    }
}

// Check if the user is an administrator
function checkAdminRole() {
    const role = sessionStorage.getItem('role');
    if (role !== 'admin') {
        // If not an administrator, redirect to the regular user's dashboard page
        alert('You do not have permission to access this page');
        window.location.href = 'dashboard.html';
    }
}

// Check login status on page load and check user role if necessary
document.addEventListener('DOMContentLoaded', function() {
    checkLoginStatus();
    
    // Only admin_dashboard.html, books.html, borrow_status.html, and users.html need to check for admin permissions
    const restrictedPages = ['admin_dashboard.html', 'books.html', 'users.html', 'borrow_status.html'];
    const currentPage = window.location.pathname.split('/').pop();

    if (restrictedPages.includes(currentPage)) {
        checkAdminRole();
    }
});
