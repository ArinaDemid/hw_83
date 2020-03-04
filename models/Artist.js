const mongoose = require("mongoose");

const ArtistSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  image: String,
  info: {
    type: String,
    required: true
  }
});

const Artist = mongoose.model("Artist", ArtistSchema);

module.exports = Artist;
