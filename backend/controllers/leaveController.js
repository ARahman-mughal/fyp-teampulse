const Leave = require('../models/Leave');

// @desc    Create a new leave request
// @route   POST /api/leaves
// @access  Private
const createLeave = async (req, res) => {
  try {
    console.log('Received leave data:', req.body); // Add this for debugging
    const leave = await Leave.create({
      ...req.body,
      employee: req.body.employees
    });
    res.status(201).json(leave);
  } catch (err) {
    console.error('Error in createLeave:', err);
    res.status(400).json({ error: err.message });
  }
};
// @desc    Get all leaves
// @route   GET /api/leaves
// @access  Private
const getLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find()
        .populate('employee', 'firstName lastName')
        .populate('approvedBy', 'name');
    console.log({ leaves })
    res.json(leaves);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @desc    Get leaves for specific employee
// @route   GET /api/leaves/employee/:id
// @access  Private
const getEmployeeLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find({ employee: req.params.id })
      .populate('employee', 'firstName lastName')
      .populate('approvedBy', 'name');
    res.json(leaves);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @desc    Get single leave by ID
// @route   GET /api/leaves/:id
// @access  Private
const getLeaveById = async (req, res) => {
  try {
    const leave = await Leave.findById(req.params.id)
      .populate('employee', 'firstName lastName position')
      .populate('approvedBy', 'name');

    if (!leave) return res.status(404).json({ error: 'Leave not found' });

    res.json(leave);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @desc    Update leave
// @route   PUT /api/leaves/:id
// @access  Private
const updateLeave = async (req, res) => {
  try {
    const leave = await Leave.findById(req.params.id);

    if (!leave) return res.status(404).json({ error: 'Leave not found' });

    const updatedLeave = await Leave.findByIdAndUpdate(req.params.id, req.body, { 
      new: true,
      runValidators: true
    })
      .populate('employee', 'firstName lastName')
      .populate('approvedBy', 'name');

    res.json(updatedLeave);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// @desc    Approve/Reject leave
// @route   PUT /api/leaves/:id/approve
// @access  Private/Admin
const approveLeave = async (req, res) => {
  try {
    const { status, notes } = req.body;

    if (!['Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const leave = await Leave.findByIdAndUpdate(
      req.params.id,
      { 
        status,
        approvedBy: req.user._id,
        notes: notes || undefined
      },
      { new: true }
    )
      .populate('employee', 'firstName lastName email')
      .populate('approvedBy', 'name');

    if (!leave) return res.status(404).json({ error: 'Leave not found' });

    res.json(leave);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// @desc    Delete leave
// @route   DELETE /api/leaves/:id
// @access  Private/Admin
const deleteLeave = async (req, res) => {
  try {
    const leave = await Leave.findByIdAndDelete(req.params.id);
    if (!leave) return res.status(404).json({ error: 'Leave not found' });
    res.json({ message: 'Leave deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createLeave,
  getLeaves,
  getEmployeeLeaves,
  getLeaveById,
  updateLeave,
  approveLeave,
  deleteLeave
};