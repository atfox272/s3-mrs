import API_URL from '../js/api.js';
import { currentUser } from '../js/main.js';

const SRSO_ROOM_STATUS_API = `${API_URL}/srso-room-status`;

// Hàm tải dữ liệu trạng thái phòng
export async function loadSRSORoomStatusView() {
  try {
    // Kiểm tra nếu currentUser và currentUser.id có sẵn
    if (!currentUser || !currentUser.id) {
      throw new Error('User ID is not available');
    }

    // Lấy dữ liệu trạng thái phòng theo ID của người dùng
    const res = await fetch(`${SRSO_ROOM_STATUS_API}/get-room-status?id=${currentUser.id}`);
    
    if (!res.ok) {
      throw new Error(`API error: ${res.statusText}`);
    }
    
    const data = await res.json();

    // Gọi hàm để hiển thị trạng thái phòng
    renderRoomStatus(data);

    // Gọi hàm để thêm chức năng tìm kiếm
    addSearchFunctionality(data);
  } catch (error) {
    console.error('Lỗi khi tải trạng thái phòng:', error);
  }
}

// Hàm hiển thị trạng thái phòng trong bảng
function renderRoomStatus(data) {
  const tbody = document.getElementById('statusBody'); // Đã thay đổi từ statisticsBody thành statusBody
  tbody.innerHTML = ''; // Xóa dữ liệu cũ trong bảng

  // Lặp qua dữ liệu và tạo từng dòng cho bảng
  data.forEach((entry, index) => {
    const tr = document.createElement('tr');
    tr.className = 'border-t';

    const listMembers = entry.members.join(', '); // Ghép danh sách thành viên thành chuỗi
    const row = `
      <td>${index + 1}</td>
      <td>${entry.mssv}</td>
      <td>${entry.fullName}</td>
      <td>${entry.cs}</td>
      <td>${entry.building}</td>
      <td>${entry.floor}</td>
      <td>${entry.room}</td>
      <td>${entry.time}</td>
      <td>${entry.date}</td>
      <td>${entry.checkIn}</td>
      <td>${entry.checkOut}</td>
      <td>${listMembers}</td>
      <td>${entry.status}</td>
    `;
    tr.innerHTML = row;
    tbody.appendChild(tr);
  });
}

// Thêm chức năng tìm kiếm
function addSearchFunctionality(data) {
  const searchInput = document.getElementById('searchInput');

  // Lắng nghe sự kiện input để lọc dữ liệu
  searchInput.addEventListener('input', () => {
    const query = searchInput.value.trim().toLowerCase();
    const filteredData = data.filter(entry => {
      const roomIdentifier = `${entry.building}-${entry.room}`.toLowerCase();
      return roomIdentifier.includes(query);
    });

    // Hiển thị lại dữ liệu đã lọc
    renderRoomStatus(filteredData);
  });
}