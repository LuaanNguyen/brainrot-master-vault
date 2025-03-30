"use client";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Linking,
  ScrollView,
} from "react-native";
import { useTheme } from "@/context/ThemeContext";
import { Plus } from "lucide-react-native";
import { useState, useEffect } from "react";
import { useRefresh } from "../../context/RefreshContext";

const LibraryScreen = () => {
  const { colors } = useTheme();
  const [activeTab, setActiveTab] = useState("categories");
  const [allRecentVideos, setAllRecentVideos] = useState([]); // All videos from API
  const [visibleRecentVideos, setVisibleRecentVideos] = useState([]); // Currently visible videos
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasReachedEnd, setHasReachedEnd] = useState(false);
  const ITEMS_PER_PAGE = 10;
  const { refreshTrigger } = useRefresh();

  // Fetch recent videos from API
  useEffect(() => {
    if (activeTab === "recent") {
      setLoading(true);
      setPage(1); // Reset page when tab changes
      setHasReachedEnd(false);

      fetch("https://brainrotapi.codestacx.com/home")
        .then((response) => response.json())
        .then((data) => {
          const videos = data.videos || [];
          setAllRecentVideos(videos);
          // Initially show only the first 5 items
          setVisibleRecentVideos(videos.slice(0, ITEMS_PER_PAGE));
          setHasReachedEnd(videos.length <= ITEMS_PER_PAGE);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching recent videos:", error);
          setLoading(false);
        });
    }
  }, [activeTab, refreshTrigger]);

  // Function to load more items
  const loadMoreItems = () => {
    if (loadingMore || hasReachedEnd || activeTab !== "recent") {
      return;
    }

    setLoadingMore(true);

    // Calculate the next set of items to display
    const nextPage = page + 1;
    const startIndex = visibleRecentVideos.length;
    const endIndex = nextPage * ITEMS_PER_PAGE;

    // Add the next batch of items to the visible items
    setTimeout(() => {
      const newItems = allRecentVideos.slice(startIndex, endIndex);

      if (newItems.length > 0) {
        setVisibleRecentVideos([...visibleRecentVideos, ...newItems]);
        setPage(nextPage);
      }

      // Check if we've reached the end
      if (startIndex + newItems.length >= allRecentVideos.length) {
        setHasReachedEnd(true);
      }

      setLoadingMore(false);
    }, 500); // Small delay to show loading indicator
  };

  // Handle scroll event for FlatList
  const handleOnEndReached = () => {
    if (!loading && !loadingMore && activeTab === "recent") {
      loadMoreItems();
    }
  };

  // Mock data for categories with added image URLs
  const categories = [
    {
      id: "1",
      title: "Educational",
      videos: 12,
      imageUrl:
        "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80",
    },
    {
      id: "2",
      title: "Cooking",
      videos: 8,
      imageUrl:
        "https://images.unsplash.com/photo-1556911220-bff31c812dba?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80",
    },
    {
      id: "3",
      title: "Tech Reviews",
      videos: 15,
      imageUrl:
        "https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80",
    },
    {
      id: "4",
      title: "Travel",
      videos: 6,
      imageUrl:
        "https://images.unsplash.com/photo-1503220317375-aaad61436b1b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80",
    },
    {
      id: "5",
      title: "Fitness",
      videos: 10,
      imageUrl:
        "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80",
    },
    {
      id: "6",
      title: "DIY Projects",
      videos: 4,
      imageUrl:
        "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80",
    },
    {
      id: "7",
      title: "Fashion",
      videos: 7,
      imageUrl:
        "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80",
    },
    {
      id: "8",
      title: "Gaming",
      videos: 9,
      imageUrl:
        "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80",
    },
  ];

  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.categoryItem, { borderBottomColor: colors.border }]}
    >
      <Image
        source={{ uri: item.imageUrl }}
        style={styles.categoryImage}
        resizeMode="cover"
      />
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

  const renderVideoItem = ({ item }) => {
    // Handle different video sources and formats
    const videoId = item.video_id || item.id;
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

      // Default thumbnail for TikTok
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
            resizeMode="cover"
          />
          <View style={styles.sourceBadge}>
            <Text style={styles.sourceText}>{source}</Text>
          </View>
          {publishedDate && (
            <View style={styles.durationBadge}>
              <Text style={styles.durationText}>
                {formatDate(publishedDate)}
              </Text>
            </View>
          )}
        </View>
        <View style={styles.recentlyAddedInfo}>
          <Text
            style={[styles.recentlyAddedTitle, { color: colors.text }]}
            numberOfLines={2}
          >
            {title}
          </Text>
          <Text style={styles.recentlyAddedSubtitle}>{channelTitle}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  // Footer component for loading indicator
  const renderFooter = () => {
    if (!loadingMore) return null;

    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={colors.primary} />
        <Text style={[styles.loadingMoreText, { color: colors.text }]}>
          Loading more...
        </Text>
      </View>
    );
  };

  const renderEndOfList = () => {
    if (
      !hasReachedEnd ||
      activeTab !== "recent" ||
      allRecentVideos.length === 0
    )
      return null;

    return (
      <View style={styles.endOfListContainer}>
        <Text style={[styles.endOfListText, { color: colors.text }]}>
          You've reached the end of the list
        </Text>
      </View>
    );
  };

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
          style={[
            styles.filterButton,
            {
              backgroundColor:
                activeTab === "categories" ? colors.primary : colors.card,
              borderColor:
                activeTab === "categories" ? "transparent" : colors.border,
            },
          ]}
          onPress={() => setActiveTab("categories")}
        >
          <Text
            style={[
              styles.filterButtonText,
              { color: activeTab === "categories" ? "white" : colors.text },
            ]}
          >
            Categories
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            {
              backgroundColor:
                activeTab === "recent" ? colors.primary : colors.card,
              borderColor:
                activeTab === "recent" ? "transparent" : colors.border,
            },
          ]}
          onPress={() => setActiveTab("recent")}
        >
          <Text
            style={[
              styles.filterButtonText,
              { color: activeTab === "recent" ? "white" : colors.text },
            ]}
          >
            Recently Added
          </Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={activeTab === "categories" ? categories : visibleRecentVideos}
          renderItem={
            activeTab === "categories" ? renderCategoryItem : renderVideoItem
          }
          keyExtractor={(item) =>
            item.id || item._id || item.video_id || String(Math.random())
          }
          contentContainerStyle={styles.list}
          ListFooterComponent={
            activeTab === "recent" ? (
              <>
                {renderFooter()}
                {renderEndOfList()}
              </>
            ) : null
          }
          onEndReached={activeTab === "recent" ? handleOnEndReached : null}
          onEndReachedThreshold={0.3}
        />
      )}
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
  },
  filterButtonText: {
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
  categoryImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  // Styles for recently added items
  recentlyAddedItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    paddingHorizontal: 6,
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderColor: "rgba(128, 128, 128, 0.3)",
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

  // Footer loader styles
  footerLoader: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 16,
  },
  loadingMoreText: {
    marginLeft: 8,
    fontSize: 12,
  },

  // End of list styles
  endOfListContainer: {
    paddingVertical: 16,
    alignItems: "center",
  },
  endOfListText: {
    fontSize: 12,
    opacity: 0.7,
  },
});

export default LibraryScreen;
