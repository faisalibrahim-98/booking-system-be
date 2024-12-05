const mongoose = require("mongoose");

const skillsSchema = new mongoose.Schema({
  skillName: {
    type: String,
    requried: true,
    trim: true,
  },
});

const Skills = mongoose.model("Skills", skillsSchema);

module.exports = Skills;
