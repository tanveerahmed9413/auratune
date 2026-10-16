const multer = require("multer");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB
  fileFilter: (req, file, cb) => {
    const isMp3 = file.mimetype === "audio/mpeg" || file.originalname.toLowerCase().endsWith(".mp3");
    if (!isMp3) {
      const err = new Error("Only MP3 files are supported");
      err.status = 400;
      return cb(err);
    }
    cb(null, true);
  },
});

module.exports = upload;
