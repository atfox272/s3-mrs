import API_URL from '../js/api.js';
import { currentUser } from '../js/main.js';

const SRSO_ROOM_CONF_API = `${API_URL}/srso-room-config`;
let roomEquipment = null;

// Function to load room configuration view
export function loadSRSORoomConfigView() {
    console.log('[INFO]: Loading room configuration view...');
    // Search room by ID  
    getRoomByCampus(1);
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
                    <td>${room.equipment.map(eq => eq.name).join(', ')}</td>
                    <td>${room.status}</td>
                    <td><a href="${room.cameraLink}">Link</a></td>
                `;
                row.addEventListener('click', () => showRoomEditMenu(room));
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
                <td>${room.equipment.map(eq => eq.name).join(', ')}</td>
                <td>${room.status}</td>
                <td><a href="${room.cameraLink}">Link</a></td>
            `;
            row.addEventListener('click', () => showRoomEditMenu(room));
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
        showAddRoomModal();
    });
    
    // Press "Cơ sở 1" button
    document.getElementById('srso-campus-1-btn').addEventListener('click', () => {
        console.log('[INFO]: Change to CS1 room list'); // Corrected log message to reflect the button clicked
        setActiveButton('srso-campus-1-btn');
        getRoomByCampus(1);
    });
    // Press "Cơ sở 2" button
    document.getElementById('srso-campus-2-btn').addEventListener('click', () => {
        console.log('[INFO]: Change to CS2 room list'); // Corrected log message to reflect the button clicked
        setActiveButton('srso-campus-2-btn');
        getRoomByCampus(2);
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
                const campus = activeButton.id === 'srso-campus-1-btn' ? 1 : 2;
                getRoomByCampus(campus);
            }
            }
        }
    });

    // Add event listener for the add room modal
    document.getElementById('srso-room-config-add-confirm-btn').addEventListener('click', () => {
        confirmAddRoom();
    }); 
    document.getElementById('srso-room-config-add-cancel-btn').addEventListener('click', () => {
        closeAddRoomModal();
    });
    // Add event listener for the edit room modal close button
    document.getElementById('srso-room-edit-close-btn').addEventListener('click', () => {
        closeRoomEditModal();
    });
}

async function showAddRoomModal() {
    console.log('[INFO]: Open add room modal...');
    try {
        // Fetch options for "Cơ sở" and "Thiết bị"
        const response = await fetch(`${SRSO_ROOM_CONF_API}/get-room-options`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        console.log(data);

        if (data.success) {
            // Populate "Cơ sở" options
            const campusSelect = document.getElementById('srso-room-config-campus-select');
            campusSelect.innerHTML = ''; // Clear existing options
            data.campuses.forEach(campus => {
                const option = document.createElement('option');
                option.value = campus.id;
                option.textContent = campus.name;
                campusSelect.appendChild(option);
            });

            // Populate "Thiết bị" options with checkboxes
            roomEquipment = data.equipment;
            const equipmentContainer = document.getElementById('srso-room-config-equipment');
            equipmentContainer.innerHTML = ''; // Clear existing options
            data.equipment.forEach(item => {
                const label = document.createElement('label');
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.value = item.id;
                label.appendChild(checkbox);
                label.appendChild(document.createTextNode(` ${item.name}`));
                equipmentContainer.appendChild(label);
            });

            // Show the modal
            document.getElementById('srso-room-config-add-modal').style.display = 'block';
        } else {
            alert('Không thể tải danh sách tùy chọn.');
        }
    } catch (error) {
        console.error('Error loading room options:', error);
        alert('Có lỗi xảy ra khi tải danh sách tùy chọn.');
    }
}

function closeAddRoomModal() {
    document.getElementById('srso-room-config-add-modal').style.display = 'none';
}

function confirmAddRoom() {
    const campus = document.getElementById('srso-room-config-campus-select').value;
    const building = document.getElementById('srso-room-config-building-input').value;
    const floor = document.getElementById('srso-room-config-floor-input').value;
    const room = document.getElementById('srso-room-config-room-input').value;
    const capacity = document.getElementById('srso-room-config-capacity-input').value;
    const equipment = Array.from(document.querySelectorAll('#srso-room-config-equipment input:checked')).map(input => {
        const equipmentItem = roomEquipment.find(eq => eq.id === input.value);
        return {
            id: equipmentItem.id,
            name: equipmentItem.name
        };
    });

    console.log('[INFO]: Adding new room:', { campus, building, floor, room, capacity, equipment });
    fetch(`${SRSO_ROOM_CONF_API}/add-room`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            campus: campus,
            building: building,
            floor: floor,
            room: room,
            capacity: capacity,
            equipment: equipment
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Thêm phòng thành công!. Nhấp "OK" để đóng cửa sổ thêm phòng.');
            closeAddRoomModal();
            const activeButton = document.querySelector('.srso-campus-btn.active');
            const currentCampus = activeButton ? (activeButton.id === 'srso-campus-1-btn' ? 1 : 2) : campus;
            getRoomByCampus(currentCampus);
        } else {
            alert('Thêm phòng thất bại: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error adding room:', error);
        alert('Có lỗi xảy ra khi thêm phòng.');
    });
    // Close the modal
}

