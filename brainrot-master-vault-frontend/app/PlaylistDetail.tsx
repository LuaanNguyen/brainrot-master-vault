import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Linking,
  Dimensions,
} from "react-native";
import { useLocalSearchParams, Stack, router } from "expo-router";
import { useEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Audio } from "expo-av";

// Get screen width for responsive sizing
const { width } = Dimensions.get("window");
const coverSize = width - 32; // Full width minus padding

// Define interface for Video Item
interface VideoItemType {
  id?: string;
  video_id?: string;
  source?: string;
  title?: string;
  channelTitle?: string;
  publishedAt?: string;
  thumbnails?: string; // Assuming string URL, adjust if object
  response_data?: any; // Keeping this flexible for now
}

// Format date helper function
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString();
};

// Recently Added Item Component
const RecentlyAddedItem = ({ item }: { item: VideoItemType }) => {
  // Extract video details from nested response data
  const videoId = item.video_id || item.id;
  const source = item.source || "youtube";

  // Extract title from response_data for YouTube videos correctly
  const title =
    (item.response_data &&
      item.response_data.items &&
      item.response_data.items[0] &&
      item.response_data.items[0].snippet &&
      item.response_data.items[0].snippet.title) ||
    (item.response_data && item.response_data.title) ||
    item.title ||
    "Untitled";

  // Extract channel title
  const channelTitle =
    (item.response_data &&
      item.response_data.items &&
      item.response_data.items[0] &&
      item.response_data.items[0].snippet &&
      item.response_data.items[0].snippet.channelTitle) ||
    (item.response_data && item.response_data.channelTitle) ||
    item.channelTitle ||
    "Unknown";

  // Extract published date
  const publishedDate =
    item.publishedAt ||
    (item.response_data &&
      item.response_data.items &&
      item.response_data.items[0] &&
      item.response_data.items[0].snippet &&
      item.response_data.items[0].snippet.publishedAt) ||
    (item.response_data && item.response_data.publishedAt);

  // Get appropriate thumbnail
  const getThumbnailUrl = () => {
    // Check for thumbnail in response_data items first
    if (
      item.response_data &&
      item.response_data.items &&
      item.response_data.items[0] &&
      item.response_data.items[0].snippet &&
      item.response_data.items[0].snippet.thumbnails &&
      item.response_data.items[0].snippet.thumbnails.medium
    ) {
      return item.response_data.items[0].snippet.thumbnails.medium.url;
    }

    // Then check other locations
    if (
      item.thumbnails ||
      (item.response_data && item.response_data.thumbnail)
    ) {
      return item.thumbnails || item.response_data.thumbnail;
    }

    // Default thumbnail for YouTube
    if (source === "youtube") {
      return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
    }

    return "https://cdn.shopify.com/s/files/1/0070/7032/files/tiktok2_5381bbf7-d33d-4c31-9cbd-6dad2ef3b2ce.png?v=1734596856";
  };

  // Handle video URL generation
  const getVideoUrl = () => {
    if (source === "youtube") {
      return `https://youtube.com/watch?v=${videoId}`;
    } else if (source === "tiktok") {
      return `https://tiktok.com/@username/video/${videoId}`;
    }
    return "";
  };

  return (
    <TouchableOpacity
      style={styles.recentlyAddedItem}
      onPress={() => Linking.openURL(getVideoUrl())}
    >
      <View style={styles.videoThumbnailContainer}>
        <Image
          source={{ uri: getThumbnailUrl() }}
          style={styles.recentlyAddedCover}
          resizeMode="cover"
        />
        {source && (
          <View style={styles.sourceBadge}>
            <Text style={styles.sourceText}>{source}</Text>
          </View>
        )}
        {publishedDate && (
          <View style={styles.durationBadge}>
            <Text style={styles.durationText}>{formatDate(publishedDate)}</Text>
          </View>
        )}
      </View>
      <View style={styles.recentlyAddedInfo}>
        <Text style={styles.recentlyAddedTitle} numberOfLines={2}>
          {title}
        </Text>
        <Text style={styles.recentlyAddedSubtitle}>{channelTitle}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default function PlaylistDetail() {
  const { id, title, imageUrl } = useLocalSearchParams();
  const [videos, setVideos] = useState<VideoItemType[]>([]);
  const [filteredVideos, setFilteredVideos] = useState<VideoItemType[]>([]);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    fetch("https://brainrotapi.codestacx.com/home")
      .then((response) => response.json())
      .then((data) => {
        setVideos(data.videos);
      });
  }, []);

  // Filter videos based on playlist title/id
  useEffect(() => {
    if (videos.length > 0) {
      let filtered: VideoItemType[] = [];
      const playlistTitle = title as string;

      // Case insensitive matching
      const lcTitle = playlistTitle.toLowerCase();

      if (lcTitle.includes("tech news") || lcTitle.includes("technology")) {
        filtered = videos.slice(0, 5);
      } else if (
        lcTitle.includes("natural disaster") ||
        lcTitle.includes("weather")
      ) {
        filtered = videos.slice(5, 10);
      } else if (lcTitle.includes("health") || lcTitle.includes("fitness")) {
        filtered = videos.slice(10, 15);
      } else if (lcTitle.includes("finance") || lcTitle.includes("investing")) {
        filtered = videos.slice(15, 20);
      } else if (lcTitle.includes("food") || lcTitle.includes("cooking")) {
        filtered = videos.slice(20, 25);
      } else if (lcTitle.includes("crime")) {
        filtered = videos.slice(25, 27);
      } else {
        // Default case - show all videos or a subset
        filtered = videos;
      }

      setFilteredVideos(filtered);
    }
  }, [videos, title]);

  // Mock playlist data including summary
  const playlistSummary =
    "A curated collection of short clips about the latest tech trends and innovations that are shaping our digital future. Updated regularly with new content.";

  // Count of items and total duration - now using filteredVideos
  const itemCount = filteredVideos.length || 0;
  const totalDuration = filteredVideos.length
    ? `${filteredVideos.length * 2} min`
    : "0 min"; // Assuming each video is ~2 minutes

  // Function to handle play/pause
  async function handlePlayPause() {
    if (sound) {
      if (isPlaying) {
        console.log("Pausing Sound");
        await sound.pauseAsync();
        setIsPlaying(false);
      } else {
        console.log("Playing Sound");
        await sound.playAsync();
        setIsPlaying(true);
      }
    } else {
      console.log("Loading Sound");
      try {
        const { sound: newSound } = await Audio.Sound.createAsync(
          require("../assets/podcasts/tech_podcast.mp3") // Use require for static assets
        );
        setSound(newSound);
        console.log("Playing Sound");
        await newSound.playAsync();
        setIsPlaying(true);

        // Add listener for when playback finishes
        newSound.setOnPlaybackStatusUpdate((status) => {
          if (status.isLoaded && status.didJustFinish) {
            setIsPlaying(false);
            // Optionally unload or reset position
            // newSound.unloadAsync();
            // setSound(null);
            newSound.setPositionAsync(0); // Reset to start
          } else if (status.isLoaded === false && status.error) {
            console.error(`Playback Error: ${status.error}`);
            setIsPlaying(false); // Ensure state is updated on error
            setSound(null); // Clear the sound object on error
          }
        });
      } catch (error) {
        console.error("Failed to load or play sound", error);
      }
    }
  }

  // Effect to unload sound on component unmount
  useEffect(() => {
    return sound
      ? () => {
          console.log("Unloading Sound");
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>

          {/* Album Cover Image */}
          {imageUrl && (
            <Image
              source={{ uri: decodeURIComponent(imageUrl as string) }}
              style={styles.coverImage}
              resizeMode="cover"
            />
          )}

          <Text style={styles.title}>{title}</Text>

          {/* Playlist Summary */}
          <Text style={styles.summary}>{playlistSummary}</Text>

          {/* Playlist stats */}
          <Text style={styles.stats}>
            {itemCount} clips • {totalDuration} total
          </Text>

          {/* Play Button with Linear Gradient */}
          <TouchableOpacity onPress={handlePlayPause}>
            <LinearGradient
              colors={["#36d0ff", "#4576ff"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.playButton}
            >
              <Text style={styles.playButtonText}>
                {isPlaying ? "❚❚ Pause" : "▶ Summarize"}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        {/* Content Title */}
        <Text style={styles.sectionTitle}>All Clips</Text>

        {/* Playlist Content - now using filteredVideos */}
        <View style={styles.recentlyAddedList}>
          {filteredVideos.length > 0 ? (
            filteredVideos.map((item) => (
              <RecentlyAddedItem
                key={item.id || item.video_id || Math.random().toString()}
                item={item}
              />
            ))
          ) : (
            <Text style={styles.placeholder}>Loading videos...</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  backButton: {
    marginBottom: 16,
  },
  backButtonText: {
    color: "#4A8FE7",
    fontSize: 22,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
  },
  detailText: {
    fontSize: 16,
    color: "#CCCCCC",
    marginBottom: 16,
  },
  placeholder: {
    fontSize: 16,
    color: "#999999",
    marginTop: 32,
    textAlign: "center",
  },
  videoThumbnailContainer: {
    position: "relative",
    width: 120,
    height: 70,
    borderRadius: 8,
    overflow: "hidden",
  },
  recentlyAddedCover: {
    width: "100%",
    height: "100%",
  },
  sourceBadge: {
    position: "absolute",
    left: 4,
    top: 4,
    backgroundColor: "rgba(0,0,0,0.7)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  sourceText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "500",
  },
  durationBadge: {
    position: "absolute",
    right: 4,
    bottom: 4,
    backgroundColor: "rgba(0,0,0,0.7)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  durationText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "500",
  },
  recentlyAddedInfo: {
    marginLeft: 12,
    flex: 1,
  },
  recentlyAddedTitle: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
    lineHeight: 18,
  },
  recentlyAddedSubtitle: {
    color: "#999999",
    fontSize: 12,
    fontWeight: "400",
  },
  recentlyAddedList: {
    paddingBottom: 24,
  },
  recentlyAddedItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  container: {
    flex: 1,
    backgroundColor: "#0A0A0A",
  },
  summary: {
    fontSize: 14,
    color: "#BBBBBB",
    lineHeight: 20,
    marginBottom: 12,
  },
  stats: {
    fontSize: 13,
    color: "#999999",
    marginBottom: 16,
  },
  playButton: {
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: "center",
    marginVertical: 8,
    alignSelf: "flex-start",
  },
  playButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  divider: {
    height: 1,
    backgroundColor: "#333333",
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 16,
  },
  coverImage: {
    width: coverSize,
    height: coverSize * 0.6, // Aspect ratio 5:3
    borderRadius: 12,
    marginBottom: 16,
    alignSelf: "center",
  },
});
