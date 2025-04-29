const rooms = require('../database/rooms.json');
const rules = require('../database/config.json');
const users = require('../database/users.json');
const fs = require('fs');
const path = require('path');

exports.getProfile = (req, res) => {
    const userId = req.query.id;
    const user = users.find(u => u.id === userId);
    res.json({
        id: user.id,
        name: user.name,
        dob: user.birthday,
        email: user.email,
        faculty: user.faculty,
        major: user.major,
        code: "08081321492115", // Assuming this is a static or generated value
        bookingCount: user.dailyCount// Assuming bookingCount is dailyCount + 1
    });
};  