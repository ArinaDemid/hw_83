const path = require("path");
const express = require("express");
const multer = require("multer");
const nanoid = require("nanoid");
const config = require("../config");
const Album = require("../models/Album");

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
  if (!req.query.artist) {
    const albums = await Album.find();
    res.send(albums);
  } else {
    const albumsOfArtist = await Album.find({
      artist: { _id: req.query.artist }
    }).populate("artist");
    res.send(albumsOfArtist);
  }
});

router.get("/:id", async (req, res) => {
  const album = await Album.findById(req.params.id).populate("artist");
  return res.send(album);
});

router.post("/", upload.single("image"), async (req, res) => {
  const albumData = req.body;

  if (req.file) {
    albumData.image = req.file.filename;
  } else {
    albumData.image = null;
  }

  if (!albumData.title) {
    res
      .status(400)
      .send({ error: "Title of the album must be present in the request" });
  }
  if (!albumData.artist) {
    res
      .status(400)
      .send({ error: "ID of the artist must be present in the request" });
  }

  if (!albumData.releaseDate) {
    res
      .status(400)
      .send({ error: "Release date must be present in the request" });
  }

  const album = new Album(albumData);
  try {
    await album.save();
    return res.send(album);
  } catch (error) {
    return res.status(400).send(error);
  }
});

module.exports = router;
