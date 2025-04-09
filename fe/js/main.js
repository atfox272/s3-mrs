// import './auth.js';

// View management
const views = {
    home: 'views/home.html',
    rooms: 'views/rooms.html',
    reservations: 'views/reservations.html',
    history: 'views/history.html',
    profile: 'views/profile.html',
    login: 'views/login.html',
};

// Current user state
let currentUser = null;

// Load a view into the main content area
async function loadView(viewName) {
    try {
        const response = await fetch(views[viewName]);
        if (!response.ok) throw new Error('View not found');
        
        const content = await response.text();
        document.getElementById('main-content').innerHTML = content;
        
        // Update active navigation button
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[onclick="loadView('${viewName}')"]`).classList.add('active');
    } catch (error) {
        console.error('Error loading view:', error);
        document.getElementById('main-content').innerHTML = `
            <div class="error-message">
                <h2>Lỗi tải trang</h2>
                <p>Không thể tải nội dung trang. Vui lòng thử lại sau.</p>
            </div>
        `;
    }
}

// auth.js
async function handleLogin() {
    const email = document.getElementById('email-input').value; // Assuming you have an input for email
    const password = document.getElementById('password-input').value; // Assuming you have an input for password

    try {
        const response = await fetch('http://localhost:3001/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (data.success) {
            // Save user information and token
            currentUser = data.user; // Update currentUser with the returned user data
            localStorage.setItem('token', data.token); // Store token if needed
            console.log("Login successful:", currentUser);
            updateUserUI(); // Update the UI to reflect the logged-in state
            loadView('home'); // Redirect the user to the home view after successful login
        } else {
            console.error("Login failed:", data.message);
            // alert(data.message); // Show error message to user
            const errorMessageElement = document.getElementById('error-message');
            errorMessageElement.textContent = data.message; // Display the error message
            errorMessageElement.style.display = 'block'; // Make sure the error message is visible
        }
    } catch (error) {
        console.error("Error during login:", error);
        alert("An error occurred. Please try again.");
    }
}

// Handle logout
function handleLogout() {
    currentUser = null;
    updateUserUI();
    loadView('login');
}

// Update UI based on user state
function updateUserUI() {
    const userNameSpan = document.getElementById('user-name');
    const loginBtn = document.getElementById('login-btn');
    const logoutBtn = document.getElementById('logout-btn');
    
    if (currentUser) {
        userNameSpan.textContent = currentUser.name;
        loginBtn.style.display = 'none';
        logoutBtn.style.display = 'block';
    } else {
        userNameSpan.textContent = 'Chưa đăng nhập';
        loginBtn.style.display = 'block';
        logoutBtn.style.display = 'none';
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    // Load home view by default
    loadView('home');
    
    // Check if user is already logged in
    // TODO: Implement session management
    updateUserUI();
});
