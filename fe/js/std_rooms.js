import API_URL from './api.js';

// Function to get room rules from the backend
export default async function getRoomRule() {
    try {
        const response = await fetch(`${API_URL}/room/rules`);
        if (!response.ok) throw new Error('Failed to fetch room rules');

        const data = await response.json();
        return data.rules.map((rule, index) => `${index + 1}. ${rule.text}`).join('<br>'); // Append ID to each rule
    } catch (error) {
        console.error('Error fetching room rules:', error);
        return 'Không thể tải quy tắc phòng'; // Return a default error message
    }
}
