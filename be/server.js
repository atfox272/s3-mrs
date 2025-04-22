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
app.use('/api/auth', userRoutes);
app.use('/api/rooms', roomRoutes);

// Start server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});