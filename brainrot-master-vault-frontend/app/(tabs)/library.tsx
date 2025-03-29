"use client";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useTheme } from "@/context/ThemeContext";
import { Folder, Plus } from "lucide-react-native";

const LibraryScreen = () => {
  const { colors } = useTheme();

  // Mock data for playlists/categories
  const categories = [
    { id: "1", title: "Educational", videos: 12 },
    { id: "2", title: "Cooking", videos: 8 },
    { id: "3", title: "Tech Reviews", videos: 15 },
    { id: "4", title: "Travel", videos: 6 },
    { id: "5", title: "Fitness", videos: 10 },
    { id: "6", title: "DIY Projects", videos: 4 },
    { id: "7", title: "Fashion", videos: 7 },
    { id: "8", title: "Gaming", videos: 9 },
  ];

  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.categoryItem, { borderBottomColor: colors.border }]}
    >
      <View
        style={[styles.categoryIcon, { backgroundColor: colors.text }]}
      ></View>
      <View style={styles.categoryInfo}>
        <Text style={[styles.categoryTitle, { color: colors.text }]}>
          {item.title}
        </Text>
        <Text style={[styles.videoCount, { color: colors.text }]}>
          {item.videos} videos
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Your Library</Text>
        <TouchableOpacity style={styles.addButton}>
          <Plus color={colors.text} size={24} />
        </TouchableOpacity>
      </View>

      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterButton, { backgroundColor: colors.primary }]}
        >
          <Text style={styles.filterButtonText}>Categories</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.filterButtonText, { color: colors.text }]}>
            Recently Added
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={categories}
        renderItem={renderCategoryItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 40,
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  addButton: {
    padding: 8,
  },
  filterContainer: {
    flexDirection: "row",
    padding: 16,
    paddingTop: 0,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "transparent",
    backgroundColor: "#3B82F6", // Blue for active, dark gray for inactive
  },
  filterButtonText: {
    color: "white",
    fontWeight: "500",
  },
  list: {
    paddingBottom: 100,
    marginLeft: 10,
    marginRight: 10,
  },
  categoryItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 0.5,
    borderColor: "gray",
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },
  videoCount: {
    fontSize: 14,
    opacity: 0.7,
  },
});

export default LibraryScreen;
