const Payroll = require('../models/Payroll');

// @desc    Create payroll record
// @route   POST /api/payrolls
const createPayroll = async (req, res) => {
  try {
    const { employee, month, year, basicSalary, allowances, deductions, payPeriod } = req.body;
    
    // Calculate net salary
    const totalAllowances = allowances.reduce((sum, item) => sum + item.amount, 0);
    const totalDeductions = deductions.reduce((sum, item) => sum + item.amount, 0);
    const netPay = basicSalary + totalAllowances - totalDeductions;

    const payroll = await Payroll.create({
      employee,
      month,
      year,
      basicSalary,
      allowances,
      deductions,
      netPay,
      payPeriod,
      status: 'Pending'
    });

    res.status(201).json({
      success: true,
      data: payroll
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
};

// @desc    Get all payroll records
// @route   GET /api/payrolls
const getPayrolls = async (req, res) => {
  try {
    const payrolls = await Payroll.find().populate('employee', 'firstName lastName position');
    res.status(200).json({
      success: true,
      data: payrolls
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
};

// @desc    Get payrolls for specific employee
// @route   GET /api/payrolls/employee/:employeeId
const getEmployeePayrolls = async (req, res) => {
  try {
    const payroll = await Payroll.findById(req.params.id)
      .populate('employee', 'firstName lastName position');
    
    res.status(200).json({
      success: true,
      data: payroll
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
};

// @desc    Update payroll status
// @route   PUT /api/payrolls/:id/status
const updatePayrollStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  // 1. Validate Input
  if (!id || !status) {
    return res.status(400).json({
      success: false,
      error: "Payroll ID and status are required.",
    });
  }

  // 2. Check if status is valid
  const validStatuses = ["Pending", "Approved", "Paid", "Rejected"];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      error: `Invalid status. Must be one of: ${validStatuses.join(", ")}.`,
    });
  }

  try {
    // 3. Check if payroll exists before updating
    const existingPayroll = await Payroll.findById(id);
    if (!existingPayroll) {
      return res.status(404).json({
        success: false,
        error: "Payroll not found.",
      });
    }

    // 4. Update payroll status & payment date (if Paid)
    const updateData = {
      status,
      ...(status === "Paid" && { paymentDate: Date.now() }), // Only update paymentDate if status is "Paid"
    };

    // 5. Apply the update (FIXED: Use findByIdAndUpdate instead of updateData)
    const updatedPayroll = await Payroll.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true } // Ensures the updated document is returned
    ).populate("employee", "firstName lastName position");

    // 5. Success Response
    res.status(200).json({
      success: true,
      data: updatedPayroll,
    });
  } catch (err) {
    // 6. Handle Errors
    console.error("Error updating payroll status:", err);
    res.status(500).json({
      success: false,
      error: "Server error while updating payroll status.",
    });
  }
};

module.exports = {
  createPayroll,
  getEmployeePayrolls,
  updatePayrollStatus,
  getPayrolls,
};