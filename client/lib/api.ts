import { VideoMetadata } from "./types";

const API_BASE_URL = "https://brainrotapi.codestacx.com";

/**
 * Fetches video metadata from the BrainRot API
 * @param videoUrl Full YouTube or TikTok video URL
 * @returns VideoMetadata object
 */
export async function fetchVideoMetadata(
  videoUrl: string
): Promise<VideoMetadata> {
  try {
    // Determine platform (YouTube or TikTok)
    const platform =
      videoUrl.includes("youtube") || videoUrl.includes("youtu.be")
        ? "youtube"
        : "tiktok";

    // Build API URL
    const apiUrl = `${API_BASE_URL}/${platform}?video_url=${encodeURIComponent(
      videoUrl
    )}`;

    // Make request
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data as VideoMetadata;
  } catch (error) {
    console.error("Error fetching video metadata:", error);
    throw error;
  }
}

/**
 * Extracts video ID from YouTube URL
 * @param url YouTube video URL
 * @returns Video ID
 */
export function extractYouTubeVideoId(url: string): string | null {
  // Handle various YouTube URL formats
  const regexPatterns = [
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i, // Standard and embed URLs
    /youtube.com\/shorts\/([a-zA-Z0-9_-]{11})/i, // YouTube Shorts URLs
  ];

  for (const pattern of regexPatterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}

/**
 * Extracts video ID from TikTok URL
 * @param url TikTok video URL
 * @returns Video ID
 */
export function extractTikTokVideoId(url: string): string | null {
  // Handle various TikTok URL formats
  const regex = /tiktok\.com\/@[^\/]+\/video\/(\d+)/i;
  const match = url.match(regex);

  return match && match[1] ? match[1] : null;
}
