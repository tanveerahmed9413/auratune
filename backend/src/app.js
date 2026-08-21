const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);

// Routes
const authRoutes = require("./routes/auth.routes");
const songRoutes = require("./routes/song.routes");

app.use("/api/auth", authRoutes);
app.use("/api/songs", songRoutes);

// React frontend
const publicPath = path.join(__dirname, "../public/dist");

app.use(express.static(publicPath));

// React Router fallback — Express 5
app.get("/{*splat}", (req, res) => {
    res.sendFile(path.join(publicPath, "index.html"));
});

module.exports = app;