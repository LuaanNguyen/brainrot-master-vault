import React, { createContext, useState, useContext, useEffect } from "react";
import { useRefresh } from "./RefreshContext";

const VideoContext = createContext();

export function VideoProvider({ children }) {
  const [videos, setVideos] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { refreshTrigger } = useRefresh();

  const refreshVideos = async () => {
    setIsRefreshing(true);
    try {
      const response = await fetch("https://brainrotapi.codestacx.com/");
      const data = await response.json();
      setVideos(data.videos || []);
    } catch (error) {
      console.error("Error fetching videos:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Initial load and refresh when triggered
  useEffect(() => {
    refreshVideos();
  }, [refreshTrigger]);

  return (
    <VideoContext.Provider value={{ videos, isRefreshing, refreshVideos }}>
      {children}
    </VideoContext.Provider>
  );
}

export function useVideos() {
  return useContext(VideoContext);
}
