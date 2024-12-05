const Shifts = require("../models/shifts");
const User = require("../models/user");
const UserAccountsService = require("./accountsServices.js");

let userService = new UserAccountsService();

class ShiftsService {
  async createShift(shiftBody) {
    const shift = new Shifts(shiftBody);

    try {
      await shift.save();
      return shift;
    } catch (e) {
      return null;
    }
  }

  async getShifts() {
    try {
      const shifts = await Shifts.find({});
      return shifts;
    } catch (e) {
      return null;
    }
  }

  async getShiftById(id) {
    try {
      const shift = await Shifts.findById(id);
      return shift;
    } catch (e) {
      return null;
    }
  }

  async updateShift(id, data) {
    try {
      const shift = await Shifts.findByIdAndUpdate(id, data, { new: true });
      return shift;
    } catch (e) {
      return null;
    }
  }

  async applyShift(shiftDetails, userDetails) {
    const shift = await Shifts.findById(shiftDetails._id);
    const user = await User.findById(userDetails._id);

    user.shifts.shiftsBooked.push(shift._id);

    try {
      await user.save();
      return user;
    } catch (e) {
      return null;
    }
  }

  async payShift(shiftId) {
    try {
      const shift = await Shifts.findById(shiftId);
      shift.status = "paid";

      await userService.shiftPaidLogic(shift);
      await shift.save();
      return shift;
    } catch (e) {
      return null;
    }
  }
}

module.exports = ShiftsService;
