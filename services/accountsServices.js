const User = require("../models/user");
const SkillService = require("./skillsService.js");

let skillService = new SkillService();

// Account Service Class.
class UserAccountsService {
  // Creating account functionality.
  async createAccount(userBody) {
    const user = new User(userBody);

    try {
      await user.save();
      return user;
    } catch (e) {
      return null;
    }
  }

  // Getting account details functionality.
  // Gets detail through users email and password.
  // Used for login.
  async getAccount(accountDetails) {
    try {
      const user = await User.findByCredentials(
        accountDetails.email,
        accountDetails.password
      );
      return user;
    } catch (e) {
      return null;
    }
  }

  // Getting account details by Id functionality.
  async getAccountById(accountId) {
    try {
      const user = await User.findById(accountId);
      return user;
    } catch (e) {
      return null;
    }
  }

  // Updating account details functionality.
  async updateAccount(updates, req) {
    try {
      updates.forEach((update) => (req.user[update] = req.body[update]));
      await req.user.save();
      return req.user;
    } catch (e) {
      return null;
    }
  }

  // deleting account details functionality.
  // Takes the user model object as argument.
  async deleteAccount(id) {
    try {
      const user = await User.findById(id);
      await user.remove();
      return user;
    } catch {
      return null;
    }
  }

  async findAllStaff(query) {
    try {
      const users = await User.find(query);
      return users;
    } catch {
      return null;
    }
  }

  async shiftPaidLogic(shiftDetails) {
    try {
      let staffMembers = await this.findAllStaff({ type: "staff" });

      let shiftStaff = staffMembers.filter((staff) =>
        staff.shifts.shiftsBooked.includes(shiftDetails._id)
      );

      let skillId = await skillService.getSkillIdByName(shiftDetails.role);

      shiftStaff.forEach((user) => {
        // Total Paid
        let startTime = new Date(shiftDetails.start);
        let endTime = new Date(shiftDetails.end);

        user.totalPaid =
          (endTime.getHours() +
            endTime.getMinutes() / 60 -
            (startTime.getHours() + startTime.getMinutes() / 60)) *
          shiftDetails.rate;

        // Experience

        let expFound = user.experience.find(
          (expereince) => expereince.skillId === skillId
        );

        if (expFound) {
          user.experience.forEach((exp) => {
            if (exp.skillId == skillId) {
              exp.days = exp.days + 1;
            }
          });
        } else {
          user.experience.push({
            skillId,
            skillName: shiftDetails.role,
            days: 1,
          });
        }

        // Shifts Booked

        user.shifts.shiftsBooked = user.shifts.shiftsBooked.filter(
          (shiftId) => !shiftId.equals(shiftDetails._id)
        );

        // Shifts Paid

        user.shifts.shiftsPaid.push(shiftDetails._id);

        user.save();
      });

      return shiftStaff;
    } catch {
      return null;
    }
  }

  async rateAllStaff(body) {
    try {
      for (let i = 0; i < body.shiftStaff.length; i++) {
        const user = await User.findById(body.shiftStaff[i]);

        user.ratings.push({
          stars: body.rating,
          givenBy: body.userId,
        });

        user.save();
      }
      return body.shiftStaff;
    } catch {
      return null;
    }
  }

  async rateIndividualStaff(body) {
    try {
      const user = await User.findById(body.staffId);

      user.ratings.push({
        stars: body.rating,
        givenBy: body.userId,
      });

      user.save();

      return user;
    } catch {
      return null;
    }
  }

  async getNotifications(accountId) {
    try {
      const user = await User.findById(accountId);
      return user.notifications;
    } catch (e) {
      return null;
    }
  }
}

module.exports = UserAccountsService;
