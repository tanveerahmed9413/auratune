const express = require("express");
const songController = require("../controller/song.controller");
const upload = require("../middleware/multer.middleware");
const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

// Everything under /api/songs needs a logged-in user
router.use(authMiddleware);

router.post("/upload", upload.single("song"), songController.uploadSong);
router.get("/", songController.getSongs);
// accepts one mood or a comma separated list: /mood/happy,energetic
router.get("/mood/:mood", songController.getSongsByMood);

module.exports = router;
