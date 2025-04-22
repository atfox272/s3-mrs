const express = require('express');
const router = express.Router();
const roomController = require('../controllers/rooms_controller');

// router.get('/', roomController.getAllRooms);
// router.get('/:id', roomController.getRoomById);
// router.post('/', roomController.addRoom);
// router.put('/:id', roomController.updateRoom);
// router.delete('/:id', roomController.deleteRoom);

router.get('/rules', roomController.getRules);

module.exports = router;