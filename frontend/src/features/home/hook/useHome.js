import { useContext, useState } from "react";

import { HomeContext } from "../home.context";
import { getAllSongs, songUpload, getSongsByMood ,songSearch } from "../services/home.api";
import {
  dismissToast,
  showError,
  showLoading,
  showSuccess,
} from "../../../utils/toast";

export const useHome = () => {
  const context = useContext(HomeContext);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [moodLoading, setMoodLoading] = useState(false);
  const [searchLoading,setSearchLoading] = useState(false)

  if (!context) {
    throw new Error("useHome must be used inside HomeProvider");
  }

  const {
    songs,
    setSongs,

    loading,
    setLoading,

    currentSong,
    setCurrentSong,

    currentIndex,
    setCurrentIndex,

    uploadedSong,
    setUploadedSong,

    mood,
    setMood,

    selectedMood,
    setSelectedMood,
    
    searchResult,
    setSearchResults,

    searchQuery,
    setSearchQuery
  } = context;

  // GET ALL SONGS

  const getSongs = async () => {
    try {
      setLoading(true);

      const response = await getAllSongs();

      setSongs(response);

      return response;
    } catch (error) {
      console.error("Get songs error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGetSongsByMood = async (detectedMood) => {
    try {
      setMoodLoading(true);
      setMood(detectedMood);

      const data = await getSongsByMood(detectedMood);

      setSongs(data);
    } catch (error) {
      console.error("[handleGetSongsByMood] Failed to get mood songs:", error);
      setSongs([]);
    } finally {
      setMoodLoading(false);
    }
  };

  const handleUploadSong = async (formData) => {
    try {
      setUploadLoading(true);

      const response = await songUpload(formData);

      setUploadedSong(response.song);

      setSongs((prev) => [...prev, response.song]);

      // Phir success toast dikhao
      showSuccess("Song Created Successfully!");

      return response;
    } catch (error) {
      console.error("UPLOAD ERROR:", error);

      const message =
        error?.response?.data?.message ||
        "Song upload failed. Please try again.";
      // Error toast
      showError(message);

      throw error;
    } finally {
      setUploadLoading(false);
    }
  };

  const handleSearchSongs = async (query) => {
  setSearchQuery(query);

  if (!query.trim()) {
    setSearchResults([]);
    return;
  }

  try {
    setSearchLoading(true);

    const songs = await songSearch(query);

    setSearchResults(songs);
  } catch (error) {
    console.error("Search failed:", error);
    setSearchResults([]);
  } finally {
    setLoading(false);
  }
};

  const playSong = (song, index) => {
    setCurrentSong(song);
    setCurrentIndex(index);
  };

  const nextSong = () => {
    if (!songs || songs.length === 0) return;

    const nextIndex = currentIndex + 1;

    // Last song par ho to first song
    if (nextIndex >= songs.length) {
      setCurrentIndex(0);
      setCurrentSong(songs[0]);

      return;
    }

    setCurrentIndex(nextIndex);
    setCurrentSong(songs[nextIndex]);
  };

  const previousSong = () => {
    if (!songs || songs.length === 0) return;

    const previousIndex = currentIndex - 1;

    // First song par ho to last song
    if (previousIndex < 0) {
      const lastIndex = songs.length - 1;

      setCurrentIndex(lastIndex);
      setCurrentSong(songs[lastIndex]);

      return;
    }

    setCurrentIndex(previousIndex);
    setCurrentSong(songs[previousIndex]);
  };

  const handleMoodFilter = async (selectedMood) => {
    setSelectedMood(selectedMood);

    if (selectedMood === "all") {
      await getSongs();
    } else {
      await handleGetSongsByMood(selectedMood);
    }
  };

  return {
    songs,
    loading,
    getSongs,

    currentSong,
    currentIndex,

    playSong,
    nextSong,
    previousSong,

    handleUploadSong,
    uploadLoading,

    mood,
    moodLoading,
    handleGetSongsByMood,

    handleMoodFilter,
    selectedMood,

    handleSearchSongs,
    searchLoading,
    searchResult,
    searchQuery
  };
};
