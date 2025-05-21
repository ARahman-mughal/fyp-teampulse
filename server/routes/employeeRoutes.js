const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');
const { protect } = require('../middleware/auth');

router.route('/stats')
  .get(protect, employeeController.getRecentEmployees)

router.route('/')
  .get(protect, employeeController.getEmployees)
  .post(protect, employeeController.createEmployee);

router.route('/:id')
  .get(protect, employeeController.getEmployeeById)
  .put(protect, employeeController.updateEmployee)
  .delete(protect, employeeController.deleteEmployee);

module.exports = router;