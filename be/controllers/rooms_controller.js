const rooms = require('../database/rooms.json');
const rules = require('../database/rules.json');
exports.getAllRooms = (req, res) => {
    res.json(rooms);
};

exports.getRoomById = (req, res) => {
    const room = rooms.find(r => r.id === req.params.id);
    if (room) {
        res.json(room);
    } else {
        res.status(404).send('Room not found');
    }
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
