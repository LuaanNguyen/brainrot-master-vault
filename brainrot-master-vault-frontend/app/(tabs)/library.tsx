import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Plus } from "lucide-react-native";

export default function LibraryScreen() {
  const playlists = [
    { id: "1", name: "Cooking Tips", videoCount: 12 },
    { id: "2", name: "Workout Routines", videoCount: 8 },
    { id: "3", name: "Tech Reviews", videoCount: 15 },
    { id: "4", name: "Travel Guides", videoCount: 6 },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Library</Text>
        <Pressable style={styles.createButton}>
          <Plus size={24} color="#3B82F6" />
          <Text style={styles.createButtonText}>New Category</Text>
        </Pressable>
      </View>

      <ScrollView style={styles.content}>
        {playlists.map((playlist) => (
          <Pressable key={playlist.id} style={styles.playlistCard}>
            <View style={styles.playlistInfo}>
              <Text style={styles.playlistName}>{playlist.name}</Text>
              <Text style={styles.playlistCount}>
                {playlist.videoCount} videos
              </Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111111",
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#222222",
  },
  title: {
    fontSize: 32,
    fontFamily: "Inter_700Bold",
    color: "#FFFFFF",
    marginBottom: 16,
  },
  createButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  createButtonText: {
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
    color: "#3B82F6",
    marginLeft: 8,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  playlistCard: {
    backgroundColor: "#1F2937",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  playlistInfo: {
    flex: 1,
  },
  playlistName: {
    fontSize: 18,
    fontFamily: "Inter_600SemiBold",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  playlistCount: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    color: "#9CA3AF",
  },
});
