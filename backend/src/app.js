const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(express.json());
app.use(cookieParser());

const allowedOrigins = [
    "http://localhost:5173",
    "https://auratune-vqd1.onrender.com",
];

app.use(
    cors({
        origin: function (origin, callback) {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
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

// React Router fallback
app.get("/{*splat}", (req, res) => {
    res.sendFile(path.join(publicPath, "index.html"));
});

module.exports = app;