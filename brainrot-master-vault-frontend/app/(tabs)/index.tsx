import React, { useEffect, useState, useCallback } from "react";
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
  Linking,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { useRefresh } from "../../context/RefreshContext";
import { LinearGradient } from "expo-linear-gradient"; // Add this import

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
            // Remove the activeFilterTab style here since we'll use LinearGradient instead
          ]}
          onPress={() => setActiveTab(tab)}
        >
          {activeTab === tab ? (
            <LinearGradient
              colors={["#36d0ff", "#4576ff"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.activeFilterTabGradient}
            >
              <Text style={styles.activeFilterText}>{tab}</Text>
            </LinearGradient>
          ) : (
            <Text style={styles.filterText}>{tab}</Text>
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
};

// Music Item Component
const MusicItem = ({ item }) => {
  const handlePress = () => {
    router.push({
      pathname: "/PlaylistDetail",
      params: {
        id: item.id,
        title: item.title || item.description,
        imageUrl: encodeURIComponent(item.imageUrl),
      },
    });
  };

  return (
    <TouchableOpacity style={styles.musicItem} onPress={handlePress}>
      <Image source={{ uri: item.imageUrl }} style={styles.musicCover} />
      <Text style={styles.musicTitle} numberOfLines={2}>
        {item.description || item.title}
      </Text>
    </TouchableOpacity>
  );
};

// Daily Mix Card
const DailyMixCard = ({ item }) => {
  const handlePress = () => {
    router.push({
      pathname: "/PlaylistDetail",
      params: {
        id: item.id,
        title: item.number ? `Daily Mix ${item.number}` : item.description,
        imageUrl: encodeURIComponent(item.imageUrl),
      },
    });
  };

  return (
    <TouchableOpacity style={styles.dailyMixCard} onPress={handlePress}>
      <Image source={{ uri: item.imageUrl }} style={styles.dailyMixImage} />
      <View style={styles.dailyMixOverlay}>
        <Text style={styles.dailyMixLabel}>Daily Mix</Text>
        <Text style={styles.dailyMixNumber}>{item.number}</Text>
      </View>
      <Text style={styles.dailyMixArtists} numberOfLines={2}>
        {item.description}
      </Text>
    </TouchableOpacity>
  );
};

// Recently Added Item Component
const RecentlyAddedItem = ({ item }) => {
  // Format the published date
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

  // Handle different video sources and formats
  const videoId = item.video_id;
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

  // Create appropriate thumbnails based on source
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

    // Default thumbnail for TikTok (you might need to adjust this)
    if (source === "tiktok") {
      return "https://cdn.shopify.com/s/files/1/0070/7032/files/tiktok2_5381bbf7-d33d-4c31-9cbd-6dad2ef3b2ce.png?v=1734596856";
    }

    return "https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?w=800&auto=format&fit=crop";
  };

  // Handle video URL based on source
  const handleVideoPress = () => {
    let url = "";
    if (source === "youtube") {
      url = `https://youtube.com/watch?v=${videoId}`;
    } else if (source === "tiktok") {
      url = `https://tiktok.com/@username/video/${videoId}`;
    }

    if (url) {
      Linking.openURL(url);
    }
  };

  return (
    <TouchableOpacity
      style={styles.recentlyAddedItem}
      onPress={handleVideoPress}
    >
      <View style={styles.videoThumbnailContainer}>
        <Image
          source={{ uri: getThumbnailUrl() }}
          style={styles.recentlyAddedCover}
        />
        <View style={styles.sourceBadge}>
          <Text style={styles.sourceText}>{source}</Text>
        </View>
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

// Main App
const Home = () => {
  const [activeTab, setActiveTab] = useState("All");
  const [allRecentItems, setAllRecentItems] = useState([]); // All items from the API
  const [visibleRecentItems, setVisibleRecentItems] = useState([]); // Currently visible items
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 5;
  const { refreshTrigger } = useRefresh();

  // Fetch videos when component mounts or refreshTrigger changes
  useEffect(() => {
    setLoading(true);
    fetch("https://brainrotapi.codestacx.com/home")
      .then((response) => response.json())
      .then((data) => {
        const videos = data.videos || [];
        setAllRecentItems(videos);
        // Initially show only the first 5 items
        setVisibleRecentItems(videos.slice(0, ITEMS_PER_PAGE));
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching recent videos:", error);
        setLoading(false);
      });
  }, [refreshTrigger]);

  // Function to load more items
  const loadMoreItems = () => {
    if (loading || visibleRecentItems.length >= allRecentItems.length) {
      return;
    }

    setLoading(true);

    // Calculate the next set of items to display
    const nextPage = page + 1;
    const endIndex = nextPage * ITEMS_PER_PAGE;

    // Add the next batch of items to the visible items
    setTimeout(() => {
      setVisibleRecentItems([
        ...visibleRecentItems,
        ...allRecentItems.slice(visibleRecentItems.length, endIndex),
      ]);
      setPage(nextPage);
      setLoading(false);
    }, 500); // Small delay to show loading indicator
  };

  // Function to check if the user has scrolled to the bottom
  const isCloseToBottom = ({
    layoutMeasurement,
    contentOffset,
    contentSize,
  }) => {
    const paddingToBottom = 20; // How close to the bottom
    return (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
    );
  };

  // Handle scroll event
  const handleScroll = ({ nativeEvent }) => {
    if (isCloseToBottom(nativeEvent)) {
      loadMoreItems();
    }
  };

  // Mock data
  const categories = [
    {
      id: "1",
      title: "Tech News",
      imageUrl:
        "https://images.unsplash.com/photo-1557838923-2985c318be48?w=800&auto=format&fit=crop",
    },
    {
      id: "2",
      title: "Natural Disasters",
      imageUrl:
        "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop",
      showPlayButton: false,
    },
    {
      id: "3",
      title: "Health & Fitness Tips",
      imageUrl:
        "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&auto=format&fit=crop",
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
      title: "Food & Cooking Trends",
      imageUrl:
        "https://images.unsplash.com/photo-1584433144859-1fc3ab64a957?w=800&auto=format&fit=crop",
      showPlayButton: false,
    },
    {
      id: "6",
      title: "Crime",
      imageUrl:
        "https://images.unsplash.com/photo-1447433865958-f402f562b843?w=800&auto=format&fit=crop",
    },
  ];

  const dailyMixes = [
    {
      id: "1",
      number: "01",
      imageUrl:
        "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800&auto=format&fit=crop",
      description: "Tech Innovations, AI Trends, and Future Gadgets",
    },
    {
      id: "2",
      number: "02",
      imageUrl:
        "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&auto=format&fit=crop",
      description: "Study Hacks, Learning Tips, and Productivity Boosters",
    },
    {
      id: "3",
      number: "03",
      imageUrl:
        "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800&auto=format&fit=crop",
      description: "Gaming Strategies, Esports Highlights, and Pro Tips",
    },
  ];

  // Render
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView
        onScroll={handleScroll}
        scrollEventThrottle={400} // Adjust throttle as needed
      >
        {/* Filter tabs */}
        <FilterTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        <Text style={styles.title}> Playlists</Text>
        {/* Recent items - grid layout */}
        <View style={styles.recentGrid}>
          {categories.map((item) => (
            <MusicItem key={item.id} item={item} />
          ))}
        </View>

        {/* Made For You section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Made For You</Text>
          <TouchableOpacity></TouchableOpacity>
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
          <TouchableOpacity onPress={loadMoreItems}>
            <Text style={styles.sectionLink}>See more</Text>
          </TouchableOpacity>
        </View>

        {/* Recently Added items - vertical list */}
        <View style={styles.recentlyAddedList}>
          {visibleRecentItems && visibleRecentItems.length > 0 ? (
            visibleRecentItems.map((item) => (
              <RecentlyAddedItem key={item.id || item.video_id} item={item} />
            ))
          ) : (
            <Text style={styles.recentlyAddedSubtitle}>
              No recent items available
            </Text>
          )}

          {/* Loading indicator at the bottom */}
          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#4A8FE7" />
              <Text style={styles.loadingText}>Loading more...</Text>
            </View>
          )}

          {/* End of list message */}
          {!loading &&
            visibleRecentItems.length >= allRecentItems.length &&
            allRecentItems.length > 0 && (
              <Text style={styles.endOfListText}>
                You've reached the end of the list
              </Text>
            )}
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
    marginRight: 6,
    backgroundColor: "#262626", // Only for inactive tabs
    borderRadius: 16,
    overflow: "hidden", // Important for the gradient to stay within rounded corners
  },
  activeFilterTabGradient: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
  },
  filterText: {
    color: "#CCCCCC", // Light gray
    fontSize: 12,
    fontWeight: "500",
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  activeFilterText: {
    color: "#FFFFFF", // White text for active tab
    fontSize: 12,
    fontWeight: "500",
  },
  recentGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 12,
    justifyContent: "space-between", // Better spacing between cards
  },
  musicItem: {
    width: "31%", // Slightly narrower than 33.33% to allow for more spacing
    marginBottom: 16, // Increased bottom margin for better separation
    backgroundColor: "rgba(100, 100, 100, 0.3)", // Subtle background for better text visibility
    borderRadius: 8,
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
    color: "#FFFFFF", // Brighter white for better contrast
    fontSize: 10, // Smaller font size
    fontWeight: "600", // Slightly bolder
    textAlign: "center", // Center text
    margin: 6,
    paddingHorizontal: 4, // Add some horizontal padding
    lineHeight: 14, // Tighter line height for better readability
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
    color: "#FFFFFF", // Changed from #999999 to white
    fontSize: 10, // Kept the same size
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
  // New styles for loading and end of list
  loadingContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  loadingText: {
    color: "#999999",
    fontSize: 12,
    marginLeft: 8,
  },
  endOfListText: {
    color: "#999999",
    fontSize: 12,
    textAlign: "center",
    padding: 16,
  },
});

export default Home;
