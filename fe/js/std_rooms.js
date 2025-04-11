import API_URL from './api.js';
import { currentUser } from './main.js';

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
                <td>${availableTimes}</td>
                <td><a href="#" class="reserve-room" data-room-id="${room.roomId}">Đặt phòng</a></td>
            `;
            // Open reserve-room menu
            row.querySelector('.reserve-room').addEventListener('click', function(event) {
                event.preventDefault(); // Prevent default link behavior
                const roomId = this.getAttribute('data-room-id');
                showReserveRoomMenu(roomId, room);
            });
            roomList.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading rooms:', error);
    }
}

async function loadRoomsByID(roomId) {
    try {
        const response = await fetch(`${ROOMS_API}/room-id?roomId=${roomId}`);
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
            <td>${availableTimes}</td>
            <td><a href="#" class="reserve-room" data-room-id="${room.roomId}">Đặt phòng</a></td>
        `;
        // Open reserve-room menu
        row.querySelector('.reserve-room').addEventListener('click', function(event) {
            event.preventDefault(); // Prevent default link behavior
            const roomId = this.getAttribute('data-room-id');
            showReserveRoomMenu(roomId, room);
        });
        roomList.appendChild(row);
    } catch (error) {
        console.error('Error loading room by ID:', error);
    }
}


function showReserveRoomMenu(roomId, room) {
    // Logic to navigate to the booking UI
    console.log("[INFO]: Show reserve-room menu");
    console.log(`[INFO]: Reserve-room menu of room: ${roomId}`);
    // Populate room information
        const roomCampus = document.getElementById('room-campus');
    roomCampus.innerHTML = `<strong>${room.campus}</strong>`;
    roomCampus.style.color = '#1a237e'; // Set color for room campus

    const roomBuilding = document.getElementById('room-building');
    roomBuilding.innerHTML = `<strong>${room.building}</strong>`;
    roomBuilding.style.color = '#1a237e'; // Set color for room building

    const roomFloor = document.getElementById('room-floor');
    roomFloor.innerHTML = `<strong>${room.floor}</strong>`;
    roomFloor.style.color = '#1a237e'; // Set color for room floor

    const roomNumber = document.getElementById('room-number');
    roomNumber.innerHTML = `<strong>${room.room}</strong>`;
    roomNumber.style.color = '#1a237e'; // Set color for room number

    const roomCapacity = document.getElementById('room-capacity');
    roomCapacity.innerHTML = `<strong>${room.capacity}</strong>`;
    roomCapacity.style.color = '#1a237e'; // Set color for room capacity

    const roomEquipment = document.getElementById('room-equipment');
    roomEquipment.innerHTML = `<strong>${room.equipment}</strong>`; // Set equipment text in bold
    roomEquipment.style.color = '#1a237e'; // Set color for room equipment

    // Align text to the center
    [roomCampus, roomBuilding, roomFloor, roomNumber, roomCapacity, roomEquipment].forEach(element => {
        element.style.textAlign = 'center';
    });

    // Generate member list based on room capacity
    if (room.capacity > 1) { // If the number of student > 1 -> require remaining member id
        const memberListContainer = document.getElementById('reserve-menu-member-list');
        memberListContainer.innerHTML = '<p><strong>Danh sách thành viên còn lại:</strong></p>'; // Clear existing content
        for (let i = 0; i < (room.capacity - 1); i++) {
            const memberInput = document.createElement('div');
            memberInput.innerHTML = `
                <input type="text" placeholder="MSSV" />
            `;
            memberListContainer.appendChild(memberInput);
        }
    }
        // Generate time slots as checkboxes
        const timeSlotsContainer = document.getElementById('reserve-menu-time-slots');
        // timeSlotsContainer.innerHTML = '<p>Thời gian tự học:</p>'; // Clear existing content\
        timeSlotsContainer.innerHTML = room.time.map(time => `
            <label style="color: ${time.status === 'Occupied' ? 'gray' : 'black'};">
                <input type="checkbox" ${time.status === 'Occupied' ? 'disabled' : ''} /> ${time.slot}
            </label>
        `).join('');

    // Display the modal
    document.getElementById('reserve-room-menu').style.display = 'block';

    // Example: Disable already booked time slots
    // const bookedSlots = ['9:00-10:00']; // Example booked slots
    document.querySelectorAll('.reserve-menu-time-slot').forEach(slot => {
        if (bookedSlots.includes(slot.textContent)) {
            slot.classList.add('disabled');
        }
    });

    const closeButton = document.getElementById('reserve-menu-close-btn');
    closeButton.addEventListener('click', () => {
        closeReserveRoomMenu();
    });
    const cancelButton = document.getElementById('reserve-menu-cancel-btn');
    cancelButton.addEventListener('click', () => {
        closeReserveRoomMenu();
    });
    const confirmButton = document.getElementById('reserve-menu-confirm-btn');
    confirmButton.addEventListener('click', () => {
        requestReservation();
    });
    
}

