import API_URL from './api.js';
import { currentUser } from './main.js';

const RESERVATIONS_API = `${API_URL}/reservations`;

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
}

async function showCheckinMenu(reservation) {
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
    document.getElementById('cancel-reservation-modal').style.display = 'block';
    const confirmButton = document.querySelector('.cancel-reservation-confirm-btn');
    confirmButton.addEventListener('click', () => confirmCancelReservation(reservation));
    const backButton = document.querySelector('.cancel-reservation-back-btn');
    backButton.addEventListener('click', closeCancelModal);
}

function closeCancelModal() {
    document.getElementById('cancel-reservation-modal').style.display = 'none';
}

async function confirmCancelReservation(reservation) {
    // Logic to cancel the reservation
    console.log(`Cancel reservation: ${reservation}`);
    const response = await fetch(`${RESERVATIONS_API}/cancel-reservation`, {
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
        console.log('[INFO]]: Cancle reservation successfully.');
        closeCancelModal();
        loadReservationsView();
    } else {
        alert(`${data.message}`);
    }
}
