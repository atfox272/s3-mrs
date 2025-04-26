import API_URL from './api.js';
import { currentUser } from './main.js';

const STD_NOTIFICATIONS_API = `${API_URL}/std-notifications`;

let prevNotificationsList = null;

// Function to load statistics view
export async function loadNotificationsView() {
    console.log('[INFO]: Loading notifications view...');
    // Update the bell icon to indicate new notifications
    const bellIcon = document.getElementById('bell-icon');
    bellIcon.style.color = `#1a237e`; // Change color to indicate a new notification
    try {
        // Fetch notifications from the server
        const response = await fetch(`${STD_NOTIFICATIONS_API}/get-notifications`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ currentUser: currentUser })
        });

        const data = await response.json();

        if (data.success) {
            const notificationList = document.getElementById('std-notifications-list');
            notificationList.innerHTML = ''; // Clear existing content

            data.notifications.forEach(notification => {
                const card = document.createElement('div');
                card.className = 'std-notification-card';
                card.innerHTML = `
                    <div class="std-notification-info">
                        <p>${notification.date}, bạn có lịch đặt phòng ${notification.roomId} vào lúc ${notification.time}</p>
                    </div>
                    <div class="std-notification-arrow">
                        <span>➔</span>
                    </div>
                `;

                card.addEventListener('click', () => {
                    // Redirect to detailed notification view
                    loadView('std_reservations');
                });

                notificationList.appendChild(card);
            });
        } else {
            alert('Không thể tải danh sách thông báo.');
        }
    } catch (error) {
        console.error('Error loading notifications:', error);
        alert('Có lỗi xảy ra khi tải danh sách thông báo.');
    }
}

function checkNotifications() {
    if(currentUser == null) {
        return;
    }
    if(currentUser.role != 'student') {
        return;
    }
    fetch(`${STD_NOTIFICATIONS_API}/check-notifications`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ currentUser: currentUser })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            const newNotifications = data.notificationsList;

            if (newNotifications.length > 0) {
                // Activate new notifications
                // newNotifications.forEach(notification => {
                //     // Logic to activate the notification (e.g., display it, play a sound, etc.)
                //     console.log('New notification:', notification);
                // });
                // Update the previous notifications list
                prevNotificationsList = data.notificationsList;
                // Update the bell icon to indicate new notifications
                const bellIcon = document.getElementById('bell-icon');
                bellIcon.style.color = 'red'; // Change color to indicate a new notification
            }
            prevNotificationsList = data.notificationsList;
        }
    })
    .catch(error => {
        console.error('Error checking notifications:', error);
    });
}

// Function to calculate the delay until the next 2-minute interval
function getDelayUntilNextInterval(intervalMinutes) {
    const now = new Date();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    const nextIntervalMinutes = Math.ceil(minutes / intervalMinutes) * intervalMinutes;
    const delayMinutes = nextIntervalMinutes - minutes;
    const delaySeconds = (delayMinutes * 60) - seconds;
    return delaySeconds * 1000; // Convert to milliseconds
}

// Function to start the polling process with a configurable interval
export function startNotificationsChecker(intervalMinutes = 2) {
    setTimeout(() => {
        // Start polling every `intervalMinutes` minutes
        setInterval(checkNotifications, intervalMinutes * 60 * 1000);
        // Initial call to check for notifications immediately
        checkNotifications();
    }, getDelayUntilNextInterval(intervalMinutes));
}