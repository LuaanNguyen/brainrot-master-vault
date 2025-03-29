import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  FlatList,
} from "react-native";

// Filter component
const FilterTabs = ({ activeTab, setActiveTab }) => {
  const tabs = ["All", "Podcasts", "Recently Added"];

  return (
    <View style={styles.filterContainer}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab}
          style={[
            styles.filterTab,
            activeTab === tab && styles.activeFilterTab,
          ]}
          onPress={() => setActiveTab(tab)}
        >
          <Text
            style={[
              styles.filterText,
              activeTab === tab && styles.activeFilterText,
            ]}
          >
            {tab}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

// Music Item Component
const MusicItem = ({ item }) => {
  return (
    <TouchableOpacity style={styles.musicItem}>
      <Image source={{ uri: item.imageUrl }} style={styles.musicCover} />
      <View style={styles.musicInfo}>
        <Text style={styles.musicTitle}>{item.title}</Text>
      </View>
    </TouchableOpacity>
  );
};

// Daily Mix Card
const DailyMixCard = ({ item }) => {
  return (
    <TouchableOpacity style={styles.dailyMixCard}>
      <Image source={{ uri: item.imageUrl }} style={styles.dailyMixImage} />
      <View style={styles.dailyMixOverlay}>
        <Text style={styles.dailyMixLabel}>Daily Mix</Text>
        <Text style={styles.dailyMixNumber}>{item.number}</Text>
      </View>
      <Text style={styles.dailyMixArtists} numberOfLines={2}>
        {item.artists}
      </Text>
    </TouchableOpacity>
  );
};

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

// Main App
const Home = () => {
  const [activeTab, setActiveTab] = useState("All");

  // Mock data
  const recentItems = [
    {
      id: "1",
      title: "Tech & AI Trends",
      imageUrl:
        "https://images.unsplash.com/photo-1557838923-2985c318be48?w=800&auto=format&fit=crop",
    },
    {
      id: "2",
      title: "Motivation & Self-Improvement",
      imageUrl:
        "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop",
      showPlayButton: false,
    },
    {
      id: "3",
      title: "Health & Fitness Tips",
      imageUrl:
        "https://images.unsplash.com/photo-1571019614242-c5c5dee9f707?w=800&auto=format&fit=crop",
      showPlayButton: false,
    },
    {
      id: "4",
      title: "Finance & Investing",
      imageUrl:
        "https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=800&auto=format&fit=crop",
      showPlayButton: false,
    },
    {
      id: "5",
      title: "Viral Trends & Challenges",
      imageUrl:
        "https://images.unsplash.com/photo-1584433144859-1fc3ab64a957?w=800&auto=format&fit=crop",
      showPlayButton: false,
    },
    {
      id: "6",
      title: "Science & Space Discoveries",
      imageUrl:
        "https://images.unsplash.com/photo-1447433865958-f402f562b843?w=800&auto=format&fit=crop",
      showPlayButton: false,
    },
  ];

  const dailyMixes = [
    {
      id: "1",
      number: "01",
      imageUrl:
        "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800&auto=format&fit=crop",
      artists: "OCTOBER, Nuage Cafe, Tales of Vibrations and more",
    },
    {
      id: "2",
      number: "02",
      imageUrl:
        "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&auto=format&fit=crop",
      artists: "Simon Wester, Rasmus H Thomsen, We Dream of and more",
    },
    {
      id: "3",
      number: "03",
      imageUrl:
        "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800&auto=format&fit=crop",
      artists: "Milky Day, Jimmy Brown, Hojean and more",
    },
  ];

  // Recently Added mock data
  const recentlyAddedItems = [
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

  // Render
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView>
        {/* Filter tabs */}
        <FilterTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        <Text style={styles.title}> Playlists</Text>
        {/* Recent items - grid layout */}
        <View style={styles.recentGrid}>
          {recentItems.map((item) => (
            <MusicItem key={item.id} item={item} />
          ))}
        </View>

        {/* Made For You section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Made For You</Text>
          <TouchableOpacity>
            <Text style={styles.sectionLink}>Show all</Text>
          </TouchableOpacity>
        </View>

        {/* Daily mixes horizontal scroll */}
        <FlatList
          data={dailyMixes}
          renderItem={({ item }) => <DailyMixCard item={item} />}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.dailyMixList}
        />

        {/* Recently Added section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recently Added</Text>
          <TouchableOpacity>
            <Text style={styles.sectionLink}>See more</Text>
          </TouchableOpacity>
        </View>

        {/* Recently Added items - vertical list */}
        <View style={styles.recentlyAddedList}>
          {recentlyAddedItems.map((item) => (
            <RecentlyAddedItem key={item.id} item={item} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  container: {
    flex: 1,
    backgroundColor: "#0A0A0A", // Darker black background
  },
  filterContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  filterTab: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 6,
    backgroundColor: "#262626", // Slightly lighter gray
  },
  activeFilterTab: {
    backgroundColor: "#2D5D8E", // Medium blue for active tab
  },
  filterText: {
    color: "#CCCCCC", // Light gray
    fontSize: 12,
    fontWeight: "500",
  },
  activeFilterText: {
    color: "#FFFFFF", // White text for active tab
  },
  recentGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 12,
  },
  musicItem: {
    width: "33.33%", // 3 cards per row
    paddingHorizontal: 4,
    marginBottom: 12,
  },
  musicCover: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 6,
  },
  musicInfo: {
    marginTop: 4, // Smaller gap between image and text
  },
  musicTitle: {
    color: "#E6E6E6",
    fontSize: 12, // Smaller font size
    fontWeight: "500",
    textAlign: "center", // Center text
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginTop: 20,
    marginBottom: 14,
  },
  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 20, // Slightly smaller
    fontWeight: "bold",
  },
  sectionLink: {
    color: "#4A8FE7",
    fontSize: 12, // Smaller
    opacity: 0.8,
  },
  dailyMixList: {
    paddingHorizontal: 12,
    paddingBottom: 24,
  },
  dailyMixCard: {
    width: 140, // Smaller cards
    marginHorizontal: 6,
  },
  dailyMixImage: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 6,
  },
  dailyMixOverlay: {
    position: "absolute",
    bottom: 54, // Adjusted for the smaller card
    right: 0,
    flexDirection: "row",
    backgroundColor: "rgba(0,0,0,0.8)",
    padding: 6,
  },
  dailyMixLabel: {
    color: "#CCCCCC",
    fontSize: 11, // Smaller
    fontWeight: "bold",
    marginRight: 3,
  },
  dailyMixNumber: {
    color: "#4A8FE7",
    fontSize: 12, // Smaller
    fontWeight: "bold",
  },
  dailyMixArtists: {
    color: "#999999",
    fontSize: 10, // Smaller
    marginTop: 6,
  },
  // Recently Added styles
  recentlyAddedList: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  recentlyAddedItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
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
});

export default Home;
