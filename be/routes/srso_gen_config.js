const express = require('express');
const router = express.Router();
const srsoGenConfigController = require('../controllers/srso_gen_config_controller.js');

router.get('/get-gen-config', srsoGenConfigController.getGenConfig);
router.post('/update-gen-config', srsoGenConfigController.updateGenConfig);


module.exports = router;