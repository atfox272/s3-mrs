const users = require('../database/users.json');

// Chuyển đổi ngày tháng
function formatDate(d) {
  const day   = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year  = d.getFullYear();
  return `${day}/${month}/${year}`;
}

exports.checkNotifications = (req, res) => {
  const { currentUser } = req.body;
  const user = users.find(u => u.id === currentUser.id);
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  const notificationsList = [];
  const currentTime = new Date();

  (user.reservationUsing || []).forEach(r => {
    const [startTime] = r.time.split(' - ');
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const reservationTime = new Date(currentTime);
    reservationTime.setHours(startHour, startMinute, 0, 0);

    const timeDifference = (reservationTime - currentTime) / (1000 * 60); // difference in minutes

    if (timeDifference <= 5 && timeDifference >= 0) {
      notificationsList.push({
        notificationId: r.reservationId,
        notificationType: 1
      });
    }
  });

  res.json({ success: true, notificationsList });
};

exports.getNotifications = (req, res) => {
  const { currentUser } = req.body;
  const user = users.find(u => u.id === currentUser.id);
  if (!user) {
    return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng' });
  }

  const notifications = [];
  const todayStr = formatDate(new Date());

  (user.reservationUsing || []).forEach(r => {
    notifications.push({
      date: r.date || todayStr,
      roomId: r.roomId,
      time: r.time,
      message: `Bạn có lịch đặt phòng ${r.roomId} vào lúc ${r.time.split(' - ')[0]}`
    });
  });

  res.json({ success: true, notifications });
};