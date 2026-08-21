const songModel = require("../models/song.model");
const upload = require("../middleware/multer.middleware");
const imagekit = require("../services/imageKit.service");
const id3 = require("node-id3");

const { analyzeAudio } = require("../services/moodAnalyzer.service");

async function uploadSong(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Song file is required",
      });
    }
    const songBuffer = req.file.buffer;

    const tags = id3.read(songBuffer);


    // =========================
    // RECCOBEATS ANALYSIS
    // =========================

    const analysis = await analyzeAudio(req.file.buffer, req.file.originalname);



    if (!tags?.title) {
      return res.status(400).json({
        success: false,
        message: "Song title not found in metadata",
      });
    }

    if (!tags?.image?.imageBuffer) {
      return res.status(400).json({
        success: false,
        message: "Song poster not found",
      });
    }

    const songFile = await imagekit.uploadFile({
      buffer: songBuffer,
      fileName: `${tags.title}.mp3`,
      folder: "/cohort-2/moodify/songs",
    });

    const posterFile = await imagekit.uploadFile({
      buffer: tags.image.imageBuffer,
      fileName: `${tags.title}.jpeg`,
      folder: "/cohort-2/moodify/posters",
    });

    const song = await songModel.create({
      title: tags.title,
      songUrl: songFile.url,
      posterUrl: posterFile.url,
      mood: analysis.mood,
    });

    return res.status(201).json({
      success: true,
      message: "Song created successfully",
      song,
    });
  } catch (error) {
    console.error("UPLOAD ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Song upload failed",
      error: error.message,
    });
  }
}

async function getSongs(req, res) {
  let songs = await songModel.find();
  return res.status(200).json({
    message: "song fetched successfully",
    songs,
  });
}

async function getSongsByMood(req, res) {
  const { mood } = req.params;

  const songs = await songModel.find({
    mood: mood.toLowerCase(),
  });

  return res.status(200).json({
    message: "success to fetch mood songs",
    mood,
    songs,
  });
}

module.exports = { uploadSong, getSongs, getSongsByMood };
