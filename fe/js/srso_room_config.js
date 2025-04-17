import API_URL from '../js/api.js';
import { currentUser } from '../js/main.js';

const SRSO_ROOM_CONF_API = `${API_URL}/srso-room-config`;

// Function to load room configuration view
export function loadSRSORoomConfigView() {
    console.log('[INFO]: Loading room configuration view...');
    // Search room by ID  
    getRoomByCampus('CS1');
    setupRoomConfigView();
}
async function getRoomByCampus(campus) {
    console.log(`[INFO]: Get room by campus ${campus}...`);
    try {
        // Fetch room data from the server
        const response = await fetch(`${SRSO_ROOM_CONF_API}/get-room-by-campus?cs=${campus}`);

        const data = await response.json();

        if (data.success) {
            const roomList = document.getElementById('srso-room-list');
            roomList.innerHTML = ''; // Clear existing content

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
                    <td><a href="${room.cameraLink}">Link</a></td>
                `;
                roomList.appendChild(row);
            });
        } else {
            alert('Không thể tải danh sách phòng.');
        }
    } catch (error) {
        console.error('Error loading rooms:', error);
        alert('Có lỗi xảy ra khi tải danh sách phòng.');
    }
}
async function getRoomByID(roomId) {
    console.log(`[INFO]: Get room by ID ${roomId}...`);
    try {
        const response = await fetch(`${SRSO_ROOM_CONF_API}/get-room-by-id?roomId=${roomId}`);
        const data = await response.json();
        console.log(data);
        if(data.success) {
            const roomList = document.getElementById('srso-room-list');
            roomList.innerHTML = ''; // Clear existing content
            const room = data.room;
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${room.campus}</td> 
                <td>${room.building}</td>
                <td>${room.floor}</td>
                <td>${room.room}</td>
                <td>${room.capacity}</td>
                <td>${room.equipment}</td>
                <td>${room.status}</td>
                <td><a href="${room.cameraLink}">Link</a></td>
            `;
            roomList.appendChild(row);
        }
        else {
            alert('Không tìm thấy phòng.');
        }
    } catch (error) {
        console.error('Error loading rooms:', error);
        alert('Có lỗi xảy ra khi tải danh sách phòng.');
    }

}

function setActiveButton(buttonId) {
    document.querySelectorAll('.srso-campus-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.getElementById(buttonId).classList.add('active');
}

async function setupRoomConfigView() {
    // Add event listeners for buttons
    document.getElementById('srso-add-room-btn').addEventListener('click', () => {
        // Logic to add a room
        console.log('Add room');
    });
    
    document.getElementById('srso-edit-room-btn').addEventListener('click', () => {
        // Logic to edit a room
        console.log('Edit room');
    });
    
    document.getElementById('srso-delete-room-btn').addEventListener('click', () => {
        // Logic to delete a room
        console.log('Delete room');
    });
    
    // Press "Cơ sở 1" button
    document.getElementById('srso-campus-1-btn').addEventListener('click', () => {
        console.log('[INFO]: Change to CS1 room list'); // Corrected log message to reflect the button clicked
        setActiveButton('srso-campus-1-btn');
        getRoomByCampus('CS1');
    });
    // Press "Cơ sở 2" button
    document.getElementById('srso-campus-2-btn').addEventListener('click', () => {
        console.log('[INFO]: Change to CS2 room list'); // Corrected log message to reflect the button clicked
        setActiveButton('srso-campus-2-btn');
        getRoomByCampus('CS2');
    });

    const searchInput = document.getElementById('srso-search-room');
    searchInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            const roomId = searchInput.value.trim();
            if (roomId) {
                getRoomByID(roomId);
            }
            else {
            const activeButton = document.querySelector('.srso-campus-btn.active');
            if (activeButton) {
                const campus = activeButton.id === 'srso-campus-1-btn' ? 'CS1' : 'CS2';
                getRoomByCampus(campus);
            }
            }
        }
    });
}
