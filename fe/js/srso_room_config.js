import API_URL from '../js/api.js';
import { currentUser } from '../js/main.js';

const SRSO_ROOM_CONF_API = `${API_URL}/srso-room-config`;

// TODO: add your functions here 

// Function to load room configuration view
export async function loadSRSORoomConfigView() {
    // TODO: Code here
    // - Using API SRSO_ROOM_CONF_API to get current room configuration
    // - Add new APIs based on this path "${SRSO_ROOM_CONF_API}" (Example: "${SRSO_ROOM_CONF_API}/get-room-config, ${SRSO_ROOM_CONF_API}/update-room-config")
    // - Use user information via currentUser global varible
    // - currentUser: {
    //     "id": "2114700",
    //     "name": "Trần Anh SRSO",
    //     "email": "trananhtai@hcmut.edu.vn",
    //     "role": "SRSO"
    //   },
}
