import API_URL from './api.js';
import { currentUser } from './main.js';

const RESERVATIONS_API = `${API_URL}/reservations`;
let detailUsingRoomButton;
let checkoutUsingRoomButton;
let currentReservationCard;
let currentUsingRoomCard;
export async function loadReservationsView() {
    console.log('[INFO]: Loading reservations view...');
    try {
        // Fetch reservations from the server
        const response = await fetch(`${RESERVATIONS_API}/get-reservations`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId: `${currentUser.id}` })
        });

        const data = await response.json();

        if (data.success) {
            console.log('[INFO]: Using room data:', data.usingStatus);
            if(data.userStatus == "Using") {
                const usingRoomList = document.getElementById('using-room-list');
                usingRoomList.innerHTML = ''; // Clear existing content
                const usingRoom = data. usingStatus; // Assuming usingStatus has only one element
                const card = document.createElement('div');
                card.className = 'using-room-card';
                card.innerHTML = `
                    <div class="using-room-info">
                        <p>Cơ sở: ${usingRoom.campus}</p>
                        <p>Phòng: ${usingRoom.roomId}</p>
                        <p>Thời gian: ${usingRoom.time}</p>
                    </div>
                    <div class="using-room-buttons">
                        <button class="detail-using-room-button" id="detail-using-room-button">Chi tiết</button>
                        <button class="checkout-using-room-button" id="checkout-using-room-button">Rời phòng</button>
                    </div>
                `;
                card.querySelector('.detail-using-room-button').addEventListener('click', () => {
                    // TODO: 
                    console.log('[INFO]: ------ Show detail using room:');
                    showDetailUsingRoom(usingRoom);
                });
                card.querySelector('.checkout-using-room-button').addEventListener('click', () => {
                    // TODO: 
                    showCheckoutUsingRoom(usingRoom);
                });
                usingRoomList.appendChild(card);
            }
            
            const reservationList = document.getElementById('reservation-list');
            reservationList.innerHTML = ''; // Clear existing content

            data.reservations.forEach(reservation => {
                const card = document.createElement('div');
                card.className = 'reservation-card';
                card.innerHTML = `
                    <div class="reservation-info">
                        <p>Cơ sở: ${reservation.campus}</p>
                        <p>Phòng: ${reservation.roomId}</p>
                        <p>Thời gian: ${reservation.time}</p>
                    </div>
                    <div class="reservation-buttons">
                        <button class="check-in-button" id="check-in-button">Nhận phòng</button>
                        <button class="cancle-reservation-button" id="cancle-reservation-button">Hủy đặt</button>
                    </div>
                `;

                // card.addEventListener('click', () => {
                //     // Show detailed reservation info
                //     alert(`Chi tiết đặt phòng: ${reservation.details}`);
                // });
                card.querySelector('.check-in-button').addEventListener('click', () => {
                    showCheckinMenu(reservation);
                });

                card.querySelector('.cancle-reservation-button').addEventListener('click', () => {
                    showCancelReservationMenu(reservation);
                });
                reservationList.appendChild(card);
            });
        } else {
            alert('Không thể tải danh sách đặt phòng.');
        }
    } catch (error) {
        console.error('Error loading reservations:', error);
        alert('Có lỗi xảy ra khi tải danh sách đặt phòng.');
    }
    
    document.querySelector('.checkout-back-btn').addEventListener('click', closeCheckoutUsingRoomModal);
    document.querySelector('.checkout-confirm-btn').addEventListener('click', confirmCheckoutUsingRoom);
    document.querySelector('.cancel-reservation-confirm-btn').addEventListener('click', confirmCancelReservation);
    document.querySelector('.cancel-reservation-back-btn').addEventListener('click', closeCancelModal);
}

