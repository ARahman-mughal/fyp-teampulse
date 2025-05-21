const express = require('express');
const router = express.Router();
const payrollController = require('../controllers/payrollController');
const { protect } = require('../middleware/auth');

router.route('/')
  .get(protect, payrollController.getPayrolls)
  .post(protect, payrollController.createPayroll);

router.route('/:id')
  .get(protect, payrollController.getEmployeePayrolls)

router.route('/:id/status')
  .put(protect, payrollController.updatePayrollStatus);

module.exports = router;
