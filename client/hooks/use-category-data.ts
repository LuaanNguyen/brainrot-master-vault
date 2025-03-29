import { useState, useEffect } from "react";
import { VideoMetadata, Category, GraphData, GraphLink } from "@/lib/types";
import { CATEGORIES, categorizeVideo } from "@/lib/categorize";

type VideosByCategory = Record<string, VideoMetadata[]>;

export function useCategoryData(videos: VideoMetadata[] = []) {
  const [videosByCategory, setVideosByCategory] = useState<VideosByCategory>(
    {}
  );
  const [graphData, setGraphData] = useState<GraphData>({
    nodes: [],
    links: [],
  });

  // Process videos and organize by category
  useEffect(() => {
    if (!videos.length) return;

    const categorized: VideosByCategory = {};

    // Initialize categories
    CATEGORIES.forEach((category) => {
      categorized[category.id] = [];
    });

    // Categorize each video
    videos.forEach((video) => {
      const categoryId = categorizeVideo(video);

      // Only add if it's a valid category
      if (categorized[categoryId]) {
        categorized[categoryId].push(video);
      }
    });

    setVideosByCategory(categorized);

    // Update graph data
    const nodes = CATEGORIES.map((category) => ({
      id: category.id,
      name: category.label,
      color: category.color,
      val: 10 + categorized[category.id].length * 2, // Size based on number of videos
    }));

    // Define relationships between categories
    const links: GraphLink[] = [
      { source: "food", target: "science" },
      { source: "food", target: "fitness" },
      { source: "tech", target: "science" },
      { source: "tech", target: "finance" },
      { source: "travel", target: "art" },
      { source: "science", target: "history" },
      { source: "history", target: "art" },
      { source: "fitness", target: "food" },
      { source: "fitness", target: "science" },
      { source: "finance", target: "history" },
    ];

    setGraphData({ nodes, links });
  }, [videos]);

  return { videosByCategory, graphData };
}
