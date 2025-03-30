/**
 * Utility functions for uploading content to the knowledge vault
 */

// Function to validate if a URL is a YouTube or TikTok URL
export const validateURL = (
  url: string
): { isValid: boolean; platform: "youtube" | "tiktok" | null } => {
  // YouTube URL patterns (both standard and shorts)
  const youtubePattern =
    /^(https?:\/\/)?(www\.)?youtube\.com\/(watch\?v=|shorts\/|embed\/|v\/|e\/|watch\?.*v=)([a-zA-Z0-9_-]{11})(\S*)?$|^(https?:\/\/)?(www\.)?youtu\.be\/([a-zA-Z0-9_-]{11})(\S*)?$/;

  // TikTok URL patterns
  const tiktokPattern =
    /^(https?:\/\/)?(www\.|vm\.)?tiktok\.com\/(@[\w.-]+\/video\/\d+|[\w.-]+\/?)$/;

  if (youtubePattern.test(url)) {
    return { isValid: true, platform: "youtube" };
  } else if (tiktokPattern.test(url)) {
    return { isValid: true, platform: "tiktok" };
  }

  return { isValid: false, platform: null };
};

// Function to fetch video data from the backend
export const fetchVideoContent = async (url: string): Promise<any> => {
  try {
    const { isValid, platform } = validateURL(url);

    if (!isValid || !platform) {
      throw new Error(
        "Invalid URL. Please provide a valid YouTube or TikTok URL."
      );
    }

    console.log(`Platform detected: ${platform}`);

    // Extract video ID directly
    const videoId = extractVideoId(url, platform);
    if (!videoId) {
      throw new Error("Could not extract video ID from the URL");
    }

    console.log(`Video ID: ${videoId}`);

    // Try using a simpler approach - using just the video ID for YouTube
    if (platform === "youtube") {
      // For YouTube, we can use the actual thumbnail and fallback to mock data
      console.log("Creating fallback YouTube data using video ID");
      const mockData = {
        id: videoId,
        title: `YouTube Short: ${videoId}`,
        description: "YouTube video content (mock)",
        publishedAt: new Date().toISOString(),
        thumbnails: `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`,
        channelTitle: "YouTube Creator",
        source: platform,
        summary: "Mock summary content - API connection failed",
        transcription: "Mock transcription - API connection failed",
      };

      // Attempt API call, but immediately fall back to mock if it fails
      try {
        // Exactly match the working curl format
        // Use a raw unencoded URL in video_url parameter without encoding
        const apiUrl = `https://brainrotapi.codestacx.com/${platform}?video_url=${url}`;

        // Use CORS proxy for development
        const corsProxyUrl = `https://corsproxy.io/?${encodeURIComponent(
          apiUrl
        )}`;

        console.log(`Attempting API fetch from: ${corsProxyUrl}`);

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

        const response = await fetch(corsProxyUrl, {
          signal: controller.signal,
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          method: "GET",
        });
        clearTimeout(timeoutId);

        if (!response.ok) {
          console.warn(
            `API returned status ${response.status}, using fallback data`
          );
          return mockData;
        }

        const data = await response.json();
        return { ...data, source: platform };
      } catch (apiError: any) {
        console.warn(
          `API fetch failed: ${apiError.message}. Using fallback data.`
        );
        return mockData;
      }
    } else if (platform === "tiktok") {
      // For TikTok we'll still try the API
      try {
        // Construct API URL based on platform - exact same format as YouTube
        const apiUrl = `https://brainrotapi.codestacx.com/${platform}?video_url=${url}`;

        // Use CORS proxy for development
        const corsProxyUrl = `https://corsproxy.io/?${encodeURIComponent(
          apiUrl
        )}`;

        console.log(`Fetching from: ${corsProxyUrl}`);

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

        const response = await fetch(corsProxyUrl, {
          signal: controller.signal,
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          method: "GET",
        });
        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`Error fetching TikTok video: ${response.status}`);
        }

        const data = await response.json();
        return { ...data, source: platform };
      } catch (error: any) {
        console.error("TikTok fetch error:", error);
        throw new Error(`Failed to fetch TikTok content: ${error.message}`);
      }
    }

    throw new Error("Unsupported platform");
  } catch (error) {
    console.error("Error fetching video content:", error);
    throw error;
  }
};

// Function to extract video ID from URL
export const extractVideoId = (
  url: string,
  platform?: "youtube" | "tiktok" | null
): string | null => {
  if (!platform) {
    // If platform is not provided, try to detect it
    const { platform: detectedPlatform } = validateURL(url);
    platform = detectedPlatform;
  }

  if (platform === "youtube") {
    // Handle YouTube shorts URLs specifically
    if (url.includes("youtube.com/shorts/")) {
      const shortsMatch = url.match(
        /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/
      );
      if (shortsMatch && shortsMatch[1]) {
        return shortsMatch[1];
      }
    }

    // Standard YouTube URLs
    const watchMatch = url.match(/youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/);
    if (watchMatch && watchMatch[1]) {
      return watchMatch[1];
    }

    // Short YouTube URLs
    const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
    if (shortMatch && shortMatch[1]) {
      return shortMatch[1];
    }

    // Embedded YouTube URLs
    const embedMatch = url.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/);
    if (embedMatch && embedMatch[1]) {
      return embedMatch[1];
    }

    return null;
  }

  if (platform === "tiktok") {
    // TikTok ID extraction (more complex)
    const tiktokRegex = /tiktok\.com\/(?:@[\w.-]+\/video\/|[\w.-]+\/?)(\d+)/;
    const tiktokMatch = url.match(tiktokRegex);

    if (tiktokMatch && tiktokMatch[1]) {
      return tiktokMatch[1];
    }
  }

  return null;
};
