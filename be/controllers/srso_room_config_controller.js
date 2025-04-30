const rooms = require("../database/rooms.json");
const fs = require("fs");
const path = require("path");

exports.getRoomByCampus = (req, res) => {
  const cs = req.query.cs;
  const room = rooms.filter((rr) => rr.campus === cs);
  if (room) {
    res.json({ success: true, rooms: room });
  } else {
    res.status(404).json({ success: false, message: "User not found" });
  }
};

exports.getRoomById = (req, res) => {
  const roomId = req.query.roomId;
  const room = rooms.find((r) => r.roomId === roomId);
  if (room) {
    res.json({ success: true, room: room });
  } else {
    res.status(404).json({ error: "Room not found" });
  }
};

exports.addRoom = (req, res) => {
  console.log(req.body);
  const { campus, building, floor, room, capacity, equipment } = req.body;
  const newRoom = {
    roomId: `${building}-${room}`,
    campus,
    building,
    floor,
    room,
    capacity,
    equipment,
    status: "Available",
    time: [
      { slot: "7:00 - 8:00", status: "Available" },
      { slot: "8:00 - 9:00", status: "Available" },
      { slot: "9:00 - 10:00", status: "Available" },
      { slot: "10:00 - 11:00", status: "Available" },
      { slot: "11:00 - 12:00", status: "Available" },
      { slot: "12:00 - 13:00", status: "Available" },
      { slot: "13:00 - 14:00", status: "Available" },
      { slot: "14:00 - 15:00", status: "Available" },
      { slot: "15:00 - 16:00", status: "Available" },
      { slot: "16:00 - 17:00", status: "Available" },
      { slot: "17:00 - 18:00", status: "Available" }
    ],
    roomUsage: [],
    roomHistory: [],
    cameraLink: "assign camera link here"
  };
  rooms.push(newRoom);
  try {
    fs.writeFileSync(
      path.resolve(__dirname, "../database/rooms.json"),
      JSON.stringify(rooms, null, 2),
      "utf8"
    );
  } catch (error) {
    console.error("Error writing to file:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to save room data" });
  }
  res.json({ success: true, message: "Add a new room completely" });
  console.log(res.body);
};

exports.updateRoom = (req, res) => {
  console.log(req.body);
  const { campus, building, floor, room } = req.body;
  const r = rooms.find(
    (rr) =>
      rr.campus === campus &&
      rr.building === building &&
      rr.floor === floor &&
      rr.room === room,
  );
  if (r) {
    Object.assign(r, req.body);
    try {
      fs.writeFileSync(
        path.resolve(__dirname, "../database/rooms.json"),
        JSON.stringify(rooms, null, 2),
        "utf8",
      );
    } catch (error) {
      console.error("Error writing to file:", error);
      return res
        .status(500)
        .json({ success: false, message: "Failed to update room data" });
    }
    res.json({ success: true });
  } else {
    res.status(404).send("Room not found to update");
  }
  console.log(res.body);
};

exports.deleteRoom = (req, res) => {
  console.log(req.body);
  const { campus, building, floor, room } = req.body;
  const rindex = rooms.findIndex(
    (rr) =>
      rr.campus === campus &&
      rr.building === building &&
      rr.floor === floor &&
      rr.room === room,
  );
  if (rindex !== -1) {
    rooms.splice(rindex, 1);
    res.json({ success: true });
    try {
      fs.writeFileSync(
        path.resolve(__dirname, "../database/rooms.json"),
        JSON.stringify(rooms, null, 2),
        "utf8",
      );
    } catch (error) {
      console.error("Error writing to file:", error);
      return res
        .status(500)
        .json({ success: false, message: "Failed to delete room data" });
    }
  } else {
    res.status(404).send("Room not found to delete");
  }
  console.log(res.body);
};

exports.getRoomOptions = (req, res) => {
  console.log(req.body);
  res.json({
    success: true,
    campuses: [
      {
        id: "1",
        name: "Cơ sở 1",
      },
      {
        id: "2",
        name: "Cơ sở 2",
      },
    ],
    equipment: [
      {
        id: "wifi",
        name: "Wifi",
      },
      {
        id: "projector",
        name: "Máy chiếu",
      },
      {
        id: "charger",
        name: "Ổ sạc",
      },
      {
        id: "table",
        name: "Bàn",
      },
      {
        id: "meeting_device",
        name: "Thiết bị họp",
      },
      {
        id: "big_board",
        name: "Bảng lớn",
      },
      {
        id: "ac",
        name: "Máy lạnh",
      },
    ],
  });
  console.log(res.body);
};
