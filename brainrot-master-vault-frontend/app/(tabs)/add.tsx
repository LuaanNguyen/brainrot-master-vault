import { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  Alert,
  Image,
  Animated,
  Easing,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link } from "lucide-react-native";
import { useRefresh } from "../../context/RefreshContext";
import { LinearGradient } from "expo-linear-gradient";

// YouTube and TikTok logo URLs for fallback thumbnails
const YOUTUBE_LOGO_URL =
  "https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/YouTube_full-color_icon_%282017%29.svg/2560px-YouTube_full-color_icon_%282017%29.svg.png";
const TIKTOK_LOGO_URL =
  "https://static.vecteezy.com/system/resources/previews/018/930/572/original/tiktok-logo-tiktok-icon-transparent-free-png.png";

export default function AddVideoScreen() {
  const [videoUrl, setVideoUrl] = useState("");
  const [recentItems, setRecentItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const { triggerRefresh } = useRefresh();

  // Animation value for the gradient wave effect
  const dotsAnimation = useRef(new Animated.Value(0)).current;

  // Add a new animated value for the button pulse effect
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Start animation when loading state changes
  useEffect(() => {
    if (isLoading) {
      // Create a pulsing animation for the button
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.05,
            duration: 700,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 700,
            easing: Easing.in(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Animate the dots for the text
      Animated.loop(
        Animated.timing(dotsAnimation, {
          toValue: 3,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: false,
        })
      ).start();
    } else {
      // Stop animations when not loading
      pulseAnim.setValue(1);
      pulseAnim.stopAnimation();
      dotsAnimation.stopAnimation();
    }
  }, [isLoading]);

  // Function to render the animated dots
  const renderDots = () => {
    // Round to nearest integer for dot display
    const dotsCount = Math.floor(dotsAnimation._value);
    return ".".repeat(dotsCount);
  };

  useEffect(() => {
    fetch("https://brainrotapi.codestacx.com/")
      .then((response) => response.json())
      .then((data) => {
        console.log(data.videos);
        setRecentItems(data.videos);
      })
      .catch((error) => {
        console.error("Error fetching recent videos:", error);
      });
  }, []);

  const isYouTubeUrl = (url) => {
    return url.includes("youtube.com") || url.includes("youtu.be");
  };

  const isTikTokUrl = (url) => {
    return url.includes("tiktok.com");
  };

  const getThumbnailUrl = (item) => {
    // Check if item has standard thumbnail
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

    // Check for other thumbnail locations
    if (
      item.thumbnails ||
      (item.response_data && item.response_data.thumbnail)
    ) {
      return item.thumbnails || item.response_data.thumbnail;
    }

    // If source is YouTube, use YouTube logo as fallback
    if (
      item.source === "youtube" ||
      (item.video_url && isYouTubeUrl(item.video_url))
    ) {
      return YOUTUBE_LOGO_URL;
    }

    // If source is TikTok, use TikTok logo as fallback
    if (
      item.source === "tiktok" ||
      (item.video_url && isTikTokUrl(item.video_url))
    ) {
      return TIKTOK_LOGO_URL;
    }

    // Default fallback (should never reach here if source is properly set)
    return "https://via.placeholder.com/120x90?text=No+Thumbnail";
  };

  const handleAddVideo = async () => {
    if (!videoUrl) return;

    setIsLoading(true);
    setSuccessMessage("");

    try {
      let apiUrl;
      let processedUrl = videoUrl;
      let source = "";

      // Process URLs - remove query parameters for both YouTube and TikTok
      if (videoUrl.includes("?")) {
        processedUrl = videoUrl.split("?")[0];
      }

      if (isYouTubeUrl(videoUrl)) {
        source = "youtube";
        apiUrl = `https://brainrotapi.codestacx.com/youtube?video_url=${encodeURIComponent(
          processedUrl
        )}`;
      } else if (isTikTokUrl(videoUrl)) {
        source = "tiktok";
        apiUrl = `https://brainrotapi.codestacx.com/tiktok?tiktok_url=${encodeURIComponent(
          processedUrl
        )}`;
      } else {
        Alert.alert(
          "Invalid URL",
          "Please enter a valid YouTube or TikTok URL"
        );
        setIsLoading(false);
        return;
      }

      const response = await fetch(apiUrl);
      const data = await response.json();

      if (response.ok) {
        setSuccessMessage("Video successfully added to your library!");
        setVideoUrl("");

        // Trigger refresh for other components
        triggerRefresh();
      } else {
        Alert.alert("Error", data.message || "Failed to process video");
      }
    } catch (error) {
      console.error("Error processing video:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Add Video</Text>
        <Text style={styles.subtitle}>
          Paste a YouTube or TikTok video link to add it to your library
        </Text>

        <View style={styles.inputContainer}>
          <Link size={20} color="#9CA3AF" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Paste video URL here"
            placeholderTextColor="#6B7280"
            value={videoUrl}
            onChangeText={setVideoUrl}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        {successMessage ? (
          <View style={styles.successContainer}>
            <Text style={styles.successMessage}>{successMessage}</Text>
          </View>
        ) : null}

        <Pressable
          style={[
            styles.buttonContainer,
            (!videoUrl || isLoading) && styles.buttonDisabled,
          ]}
          onPress={handleAddVideo}
          disabled={!videoUrl || isLoading}
        >
          {!videoUrl ? (
            // Inactive button state - no gradient
            <View style={styles.buttonInner}>
              <Text style={styles.buttonTextDisabled}>Process Video</Text>
            </View>
          ) : isLoading ? (
            // Loading state with pulse animation and animated dots
            <Animated.View
              style={[
                styles.gradientContainer,
                { transform: [{ scale: pulseAnim }] },
              ]}
            >
              <LinearGradient
                colors={["#36d0ff", "#4576ff"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.buttonGradient}
              >
                <Text style={styles.buttonText}>
                  Processing
                  <Animated.Text>{renderDots()}</Animated.Text>
                </Text>
              </LinearGradient>
            </Animated.View>
          ) : (
            // Active button state with static gradient
            <LinearGradient
              colors={["#36d0ff", "#4576ff"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonText}>Process Video</Text>
            </LinearGradient>
          )}
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111111",
  },
  content: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontFamily: "Inter_700Bold",
    marginBottom: 8,
    color: "#FFFFFF",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    fontFamily: "Inter_400Regular",
    color: "#9CA3AF",
    textAlign: "center",
    marginBottom: 32,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1F2937",
    borderRadius: 12,
    padding: 12,
    width: "100%",
    marginBottom: 20,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: "Inter_400Regular",
    color: "#FFFFFF",
  },
  buttonContainer: {
    width: "100%",
    borderRadius: 12,
    overflow: "hidden", // Important for the gradient to stay within rounded corners
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonInner: {
    backgroundColor: "#374151",
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: "center",
  },
  gradientContainer: {
    width: "100%",
  },
  buttonGradient: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
    textAlign: "center",
  },
  buttonTextDisabled: {
    color: "#6B7280",
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
    textAlign: "center",
  },
  successContainer: {
    backgroundColor: "#065F46",
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    width: "100%",
  },
  successMessage: {
    color: "#FFFFFF",
    fontFamily: "Inter_600SemiBold",
    textAlign: "center",
  },
});