function closeReserveRoomMenu() {
    console.log('[INFO]: Cancel reservation');
    document.getElementById('reserve-room-menu').style.display = 'none';
}

function requestReservation() {
    // Gather room ID
    const roomId = document.getElementById('room-number').textContent.trim();
    const roomBuilding = document.getElementById('room-building').textContent.trim();

    // Gather MSSV information
    const mssvInputs = document.querySelectorAll('#reserve-menu-member-list input[type="text"]');
    const mssvList = Array.from(mssvInputs).map(input => input.value.trim()).filter(value => value);

    // Gather selected time slots
    const selectedTimeSlots = [];
    document.querySelectorAll('#time-slots input[type="checkbox"]:checked').forEach(checkbox => {
        selectedTimeSlots.push(checkbox.nextElementSibling.textContent.trim());
    });

    // Create reservation data
    const reservationData = {
        hostId: currentUser.id,
        hostRole: currentUser.role,
        memId: mssvList,
        roomId: `${roomBuilding}-${roomId}`,
        time: selectedTimeSlots
    };

    // Send API request
    fetch(`${ROOMS_API}/reserve`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(reservationData)
    })
    .then(response => response.json())
    .then(data => {
        // Handle server response
        if (data.success) {
            alert('Đặt phòng thành công!');
            closeReserveRoomMenu();
        } else {
            alert(`Đặt phòng thất bại: ${data.message}`);
        }
    })
}

