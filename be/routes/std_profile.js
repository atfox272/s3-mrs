const express = require('express');
const router = express.Router();
const stdProfileController = require('../controllers/std_profile_controller.js');

router.get('/get-profile', stdProfileController.getProfile);
module.exports = router;