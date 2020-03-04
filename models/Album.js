const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AlbumSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  artist: {
    type: Schema.Types.ObjectId,
    ref: "Artist",
    required: true
  },
  releaseDate: {
    type: String,
    required: true
  },
  image: String
});

const Album = mongoose.model("Album", AlbumSchema);

module.exports = Album;