async function showRoomEditMenu(room) {
    console.log('[INFO]: Opening edit menu for room:', room);
    try {
        // Fetch full list of equipment
        const response = await fetch(`${SRSO_ROOM_CONF_API}/get-room-options`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        
        if (data.success) {
            roomEquipment = data.equipment;
            // Populate the modal with room details
            document.getElementById('edit-campus').value = room.campus;
            document.getElementById('edit-building').value = room.building;
            document.getElementById('edit-floor').value = room.floor;
            document.getElementById('edit-room').value = room.room;
            document.getElementById('edit-capacity').value = room.capacity;

            // Populate equipment checkboxes similar to add room
            roomEquipment = data.equipment;
            const equipmentContainer = document.getElementById('edit-equipment');
            equipmentContainer.innerHTML = ''; // Clear existing checkboxes
            roomEquipment.forEach(equip => {
                const label = document.createElement('label');
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.value = equip.id;
                checkbox.checked = room.equipment.some(roomEquip => roomEquip.id === equip.id); // Check if the equipment is in the room
                label.appendChild(checkbox);
                label.appendChild(document.createTextNode(` ${equip.name}`));
                equipmentContainer.appendChild(label);
            });

            // Show the modal
            document.getElementById('srso-room-edit-modal').style.display = 'block';
        } else {
            alert('Không thể tải danh sách thiết bị.');
        }
    } catch (error) {
        console.error('Error loading equipment options:', error);
        alert('Có lỗi xảy ra khi tải danh sách thiết bị.');
    }

    // Handle update action
    document.getElementById('update-room-btn').onclick = function() {
        const updatedRoom = {
            campus: document.getElementById('edit-campus').value,
            building: document.getElementById('edit-building').value,
            floor: document.getElementById('edit-floor').value,
            room: document.getElementById('edit-room').value,
            capacity: document.getElementById('edit-capacity').value,
            equipment: Array.from(document.querySelectorAll('#edit-equipment input:checked')).map(input => {
                const equipmentItem = roomEquipment.find(eq => eq.id === input.value);
                return {
                    id: equipmentItem.id,
                    name: equipmentItem.name
                };
            })
        };
        updateRoomHandler(updatedRoom);
    };

    // Handle delete action
    document.getElementById('delete-room-btn').onclick = function() {
        deleteRoomHandler(room);
    };
}

function closeRoomEditModal() {
    document.getElementById('srso-room-edit-modal').style.display = 'none';
}

async function deleteRoomHandler(room) {
    console.log('[INFO]: Deleting room:', room);
    // Add logic to delete the room from the server
    fetch(`${SRSO_ROOM_CONF_API}/delete-room`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(room)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Xóa phòng thành công!. Nhấp "OK" để đóng cửa sổ chỉnh sửa phòng.');
            closeRoomEditModal();
            getRoomByCampus(room.campus);   
        } else {
            alert('Xóa phòng thất bại: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error deleting room:', error);
        alert('Có lỗi xảy ra khi xóa phòng.');
    });
}

async function updateRoomHandler(updatedRoom) {
    console.log('[INFO]: Updating room:', updatedRoom);
    // Add logic to update the room on the server
    fetch(`${SRSO_ROOM_CONF_API}/update-room`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedRoom)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Cập nhật phòng thành công!. Nhấp "OK" để đóng cửa sổ chỉnh sửa phòng.');
            closeRoomEditModal();
            getRoomByCampus(updatedRoom.campus);
        } else {
            alert('Cập nhật phòng thất bại: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error updating room:', error);
        alert('Có lỗi xảy ra khi cập nhật phòng.');
    });
}



