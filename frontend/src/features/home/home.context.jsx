import React, { createContext, useState } from "react";

export const HomeContext = createContext();

export const HomeProvider = ({ children }) => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(false);
   const [uploadedSong, setUploadedSong] = useState(null);
  const [currentSong, setCurrentSong] = useState();
  const [currentIndex, setCurrentIndex] = useState();
  const [mood,setMood] = useState(null)
  const [selectedMood, setSelectedMood] = useState("all");

  

  return (
    <HomeContext.Provider
      value={{
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
      }}
    >
      {children}
    </HomeContext.Provider>
  );
};
