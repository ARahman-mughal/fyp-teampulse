const express = require('express');
const router = express.Router();
const {
  createLeave,
  getLeaves,
  getLeaveById,
  updateLeave,
  deleteLeave,
  getEmployeeLeaves,
  approveLeave
} = require('../controllers/leaveController');
const { protect } = require('../middleware/auth');


router.route('/')
  .post(protect, createLeave)
  .get(protect, getLeaves);

router.route('/employee/:id')
  .get(protect, getEmployeeLeaves);

router.route('/:id')
  .get(protect, getLeaveById)
  .put(protect, updateLeave)
  .delete(protect, deleteLeave);

router.route('/:id/approve')
  .put(protect, approveLeave);

module.exports = router;