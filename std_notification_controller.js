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

  if (user.usingStatus) {
    notificationsList.push({
      notificationId: user.usingStatus.reservationId,
      notificationType: 2
    });
  }

  (user.reservationUsing || []).forEach(r => {
    notificationsList.push({
      notificationId: r.reservationId,
      notificationType: 1
    });
  });

  (user.reservationHistory || []).forEach(h => {
    notificationsList.push({
      notificationId: h.reservationId,
      notificationType: 0
    });
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

  (user.reservationHistory || []).forEach(h => {
    notifications.push({
      date: h.date,
      roomId: h.roomId,
      time: h.time,
      message: `Bạn có lịch đặt phòng ${h.roomId} vào lúc ${h.time.split(' - ')[0]}`
    });
  });

  if (user.usingStatus) {
    const u = user.usingStatus;
    notifications.push({
      date: u.date || todayStr,
      roomId: u.roomId,
      time: u.time,
      message: `Bạn đang sử dụng phòng ${u.roomId} bắt đầu từ ${u.time.split(' - ')[0]}`
    });
  }

  res.json({ success: true, notifications });
};
