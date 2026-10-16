const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const app = express();

// Render / proxies terminate TLS, needed for secure cookies
app.set("trust proxy", 1);

app.use(express.json());
app.use(cookieParser());

// CLIENT_URL may be a comma separated list. Not needed when the backend serves the frontend itself.
const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:5173")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, cb) =>
      !origin || allowedOrigins.includes(origin) ? cb(null, true) : cb(new Error("Not allowed by CORS")),
    credentials: true,
  }),
);

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

const authRoutes = require("./routes/auth.routes");
const songRoutes = require("./routes/song.routes");

app.use("/api/auth", authRoutes);
app.use("/api/songs", songRoutes);

// Unknown /api routes must return JSON, not the React page
app.use("/api", (req, res) => res.status(404).json({ message: "API route not found" }));

// Serve the built React app (copied to backend/public/dist by `npm run build` at the repo root)
const publicPath = path.join(__dirname, "../public/dist");
if (fs.existsSync(publicPath)) {
  app.use(express.static(publicPath));
  // React Router fallback (Express 5 syntax)
  app.get("/{*splat}", (req, res) => res.sendFile(path.join(publicPath, "index.html")));
}

// Central error handler (multer errors, async errors, CORS errors...)
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  const status = err.code === "LIMIT_FILE_SIZE" ? 413 : err.status || 500;
  const message =
    err.code === "LIMIT_FILE_SIZE" ? "File is too large (max 50 MB)" : err.message || "Internal server error";
  res.status(status).json({ success: false, message });
});

module.exports = app;
