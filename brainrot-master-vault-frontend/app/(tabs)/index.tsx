import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Play, Video } from "lucide-react-native";

export default function HomeScreen() {
  const recentVideos = [
    {
      id: "1",
      title: "How to make perfect pasta",
      author: "@chefcooking",
      thumbnail:
        "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800&auto=format&fit=crop",
    },
    {
      id: "2",
      title: "Daily workout routine",
      author: "@fitnesscoach",
      thumbnail:
        "https://images.unsplash.com/photo-1549576490-b0b4831ef60a?w=800&auto=format&fit=crop",
    },
    {
      id: "3",
      title: "Morning meditation guide",
      author: "@mindfulnessmaster",
      thumbnail:
        "https://images.unsplash.com/photo-1593811167562-9cef47bfc4d7?w=800&auto=format&fit=crop",
    },
  ];

  const categories = [
    {
      id: "1",
      name: "Cooking",
      count: 12,
      image:
        "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&auto=format&fit=crop",
    },
    {
      id: "2",
      name: "Fitness",
      count: 8,
      image:
        "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&auto=format&fit=crop",
    },
    {
      id: "3",
      name: "Tech Tips",
      count: 15,
      image:
        "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800&auto=format&fit=crop",
    },
    {
      id: "4",
      name: "Travel",
      count: 6,
      image:
        "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&auto=format&fit=crop",
    },
    {
      id: "5",
      name: "Mindfulness",
      count: 10,
      image:
        "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&auto=format&fit=crop",
    },
    {
      id: "6",
      name: "Education",
      count: 20,
      image:
        "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&auto=format&fit=crop",
    },
    {
      id: "7",
      name: "DIY & Crafts",
      count: 14,
      image:
        "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=800&auto=format&fit=crop",
    },
    {
      id: "8",
      name: "Music",
      count: 18,
      image:
        "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&auto=format&fit=crop",
    },
    {
      id: "9",
      name: "Gaming",
      count: 25,
      image:
        "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800&auto=format&fit=crop",
    },
    {
      id: "10",
      name: "Fashion",
      count: 16,
      image:
        "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&auto=format&fit=crop",
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.mainTitle}>Categories</Text>
        <View style={styles.categoriesGrid}>
          {categories.map((category) => (
            <Pressable key={category.id} style={styles.categoryCard}>
              <Image
                source={{ uri: category.image }}
                style={styles.categoryImage}
              />
              <View style={styles.categoryOverlay} />
              <View style={styles.categoryContent}>
                <Text style={styles.categoryName}>{category.name}</Text>
                <View style={styles.categoryMeta}>
                  <Video size={16} color="#FFFFFF" />
                  <Text style={styles.categoryCount}>
                    {category.count} videos
                  </Text>
                </View>
              </View>
            </Pressable>
          ))}
        </View>

        <View style={styles.recentSection}>
          <Text style={styles.sectionTitle}>Recently Added</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.recentScroll}
          >
            {recentVideos.map((video) => (
              <Pressable key={video.id} style={styles.videoCard}>
                <Image
                  source={{ uri: video.thumbnail }}
                  style={styles.thumbnail}
                />
                <View style={styles.playButton}>
                  <Play size={20} color="#FFFFFF" fill="#FFFFFF" />
                </View>
                <View style={styles.videoInfo}>
                  <Text numberOfLines={1} style={styles.videoTitle}>
                    {video.title}
                  </Text>
                  <Text style={styles.videoAuthor}>{video.author}</Text>
                </View>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111111",
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  mainTitle: {
    fontSize: 32,
    fontFamily: "Inter_700Bold",
    marginBottom: 24,
    color: "#FFFFFF",
  },
  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 32,
  },
  categoryCard: {
    width: "48%",
    height: 180,
    marginBottom: 16,
    borderRadius: 16,
    overflow: "hidden",
    position: "relative",
  },
  categoryImage: {
    width: "100%",
    height: "100%",
  },
  categoryOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  categoryContent: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
  },
  categoryName: {
    fontSize: 20,
    fontFamily: "Inter_700Bold",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  categoryMeta: {
    flexDirection: "row",
    alignItems: "center",
  },
  categoryCount: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    color: "#FFFFFF",
    marginLeft: 6,
  },
  recentSection: {
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: "Inter_600SemiBold",
    marginBottom: 16,
    color: "#FFFFFF",
  },
  recentScroll: {
    marginBottom: 16,
  },
  videoCard: {
    width: 180,
    marginRight: 12,
    backgroundColor: "#1F2937",
    borderRadius: 12,
    overflow: "hidden",
    position: "relative",
  },
  thumbnail: {
    width: "100%",
    height: 100,
  },
  playButton: {
    position: "absolute",
    top: "25%",
    left: "50%",
    transform: [{ translateX: -16 }, { translateY: -16 }],
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(59, 130, 246, 0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  videoInfo: {
    padding: 10,
  },
  videoTitle: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
    marginBottom: 2,
    color: "#FFFFFF",
  },
  videoAuthor: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    color: "#9CA3AF",
  },
});
