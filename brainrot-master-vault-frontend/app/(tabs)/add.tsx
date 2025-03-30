import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link } from "lucide-react-native";

export default function AddVideoScreen() {
  const [videoUrl, setVideoUrl] = useState("");
  const [recentItems, setRecentItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

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

  const handleAddVideo = async () => {
    if (!videoUrl) return;

    setIsLoading(true);
    setSuccessMessage("");

    try {
      let apiUrl;

      if (isYouTubeUrl(videoUrl)) {
        apiUrl = `https://brainrotapi.codestacx.com/youtube?video_url=${encodeURIComponent(
          videoUrl
        )}`;
      } else if (isTikTokUrl(videoUrl)) {
        apiUrl = `https://brainrotapi.codestacx.com/tiktok?tiktok_url=${encodeURIComponent(
          videoUrl
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

        // Refresh the recent videos list
        const recentResponse = await fetch(
          "https://brainrotapi.codestacx.com/"
        );
        const recentData = await recentResponse.json();
        setRecentItems(recentData.videos);
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
            styles.button,
            (!videoUrl || isLoading) && styles.buttonDisabled,
          ]}
          onPress={handleAddVideo}
          disabled={!videoUrl || isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <Text
              style={[
                styles.buttonText,
                !videoUrl && styles.buttonTextDisabled,
              ]}
            >
              Process Video
            </Text>
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
  button: {
    backgroundColor: "#3B82F6",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    width: "100%",
    alignItems: "center",
  },
  buttonDisabled: {
    backgroundColor: "#374151",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
    textAlign: "center",
  },
  buttonTextDisabled: {
    color: "#6B7280",
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
