const express = require('express');
const router = express.Router();
const stdNotificationController = require('../controllers/std_notification_controller.js');

router.post('/api/std-notifications', stdNotificationController.checkNotifications);
router.post('/api/std-notifications', stdNotificationController.getNotifications);


router.post(
   '/check-notifications',
   stdNotificationController.checkNotifications
);

router.post(
   '/get-notifications',
    stdNotificationController.getNotifications
);

module.exports = router;