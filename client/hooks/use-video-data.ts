import { useState, useEffect } from "react";
import { fetchVideoMetadata } from "@/lib/api";
import { VideoMetadata } from "@/lib/types";

export function useVideoData(videoUrl: string | null) {
  const [data, setData] = useState<VideoMetadata | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!videoUrl) return;

    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const metadata = await fetchVideoMetadata(videoUrl);
        setData(metadata);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("An unknown error occurred")
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [videoUrl]);

  return { data, isLoading, error };
}
