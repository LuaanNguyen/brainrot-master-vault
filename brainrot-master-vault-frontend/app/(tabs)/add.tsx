import { useState } from "react";
import { View, Text, TextInput, StyleSheet, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link } from "lucide-react-native";

export default function AddVideoScreen() {
  const [videoUrl, setVideoUrl] = useState("");

  const handleAddVideo = () => {
    // TODO: Implement video processing logic
    console.log("Processing video:", videoUrl);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Add TikTok Video</Text>
        <Text style={styles.subtitle}>
          Paste a TikTok video link to add it to your library
        </Text>

        <View style={styles.inputContainer}>
          <Link size={20} color="#9CA3AF" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Paste TikTok URL here"
            placeholderTextColor="#6B7280"
            value={videoUrl}
            onChangeText={setVideoUrl}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        <Pressable
          style={[styles.button, !videoUrl && styles.buttonDisabled]}
          onPress={handleAddVideo}
          disabled={!videoUrl}
        >
          <Text
            style={[styles.buttonText, !videoUrl && styles.buttonTextDisabled]}
          >
            Process Video
          </Text>
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
});
