const NotificationService = require("../services/notificationService.js");
const ShiftsService = require("../services/shiftsService.js");
const auth = require("../middleware/auth");
const express = require("express");
const router = new express.Router();

// Instanciation of Services.
let shiftsService = new ShiftsService();
let notificationService = new NotificationService();

router.post("/shift", auth, async (req, res) => {
  try {
    const shiftsDetail = req.body;
    const shift = await shiftsService.createShift(shiftsDetail);
    if (shift) {
      res.status(200).send(shift);
    } else {
      res.status(400).send("Shift Could Not Be Created!");
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/shifts/all", auth, async (req, res) => {
  try {
    const shifts = await shiftsService.getShifts();
    if (shifts) {
      res.status(200).send(shifts);
    } else {
      res.status(400).send("No Shifts Found");
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/shifts/:shiftId", auth, async (req, res) => {
  try {
    const shiftId = req.params.shiftId;
    const shift = await shiftsService.getShiftById(shiftId);

    if (shift) {
      res.status(200).send(shift);
    } else {
      res.status(400).send(`Shift with Id: ${shiftId} not found`);
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

router.patch("/updateShift/:shiftId", auth, async (req, res) => {
  try {
    const shiftId = req.params.shiftId;
    const shiftData = req.body;
    const shift = await shiftsService.updateShift(shiftId, shiftData);

    if (shift) {
      res.status(200).send(shift);
    } else {
      res.status(400).send(`Shift with Id: ${shiftId} not found`);
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post("/apply", auth, async (req, res) => {
  try {
    const shift = req.body.shift;
    const user = req.body.user;

    const updatedUser = await shiftsService.applyShift(shift, user);

    if (updatedUser) {
      res.status(200).send(updatedUser);
    } else {
      res.status(400).send("Cannot Apply");
    }
  } catch (e) {
    res.status(500).send();
  }
});

router.post("/pay", auth, async (req, res) => {
  try {
    const shiftsDetail = req.body;
    const shift = await shiftsService.payShift(shiftsDetail._id);
    if (shift) {
      res.status(200).send(shift);
    } else {
      res.status(400).send("Shift Could Not Be Paid!");
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post("/refer", auth, async (req, res) => {
  try {
    const notification = req.body;
    const user = await notificationService.addNotification(notification);
    if (user) {
      res.status(200).send(user);
    } else {
      res.status(400).send("User Could Not be Refered");
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/notifications/:id", auth, async (req, res) => {
  try {
    const userId = req.params.id;
    const notifications = await notificationService.getNotification(userId);
    if (notifications) {
      res.status(200).send(notifications);
    } else {
      res.status(400).send("Notifications Not Found!");
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post("/removeRefer", auth, async (req, res) => {
  try {
    const body = req.body;
    const user = await notificationService.removeNotification(body);
    if (user) {
      res.status(200).send(user);
    } else {
      res.status(400).send("Notification Could Not Be Removed");
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
