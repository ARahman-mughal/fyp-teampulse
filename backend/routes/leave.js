const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Leave = require('../models/Leave');
const User = require('../models/User');

// Submit a leave request
router.post('/request', auth, async (req, res) => {
  try {
    const { startDate, endDate, leaveType, reason } = req.body;

    // Create new leave request
    const leaveRequest = new Leave({
      employee: req.user.id,
      startDate,
      endDate,
      leaveType,
      reason,
      status: 'pending'
    });

    await leaveRequest.save();

    res.status(201).json({ message: 'Leave request submitted successfully', leaveRequest });
  } catch (error) {
    console.error('Error in leave request:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all leave requests for an employee
router.get('/my-requests', auth, async (req, res) => {
  try {
    const leaveRequests = await Leave.find({ employee: req.user.id })
      .sort({ createdAt: -1 });
    res.json(leaveRequests);
  } catch (error) {
    console.error('Error fetching leave requests:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get leave request by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const leaveRequest = await Leave.findById(req.params.id);
    if (!leaveRequest) {
      return res.status(404).json({ message: 'Leave request not found' });
    }
    
    // Check if the user is authorized to view this leave request
    if (leaveRequest.employee.toString() !== req.user.id && !req.user.isManager) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    res.json(leaveRequest);
  } catch (error) {
    console.error('Error fetching leave request:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update leave request status (for managers)
router.put('/:id/status', auth, async (req, res) => {
  try {
    const { status, comment } = req.body;
    
    // Check if user is a manager
    const user = await User.findById(req.user.id);
    if (!user.isManager) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const leaveRequest = await Leave.findById(req.params.id);
    if (!leaveRequest) {
      return res.status(404).json({ message: 'Leave request not found' });
    }

    leaveRequest.status = status;
    leaveRequest.managerComment = comment;
    leaveRequest.reviewedBy = req.user.id;
    leaveRequest.reviewedAt = Date.now();

    await leaveRequest.save();

    res.json({ message: 'Leave request updated successfully', leaveRequest });
  } catch (error) {
    console.error('Error updating leave request:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Cancel leave request
router.delete('/:id', auth, async (req, res) => {
  try {
    const leaveRequest = await Leave.findById(req.params.id);
    
    if (!leaveRequest) {
      return res.status(404).json({ message: 'Leave request not found' });
    }

    // Check if the user owns this leave request
    if (leaveRequest.employee.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Only allow cancellation of pending requests
    if (leaveRequest.status !== 'pending') {
      return res.status(400).json({ message: 'Cannot cancel a processed leave request' });
    }

    await leaveRequest.remove();
    res.json({ message: 'Leave request cancelled successfully' });
  } catch (error) {
    console.error('Error cancelling leave request:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 