const path = require("path");
const express = require("express");
const multer = require("multer");
const nanoid = require("nanoid");
const config = require("../config");
const Artist = require("../models/Artist");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, config.uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, nanoid() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const artists = await Artist.find();
    res.send(artists);
  } catch {
    res.sendStatus(500);
  }
});

router.post("/", upload.single("image"), async (req, res) => {
  const artistData = req.body;

  if (req.file) {
    artistData.image = req.file.filename;
  } else {
    artistData.image = null;
  }

  if (!artistData.name) {
    return res
      .status(400)
      .send({ error: "Name of the artist must be present in the request" });
  }

  if (!artistData.info) {
    return res
      .status(400)
      .send({ error: "Info about the artist must be present in the request" });
  }

  const artist = new Artist(artistData);
  try {
    await artist.save();
    res.send(artist);
  } catch (error) {
    return res.status(400).send(error);
  }
});

module.exports = router;
