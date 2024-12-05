const mongoose = require("mongoose");

const paidShiftsSchema = new mongoose.Schema({
  location: {
    type: String,
    required: true,
    trim: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  rate: {
    type: Number,
  },
  startTime: {
    type: String,
    required: true,
  },
  endTime: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  eventType: {
    type: String,
  },
  role: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  skillsRequired: {
    type: [String],
    required: true,
  },
});

const PaidShifts = mongoose.model("PaidShifts", paidShiftsSchema);

module.exports = PaidShifts;
