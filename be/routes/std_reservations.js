const express = require('express');
const router = express.Router();
const stdReservationsController = require('../controllers/std_reservations_controller.js');

router.post('/get-reservations', stdReservationsController.getReservations);
router.post('/get-room-password', stdReservationsController.getRoomPassword);
router.post('/cancel-reservation', stdReservationsController.cancelReservation);
router.post('/checkout', stdReservationsController.checkoutReservation);
module.exports = router;