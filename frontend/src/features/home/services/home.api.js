import api from "../../../lib/api";

export const getAllSongs = async () => (await api.get("/api/songs")).data.songs;

// `moods` can be one mood or a list; the backend accepts a comma separated list
export const getSongsByMood = async (moods) => {
  const list = Array.isArray(moods) ? moods.join(",") : moods;
  return (await api.get(`/api/songs/mood/${encodeURIComponent(list)}`)).data.songs;
};

export const songUpload = async (songFile, mood) => {
  const formData = new FormData();
  formData.append("song", songFile);
  if (mood && mood !== "auto") formData.append("mood", mood);
  return (await api.post("/api/songs/upload", formData)).data;
};
