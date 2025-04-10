import API_URL from './api.js';

// Function to get room rules from the backend
export async function getRoomRule() {
    try {
        const response = await fetch(`${API_URL}/room/rules`);
        if (!response.ok) throw new Error('Failed to fetch room rules');

        const data = await response.json();
        return data.rules.map((rule, index) => `${index + 1}. ${rule.text}`).join('<br>'); // Append ID to each rule
    } catch (error) {
        console.error('Error fetching room rules:', error);
        return 'Không thể tải quy tắc phòng'; // Return a default error message
    }
}

async function loadRooms(cs) {
    try {
        const response = await fetch(`${API_URL}/rooms?cs=${cs}`);
        if (!response.ok) throw new Error('Failed to fetch room data');
        
        const data = await response.json();
        const roomList = document.getElementById('room-list');
        roomList.innerHTML = ''; // Clear existing rows

        data.rooms.forEach(room => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${room.campus}</td>
                <td>${room.building}</td>
                <td>${room.floor}</td>
                <td>${room.room}</td>
                <td>${room.capacity}</td>
                <td>${room.equipment}</td>
                <td>${room.status}</td>
                <td><a href="#" onclick="bookRoom('${room.roomId}')">Đặt phòng</a></td>
            `;
            roomList.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading rooms:', error);
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
    const btn = document.getElementById('cs1-btn');
    document.getElementById('cs1-btn').addEventListener('click', () => {
        console.log('from cs1 click');
        setActiveButton('cs1-btn');
        loadRooms('CS1');
    });
    document.getElementById('cs2-btn').addEventListener('click', () => {
        console.log('from cs2 click'); // Corrected log message to reflect the button clicked
        setActiveButton('cs2-btn');
        loadRooms('CS2');
    });
    setActiveButton('cs1-btn'); // Set CS1 as active by default
    loadRooms('CS1'); // Load CS1 by default
}