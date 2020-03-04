const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = require("../models/User");
const TrackHistory = require("../models/TrackHistory");

router.get("/", async (req, res) => {
  const populateQuery = [
    { path: "user", select: "token" },
    { path: "track", select: "_id" }
  ];
  const trackHistory = await TrackHistory.find().populate(populateQuery);
  return res.send(trackHistory);
});

router.post("/", async (req, res) => {
  const token = req.get("Token");
  try {
    const user = await User.findOne({ token });

    if (!user) {
      return res.status(401).send({ error: "Username not Unauthorized" });
    }

    const trackId = req.body.track;

    if (!trackId) {
      return res.status(400).send({ error: "Enter track ID" });
    }

    if (!mongoose.Types.ObjectId.isValid(trackId)) {
      return res.status(400).send({ error: "Track not found" });
    }

    const trackForSave = {
      user: user._id,
      track: trackId,
      datetime: new Date().toISOString()
    };

    const trackHistory = new TrackHistory(trackForSave);
    await trackHistory.save();
    return res.send(trackHistory);
  } catch (error) {
    return res.status(400).send({ error: error.message });
  }
});

module.exports = router;
