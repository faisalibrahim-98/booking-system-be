const mongoose = require("mongoose");

const shiftsSchema = new mongoose.Schema({
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
  // Event Date
  start: {
    type: Date,
    required: true,
  },
  end: {
    type: Date,
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
    default: 'available'
  },
  skillsRequired: {
    type: [mongoose.Schema.Types.ObjectId],
  },
});

const Shifts = mongoose.model("Shifts", shiftsSchema);

module.exports = Shifts;
