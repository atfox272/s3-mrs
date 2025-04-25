const express = require('express');
const router = express.Router();
const srsoRoomConfigController = require('../controllers/srso_room_config_controller.js');

router.post('/get-room-by-campus', srsoRoomConfigController.getRoomByCampus);
router.post('/get-room-by-id', srsoRoomConfigController.getRoomById);
router.post('/get-room-by-options', srsoRoomConfigController.getRoomByOptions);
router.post('/add-room', srsoRoomConfigController.addRoom);
router.post('/update-room', srsoRoomConfigController.updateRoom);
router.post('/delete-room', srsoRoomConfigController.deleteRoom);

module.exports = router;