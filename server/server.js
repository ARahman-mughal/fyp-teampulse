require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

// __dirname is available in CommonJS
const directoryName = __dirname;

// Import routes
const authRoutes = require('./routes/authRoutes');
const employeesRoutes = require('./routes/employeeRoutes');
const payrollsRoutes = require('./routes/payrollsRoutes');
const projectRoutes = require('./routes/projectRoutes');
const leaveRoutes = require('./routes/leaveRoutes')

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Replace your current CORS middleware with this:
app.use(cors({
  origin: 'http://localhost:3000', // Your React app's URL
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Add this after your routes in server.js
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.status(500).json({ error: err.message });
});

// Handle OPTIONS requests
app.options('*', cors());

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/employee_management')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/employees', employeesRoutes);
app.use('/api/payrolls', payrollsRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/leaves', leaveRoutes)


// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(directoryName, '../client/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(directoryName, '../client/build/index.html'));
  });
}

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

