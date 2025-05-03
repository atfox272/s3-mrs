const express = require('express');
const router = express.Router();
const srsoRoomStatusController = require('../controllers/srso_room_status_controller.js');

// router.post('/<api_path>', srsoRoomStatusController.<api_function>);
router.get('/get-room-status', srsoRoomStatusController.getRoomStatus);

module.exports = router;