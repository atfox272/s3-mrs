const rooms_data = require('../database/rooms.json');
const users_data = require('../database/users.json');
const fs = require("fs");
const path = require("path");

exports.getRoomStatus = (req, res) => {
    const userId = req.query.id;
    const user = users_data.find(u => u.id === userId);
    if (user){
        const room = rooms_data.find(r => r.roomId === user.usingStatus.roomId);
        const rroom = room.time.find(r => r.slot === user.usingStatus.time);
        const rrroom = room.roomHistory.find(r => r.slot === user.id);
        res.json({
            mssv: user.id,
            fullName: user.name,
            cs:user.usingStatus.campus,
            building: room.building,
            floor: room.floor,
            room: user.usingStatus.roomId,
            time: user.usingStatus.time,
            date: rrroom.date,
            checkIn: user.usingStatus.checkinTime,
            checkOut: rrroom.checkoutTime,
            members: [null],
            status: rroom.status,
        });
    } else {
        res.status(404).json({ success: false, message: "User not found" });
    }
};  

