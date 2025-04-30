const express = require('express');
const router = express.Router();
const srsoRoomConfigController = require('../controllers/srso_room_config_controller.js');

router.get('/get-room-by-campus', srsoRoomConfigController.getRoomByCampus);
router.get('/get-room-by-id', srsoRoomConfigController.getRoomById);
router.get('/get-room-options', srsoRoomConfigController.getRoomOptions);
router.post('/add-room', srsoRoomConfigController.addRoom);
router.post('/update-room', srsoRoomConfigController.updateRoom);
router.post('/delete-room', srsoRoomConfigController.deleteRoom);

module.exports = router;