"use client";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { useTheme } from "../context/ThemeContext";
import { Clock } from "lucide-react-native";

const RecentlyAddedSection = () => {
  const { colors } = useTheme();

  // Mock data for recently added videos
  const recentVideos = [
    {
      id: "1",
      title: "How to make perfect pasta",
      category: "Cooking",
      thumbnail: "/placeholder.svg?height=120&width=200",
    },
    {
      id: "2",
      title: "React Native tips and tricks",
      category: "Tech",
      thumbnail: "/placeholder.svg?height=120&width=200",
    },
    {
      id: "3",
      title: "Morning workout routine",
      category: "Fitness",
      thumbnail: "/placeholder.svg?height=120&width=200",
    },
    {
      id: "4",
      title: "Travel vlog: Paris",
      category: "Travel",
      thumbnail: "/placeholder.svg?height=120&width=200",
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.titleContainer}>
          <Clock size={18} color={colors.text} style={styles.icon} />
          <Text style={[styles.title, { color: colors.text }]}>
            Recently Added
          </Text>
        </View>
        <TouchableOpacity>
          <Text style={[styles.seeAll, { color: colors.primary }]}>
            See All
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.scrollView}
      >
        {recentVideos.map((video) => (
          <TouchableOpacity key={video.id} style={styles.videoCard}>
            <Image source={{ uri: video.thumbnail }} style={styles.thumbnail} />
            <Text
              style={[styles.videoTitle, { color: colors.text }]}
              numberOfLines={2}
            >
              {video.title}
            </Text>
            <Text style={[styles.videoCategory, { color: colors.text + "99" }]}>
              {video.category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  seeAll: {
    fontSize: 14,
    fontWeight: "500",
  },
  scrollView: {
    paddingLeft: 16,
  },
  videoCard: {
    width: 180,
    marginRight: 12,
  },
  thumbnail: {
    width: 180,
    height: 100,
    borderRadius: 4,
    marginBottom: 8,
  },
  videoTitle: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 4,
  },
  videoCategory: {
    fontSize: 12,
  },
});

export default RecentlyAddedSection;
