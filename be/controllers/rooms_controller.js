const rooms = require('../database/rooms.json');
const rules = require('../database/config.json');
const users = require('../database/users.json');
const fs = require('fs');
const path = require('path');

exports.getAllRooms = (req, res) => {
    res.json(rooms);
};

exports.getRoomById = (req, res) => {
    const roomId = req.query.roomId;
    const room = rooms.find(r => r.roomId === roomId);
    if (room) {
        res.json({ room });
    } else {
        res.status(404).json({ error: 'Room not found' });
    }
};

exports.getRoomByCampus = (req, res) => {
    const campus = req.query.cs;
    const filteredRooms = rooms.filter(r => r.campus === campus);
    if (filteredRooms.length > 0) {
        res.json({ rooms: filteredRooms });
    } else {
        res.status(404).json({ error: 'No rooms found for this campus' });
    }
};

exports.getRoomMetadata = (req, res) => {
    console.log("[INFO]: Request body: ", req.body);
    const { campus, building, floor, equipment, timeSlots } = req.body;
    
    let filteredRooms = [...rooms];

    // Filter by campus if provided
    if (campus) {
        filteredRooms = filteredRooms.filter(room => room.campus === campus);
    }

    // Filter by building if provided
    if (building) {
        filteredRooms = filteredRooms.filter(room => room.building === building);
    }

    // Filter by floor if provided
    if (floor) {
        filteredRooms = filteredRooms.filter(room => room.floor === floor);
    }

    // Filter by equipment if provided
    if (equipment && equipment.length > 0) {
        filteredRooms = filteredRooms.filter(room => 
            equipment.every(eq => 
                room.equipment.some(roomEq => roomEq.name === eq)
            )
        );
    }

    // Filter by time slots if provided
    if (timeSlots && timeSlots.length > 0) {
        filteredRooms = filteredRooms.filter(room => 
            timeSlots.every(slot => 
                room.time.some(time => time.slot === slot && time.status === "Available")
            )
        );
    }

    if (filteredRooms.length > 0) {
        res.json({ rooms: filteredRooms });
    } else {
        res.status(404).json({ error: 'No rooms found matching the criteria' });
    }
};

exports.getSpecialEquipment = (req, res) => {
    try {
        const specialEquipment = rules.equipment;
        res.json({ specialEquipment });
    } catch (error) {
        res.status(500).json({ error: 'Failed to load special equipment' });
    }
};

exports.getTimeSlots = (req, res) => {
    const timeSlots = rules.timeSlots;
    res.json({ timeSlots });
};


exports.reserveRoom = (req, res) => {
    console.log("[INFO]: Reserve request body: ", req.body);
    const { hostId, hostRole, memId, roomId, time } = req.body;
    const room = rooms.find(r => r.roomId === roomId);

    if (!room) {
        return res.status(404).json({ success: false, message: 'Room not found', data: null });
    }

    const requiredMembers = Math.ceil(room.capacity * 0.45);
    if (memId.length < requiredMembers) {
        return res.json({
            success: false,
            message: "Số lượng thành viên bạn cung cấp không đủ để đặt phòng này.",
            data: null
        });
    }

    const user = users.find(u => u.id === hostId);
    if (!user) {
        return res.status(404).json({ success: false, message: 'User not found', data: null });
    }

    if (user.dailyCount >= user.reservationLimitation) {
        return res.json({
            success: false,
            message: "Bạn đã đặt vượt quá lượt sử dụng phòng hôm nay.",
            data: null
        });
    }

    // Update room time slot status
    time.forEach(slot => {
        const timeSlot = room.time.find(t => t.slot === slot);
        if (timeSlot) {
            timeSlot.status = "Occupied";
        }
    });

    // Create reservation data
    const reservationId = user.nextReservationId;
    const reservationData = {
        reservationId,
        roomId,
        mssvList: memId,
        timeSlots: time,
        timestamp: new Date().toISOString()
    };

    // Update user's reservation usage
    user.reservationUsing.push({
        reservationId,
        campus: room.campus,
        roomId: room.roomId,
        time: time.join(', '),
        detail: ""
    });

    // Increment user's daily count
    user.dailyCount += 1;
    user.nextReservationId = (parseInt(user.nextReservationId, 10) + 1).toString();

    // Write updated user data back to the JSON file
    const usersFilePath = path.join(__dirname, '../database/users.json');
    fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), (err) => {
        if (err) {
            console.error('Error writing to users.json:', err);
            return res.status(500).json({ success: false, message: 'Failed to update user data', data: null });
        }
    });
    // Write updated room data back to the JSON file
    const roomsFilePath = path.join(__dirname, '../database/rooms.json');
    fs.writeFile(roomsFilePath, JSON.stringify(rooms, null, 2), (err) => {
        if (err) {
            console.error('Error writing to rooms.json:', err);
            return res.status(500).json({ success: false, message: 'Failed to update room data', data: null });
        }
    });
    res.json({
        success: true,
        message: "Reservation successful",
        data: reservationData
    });
};




exports.addRoom = (req, res) => {
    const newRoom = req.body;
    rooms.push(newRoom);
    res.status(201).json(newRoom);
};

exports.updateRoom = (req, res) => {
    const room = rooms.find(r => r.id === req.params.id);
    if (room) {
        Object.assign(room, req.body);
        res.json(room);
    } else {
        res.status(404).send('Room not found');
    }
};

exports.deleteRoom = (req, res) => {
    const index = rooms.findIndex(r => r.id === req.params.id);
    if (index !== -1) {
        rooms.splice(index, 1);
        res.status(204).send();
    } else {
        res.status(404).send('Room not found');
    }
};
exports.getRules = (req, res) => {
    try {
        res.json(rules);
    } catch (error) {
        res.status(500).json({ error: 'Failed to load rules' });
    }
};