function setActiveButton(buttonId) {
    document.querySelectorAll('.cs-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.getElementById(buttonId).classList.add('active');
}

async function showAdvancedSearchMenu() {
    try {
        const devicesResponse = await fetch(`${API_URL}/rooms/special-devices`);
        const devicesData = await devicesResponse.json();
        const devicesContainer = document.getElementById('special-devices');
        devicesContainer.innerHTML = devicesData.devices.map(device => `
            <label>
                <input type="checkbox" /> ${device}
            </label>
        `).join('');

        const timeSlotsResponse = await fetch(`${API_URL}/rooms/time-slots`);
        const timeSlotsData = await timeSlotsResponse.json();
        const timeSlotsContainer = document.getElementById('time-slots');
        timeSlotsContainer.innerHTML = timeSlotsData.timeSlots.map(slot => `
            <label style="color: ${slot.status === 'Past' ? 'gray' : 'black'};">
                <input type="checkbox" ${slot.status === 'Past' ? 'disabled' : ''} /> ${slot.slot}
            </label>
        `).join('');

        document.getElementById('advanced-search-menu').style.display = 'flex';
    } catch (error) {
        console.error('Error loading advanced reservation data:', error);
    }
}

function hideAdvancedSearchMenu() {
    document.getElementById('advanced-search-menu').style.display = 'none';
}

function searchRooms() {
    // Gather selected options
    const campusCheckbox = document.querySelector('input[placeholder="Vd: 1, 2"]');
    const buildingCheckbox = document.querySelector('input[placeholder="Vd: C6, H3"]');
    const floorCheckbox = document.querySelector('input[placeholder="Vd: 1, 2, 6"]');

    const campus = campusCheckbox.checked ? campusCheckbox.value : null;
    const building = buildingCheckbox.checked ? buildingCheckbox.value : null;
    const floor = floorCheckbox.checked ? floorCheckbox.value : null;

    const specialDevices = Array.from(document.querySelectorAll('#special-devices input[type="checkbox"]:checked'))
        .map(checkbox => checkbox.nextSibling.textContent.trim());

    const timeSlots = Array.from(document.querySelectorAll('#time-slots input[type="checkbox"]:checked'))
        .map(checkbox => checkbox.nextSibling.textContent.trim());

    // Create JSON object
    const searchCriteria = {
        campus: campus,
        building: building,
        floor: floor,
        specialDevices: specialDevices,
        timeSlots: timeSlots
    };

    // Send API request
    fetch(`${ROOMS_API}/room-metadata`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(searchCriteria)
    })
    .then(response => response.json())
    .then(data => {
        const roomList = document.getElementById('room-list');
        roomList.innerHTML = ''; // Clear existing rows

        // Display the number of rooms found
        alert(`Tìm thấy ${data.rooms.length} phòng tương thích.`);
        // Populate roomList with the returned rooms
        data.rooms.forEach(room => {
            // Get available time slots
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
                <td>${availableTimes}</td>
                <td><a href="#" class="reserve-room" data-room-id="${room.roomId}">Đặt phòng</a></td>
            `;
            // Open reserve-room menu
            row.querySelector('.reserve-room').addEventListener('click', function(event) {
                event.preventDefault(); // Prevent default link behavior
                const roomId = this.getAttribute('data-room-id');
                showReserveRoomMenu(roomId, room);
            });
            roomList.appendChild(row);
        });
        if (data.rooms.length > 0) {    // Find a room, then hide the advanced reservation menu
            hideAdvancedSearchMenu();
        }
    })
    .catch(error => {
        console.error('Error searching rooms:', error);
    });
}

function refreshSearchFilters() {
    console.log('Refreshing search filters');
    // Find the active campus button
    const activeCampusButton = document.querySelector('.cs-btn.active');
    console.log('activeCampusButton: ', activeCampusButton);
    if (activeCampusButton) {
        const campusButtonId = activeCampusButton.id; // Get the ID of the active campus button
        console.log('campus button ID: ', campusButtonId);
        if (campusButtonId === 'cs1-btn') {
            loadRoomsByCampus('CS1');
        } else if (campusButtonId === 'cs2-btn') {
            loadRoomsByCampus('CS2');
        }
    } else {
        console.error('No active campus found');
    }
    // Clear the search input box
    const searchInput = document.getElementById('room-id-search');
    if (searchInput) {
        searchInput.value = '';
    }

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
    document.getElementById('advanced-search-menu-btn').addEventListener('click', () => {
        console.log('Advanced search menu opened');
        // Logic to display the advanced search menu
        // Example: showAdvancedSearchMenu();
        showAdvancedSearchMenu();
        document.getElementById('advanced-search-btn').addEventListener('click', () => {
            console.log('Advanced search button clicked');
            // Logic to handle the advanced search
            searchRooms();
        });
        document.getElementById('advanced-search-cancel-btn').addEventListener('click', () => {
            console.log('Advanced search cancel button clicked');
            // Logic to handle the advanced search cancel
            hideAdvancedSearchMenu();
        });
    });
    // Refresh search filters
    document.getElementById('refresh-search-filters').addEventListener('click', () => {
        console.log('Refresh search filters button clicked');
        // Logic to refresh the search filters
        refreshSearchFilters();
    });

    setActiveButton('cs1-btn'); // Set CS1 as active by default
    loadRoomsByCampus('CS1'); // Load CS1 by default
}