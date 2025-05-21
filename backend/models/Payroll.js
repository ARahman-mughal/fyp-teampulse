const mongoose = require('mongoose');

const payrollSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  payPeriod: {
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    }
  },
  basicSalary: {
    type: Number,
    required: true
  },
  status: {
    type: String,
  },
  allowances: [
    {
      name: String,
      amount: Number
    }
  ],
  deductions: [
    {
      name: String,
      amount: Number
    }
  ],
  netPay: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Payroll', payrollSchema);
