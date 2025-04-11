import API_URL  from './api.js'; // Ensure that the script type is set to "module" in the HTML file
import {loadHomeView} from './home.js';
import {loadStdRoomView} from './std_rooms.js';
import {loadReservationsView} from './std_reservations.js';
// import loadStdRoomView from './std_rooms.js';

// View management
const views = {
    home: 'views/home.html',
    login: 'views/login.html',
    std_rooms: 'views/std_rooms.html',
    std_reservations: 'views/std_reservations.html',
    std_history: 'views/std_history.html',
    std_profile: 'views/std_profile.html',
    std_notifications: 'views/std_notifications.html',
    srso_general_config: 'views/srso_gen_config.html',
    srso_room_config: 'views/srso_room_config.html',
    srso_room_status: 'views/srso_room_status.html',
    srso_statistics: 'views/srso_statistics.html',
};

// Current user state
export let currentUser = null;

// Load a view into the main content area
export async function loadView(viewName) {
    console.log("[INFO]: loadView", viewName);
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

        if (viewName === 'home') { // If the view is home, fetch and display room rules
            await loadHomeView();
        }

        if (viewName === 'std_rooms') {
            // console.log("[INFO]: inside if");
            await loadStdRoomView();
        }

        if (viewName === 'std_reservations') {
            await loadReservationsView();
        }

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
export async function handleLogin() {
    const email = document.getElementById('email-input').value; // Assuming you have an input for email
    const password = document.getElementById('password-input').value; // Assuming you have an input for password

    try {
        const response = await fetch(`${API_URL}/auth/login`, {
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
export function handleLogout() {
    currentUser = null;
    updateUserUI();
    loadView('login');
}

// Update UI based on user state
export function updateUserUI() {
    const userNameSpan = document.getElementById('user-name');
    const loginBtn = document.getElementById('login-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const bellIcon = document.getElementById('bell-icon');
    const homeNavBtn = document.querySelector('.nav-btn:nth-child(1)'); // Select the "home" button
    const roomsNavBtn = document.querySelector('.nav-btn:nth-child(2)'); // Select the "rooms" button
    const reservationsNavBtn = document.querySelector('.nav-btn:nth-child(3)'); // Select the "reservations" button
    const historyNavBtn = document.querySelector('.nav-btn:nth-child(4)'); // Select the "history" button
    const profileNavBtn = document.querySelector('.nav-btn:nth-child(5)'); // Select the "profile" button
    const genConfigNavBtn = document.querySelector('.nav-btn:nth-child(6)'); // Select the "general_config" button
    const roomConfigNavBtn = document.querySelector('.nav-btn:nth-child(7)'); // Select the "room_config" button
    const roomStatusNavBtn = document.querySelector('.nav-btn:nth-child(8)'); // Select the "room_history" button
    const statisticsNavBtn = document.querySelector('.nav-btn:nth-child(9)'); // Select the "statistics" button

    // Show or hide navigation buttons based on user state    
    if (currentUser) {
        userNameSpan.textContent = currentUser.name;
        userNameSpan.style.marginRight = '-25px'; // Adjust margin-right because the bell icon is too far right
        loginBtn.style.display = 'none';
        logoutBtn.style.display = 'block';
        homeNavBtn.style.display = 'block'; // Hide the button if the user is not logged in
        if(currentUser.role == "student") {
            bellIcon.style.display = 'block'; // Show bell icon when logged in
            roomsNavBtn.style.display = 'block'; // Show the button if the user is logged in
            reservationsNavBtn.style.display = 'block'; // Show the button if the user is logged in
            historyNavBtn.style.display = 'block'; // Show the button if the user is logged in
            profileNavBtn.style.display = 'block'; // Show the button if the user is logged in
        }
        else if(currentUser.role == "SRSO") {
            genConfigNavBtn.style.display = 'block';  // Show the button if the user is not logged in
            roomConfigNavBtn.style.display = 'block'; // Show the button if the user is logged in
            roomStatusNavBtn.style.display = 'block'; // Show the button if the user is logged in
            statisticsNavBtn.style.display = 'block'; // Show the button if the user is logged in
        }
    } else {
        userNameSpan.textContent = 'Chưa đăng nhập';
        userNameSpan.style.marginRight = '0'; // Reset margin-right when not logged in
        loginBtn.style.display = 'block';
        logoutBtn.style.display = 'none';
        bellIcon.style.display = 'none'; // Hide bell icon when not logged in
        homeNavBtn.style.display = 'block'; // Hide the button if the user is not logged in
        roomsNavBtn.style.display = 'none'; // Hide the button if the user is not logged in
        reservationsNavBtn.style.display = 'none'; // Hide the button if the user is not logged in
        historyNavBtn.style.display = 'none'; // Hide the button if the user is not logged in
        profileNavBtn.style.display = 'none'; // Hide the button if the user is not logged in
        genConfigNavBtn.style.display = 'none';  // Hide the button if the user is not logged in
        roomConfigNavBtn.style.display = 'none'; // Hide the button if the user is not logged in
        roomStatusNavBtn.style.display = 'none'; // Hide the button if the user is not logged in
        statisticsNavBtn.style.display = 'none'; // Hide the button if the user is not logged in
    }
}

// Load notification view
export function loadNotifications() {
    loadView('notifications');
}


window.loadView = loadView;
window.handleLogin = handleLogin;
window.handleLogout = handleLogout;
window.updateUserUI = updateUserUI;
window.loadNotifications = loadNotifications;

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    // Load home view by default
    loadView('home');
    
    console.log("[INFO]: print from home");
    // Check if user is already logged in
    // TODO: Implement session management
    updateUserUI();
});

