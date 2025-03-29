import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useLocalSearchParams, Stack, router } from "expo-router";
// import Recent // Uncomment and complete this line if needed, or remove it if unused

// Recently Added Item Component
const RecentlyAddedItem = ({ item }) => {
  return (
    <TouchableOpacity style={styles.recentlyAddedItem}>
      <View style={styles.videoThumbnailContainer}>
        <Image
          source={{ uri: item.imageUrl }}
          style={styles.recentlyAddedCover}
        />
        <View style={styles.durationBadge}>
          <Text style={styles.durationText}>
            {item.subtitle.split("•")[1].trim()}
          </Text>
        </View>
      </View>
      <View style={styles.recentlyAddedInfo}>
        <Text style={styles.recentlyAddedTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.recentlyAddedSubtitle}>
          {item.subtitle.split("•")[0].trim()}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default function PlaylistDetail() {
  const { id, title } = useLocalSearchParams();

  // In a real app, you would fetch the playlist details based on the ID
  // For now, we'll just use the data passed via params

  // Mock playlist data including summary
  const playlistSummary =
    "A curated collection of short clips about the latest tech trends and innovations that are shaping our digital future. Updated regularly with new content.";

  // Count of items
  const totalDuration = "15 min"; // In a real app, calculate this from the items

  const dummyItems = [
    {
      id: "1",
      title: "AI Can Now Code Itself?",
      subtitle: "Tech & AI • 2 min",
      imageUrl:
        "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop",
      videoUrl: "https://www.tiktok.com/@example/video/123456789",
    },
    {
      id: "2",
      title: "How to Save Money in Your 20s",
      subtitle: "Finance & Investing • 1 min",
      imageUrl:
        "https://images.unsplash.com/photo-1565373677921-0a9f1a025952?w=800&auto=format&fit=crop",
      videoUrl: "https://www.tiktok.com/@example/video/987654321",
    },
    {
      id: "3",
      title: "5-Minute Workout for Busy People",
      subtitle: "Health & Fitness • 3 min",
      imageUrl:
        "https://images.unsplash.com/photo-1576678927484-cc9079570884?w=800&auto=format&fit=crop",
      videoUrl: "https://www.tiktok.com/@example/video/1122334455",
    },
    {
      id: "4",
      title: "Why Are Ice Baths So Popular?",
      subtitle: "Science & Health • 2 min",
      imageUrl:
        "https://images.unsplash.com/photo-1612837017391-f77707cf7688?w=800&auto=format&fit=crop",
      videoUrl: "https://www.tiktok.com/@example/video/5566778899",
    },
    {
      id: "5",
      title: "The Secret to Going Viral",
      subtitle: "Content Creation • 4 min",
      imageUrl:
        "https://images.unsplash.com/photo-1605379399642-870262d3d051?w=800&auto=format&fit=crop",
      videoUrl: "https://www.tiktok.com/@example/video/3344556677",
    },
  ];
  const itemCount = dummyItems.length;

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
          {dummyItems.map((item) => (
            <RecentlyAddedItem key={item.id} item={item} />
          ))}
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
