const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const taskRoutes = require('./routes/taskRoutes');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/tasks', taskRoutes);

// Serve static files from React frontend
const frontendPath = path.join(__dirname, '../frontend/build');
console.log('Frontend path:', frontendPath);
app.use(express.static(frontendPath));

// Catch-all for React (important for client-side routing)
app.get('*', (req, res) => {
    res.type('html');
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// Server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
