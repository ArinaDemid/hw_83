const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const albums = require("./app/albums");
const artists = require("./app/artists");
const tracks = require("./app/tracks");
const users = require("./app/users");
const track_history = require("./app/track_history");

const app = express();
const port = 8000;

app.use(express.json());
app.use(cors());
app.use(express.static("public"));

const run = async () => {
  await mongoose.connect("mongodb://localhost/music", {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  app.use("/albums", albums);
  app.use("/artists", artists);
  app.use("/tracks", tracks);
  app.use("/users", users);
  app.use("/track_history", track_history);

  app.listen(port, () => {
    console.log(`HTTP Server started on ${port} port!`);
  });
};

run().catch(e => {
  console.error(e);
});
