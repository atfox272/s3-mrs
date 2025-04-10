import {getRoomRule} from './std_rooms.js';

export async function loadHomeView() {
    console.log('from home.js');
    const roomRules = await getRoomRule();
    document.querySelector('#room-rule-content').innerHTML = roomRules;
}
