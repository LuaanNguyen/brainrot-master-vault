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
} from "react-native";
import { useLocalSearchParams, Stack, router } from "expo-router";
import { useEffect } from "react";

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
  return (
    <TouchableOpacity
      style={styles.recentlyAddedItem}
      onPress={() => Linking.openURL(`https://youtube.com/shorts/${item.id}`)}
    >
      <View style={styles.videoThumbnailContainer}>
        <Image
          source={{
            uri: item.thumbnails || "https://via.placeholder.com/120x70",
          }}
          style={styles.recentlyAddedCover}
          resizeMode="cover"
        />
        <View style={styles.durationBadge}>
          <Text style={styles.durationText}>
            {formatDate(item.publishedAt)}
          </Text>
        </View>
      </View>
      <View style={styles.recentlyAddedInfo}>
        <Text style={styles.recentlyAddedTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.recentlyAddedSubtitle}>{item.channelTitle}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default function PlaylistDetail() {
  const { id, title } = useLocalSearchParams();
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
              <RecentlyAddedItem key={item.id} item={item} />
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
    paddingHorizontal: 16,
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
});
