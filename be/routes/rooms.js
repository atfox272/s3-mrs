const express = require('express');
const router = express.Router();
const roomController = require('../controllers/rooms_controller');

// router.get('/', roomController.getAllRooms);
// router.get('/:id', roomController.getRoomById);
// router.post('/', roomController.addRoom);
// router.put('/:id', roomController.updateRoom);
// router.delete('/:id', roomController.deleteRoom);

router.get('/rules', roomController.getRules);
router.get('/room-id', roomController.getRoomById);
router.get('/campus', roomController.getRoomByCampus);
router.post('/room-metadata', roomController.getRoomMetadata);
router.get('/special-equipment', roomController.getSpecialEquipment);
router.get('/time-slots', roomController.getTimeSlots);
router.post('/reserve', roomController.reserveRoom);

module.exports = router;