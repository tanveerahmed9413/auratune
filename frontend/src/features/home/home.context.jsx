import { createContext, useCallback, useMemo, useRef, useState } from "react";
import { getAllSongs, getSongsByMood, songUpload } from "./services/home.api";
import { getErrorMessage } from "../../lib/api";
import { MOOD_TO_SONG_MOODS } from "../expression/utils/expression";

export const HomeContext = createContext(null);

export const HomeProvider = ({ children }) => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState("");

  const [queue, setQueue] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);

  const [selectedMood, setSelectedMood] = useState("all");
  const [detected, setDetected] = useState(null); // { expression, confidence, moods, fallback }
  const [searchQuery, setSearchQuery] = useState("");
  const [uploadLoading, setUploadLoading] = useState(false);

  // Only the latest request may update the list (prevents out-of-order responses)
  const requestId = useRef(0);

  const load = useCallback(async (fetcher) => {
    const id = ++requestId.current;
    setLoading(true);
    setError("");
    try {
      const data = await fetcher();
      if (id === requestId.current) setSongs(data);
      return data;
    } catch (err) {
      if (id === requestId.current) {
        setSongs([]);
        setError(getErrorMessage(err, "Could not load songs"));
      }
      return [];
    } finally {
      if (id === requestId.current) {
        setLoading(false);
        setLoaded(true);
      }
    }
  }, []);

  const getSongs = useCallback(() => load(getAllSongs), [load]);

  const handleMoodFilter = useCallback(
    async (mood) => {
      setSelectedMood(mood);
      setDetected(null);
      return mood === "all" ? load(getAllSongs) : load(() => getSongsByMood(mood));
    },
    [load],
  );

  // Called after the face scan: map the expression to matching song moods
  const recommendForExpression = useCallback(
    async (expression, confidence) => {
      const moods = MOOD_TO_SONG_MOODS[expression] || [expression];
      setSelectedMood(expression);
      let result = await load(() => getSongsByMood(moods));
      let fallback = false;
      if (result.length === 0) {
        fallback = true;
        result = await load(getAllSongs);
      }
      setDetected({ expression, confidence, moods, fallback });
      return result;
    },
    [load],
  );

  const clearDetected = useCallback(async () => {
    setDetected(null);
    setSelectedMood("all");
    await load(getAllSongs);
  }, [load]);

  const handleUploadSong = useCallback(async (file, mood) => {
    setUploadLoading(true);
    try {
      const response = await songUpload(file, mood);
      setSongs((prev) => [response.song, ...prev]);
      return response;
    } finally {
      setUploadLoading(false);
    }
  }, []);

  const playSong = useCallback(
    (song) => {
      const list = songs;
      setQueue(list);
      setCurrentSong(song);
      setCurrentIndex(list.findIndex((s) => s._id === song._id));
    },
    [songs],
  );

  const stepSong = useCallback(
    (delta) => {
      if (!queue.length) return;
      const base = currentIndex < 0 ? 0 : currentIndex;
      const next = (base + delta + queue.length) % queue.length;
      setCurrentIndex(next);
      setCurrentSong(queue[next]);
    },
    [queue, currentIndex],
  );

  const nextSong = useCallback(() => stepSong(1), [stepSong]);
  const previousSong = useCallback(() => stepSong(-1), [stepSong]);

  const visibleSongs = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return q ? songs.filter((s) => s.title?.toLowerCase().includes(q)) : songs;
  }, [songs, searchQuery]);

  const value = {
    songs: visibleSongs,
    totalSongs: songs.length,
    loading,
    loaded,
    error,
    getSongs,
    currentSong,
    currentIndex,
    isPlaying,
    setIsPlaying,
    playSong,
    nextSong,
    previousSong,
    selectedMood,
    handleMoodFilter,
    detected,
    recommendForExpression,
    clearDetected,
    searchQuery,
    setSearchQuery,
    uploadLoading,
    handleUploadSong,
  };

  return <HomeContext.Provider value={value}>{children}</HomeContext.Provider>;
};
