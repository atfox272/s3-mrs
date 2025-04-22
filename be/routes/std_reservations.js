const express = require('express');
const router = express.Router();
const stdReservationsController = require('../controllers/std_reservations_controller.js');

router.post('/get-reservations', stdReservationsController.getReservations);

module.exports = router;