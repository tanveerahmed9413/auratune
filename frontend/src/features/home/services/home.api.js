import axios from "axios";

const api = axios.create({
  baseURL: "https://auratune-vqd1.onrender.com",
  withCredentials: true,
});

export async function getAllSongs() {
  const response = await api.get("/api/songs");
  return response.data.songs;
}

export const getSongsByMood = async (mood) => {
  const response = await api.get(`/api/songs/mood/${mood}`);
  console.log(response.data.songs);
  return response.data.songs;
};

export async function songUpload(songFile) {
  try {
    const formData = new FormData();
    formData.append("song", songFile);
    const response = await api.post("/api/songs/upload", formData);

    return response.data;
  } catch (error) {
    console.error("UPLOAD ERROR:", error.message);

    throw error;
  }
}

export async function songSearch(query){
  const responce =  await api.get(`/api/songs/search?q=${encodeURIComponent(query)}`)
  return responce.data.songs
}
