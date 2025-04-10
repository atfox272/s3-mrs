import API_URL from './api.js';

const ROOMS_API = `${API_URL}/rooms`;

// Function to get room rules from the backend
export async function getRoomRule() {
    try {
        const response = await fetch(`${ROOMS_API}/rules`);
        if (!response.ok) throw new Error('Failed to fetch room rules');

        const data = await response.json();
        return data.rules.map((rule, index) => `${index + 1}. ${rule.text}`).join('<br>'); // Append ID to each rule
    } catch (error) {
        console.error('Error fetching room rules:', error);
        return 'Không thể tải quy tắc phòng'; // Return a default error message
    }
}

async function loadRoomsByCampus(cs) {
    try {
        const response = await fetch(`${ROOMS_API}/campus?cs=${cs}`);
        if (!response.ok) throw new Error('Failed to fetch room data');
        
        const data = await response.json();
        const roomList = document.getElementById('room-list');
        roomList.innerHTML = ''; // Clear existing rows

        data.rooms.forEach(room => {
            const availableTimes = room.time
                .filter(slot => slot.status === "Available") // Filter for available time slots
                .map(slot => slot.slot) // Extract the time slots
                .join(', '); // Join them into a string

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${room.campus}</td>
                <td>${room.building}</td>
                <td>${room.floor}</td>
                <td>${room.room}</td>
                <td>${room.capacity}</td>
                <td>${room.equipment}</td>
                <td>${room.status}</td>
                <td>${availableTimes}</td> <!-- Display only available time slots -->
                <td><a href="#" onclick="bookRoom('${room.roomId}')">Đặt phòng</a></td>
            `;
            roomList.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading rooms:', error);
    }
}

async function loadRoomsByID(roomId) {
    try {
        const response = await fetch(`${ROOMS_API}/room?roomId=${roomId}`);
        if (!response.ok) throw new Error('Failed to fetch room data');

        const data = await response.json();
        const roomList = document.getElementById('room-list');
        roomList.innerHTML = ''; // Clear existing rows

        // Assuming the API returns a single room object
        const room = data.room;
        const availableTimes = room.time
                .filter(slot => slot.status === "Available") // Filter for available time slots
                .map(slot => slot.slot) // Extract the time slots
                .join(', '); // Join them into a string
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${room.campus}</td>
            <td>${room.building}</td>
            <td>${room.floor}</td>
            <td>${room.room}</td>
            <td>${room.capacity}</td>
            <td>${room.equipment}</td>
            <td>${room.status}</td>
            <td>${availableTimes}</td> <!-- Display only available time slots -->
            <td><a href="#" onclick="bookRoom('${room.roomId}')">Đặt phòng</a></td>
        `;
        roomList.appendChild(row);
    } catch (error) {
        console.error('Error loading room by ID:', error);
    }
}

function bookRoom(roomId) {
    // Logic to navigate to the booking UI
    console.log(`Booking room: ${roomId}`);
    // Example: loadView('booking', { roomId });
}

function setActiveButton(buttonId) {
    document.querySelectorAll('.cs-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.getElementById(buttonId).classList.add('active');
}

export async function loadStdRoomView() {
    console.log('from std_room.js');
    // Search room by ID    
    const searchInput = document.getElementById('room-id-search');
    if (searchInput) {
        console.log('Input something...');
        searchInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                const roomId = searchInput.value.trim();
                if (roomId) {
                    loadRoomsByID(roomId);
                }
            }
        });
    }
    // Press "Cơ sở 1" button
    document.getElementById('cs1-btn').addEventListener('click', () => {
        console.log('from cs1 click');
        setActiveButton('cs1-btn');
        loadRoomsByCampus('CS1');
    });
    // Press "Cơ sở 2" button
    document.getElementById('cs2-btn').addEventListener('click', () => {
        console.log('from cs2 click'); // Corrected log message to reflect the button clicked
        setActiveButton('cs2-btn');
        loadRoomsByCampus('CS2');
    });
    // Open advanced reservation menu
    document.getElementById('advanced-reservation-btn').addEventListener('click', () => {
        console.log('Advanced reservation menu opened');
        // Logic to display the advanced booking menu
        // Example: showAdvancedBookingMenu();
    });

    setActiveButton('cs1-btn'); // Set CS1 as active by default
    loadRoomsByCampus('CS1'); // Load CS1 by default
}