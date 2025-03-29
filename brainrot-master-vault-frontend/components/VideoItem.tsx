"use client";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useTheme } from "../context/ThemeContext";
import { MoreVertical } from "lucide-react-native";

const VideoItem = ({ video }) => {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      style={[styles.container, { borderBottomColor: colors.border }]}
    >
      <Image
        source={{ uri: "/placeholder.svg?height=90&width=160" }}
        style={styles.thumbnail}
      />
      <View style={styles.infoContainer}>
        <Text style={[styles.title, { color: colors.text }]} numberOfLines={2}>
          {video.title}
        </Text>
        <View style={styles.metaContainer}>
          <Text style={[styles.category, { color: styles.category.color }]}>
            {video.category}
          </Text>
          <Text style={[styles.duration, { color: colors.text + "99" }]}>
            {video.duration}
          </Text>
        </View>
      </View>
      <TouchableOpacity style={styles.moreButton}>
        <MoreVertical size={20} color={colors.text} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 12,
    borderBottomWidth: 1,
  },
  thumbnail: {
    width: 120,
    height: 68,
    borderRadius: 4,
  },
  infoContainer: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "center",
  },
  title: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 4,
  },
  metaContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  category: {
    fontSize: 12,
    fontWeight: "500",
    marginRight: 8,
    color: "#3B82F6", // Blue
  },
  duration: {
    fontSize: 12,
  },
  moreButton: {
    padding: 4,
    justifyContent: "center",
  },
});

export default VideoItem;
