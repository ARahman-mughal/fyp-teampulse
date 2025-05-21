const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    trim: true
  },
  department: {
    type: String,
    required: true,
    enum: ['HR', 'IT', 'Finance', 'Marketing', 'Operations']
  },
  position: {
    type: String,
    required: true
  },
  hireDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['Active', 'On Leave', 'Terminated'],
    default: 'Active'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  // In models/Employee.js add:
  leaveBalances: {
  sick: { type: Number, default: 10 },
  vacation: { type: Number, default: 15 },
  personal: { type: Number, default: 5 }
  }

  
}, { timestamps: true });

module.exports = mongoose.model('Employee', employeeSchema);