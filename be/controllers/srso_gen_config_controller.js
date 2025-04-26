const rooms = require('../database/rooms.json');

exports.getRoomByCampus = (req, res) => {
    const cs = req.query.cs;
    const room = rooms.filter(rr => rr.campus === cs);
    console.log("[INFO]: print from room config", room);
    if (room) {
        res.json({ success: true, rooms: room});
    } else {
        res.status(404).json({ success: false, message: 'User not found' });
    }
}; 

exports.getRoomById = (req, res) => {
    const roomId = req.query.roomId;
    const room = rooms.find(r => r.roomId === roomId);
    if (room) {
        res.json({ success: true, room: room });
    } else {
        res.status(404).json({ error: 'Room not found' });
    }
};

exports.addRoom = (req, res) => {
    const {campus, building, floor, room, capacity, equipment} = req.body;
    const newRoom = {
        campus,
        building,
        floor,
        room,
        capacity,
        equipment
    }
    rooms.push(newRoom);
    res.json({ success: true, 
        message: "Add a new room completely"
    });
};


exports.updateRoom = (req, res) => {
    const {campus, building, floor, room} = req.body;
    const r = rooms.find(rr => rr.campus === campus && rr.building === building && rr.floor === floor && rr.room === room  );
    if (r) {
        Object.assign(r, req.body);
        res.json({success: true});
    } else {
        res.status(404).send('Room not found');
    }
};


exports.deleteRoom = (req, res) => {
    const {campus, building, floor, room} = req.body;
    const rindex = rooms.findIndex(rr => rr.campus === campus && rr.building === building && rr.floor === floor && rr.room === room  );
    if (rindex !== -1) {
        rooms.splice(index, 1);
        res.json({success: true});
    } else {
        res.status(404).send('Room not found');
    }
};

exports.getRoomByOptions = (req, res) => {
    res.json({
        success: true,
        campuses: [
          {
            id: "1",
            name: "Cơ sở 1"
          },
          {
            id: "2",
            name: "Cơ sở 2"
          }
        ],
        equipment: [
          {
            id: "wifi",
            name: "Wifi"
          },
          {
            id: "projector",
            name: "Máy chiếu"
          },
          {
            id: "charger",
            name: "Ổ sạc"
          },
          {
            id: "table",
            name: "Bàn"
          },
              {
                id: "meeting_device",
                name: "Thiết bị họp"
              },
              {
                id: "big_board",
                name: "Bảng lớn"
              },
          {
            id: "ac",
            name: "Máy lạnh"
          }
        ]
      });
};


