const express = require("express");
const User = require("../models/User");
const router = express.Router();

router.get("/", async (req, res) => {
  const users = await User.find();
  return res.send(users);
});

router.post("/", async (req, res) => {
  const user = new User(req.body);
  await user.save();
  return res.send(user);
});

router.post("/sessions", async (req, res) => {
  const user = await User.findOne({ username: req.body.username });

  if (!user) {
    return res.status(400).send({ error: "Username not found" });
  }

  if (!req.body.password) {
    return res.status(400).send({ error: "Enter user password" });
  }

  const isMatch = await user.checkPassword(req.body.password);

  if (!isMatch) {
    return res.status(400).send({ error: "Password is wrong" });
  }
  user.generateToken();
  await user.save();
  res.send({ token: user.token });
});

module.exports = router;
