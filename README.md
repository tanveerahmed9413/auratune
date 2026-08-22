# AuraTune 🎵

AuraTune is a full-stack music web application that lets users upload and play songs and uses music features/mood classification to organize songs by mood.

## Live Link => https://auratune-vqd1.onrender.com/

## GitHub Repo => https://github.com/tanveerahmed9413/auratune

## Tech Stack

### Frontend
- React.js
- Vite
- Tailwind CSS
- Axios
- React Router DOM
- Context API
- MediaPipe Tasks Vision
  - Face Landmarker for facial-expression/mood detection
- Lucide React

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt
- cookie-parser
- cors
- express-validator
- multer
- node-id3
- Axios
- FormData

### Storage / External Services
- ImageKit — audio and image storage
- MongoDB Atlas — database
- ReccoBeats — experimented with audio feature analysis

### Music / Mood Analysis
- MusicNN/MSD model — experimented with automatic music tagging
- Rule-based mood classification using:
  - energy
  - sad
  - happy
  - calm
  - energy
  - energetic
  - angry
  - tempo
  - surprised
  - neutral

---

## Features

- User registration and login
- Authentication with JWT/cookies
- Get current logged-in user
- Protected authentication flow
- Song upload
- Song poster upload
- ID3 metadata extraction
- Audio/image storage using ImageKit
- Song listing
- Song playback
- Play/pause
- Previous/next song
- Progress and duration
- Bottom music player
- Mood-based song classification
- Facial-expression detection using MediaPipe
- Responsive music UI

---

## Project Structure

```text
AuraTune/
│
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── services/
│   │   └── utils/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── services/
│   │   └── config/
│   │   └── app.js
│   ├── package.json
│   └── server.js
│
└── README.md
```

---

## How It Works

### Authentication

```
Register / Login
       ↓
Backend validates request
       ↓
JWT authentication
       ↓
Cookie
       ↓
Protected API requests
```

### Song Upload

```
Song + Poster
      ↓
Multer
      ↓
Read ID3 metadata
      ↓
ImageKit upload
      ↓
Music analysis / mood detection
      ↓
MongoDB
```

### Mood Detection

Music features are used for mood classification.

Example rule used during development:

```text
Low energy + low valence + low tempo
                ↓
              Sad

High energy + high valence
                ↓
             Happy
```

The project also includes facial-expression detection using MediaPipe Face Landmarker.

---

## Environment Variables

### Backend `.env`

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint


```


## Run Locally

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend:

```text
http://localhost:5173
```

Backend:

```text
http://localhost:3000
```

---

## Deployment

### Backend — Render

Backend is deployed as a Node/Express Web Service.

```text
Root Directory: backend
Build Command: npm install
Start Command: npm start
```

Production environment variables must be added in Render.

After deployment, update the frontend API variable:

```env
VITE_API_URL=https://your-backend-url.onrender.com/api
```

Also update the backend CORS origin:

```env
FRONTEND_URL=https://your-frontend-url
```





## Problems Faced During Development

### 1. CORS Issues

Frontend and backend were running on different origins, causing authentication/API requests to fail.

Fixed by configuring Express CORS correctly and allowing credentials.

---

### 2. ReccoBeats 413 Error

Error encountered:

```text
413 stream has been aborted
```

Cause:

The uploaded audio was too large for the attempted ReccoBeats analysis flow.

This approach was therefore not suitable for every uploaded file.

---

### 3. Essentia.js / MusicNN Model Problems

While implementing automatic music analysis, the MusicNN model setup caused problems including model download/fetch failures and unavailable model URLs.

Because of these issues, the mood-analysis implementation was tested with alternative approaches instead of relying completely on the remote MusicNN model.

---

### 4. TensorFlow.js Setup

TensorFlow.js was tested for music analysis.

`@tensorflow/tfjs-node` was also explored for Node.js CPU performance, but native TensorFlow/model compatibility created additional setup complexity.

---



### 5. Media Player State

The bottom player initially had issues when a song was clicked from the song list.

The player state had to be centralized so that:

```text
SongCard
   ↓
Current Song State
   ↓
Bottom Player
   ↓
Audio Element
```

The player was also adjusted for autoplay, mute, next/previous and responsive behavior.

---

## Git

```bash
git add .
git commit -m "Update AuraTune"
git push origin main
```

---

## Author

**Tanveer Ahmed**

MERN Stack Developer | BCA Student | @Cohort-2.0 Student
