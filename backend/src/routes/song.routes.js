const express = require("express")
const songController = require("../controller/song.controller")
const upload = require("../middleware/multer.middleware")


const router = express.Router()

// POST ->  "api/song"
router.post("/upload",upload.single("song"),songController.uploadSong)
router.get('/',songController.getSongs)
router.get("/mood/:mood", songController.getSongsByMood);

module.exports = router