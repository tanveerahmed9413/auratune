const axios = require("axios");
const FormData = require("form-data");

const detectMood = (features) => {
  const {
    energy = 0,
    valence = 0,
    danceability = 0,
    tempo = 0,
    loudness = -60,
    speechiness = 0,
  } = features;

  // Normalize / safety
  const e = Number(energy);
  const v = Number(valence);
  const d = Number(danceability);
  const t = Number(tempo);
  const l = Number(loudness);
  const s = Number(speechiness);

  // =====================================================
  // 1. SAD
  // Low energy + negative valence
  // =====================================================

  if (e < 0.45 && v < 0.45 && t < 115) {
    return "sad";
  }

  // =====================================================
  // 2. HAPPY
  // Positive + danceable + reasonably energetic
  // =====================================================

  if (v >= 0.6 && d >= 0.55 && e >= 0.45) {
    return "happy";
  }

  // =====================================================
  // 3. ANGRY
  // High energy + negative valence + loud
  // =====================================================

  if (e >= 0.65 && v < 0.4 && l >= -9) {
    return "angry";
  }

  // =====================================================
  // 5. SURPRISED
  // High energy + fast + moderate/positive valence
  // =====================================================

  if (e >= 0.7 && t >= 120 && v >= 0.4 && v < 0.7) {
    return "surprised";
  }

  // =====================================================
  // 4. ENERGETIC
  // High energy + fast tempo
  // =====================================================

  if (e >= 0.65 && t >= 115) {
    return "energetic";
  }

  // =====================================================
  // 6. CALM
  // Low/medium energy + positive/neutral valence
  // =====================================================

  if (e < 0.5 && v >= 0.45 && t < 115) {
    return "calm";
  }

  // =====================================================
  // 7. HAPPY fallback
  // =====================================================

  if (v >= 0.55 && d >= 0.5) {
    return "happy";
  }

  // =====================================================
  // 8. CALM fallback
  // =====================================================

  if (e < 0.55 && v >= 0.4) {
    return "calm";
  }

  // =====================================================
  // 9. ENERGETIC fallback
  // =====================================================

  if (e >= 0.6 || t >= 120) {
    return "energetic";
  }

  return "neutral";
};

const analyzeAudio = async (audioBuffer, fileName) => {
  try {
    if (!audioBuffer || !Buffer.isBuffer(audioBuffer)) {
      throw new Error("Invalid audio buffer");
    }

    const form = new FormData();

    form.append("audioFile", audioBuffer, {
      filename: fileName || "song.mp3",
      contentType: "audio/mpeg",
    });

    const headers = {
      ...form.getHeaders(),
      Accept: "application/json",
    };

    const response = await axios.post(
      "https://api.reccobeats.com/v1/analysis/audio-features",
      form,
      {
        headers,
        maxBodyLength: Infinity,
        maxContentLength: Infinity,
        timeout: 180000,
      },
    );

    const features = response.data;

    const mood = detectMood(features);

    return {
      mood,
      features,
    };
  } catch (error) {
    console.error("Message:", error.message);

    throw new Error("Audio analysis failed");
  }
};

module.exports = {
  analyzeAudio,
  detectMood,
};
