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

// Get screen width for responsive sizing
const { width } = Dimensions.get("window");
const coverSize = width - 32; // Full width minus padding

// Format date helper function
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString();
};

// Recently Added Item Component
const RecentlyAddedItem = ({ item }) => {
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
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    fetch("https://brainrotapi.codestacx.com/home")
      .then((response) => response.json())
      .then((data) => {
        setVideos(data.videos);
      });
  }, []);

  // Mock playlist data including summary
  const playlistSummary =
    "A curated collection of short clips about the latest tech trends and innovations that are shaping our digital future. Updated regularly with new content.";

  // Count of items and total duration
  const itemCount = videos.length || 0;
  const totalDuration = videos.length ? `${videos.length * 2} min` : "0 min"; // Assuming each video is ~2 minutes

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
              source={{ uri: decodeURIComponent(imageUrl) }}
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

          {/* Play Button */}
          <TouchableOpacity style={styles.playButton}>
            <Text style={styles.playButtonText}>▶ Summarize</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        {/* Content Title */}
        <Text style={styles.sectionTitle}>All Clips</Text>

        {/* Playlist Content */}
        <View style={styles.recentlyAddedList}>
          {videos.length > 0 ? (
            videos.map((item) => (
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
    backgroundColor: "#4A8FE7",
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
