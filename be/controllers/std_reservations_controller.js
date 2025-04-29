const rooms = require('../database/rooms.json');
const rules = require('../database/config.json');
const users = require('../database/users.json');
const fs = require('fs');
const path = require('path');

exports.getReservations = (req, res) => {
    const { userId } = req.body;
    const user = users.find(u => u.id === userId);

    if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
    }

    const response = {
        success: true,
        userStatus: user.usingStatus ? "Using" : "Not Using",
        usingStatus: user.usingStatus || null,
        reservations: user.reservationUsing || []
    };

    res.json(response);
};
exports.getRoomPassword = (req, res) => {
    const { reservationId, userId } = req.body;
    const user = users.find(u => u.id === userId);

    if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
    }

    const reservation = user.reservationUsing.find(r => r.reservationId === reservationId);

    if (!reservation) {
        return res.status(404).json({ success: false, message: 'Reservation not found' });
    }

    const response = {
        success: true,
        password: user.id
    };

    res.json(response);
};
exports.cancelReservation = (req, res) => {
    const { reservationId, userId } = req.body;
    const user = users.find(u => u.id === userId);

    if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
    }

    const reservation = user.reservationUsing.find(r => r.reservationId === reservationId);

    if (!reservation) {
        return res.status(404).json({ success: false, message: 'Reservation not found' });
    }

    // Find the room associated with the reservation
    const room = rooms.find(r => r.roomId === reservation.roomId);

    if (room) {
        // Find the time slot in the room and set its status to "Available"
        const timeSlot = room.time.find(t => t.slot === reservation.time);
        if (timeSlot) {
            timeSlot.status = "Available";
        }
    }

    // Add the canceled reservation to the user's reservationHistory
    user.reservationHistory.push({
        reservationId: reservation.reservationId,
        campus: reservation.campus,
        roomId: reservation.roomId,
        date: reservation.date, // Use the date of the reservation
        time: reservation.time,
        checkoutTime: "",
        detail: "hủy"
    });

    // Update the user's reservation list
    user.reservationUsing = user.reservationUsing.filter(r => r.reservationId !== reservationId);

    // Write updates to the JSON files
    const usersFilePath = path.join(__dirname, '../database/users.json');
    const roomsFilePath = path.join(__dirname, '../database/rooms.json');
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
    fs.writeFileSync(roomsFilePath, JSON.stringify(rooms, null, 2));

    res.json({ success: true, message: 'Reservation canceled' });
};
exports.checkoutReservation = (req, res) => {
    console.log("[INFO]: Checkout reservation", req.body);
    const { usingStatus, checkoutTime, userId } = req.body;
    const { reservationId, campus, roomId, time, checkinTime } = usingStatus;
    const user = users.find(u => u.id === userId);

    if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
    }

    const reservation = user.usingStatus;

    if (!reservation) {
        return res.status(404).json({ success: false, message: 'Reservation not found' });
    }

    // Find the room associated with the reservation
    const room = rooms.find(r => r.roomId === reservation.roomId);

    if (room) {
        // Find the time slot in the room and set its status to "Available"
        const timeSlot = room.time.find(t => t.slot === reservation.time);
        if (timeSlot) {
            timeSlot.status = "Available";
        }

        // Add new history to roomHistory
        room.roomHistory.push({
            userId: userId,
            reservationId: reservationId,
            campus: campus,
            roomId: roomId,
            date: new Date().toLocaleDateString(),
            time: time,
            checkoutTime: checkoutTime,
            detail: ""
        });
    }

    // Add new history to user's reservationHistory
    user.reservationHistory.push({
        reservationId: reservationId,
        campus: campus,
        roomId: roomId,
        date: new Date().toLocaleDateString(),
        time: time,
        checkoutTime: checkoutTime,
        detail: ""
    });

    // Set usingStatus to null
    user.usingStatus = null;

    // Update the user's reservation list
    user.reservationUsing = user.reservationUsing.filter(r => r.reservationId !== reservationId);

    // Write updates to the JSON files
    const usersFilePath = path.join(__dirname, '../database/users.json');
    const roomsFilePath = path.join(__dirname, '../database/rooms.json');
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
    fs.writeFileSync(roomsFilePath, JSON.stringify(rooms, null, 2));

    res.json({ success: true, message: 'Reservation checked out' });
};


