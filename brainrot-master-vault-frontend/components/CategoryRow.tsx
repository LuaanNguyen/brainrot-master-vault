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

const CategoryRow = ({ title }) => {
  const { colors } = useTheme();

  // Mock data for videos in this category
  const videos = [
    {
      id: "1",
      title: "How to make pasta",
      thumbnail: "/placeholder.svg?height=120&width=200",
    },
    {
      id: "2",
      title: "React Native tips",
      thumbnail: "/placeholder.svg?height=120&width=200",
    },
    {
      id: "3",
      title: "Morning workout",
      thumbnail: "/placeholder.svg?height=120&width=200",
    },
    {
      id: "4",
      title: "Travel vlog: Paris",
      thumbnail: "/placeholder.svg?height=120&width=200",
    },
    {
      id: "5",
      title: "DIY home decor",
      thumbnail: "/placeholder.svg?height=120&width=200",
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.scrollView}
      >
        {videos.map((video) => (
          <TouchableOpacity key={video.id} style={styles.videoCard}>
            <Image source={{ uri: video.thumbnail }} style={styles.thumbnail} />
            <Text
              style={[styles.videoTitle, { color: colors.text }]}
              numberOfLines={2}
            >
              {video.title}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginHorizontal: 16,
    marginBottom: 12,
  },
  scrollView: {
    paddingLeft: 16,
  },
  videoCard: {
    width: 160,
    marginRight: 12,
  },
  thumbnail: {
    width: 160,
    height: 90,
    borderRadius: 4,
    marginBottom: 8,
  },
  videoTitle: {
    fontSize: 14,
    fontWeight: "500",
  },
});

export default CategoryRow;
