const express = require('express');
const cors = require('cors');
const app = express();
const port = 3001;

// Middleware
app.use(express.json());
app.use(cors()); // Use the CORS middleware

// Routes
const userRoutes = require('./routes/users');
const roomRoutes = require('./routes/rooms');
const srsoGenConfigRoutes = require('./routes/srso_gen_config');
const srsoRoomConfigRoutes = require('./routes/srso_room_config');
const srsoRoomStatusRoutes = require('./routes/srso_room_status');
const stdHistoryRoutes = require('./routes/std_history');
const stdNotificationRoutes = require('./routes/std_notification');
const stdReservationsRoutes = require('./routes/std_reservations');

app.use('/api/auth', userRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/srso-gen-config', srsoGenConfigRoutes);
app.use('/api/srso-room-config', srsoRoomConfigRoutes);
app.use('/api/srso-room-status', srsoRoomStatusRoutes);
app.use('/api/std-history', stdHistoryRoutes);
app.use('/api/std-notifications', stdNotificationRoutes);
app.use('/api/std-reservations', stdReservationsRoutes);


// Start server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});