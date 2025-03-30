import { useState, useEffect } from "react";
import { loadAllVideos } from "../utils/fetchData";
import { Video } from "../components/GraphView/data";

export function useVideoData() {
  const [allVideos, setAllVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const videos = await loadAllVideos();
        setAllVideos(videos);
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Unknown error occurred")
        );
        console.error("Error loading videos:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Get videos for a specific category
  const getVideosByCategory = (categoryId: string) => {
    return allVideos.filter((video) => video.categoryId === categoryId);
  };

  return {
    allVideos,
    loading,
    error,
    getVideosByCategory,
  };
}
