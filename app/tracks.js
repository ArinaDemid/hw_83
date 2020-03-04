const express = require("express");
const Track = require("../models/Track");
const router = express.Router();

router.get("/", async (req, res) => {
  if (req.query.artist) {
    const tracksOfArtist = await Track.find().populate("album");
    const allTracksArtists = [];
    tracksOfArtist.forEach(track => {
      if (String(track.album.artist) === req.query.artist) {
        allTracksArtists.push(track);
      }
    });
    res.send(allTracksArtists);
  } else if (!req.query.album) {
    const tracks = await Track.find();
    res.send(tracks);
  } else {
    const tracksOfAlbum = await Track.find({
      album: req.query.album
    }).populate("album");
    res.send(tracksOfAlbum);
  }
});

router.post("/", async (req, res) => {
  const trackData = req.body;

  if (!trackData.title) {
    res.status(400).send({ error: "Title must be present in the request" });
  }

  if (!trackData.album) {
    res
      .status(400)
      .send({ error: "Id of the album must be present in the request" });
  }

  const track = new Track(trackData);
  try {
    await track.save();
    res.send(track);
  } catch (error) {
    return res.status(400).send(error);
  }
});

module.exports = router;