async function showCheckinMenu(reservation) {
    console.log('[INFO]: Show checkin menu:', reservation);
    try {
        // Send API request to get the password
        const response = await fetch(`${RESERVATIONS_API}/get-room-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                reservationId: reservation.reservationId,
                userId: currentUser.id,
                roomId: reservation.roomId,
                time: reservation.time
            })
        });

        const data = await response.json();

        if (data.success) {
            // Display the password
            document.getElementById('checkin-menu-room-password').value = data.password;
            document.getElementById('checkin-menu').style.display = 'block';
        } else {
            alert(`${data.message}`);
        }
    } catch (error) {
        console.error('Error fetching room password:', error);
        alert('Có lỗi xảy ra khi lấy mật khẩu phòng.');
    }
    const backButton = document.querySelector('.checkin-menu-back-btn');
    backButton.addEventListener('click', closeCheckinMenu);
}

function closeCheckinMenu() {
    document.getElementById('checkin-menu').style.display = 'none';
}

function showCancelReservationMenu(reservation) {
    currentReservationCard = reservation;
    document.getElementById('cancel-reservation-modal').style.display = 'block';
}

function closeCancelModal() {
    document.getElementById('cancel-reservation-modal').style.display = 'none';
}

async function confirmCancelReservation() {
    // Logic to cancel the reservation
    console.log(`Cancel reservation: ${currentReservationCard.roomId} - ${currentReservationCard.time}`);
    const response = await fetch(`${RESERVATIONS_API}/cancel-reservation`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },  
        body: JSON.stringify({ 
            reservationId: currentReservationCard.reservationId,
            userId: currentUser.id,
            roomId: currentReservationCard.roomId,
            time: currentReservationCard.time
        })
    });
    const data = await response.json();
    if (data.success) {
        console.log('[INFO]]: Cancle reservation successfully.');
        closeCancelModal();
        loadReservationsView();
    } else {
        alert(`${data.message}`);
    }
}

async function showDetailUsingRoom(usingRoom) {
    console.log('[INFO]: Show detail using room:', usingRoom);

    // Populate room details
    document.getElementById('using-room-menu-room-id').textContent = usingRoom.roomId;
    document.getElementById('using-room-menu-campus').textContent = usingRoom.campus;
    document.getElementById('using-room-menu-time').textContent = usingRoom.time;


    // Calculate remaining time
    const endTime = usingRoom.time.split(' - ')[1];
    const [endHour, endMinute] = endTime.split(':').map(Number);
    const endDate = new Date();
    endDate.setHours(endHour, endMinute, 0, 0);

    const timer = setInterval(updateRemainingTime, 1000);
    
    function updateRemainingTime() {
        const now = new Date();
        const remainingTime = endDate - now;
        if (remainingTime > 0) {
            const hours = Math.floor((remainingTime / (1000 * 60 * 60)) % 24);
            const minutes = Math.floor((remainingTime / (1000 * 60)) % 60);
            const seconds = Math.floor((remainingTime / 1000) % 60);
            document.getElementById('using-room-menu-remaining-time').textContent = `${hours}h ${minutes}m ${seconds}s`;
        } else {
            document.getElementById('using-room-menu-remaining-time').textContent = 'Hết giờ';
            clearInterval(timer);
        }
    }

    updateRemainingTime();

    // Display the modal
    document.getElementById('detail-using-room-modal').style.display = 'block';

    document.getElementById('checkin-menu-back-btn').addEventListener('click', () => {
        closeDetailUsingRoomModal();
        clearInterval(timer);
    });
}

function closeDetailUsingRoomModal() {
    document.getElementById('detail-using-room-modal').style.display = 'none';
}

function showCheckoutUsingRoom(usingRoom) {
    currentUsingRoomCard = usingRoom;
    console.log('[INFO]: Checkout using room:', usingRoom);
    document.getElementById('checkout-using-room-modal').style.display = 'block';
}

function confirmCheckoutUsingRoom() {
    console.log(`[INFO]: Confirm checkout using room: ${currentUsingRoomCard}`);
    try {
        const currentTime = new Date().toISOString(); // Get current time in ISO format
        fetch(`${RESERVATIONS_API}/checkout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                usingStatus: currentUsingRoomCard,
                userId: currentUser.id,
                checkoutTime: currentTime // Include current time in the request
            }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                console.log('[INFO]: Checkout successful!');
                closeCheckoutUsingRoomModal(); // Close modal after successful checkout
                loadReservationsView();
            } else {
                console.log('[INFO]: Checkout failed: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error during checkout:', error);
            alert('An error occurred during checkout.');
        });
    } catch (error) {
        console.error('[ERROR]:', error);
        alert('Có lỗi xảy ra khi thực hiện hủy đặt phòng.');
    }
}

function closeCheckoutUsingRoomModal() {
    console.log('[INFO]: Close checkout using room modal.');
    // document.querySelector('.checkout-confirm-btn').removeEventListener('click');
    document.getElementById('checkout-using-room-modal').style.display = 'none';
}
