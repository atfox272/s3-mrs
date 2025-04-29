// Lấy file config.json
const fs   = require('fs');
const path = require('path');

const configPath = path.join(__dirname, '../database/config.json');

// Cái này là phần Get
exports.getGenConfig = (req, res) => {
  fs.readFile(configPath, 'utf8', (err, data) => {
    if (err) {
      console.error('Read config error:', err);
      return res.status(500).json({ success: false, message: 'Không thể đọc cấu hình' });
    }
    try {
      const cfg = JSON.parse(data);
      // Lấy ra các trường cần thiết
      const {
        reservationLimitation,
        autoCancelTime = null,
        cancelTimeHours = null,
        cancelTimeMinutes = null,
        rules
      } = cfg;
      res.json({ reservationLimitation, autoCancelTime, cancelTimeHours, cancelTimeMinutes, rules });
    } catch (parseErr) {
      console.error('Parse config error:', parseErr);
      res.status(500).json({ success: false, message: 'Cấu hình không hợp lệ' });
    }
  });
};

// Này là post
exports.updateGenConfig = (req, res) => {
  const {
    reservationLimitation,
    autoCancelTime,
    cancelTimeHours,
    cancelTimeMinutes,
    rules
  } = req.body;

  fs.readFile(configPath, 'utf8', (err, data) => {
    if (err) {
      console.error('Read config error:', err);
      return res.status(500).json({ success: false, message: 'Không thể đọc cấu hình' });
    }
    try {
      const cfg = JSON.parse(data);
      // Cập nhật các trường
      if (reservationLimitation != null) cfg.reservationLimitation  = reservationLimitation;
      if (autoCancelTime       != null) cfg.autoCancelTime          = autoCancelTime;
      if (cancelTimeHours      != null) cfg.cancelTimeHours         = cancelTimeHours;
      if (cancelTimeMinutes    != null) cfg.cancelTimeMinutes       = cancelTimeMinutes;
      if (Array.isArray(rules)) cfg.rules = rules;

      fs.writeFile(configPath, JSON.stringify(cfg, null, 2), err2 => {
        if (err2) {
          console.error('Write config error:', err2);
          return res.status(500).json({ success: false, message: 'Không thể lưu cấu hình' });
        }
        res.json({ success: true, message: 'Cấu hình đã được cập nhật thành công' });
      });
    } catch (parseErr) {
      console.error('Parse config error:', parseErr);
      res.status(500).json({ success: false, message: 'Cấu hình không hợp lệ' });
    }
  });
};
