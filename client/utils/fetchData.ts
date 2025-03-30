import { Video, VIDEOS, CATEGORIES } from "../components/GraphView/data";

// Function to categorize videos based on content
const categorizeVideo = (video: any): string => {
  // Default category if we can't determine
  let category = "tech";

  // Extract relevant information for categorization
  const title =
    video.response_data?.items?.[0]?.snippet?.title ||
    video.response_data?.title ||
    "";
  const description =
    video.response_data?.items?.[0]?.snippet?.description ||
    video.response_data?.description ||
    "";
  const tags = video.response_data?.items?.[0]?.snippet?.tags || [];
  const transcript = video.transcript || "";

  // Combined text for keyword matching
  const combinedText = `${title} ${description} ${tags.join(
    " "
  )} ${transcript}`.toLowerCase();

  // Category mapping based on keywords
  const categoryKeywords: Record<string, string[]> = {
    food: [
      "food",
      "recipe",
      "cooking",
      "eat",
      "sauce",
      "sriracha",
      "pasta",
      "curry",
      "bread",
      "meal",
    ],
    tech: [
      "tech",
      "ai",
      "iphone",
      "computer",
      "code",
      "app",
      "software",
      "gadget",
      "device",
      "airtag",
    ],
    travel: [
      "travel",
      "trip",
      "tour",
      "destination",
      "vacation",
      "journey",
      "adventure",
    ],
    science: [
      "science",
      "research",
      "study",
      "experiment",
      "quantum",
      "physics",
      "biology",
    ],
    history: [
      "history",
      "ancient",
      "century",
      "era",
      "historical",
      "war",
      "civilization",
      "breaking bad",
    ],
    art: [
      "art",
      "music",
      "film",
      "cinema",
      "culture",
      "design",
      "creative",
      "artist",
    ],
    fitness: [
      "fitness",
      "workout",
      "exercise",
      "health",
      "training",
      "yoga",
      "nutrition",
      "diet",
      "study",
    ],
    finance: [
      "finance",
      "money",
      "invest",
      "financial",
      "economy",
      "budget",
      "saving",
    ],
  };

  // Check for keyword matches and assign category
  for (const [cat, keywords] of Object.entries(categoryKeywords)) {
    if (keywords.some((keyword) => combinedText.includes(keyword))) {
      category = cat;
      break;
    }
  }

  return category;
};

// Function to fetch videos from API and process them
export const fetchVideosFromAPI = async (): Promise<Video[]> => {
  try {
    // Call the API directly without a proxy
    const apiUrl = "https://brainrotapi.codestacx.com/home";

    console.log(`Fetching videos from: ${apiUrl}`);

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      mode: "cors",
    });

    if (!response.ok) {
      throw new Error(`Error fetching videos: ${response.status}`);
    }

    const data = await response.json();

    // Process the fetched videos to match our Video interface
    const processedVideos: Video[] = data.videos
      .map((video: any) => {
        // Extract data from either YouTube or TikTok format
        const isYoutube = video.source === "youtube";

        // For YouTube videos, extract from nested response_data
        // For TikTok videos, use the flattened response_data
        const videoData = isYoutube
          ? video.response_data?.items?.[0]
          : video.response_data;

        if (!videoData) {
          return null; // Skip if no data available
        }

        // Extract thumbnail URL - handle different structures
        let thumbnailUrl = "";
        if (isYoutube && videoData.snippet?.thumbnails?.standard?.url) {
          thumbnailUrl = videoData.snippet.thumbnails.standard.url;
        } else if (video.response_data?.thumbnail) {
          thumbnailUrl = video.response_data.thumbnail;
        } else {
          // Fallback thumbnail
          thumbnailUrl =
            "https://placehold.co/600x400/gray/white?text=No+Thumbnail";
        }

        // Determine category based on content
        const categoryId = categorizeVideo(video);

        // Create a Video object that matches our interface
        return {
          id: video.video_id,
          title: isYoutube
            ? videoData.snippet?.title || "Untitled Video"
            : videoData.title || "Untitled Video",
          description: isYoutube
            ? videoData.snippet?.description || ""
            : videoData.description || "",
          thumbnails: thumbnailUrl,
          categoryId: categoryId,
          channelTitle: isYoutube
            ? videoData.snippet?.channelTitle || "Unknown Channel"
            : videoData.channelTitle || "Unknown Channel",
          publishedAt: isYoutube
            ? videoData.snippet?.publishedAt || new Date().toISOString()
            : videoData.publishedAt || new Date().toISOString(),
        };
      })
      .filter(Boolean); // Remove any null entries

    return processedVideos;
  } catch (error) {
    console.error("Error fetching videos:", error);
    return []; // Return empty array on error
  }
};

// Function to combine API videos with existing sample videos
export const loadAllVideos = async (): Promise<Video[]> => {
  try {
    // Fetch videos from API
    const apiVideos = await fetchVideosFromAPI();

    // Check if we already have this video in our sample data to avoid duplicates
    const existingIds = new Set(VIDEOS.map((video) => video.id));
    const newApiVideos = apiVideos.filter(
      (video) => !existingIds.has(video.id)
    );

    // Combine with sample videos
    return [...VIDEOS, ...newApiVideos];
  } catch (error) {
    console.error("Error loading videos:", error);
    return VIDEOS; // Fall back to sample videos on error
  }
};
