const SkillsService = require("../services/skillsService.js");
const Interfaces = require("../interface.js");
const auth = require("../middleware/auth");
const express = require("express");
const router = new express.Router();

// Instanciation of Services.
let skillsService = new SkillsService();
let interface = new Interfaces();

router.get("/skills/all", auth, async (req, res) => {
  try {
    const skills = await skillsService.getSkills();
    if (skills) {
      res.status(200).send(skills);
    } else {
      res.status(400).send("No Skills Found");
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/skills/id", auth, async (req, res) => {
  try {
    const skills = await skillsService.getSkillById(req.body.ids);
    if (skills) {
      res.status(200).send(skills);
    } else {
      res.status(400).send("No Skills Found");
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post("/skill", auth, async (req, res) => {
  try {
    const skill = await skillsService.createSkill(req.body);

    if (!skill) {
      res.status(409).send("Skill Exists");
    } else {
      res.status(200).send(skill);
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
