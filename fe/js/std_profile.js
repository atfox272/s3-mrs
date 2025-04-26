// std_profile.js
import API_URL from './api.js'; // Đảm bảo trong api.js: export default 'http://localhost:3002/api';
import { currentUser } from './main.js';

const STD_PROFILE_API = `${API_URL}/std-profile`;

export async function loadStdProfileView() {
    try {
        console.log(" Current user: ", currentUser);
        console.log(" Gửi yêu cầu tới: ", `${STD_PROFILE_API}/get-profile?id=${currentUser.id}`);

        const res = await fetch(`${STD_PROFILE_API}/get-profile?id=${currentUser.id}`);
        
        // Kiểm tra mã trạng thái HTTP
        if (!res.ok) {
            throw new Error(`Lỗi API: ${res.status} ${res.statusText}`);
        }

        const data = await res.json();
        console.log(data); // Kiểm tra dữ liệu trả về

        // Gán dữ liệu vào các phần tử HTML
        document.getElementById("profile-name").innerText = data.name;
        document.getElementById("profile-email").innerText = data.email;
        document.getElementById("profile-dob").innerText = data.dob;
        document.getElementById("profile-faculty").innerText = data.faculty;
        document.getElementById("profile-major").innerText = data.major;
        document.getElementById("profile-id").innerText = data.id;

        // Hiển thị số lượt đặt phòng dạng "x / 6"
        const maxBooking = 6;
        document.getElementById("profile-bookingCount").innerText = `${data.bookingCount} / ${maxBooking}`;
        
    } catch (err) {
        console.error("Error: Lỗi khi lấy thông tin hồ sơ", err);
    }
}

window.addEventListener("DOMContentLoaded", () => {
    loadStdProfileView();
});
