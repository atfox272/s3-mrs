// const users = require('../database/users.json');
// const fs = require('fs');
// const path = require('path');

// const getHistoryByUserId = (req, res) => {
//     try {
//         const { userId } = req.query;
        
//         if (!userId) {
//             return res.status(400).json({ error: 'User ID is required' });
//         }

//         // Read users.json
//         const usersPath = path.join(__dirname, '../database/users.json');
//         const usersData = JSON.parse(fs.readFileSync(usersPath, 'utf8'));

//         // Find user by ID
//         const user = usersData.find(user => user.id === userId);
        
//         if (!user) {
//             return res.status(404).json({ error: 'User not found' });
//         }

//         // Get user's reservation history
//         const history = user.reservationHistory || [];

//         // Map the history to the required format
//         const formattedHistory = history.map(record => {
//             // Determine status based on checkoutTime and detail
//             let status = "Đã sử dụng";
            
//             // If there's no checkoutTime or if the detail indicates cancellation
//             if (!record.checkoutTime || (record.detail && record.detail.toLowerCase().includes("hủy"))) {
//                 status = "Đã hủy";
//             } else {
//                 // Check if checkout time is within the booked time slot
//                 const [startTime, endTime] = record.time.split('-').map(t => t.trim());
//                 const checkoutTime = new Date(record.checkoutTime);
                
//                 // Convert start and end times to Date objects for comparison
//                 const [startHour, startMinute] = startTime.split(':').map(Number);
//                 const [endHour, endMinute] = endTime.split(':').map(Number);
                
//                 const startDate = new Date(record.date);
//                 startDate.setHours(startHour, startMinute, 0);
                
//                 const endDate = new Date(record.date);
//                 endDate.setHours(endHour, endMinute, 0);
                
//                 // If checkout time is before the booked time slot, mark as cancelled
//                 if (checkoutTime < startDate) {
//                     status = "Đã hủy";
//                 }
//             }

//             return {
//                 campus: record.campus === "1" ? "Cơ sở 1" : "Cơ sở 2",
//                 building: record.roomId.split('-')[0],
//                 roomNumber: record.roomId.split('-')[1],
//                 date: record.date,
//                 time: record.time,
//                 status: status
//             };
//         });

//         res.json(formattedHistory);
//     } catch (error) {
//         console.error('Error getting history:', error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// };

// module.exports = {
//     getHistoryByUserId
// };
const users = require('../database/users.json');
const fs = require('fs');
const path = require('path');

const getHistoryByUserId = (req, res) => {
    try {
        const { userId } = req.query;
        
        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        // Read users.json
        const usersPath = path.join(__dirname, '../database/users.json');
        const usersData = JSON.parse(fs.readFileSync(usersPath, 'utf8'));

        // Find user by ID
        const user = usersData.find(user => user.id === userId);
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Get user's reservation history
        const history = user.reservationHistory || [];

        // Map the history to the required format
        const formattedHistory = history.map(record => {
            let status = "Đã sử dụng";
            
            if (!record.checkoutTime || (record.detail && record.detail.toLowerCase().includes("hủy"))) {
                status = "Đã hủy";
            } else {
                // Convert start and end times to Date objects
                const [startTime, endTime] = record.time.split('-').map(t => t.trim());
                const [startHour, startMinute] = startTime.split(':').map(Number);
                const [endHour, endMinute] = endTime.split(':').map(Number);

                const startDate = new Date(record.date);
                startDate.setHours(startHour, startMinute, 0, 0);

                const endDate = new Date(record.date);
                endDate.setHours(endHour, endMinute, 0, 0);

                // Parse checkoutTime correctly with record.date
                const [checkoutHour, checkoutMinute] = record.checkoutTime.split(':').map(Number);
                const checkoutDateTime = new Date(record.date);
                checkoutDateTime.setHours(checkoutHour, checkoutMinute, 0, 0);

                // If checkout time is before the booked time slot, mark as cancelled
                if (checkoutDateTime < startDate) {
                    status = "Đã hủy";
                }
            }

            return {
                campus: record.campus === "1" ? "Cơ sở 1" : "Cơ sở 2",
                building: record.roomId.split('-')[0],
                roomNumber: record.roomId.split('-')[1],
                date: record.date,
                time: record.time,
                status: status
            };
        });

        res.json(formattedHistory);
    } catch (error) {
        console.error('Error getting history:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    getHistoryByUserId
};
