const Skills = require("../models/skills");

class SkillsService {
  async getSkills() {
    try {
      const skills = await Skills.find({});
      return skills;
    } catch (e) {
      return null;
    }
  }

  async getSkillById(ids) {
    try {
      const obj_ids = ids.map(function (id) {
        return ObjectId(id);
      });
      const skills = await Skills.find({
        _id: { $in: obj_ids },
      });
      return skills;
    } catch (e) {
      return null;
    }
  }

  async createSkill(data) {
    try {
      const skill = await Skills.find({ skillName: data.skillName });

      if (skill.length) {
        return null;
      } else {
        const skill = new Skills(data);
        await skill.save();
        return skill;
      }
    } catch (e) {
      return null;
    }
  }

  async getSkillIdByName(skillName) {
    try {
      const skills = await Skills.find({});
      const skill = skills.find((skill) => skill.skillName === skillName);
      return skill._id;
    } catch (e) {
      return null;
    }
  }
}

module.exports = SkillsService;
