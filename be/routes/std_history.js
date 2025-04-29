const express = require('express');
const router = express.Router();
const stdHistoryController = require('../controllers/std_history_controller.js');

// router.post('/<api_path>', stdHistoryController.<api_function>);
router.get('/get-history', stdHistoryController.getHistoryByUserId);

module.exports = router;