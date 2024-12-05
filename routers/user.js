const UserAccountsService = require("../services/accountsServices.js");
const Interfaces = require("../interface.js");
const auth = require("../middleware/auth");
const express = require("express");
const router = new express.Router();

// Instanciation of Services.
let accountsService = new UserAccountsService();
let interface = new Interfaces();

// create account
router.post("/signup", async (req, res) => {
  try {
    const bodyData = interface.createUser(req.body);
    const user = await accountsService.createAccount(bodyData);

    if (!user) {
      res.status(404).send("could not create account");
    }

    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (error) {
    res.status(500).send(error);
  }
});

// login
router.post("/login", async (req, res) => {
  try {
    const bodyData = interface.loginUser(req.body);
    const user = await accountsService.getAccount(bodyData);
    if (user) {
      const token = await user.generateAuthToken();
      res.status(200).send({ user, token });
    } else {
      res.status(404).send("No account");
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

// logout
router.post("/logout", auth, async (req, res) => {
  try {
    // get the token which is currently used by the user
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();

    res.send();
  } catch (e) {
    res.status(500).send();
  }
});

// get account details by mongo Object Id
router.get("/account/:accountId", auth, async (req, res) => {
  try {
    const accountId = req.params.accountId;
    const account = await accountsService.getAccountById(accountId);
    if (account) {
      res.status(200).send(account);
    } else {
      res.status(400).send("No account");
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

// get all user data
router.get("/staff", auth, async (req, res) => {
  try {
    const account = await accountsService.findAllStaff({ type: "staff" });

    if (account) {
      res.status(200).send(account);
    } else {
      res.status(400).send("No accounts");
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update account details
router.patch("/account/me", auth, async (req, res) => {
  try {
    const updates = Object.keys(req.body);
    // Make sure that only these fields can be updated by user.
    const allowedUpdates = [
      "name",
      "email",
      "password",
      "age",
      "address",
      "type",
      "bankDetails",
      "totalPaid",
      "experience",
      "ratings",
    ];
    const isValidOperation = updates.every((update) =>
      allowedUpdates.includes(update)
    );

    if (!isValidOperation) {
      return res.status(400).send({ error: "Invalid updates!" });
    }

    const updatedAccount = await accountsService.updateAccount(updates, req);

    if (updatedAccount) {
      res.status(200).send(updatedAccount);
    } else {
      res.status(400).send("Cannot update");
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post("/account/delete", auth, async (req, res) => {
  try {
    const user = await accountsService.deleteAccount(req.id);

    if (user) {
      res.status(200).send(user);
    } else {
      res.status(400).send("Cannot delete");
    }
  } catch (e) {
    res.status(500).send();
  }
});

router.post("/search/staff", auth, async (req, res) => {
  try {
    const staff = await accountsService.findAllStaff(req.body);

    if (staff) {
      res.status(200).send(staff);
    } else {
      res.status(400).send("Cannot find any staff");
    }
  } catch (e) {
    res.status(500).send();
  }
});

router.post("/rateAll", auth, async (req, res) => {
  try {
    const result = await accountsService.rateAllStaff(req.body);

    if (result) {
      res.status(200).send(result);
    } else {
      res.status(400).send("Could Not Rate!");
    }
  } catch (e) {
    res.status(500).send();
  }
});

router.post("/rateIndividual", auth, async (req, res) => {
  try {
    const result = await accountsService.rateIndividualStaff(req.body);

    if (result) {
      res.status(200).send(result);
    } else {
      res.status(400).send("Could Not Rate!");
    }
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = router;
