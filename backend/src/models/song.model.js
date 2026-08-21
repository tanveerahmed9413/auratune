const mongoose = require("mongoose");

const songSchema = new mongoose.Schema({
  songUrl: {
    type: String,
    required: true,
  },
  posterUrl: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  mood: {
    type: String,
    enum: [
      "sad",
      "calm",
      "happy",
      "energetic",
      "angry",
      "surprised",
      "neutral",
    ],
    default: "neutral",
  },
});

const songModel = mongoose.model("songs", songSchema);

module.exports = songModel;
