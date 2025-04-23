import API_URL from '../js/api.js';
import { currentUser } from '../js/main.js';

const STD_HISTORY_API = `${API_URL}/std-history`;
let allHistoryData = [];

export async function loadStdHistoryView() {
    try {
        // Gọi API để lấy lịch sử phòng của người dùng hiện tại
        const response = await fetch(`${STD_HISTORY_API}/get-history?userId=${currentUser.id}`);
        if (!response.ok) {
            throw new Error('Failed to fetch history');
        }
        allHistoryData = await response.json();
        
        // Hiển thị dữ liệu lịch sử ban đầu
        displayHistory(allHistoryData);

        // Gắn sự kiện cho các bộ lọc
        document.getElementById('campus-filter').addEventListener('change', filterHistory);
        document.getElementById('status-filter').addEventListener('change', filterHistory);
        document.getElementById('date-filter').addEventListener('change', filterHistory);
    } catch (error) {
        console.error('Error loading history:', error);
        document.getElementById('history-list').innerHTML = `
            <div class="error-message">
                <p>Không thể tải lịch sử. Vui lòng thử lại sau.</p>
            </div>
        `;
    }
}

function displayHistory(data) {
    const historyList = document.getElementById('history-list');
    historyList.innerHTML = ''; // Xóa nội dung cũ

    if (!data || data.length === 0) {
        historyList.innerHTML = '<p>Không có lịch sử phòng phù hợp.</p>';
        return;
    }

    data.forEach(item => {
        const historyItem = document.createElement('div');
        historyItem.classList.add('history-item');
        historyItem.innerHTML = `
            <div class="room-info">
                <i class="fas fa-building"></i>
                <span>${item.campus}, Tòa ${item.building}, Phòng ${item.roomNumber}</span>
            </div>
            <div class="date-info">
                <i class="fas fa-calendar-alt"></i>
                <span>${item.date}</span>
            </div>
            <div class="time-info">
                <i class="fas fa-clock"></i>
                <span>${item.time}</span>
            </div>
            <div class="status ${item.status === 'Đã sử dụng' ? 'status-used' : 'status-canceled'}">
                <i class="${item.status === 'Đã sử dụng' ? 'fas fa-check-circle' : 'fas fa-times-circle'}"></i>
                <span>${item.status}</span>
            </div>
        `;
        historyList.appendChild(historyItem);
    });
}

function filterHistory() {
    const campus = document.getElementById('campus-filter').value;
    const status = document.getElementById('status-filter').value;
    const date = document.getElementById('date-filter').value;

    let filteredData = allHistoryData;

    if (campus) {
        filteredData = filteredData.filter(item => item.campus === campus);
    }
    if (status) {
        filteredData = filteredData.filter(item => item.status === status);
    }
    if (date) {
        filteredData = filteredData.filter(item => item.date === date);
    }

    displayHistory(filteredData);
}