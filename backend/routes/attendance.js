const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Attendance = require('../models/Attendance');
const { protect } = require('../middleware/auth');

// Clock in
router.post('/clock-in', protect, async (req, res) => {
  try {
    // Check if already clocked in
    const existingAttendance = await Attendance.findOne({
      employee: req.user.id,
      clockOut: null
    });

    if (existingAttendance) {
      return res.status(400).json({ message: 'Already clocked in' });
    }

    const attendance = new Attendance({
      employee: req.user.id,
      clockIn: new Date()
    });

    await attendance.save();
    res.status(201).json(attendance);
  } catch (error) {
    console.error('Error in clock-in:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Clock out
router.post('/clock-out', protect, async (req, res) => {
  try {
    const attendance = await Attendance.findOne({
      employee: req.user.id,
      clockOut: null
    });

    if (!attendance) {
      return res.status(400).json({ message: 'No active clock-in found' });
    }

    attendance.clockOut = new Date();
    await attendance.save();

    res.json(attendance);
  } catch (error) {
    console.error('Error in clock-out:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get current status
router.get('/status', protect, async (req, res) => {
  try {
    const activeAttendance = await Attendance.findOne({
      employee: req.user.id,
      clockOut: null
    });

    res.json({ clockedIn: !!activeAttendance });
  } catch (error) {
    console.error('Error checking status:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get attendance history
router.get('/history', protect, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const query = { employee: req.user.id };

    if (startDate && endDate) {
      query.clockIn = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const attendance = await Attendance.find(query)
      .sort({ clockIn: -1 })
      .limit(30);

    res.json(attendance);
  } catch (error) {
    console.error('Error fetching attendance history:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get attendance report (for managers)
router.get('/report', protect, async (req, res) => {
  try {
    const { startDate, endDate, employeeId } = req.query;
    
    // Verify if user is a manager
    if (!req.user.isManager) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const query = {};
    if (employeeId) {
      query.employee = employeeId;
    }
    if (startDate && endDate) {
      query.clockIn = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const attendance = await Attendance.find(query)
      .populate('employee', 'name email')
      .sort({ clockIn: -1 });

    res.json(attendance);
  } catch (error) {
    console.error('Error generating attendance report:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 