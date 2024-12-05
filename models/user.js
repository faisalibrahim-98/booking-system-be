const PaidShifts = require("./paidShifts");
const validator = require("validator");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Skills = require("./skills");
const Shifts = require("./shifts");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Email is invalid");
        }
      },
    },
    password: {
      type: String,
      required: true,
      minlength: 7,
      trim: true,
    },
    age: {
      type: Number,
      default: 0,
      validate(value) {
        if (value < 0) {
          throw new Error("Age must be a postive number");
        }
      },
    },
    address: {
      type: String,
      default: "",
    },
    type: {
      type: String,
      default: "staff",
    },
    bankDetails: {
      accountNumber: {
        type: String,
      },
      sortCode: {
        type: String,
      },
    },
    totalPaid: {
      type: Number,
      default: 0,
    },
    experience: [
      {
        skillId: {
          type: mongoose.Schema.Types.ObjectId,
        },
        skillName: {
          type: String,
        },
        days: {
          type: Number,
        },
      },
    ],
    ratings: [
      {
        stars: {
          type: Number,
        },
        givenBy: {
          type: mongoose.Schema.Types.ObjectId,
        },
      },
    ],
    shifts: {
      shiftsPaid: [
        {
          type: mongoose.Schema.Types.ObjectId,
        },
      ],
      shiftsBooked: [
        {
          type: mongoose.Schema.Types.ObjectId,
        },
      ],
      shiftsNoShow: [
        {
          type: mongoose.Schema.Types.ObjectId,
        },
      ],
    },
    notifications: [
      {
        shiftId: {
          type: mongoose.Schema.Types.ObjectId,
        },
        referedBy: {
          type: mongoose.Schema.Types.ObjectId,
        },
      },
    ],
    tokens: [
      {
        token: {
          type: String,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  delete userObject.password;
  delete userObject.tokens;

  return userObject;
};

userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("Unable to login");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Unable to login");
  }

  return user;
};

userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);

  user.tokens = user.tokens.concat({ token });
  await user.save();

  return token;
};

// Hash the plain text password before saving
userSchema.pre("save", async function (next) {
  const user = this;

  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  next();
});

userSchema.pre("remove", async function (next) {
  const user = this;
  await Skills.updateMany({}, { $pull: { owners: user._id } }, { new: true });
  await Shifts.updateMany({}, { $pull: { owners: user._id } }, { new: true });
  await PaidShifts.updateMany(
    {},
    { $pull: { owners: user._id } },
    { new: true }
  );
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
