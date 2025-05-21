const Employee = require('../models/Employee');
const asyncHandler = require('express-async-handler');

// @desc    Get all employees
// @route   GET /api/employees
// @access  Private
const getEmployees = asyncHandler(async (req, res) => {
  const employees = await Employee.find();
  res.json(employees);
});

// @desc    Get single employee
// @route   GET /api/employees/:id
// @access  Private
const getEmployeeById = asyncHandler(async (req, res) => {
  const employee = await Employee.findOne({
    _id: req.params.id,
    createdBy: req.user._id
  });

  if (employee) {
    res.json(employee);
  } else {
    res.status(404);
    throw new Error('Employee not found');
  }
});

// @desc    Create new employee
// @route   POST /api/employees
// @access  Private
const createEmployee = asyncHandler(async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    phone,
    department,
    position,
    salary
  } = req.body;

  const employee = new Employee({
    firstName,
    lastName,
    email,
    phone,
    department,
    position,
    salary,
    createdBy: req.user._id
  });

  const createdEmployee = await employee.save();
  res.status(201).json(createdEmployee);
});

// @desc    Update employee
// @route   PUT /api/employees/:id
// @access  Private
const updateEmployee = asyncHandler(async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    phone,
    department,
    position,
    salary,
    status
  } = req.body;

  const employee = await Employee.findOne({
    _id: req.params.id,
    createdBy: req.user._id
  });

  if (employee) {
    employee.firstName = firstName || employee.firstName;
    employee.lastName = lastName || employee.lastName;
    employee.email = email || employee.email;
    employee.phone = phone || employee.phone;
    employee.department = department || employee.department;
    employee.position = position || employee.position;
    employee.salary = salary || employee.salary;
    employee.status = status || employee.status;

    const updatedEmployee = await employee.save();
    res.json(updatedEmployee);
  } else {
    res.status(404);
    throw new Error('Employee not found');
  }
});

// @desc    Delete employee
// @route   DELETE /api/employees/:id
// @access  Private
const deleteEmployee = asyncHandler(async (req, res) => {
  console.log(req.params, req.user)
  const employee = await Employee.findByIdAndDelete({
    _id: req.params.id,
  });

  if (employee) {
    res.status(200)
    res.json({ message: 'Employee removed' });
  } else {
    res.status(500);
    throw new Error('Employee not found');
  }
});

// @desc    Get employees who joined in the last 7 days
// @route   GET /api/employees/stats
// @access  Private
const getRecentEmployees = asyncHandler(async (req, res) => {
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const recentEmployees = await Employee.find({
    createdAt: { $gte: oneWeekAgo },
    createdBy: req.user._id
  }).sort({ createdAt: -1 });

  const formatted = recentEmployees.map(emp => ({
    name: `${emp.firstName} ${emp.lastName}`,
    role: emp.position,
    joined: formatJoinDate(emp.createdAt)
  }));

  res.json(formatted);
});

// Helper function to format "joined" field like "2 days ago"
function formatJoinDate(date) {
  const now = new Date();
  const diffMs = now - date;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return '1 day ago';
  if (diffDays < 7) return `${diffDays} days ago`;
  return `${Math.floor(diffDays / 7)} weeks ago`;
}


module.exports = {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getRecentEmployees,
};