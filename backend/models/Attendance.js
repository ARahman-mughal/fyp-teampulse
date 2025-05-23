const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  clockIn: {
    type: Date,
    required: true
  },
  clockOut: {
    type: Date,
    default: null
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      default: [0, 0]
    }
  },
  notes: {
    type: String
  }
}, {
  timestamps: true
});

// Index for querying attendance by employee and date range
attendanceSchema.index({ employee: 1, clockIn: -1 });

// Index for location-based queries
attendanceSchema.index({ location: '2dsphere' });

// Virtual for duration in hours
attendanceSchema.virtual('durationHours').get(function() {
  if (!this.clockOut) return null;
  return (this.clockOut - this.clockIn) / (1000 * 60 * 60);
});

// Method to check if currently clocked in
attendanceSchema.methods.isActive = function() {
  return this.clockOut === null;
};

const Attendance = mongoose.model('Attendance', attendanceSchema);

module.exports = Attendance; 