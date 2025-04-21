import API_URL from '../js/api.js';
import { currentUser } from '../js/main.js';

const SRSO_GEN_CONF_API = `${API_URL}/srso-gen-config`;

function openTab(tabId) {
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(tab => tab.classList.remove('active'));
    const tabLinks = document.querySelectorAll('.tab-link');
    tabLinks.forEach(link => link.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
    document.querySelector(`.tab-link[data-tab="${tabId}"]`).classList.add('active');
}

function validateConfig(config) {
    if (!config.maxTimes || isNaN(config.maxTimes) || config.maxTimes < 1) {
        return "Số lần tối đa phải là số nguyên dương (≥ 1).";
    }
    if (config.maxTimes > 100) {
        return "Số lần tối đa không được vượt quá 100.";
    }

    if (!config.autoCancelTime || isNaN(config.autoCancelTime) || config.autoCancelTime < 0) {
        return "Thời gian tự động hủy phải là số nguyên không âm (≥ 0).";
    }
    if (config.autoCancelTime > 1440) {
        return "Thời gian tự động hủy không được vượt quá 1440 phút (24 giờ).";
    }

    if (!config.cancelTimeHours || isNaN(config.cancelTimeHours) || config.cancelTimeHours < 0) {
        return "Thời gian hủy phòng (giờ) phải là số nguyên không âm (≥ 0).";
    }
    if (config.cancelTimeHours > 24) {
        return "Thời gian hủy phòng (giờ) không được vượt quá 24 giờ.";
    }


    if (!config.cancelTimeMinutes || isNaN(config.cancelTimeMinutes) || config.cancelTimeMinutes < 0) {
        return "Thời gian hủy phòng (phút) phải là số nguyên không âm (≥ 0).";
    }
    if (config.cancelTimeMinutes > 59) {
        return "Thời gian hủy phòng (phút) không được vượt quá 59 phút.";
    }

    
    if (config.cancelTimeHours === 0 && config.cancelTimeMinutes === 0) {
        return "Thời gian hủy phòng phải lớn hơn 0 (tổng giờ và phút không được bằng 0).";
    }

    return null; // Không có lỗi
}

// Hàm lấy cấu hình hiện tại từ API
async function fetchGenConfig() {
    try {
        const response = await fetch(`${SRSO_GEN_CONF_API}/get-gen-config`, {
            headers: {
                'Authorization': `Bearer ${currentUser.token}`
            }
        });
        if (!response.ok) throw new Error('Không thể tải cấu hình');
        const config = await response.json();
        return config;
    } catch (error) {
        console.error('Lỗi khi tải cấu hình:', error);
        alert('Không thể tải cấu hình. Vui lòng thử lại.');
    }
}

// Hàm cập nhật cấu hình qua API
async function updateGenConfig(config) {
    try {
        const response = await fetch(`${SRSO_GEN_CONF_API}/update-gen-config`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${currentUser.token}`
            },
            body: JSON.stringify(config)
        });
        if (!response.ok) throw new Error('Không thể cập nhật cấu hình');
        alert('Cấu hình đã được cập nhật thành công!');
    } catch (error) {
        console.error('Lỗi khi cập nhật cấu hình:', error);
        alert('Không thể cập nhật cấu hình. Vui lòng thử lại.');
    }
}

// Hàm hiển thị cấu hình lên form
function displayConfig(config) {
    document.getElementById('max-times').value = config.maxTimes || 8;
    document.getElementById('auto-cancel-time').value = config.autoCancelTime || 30;
    document.getElementById('cancel-time-hours').value = config.cancelTimeHours || 2;
    document.getElementById('cancel-time-minutes').value = config.cancelTimeMinutes || 30;
    document.getElementById('room-rules').value = config.roomRules || '';
}

export async function loadSRSOGenConfigView() {
    // Kiểm tra quyền truy cập của người dùng
    if (currentUser.role !== 'SRSO') {
        alert('Bạn không có quyền truy cập chức năng này.');
        return;
    }

    // Tải cấu hình hiện tại và hiển thị lên form
    const config = await fetchGenConfig();
    if (config) {
        displayConfig(config);
    }

    // Gán sự kiện cho các nút tab
    const tabLinks = document.querySelectorAll('.tab-link');
    tabLinks.forEach(link => {
        link.addEventListener('click', () => {
            const tabId = link.getAttribute('data-tab');
            openTab(tabId);
        });
    });

    // Xử lý sự kiện nút "OK"
    document.getElementById('save-config').addEventListener('click', async () => {
        const newConfig = {
            maxTimes: parseInt(document.getElementById('max-times').value),
            autoCancelTime: parseInt(document.getElementById('auto-cancel-time').value),
            cancelTimeHours: parseInt(document.getElementById('cancel-time-hours').value),
            cancelTimeMinutes: parseInt(document.getElementById('cancel-time-minutes').value),
            roomRules: document.getElementById('room-rules').value
        };

        // Kiểm tra điều kiện trước khi gửi
        const validationError = validateConfig(newConfig);
        if (validationError) {
            alert(validationError);
            return; // Ngăn gửi dữ liệu nếu có lỗi
        }

        await updateGenConfig(newConfig);
    });

    // Xử lý sự kiện nút "Cancel"
    document.getElementById('cancel-config').addEventListener('click', () => {
        alert('Đã hủy cấu hình');
    });
}