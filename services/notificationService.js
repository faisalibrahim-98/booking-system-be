const User = require("../models/user");
//const SkillService = require("./skillsService.js");

//let skillService = new SkillService();

// Notifications Service Class.
class NotificationService {
  async addNotification(body) {
    try {
      const user = await User.findById(body.user._id);
      user.notifications.push({
        shiftId: body.shiftId,
        referedBy: body.referer,
      });

      user.save();

      return user;
    } catch (e) {
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

  async removeNotification(body) {
    try {
      const user = await User.findById(body.user._id);
      user.notifications = user.notifications.filter((notification) =>
        !notification.shiftId.equals(body.shift._id)
      );

      user.save();

      return user;
    } catch (e) {
      return null;
    }
  }
}

module.exports = NotificationService;
