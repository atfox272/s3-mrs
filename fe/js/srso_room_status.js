import API_URL from '../js/api.js';
import { currentUser } from '../js/main.js';

const SRSO_ROOM_STATUS_API = `${API_URL}/srso-room-status`;

// TODO: add your functions here 

// Function to load room Status view
export async function loadSRSORoomStatusView() {
    // TODO: Code here
    // - Using API SRSO_ROOM_STATUS_API to get current room status
    // - If your add new APIs, please add based on this path "${SRSO_ROOM_STATUS_API}" (Example: "${SRSO_ROOM_STATUS_API}/get-room-status") -> api/srso-room-status/get-room-status
    // - Use user information via currentUser global varible
    // - currentUser: {
    //     "id": "2114700",
    //     "name": "Trần Anh SRSO",
    //     "email": "trananhtai@hcmut.edu.vn",
    //     "role": "SRSO"
    //   },
}
