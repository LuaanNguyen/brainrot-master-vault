import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Search as SearchIcon } from "lucide-react-native";

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState("");

  const searchResults = [
    { id: "1", title: "Perfect Pasta Recipe", category: "Cooking" },
    { id: "2", title: "10-Minute Ab Workout", category: "Fitness" },
    { id: "3", title: "iPhone Photography Tips", category: "Tech" },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Search</Text>
        <View style={styles.searchContainer}>
          <SearchIcon size={20} color="#9CA3AF" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search videos or categories"
            placeholderTextColor="#6B7280"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <ScrollView style={styles.content}>
        {searchResults.map((result) => (
          <Pressable key={result.id} style={styles.resultCard}>
            <View>
              <Text style={styles.resultTitle}>{result.title}</Text>
              <Text style={styles.resultCategory}>{result.category}</Text>
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
  },
  title: {
    fontSize: 32,
    fontFamily: "Inter_700Bold",
    color: "#FFFFFF",
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1F2937",
    borderRadius: 12,
    padding: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: "Inter_400Regular",
    color: "#FFFFFF",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  resultCard: {
    backgroundColor: "#1F2937",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  resultTitle: {
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  resultCategory: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    color: "#9CA3AF",
  },
});
