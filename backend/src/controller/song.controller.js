const songModel = require("../models/song.model");
const imagekit = require("../services/imageKit.service");
const id3 = require("node-id3");
const path = require("path");
const { analyzeAudio } = require("../services/moodAnalyzer.service");

const VALID_MOODS = songModel.schema.path("mood").enumValues;

function escapeXml(value) {
  return value.replace(/[<>&"']/g, (character) => ({
    "<": "&lt;",
    ">": "&gt;",
    "&": "&amp;",
    '"': "&quot;",
    "'": "&apos;",
  })[character]);
}

function createFallbackCover(title) {
  const label = escapeXml(title.slice(0, 36));
  return Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#6d28d9"/><stop offset="1" stop-color="#111827"/></linearGradient></defs><rect width="600" height="600" fill="url(#g)"/><circle cx="300" cy="245" r="112" fill="#ffffff" fill-opacity=".12"/><path d="M350 155v165a65 65 0 1 1-28-53V205l120-28v115a65 65 0 1 1-28-53v-120z" fill="#fff"/><text x="300" y="455" text-anchor="middle" fill="#fff" font-family="Arial,sans-serif" font-size="28">${label}</text><text x="300" y="500" text-anchor="middle" fill="#ddd6fe" font-family="Arial,sans-serif" font-size="18" letter-spacing="5">AURATUNE</text></svg>`,
    "utf8",
  );
}

async function uploadSong(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "Song file is required" });
    }

    const songBuffer = req.file.buffer;
    let tags = {};
    try {
      tags = id3.read(songBuffer) || {};
    } catch (err) {
      console.warn("ID3 metadata could not be read; using upload filename and fallback artwork:", err.message);
    }

    const filenameTitle = path.basename(req.file.originalname, path.extname(req.file.originalname));
    const title = (typeof tags.title === "string" && tags.title.trim() ? tags.title.trim() : filenameTitle)
      .replace(/[<>:"/\\|?*\u0000-\u001F]/g, "")
      .trim()
      .slice(0, 120) || "Untitled song";
    const coverBuffer = tags.image?.imageBuffer || createFallbackCover(title);
    const coverExtension = tags.image?.imageBuffer ? "jpeg" : "svg";

    // Mood: user's choice wins, otherwise analyze the audio, otherwise neutral
    let mood = String(req.body?.mood || "").toLowerCase();
    let moodSource = "user";
    if (!VALID_MOODS.includes(mood)) {
      try {
        const analysis = await analyzeAudio(songBuffer, req.file.originalname);
        mood = analysis.mood;
        moodSource = "analysis";
      } catch (err) {
        console.warn("Mood analysis failed, using neutral:", err.message);
        mood = "neutral";
        moodSource = "fallback";
      }
    }

    const [songFile, posterFile] = await Promise.all([
      imagekit.uploadFile({
        buffer: songBuffer,
        fileName: `${title}.mp3`,
        folder: "/auratune/songs",
      }),
      imagekit.uploadFile({
        buffer: coverBuffer,
        fileName: `${title}.${coverExtension}`,
        folder: "/auratune/posters",
      }),
    ]);

    const song = await songModel.create({
      title,
      songUrl: songFile.url,
      posterUrl: posterFile.url,
      mood,
    });

    return res.status(201).json({
      success: true,
      message: moodSource === "fallback"
        ? "Song uploaded (mood analysis was unavailable, marked as neutral)"
        : "Song created successfully",
      moodSource,
      song,
    });
  } catch (error) {
    console.error("UPLOAD ERROR:", error);
    return res.status(500).json({ success: false, message: "Song upload failed. Please try again." });
  }
}

async function getSongs(req, res) {
  try {
    const songs = await songModel.find().sort({ _id: -1 });
    return res.status(200).json({ message: "Songs fetched successfully", songs });
  } catch (error) {
    console.error("GET SONGS ERROR:", error);
    return res.status(500).json({ message: "Could not fetch songs" });
  }
}

async function getSongsByMood(req, res) {
  try {
    const moods = String(req.params.mood)
      .toLowerCase()
      .split(",")
      .map((m) => m.trim())
      .filter((m) => VALID_MOODS.includes(m));

    if (moods.length === 0) {
      return res.status(400).json({ message: `Mood must be one of: ${VALID_MOODS.join(", ")}` });
    }

    const songs = await songModel.find({ mood: { $in: moods } }).sort({ _id: -1 });
    return res.status(200).json({ message: "Mood songs fetched successfully", moods, songs });
  } catch (error) {
    console.error("GET MOOD SONGS ERROR:", error);
    return res.status(500).json({ message: "Could not fetch songs" });
  }
}

module.exports = { uploadSong, getSongs, getSongsByMood };
