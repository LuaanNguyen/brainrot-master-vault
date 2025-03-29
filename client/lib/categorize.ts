import { VideoMetadata, Category } from "./types";

// Category keywords to match against video tags and descriptions
const CATEGORY_KEYWORDS: Record<string, string[]> = {
  food: [
    "food",
    "cooking",
    "recipe",
    "chef",
    "cuisine",
    "dish",
    "meal",
    "restaurant",
    "baking",
    "kitchen",
    "ingredient",
    "delicious",
    "tasty",
    "flavor",
    "cook",
    "eat",
    "dining",
    "culinary",
    "gourmet",
    "breakfast",
    "lunch",
    "dinner",
  ],
  tech: [
    "technology",
    "tech",
    "digital",
    "software",
    "hardware",
    "computer",
    "programming",
    "code",
    "app",
    "gadget",
    "ai",
    "artificial intelligence",
    "machine learning",
    "algorithm",
    "data",
    "internet",
    "online",
    "device",
    "smartphone",
    "innovation",
  ],
  travel: [
    "travel",
    "destination",
    "tourism",
    "tourist",
    "vacation",
    "holiday",
    "trip",
    "journey",
    "adventure",
    "explore",
    "visit",
    "country",
    "city",
    "place",
    "landmark",
    "sightseeing",
    "tour",
    "abroad",
    "foreign",
    "culture",
    "local",
  ],
  science: [
    "science",
    "scientific",
    "research",
    "experiment",
    "discovery",
    "physics",
    "chemistry",
    "biology",
    "astronomy",
    "space",
    "planet",
    "star",
    "universe",
    "laboratory",
    "theory",
    "hypothesis",
    "evidence",
    "academic",
    "study",
  ],
  history: [
    "history",
    "historical",
    "ancient",
    "past",
    "century",
    "era",
    "period",
    "timeline",
    "event",
    "date",
    "war",
    "civilization",
    "empire",
    "kingdom",
    "artifact",
    "archaeology",
    "heritage",
    "tradition",
    "culture",
    "vintage",
    "retro",
  ],
  art: [
    "art",
    "artist",
    "artistic",
    "creative",
    "creativity",
    "design",
    "painting",
    "drawing",
    "sculpture",
    "gallery",
    "museum",
    "exhibition",
    "photography",
    "performance",
    "music",
    "dance",
    "theater",
    "film",
    "literature",
    "fashion",
  ],
  fitness: [
    "fitness",
    "exercise",
    "workout",
    "gym",
    "training",
    "health",
    "healthy",
    "wellness",
    "nutrition",
    "diet",
    "body",
    "muscle",
    "weight",
    "cardio",
    "strength",
    "yoga",
    "pilates",
    "running",
    "sports",
    "athlete",
    "active",
  ],
  finance: [
    "finance",
    "financial",
    "money",
    "investment",
    "investing",
    "economy",
    "economic",
    "business",
    "market",
    "stock",
    "trade",
    "trading",
    "wealth",
    "budget",
    "saving",
    "bank",
    "banking",
    "credit",
    "debt",
    "income",
    "profit",
  ],
};

// Predefined categories with colors
export const CATEGORIES: Category[] = [
  { id: "food", label: "Food & Cooking", color: "#FF6B6B" },
  { id: "tech", label: "Technology", color: "#4ECDC4" },
  { id: "travel", label: "Travel", color: "#FFD166" },
  { id: "science", label: "Science", color: "#6A0572" },
  { id: "history", label: "History", color: "#F7B801" },
  { id: "art", label: "Art & Culture", color: "#1A535C" },
  { id: "fitness", label: "Fitness & Health", color: "#9BC53D" },
  { id: "finance", label: "Finance", color: "#5C2A9D" },
];

/**
 * Categorize a video based on its tags and description
 * @param video Video metadata
 * @returns Category ID that best matches the video
 */
export function categorizeVideo(video: VideoMetadata): string {
  const contentText = [
    video.title || "",
    video.description || "",
    ...(video.tags || []),
  ]
    .join(" ")
    .toLowerCase();

  // Calculate match scores for each category
  const scores: Record<string, number> = {};

  Object.entries(CATEGORY_KEYWORDS).forEach(([categoryId, keywords]) => {
    let score = 0;

    keywords.forEach((keyword) => {
      const regex = new RegExp(`\\b${keyword}\\b`, "gi");
      const matches = contentText.match(regex);
      if (matches) {
        score += matches.length;
      }
    });

    scores[categoryId] = score;
  });

  // Find category with highest score
  let bestCategory = "uncategorized";
  let highestScore = 0;

  Object.entries(scores).forEach(([categoryId, score]) => {
    if (score > highestScore) {
      highestScore = score;
      bestCategory = categoryId;
    }
  });

  return highestScore > 0 ? bestCategory : "uncategorized";
}

/**
 * Get all possible connections between categories
 * @returns Array of connections between categories
 */
export function getCategoryConnections() {
  return [
    { source: "food", target: "science" },
    { source: "food", target: "fitness" },
    { source: "food", target: "travel" },
    { source: "tech", target: "science" },
    { source: "tech", target: "finance" },
    { source: "travel", target: "art" },
    { source: "travel", target: "history" },
    { source: "science", target: "history" },
    { source: "science", target: "tech" },
    { source: "history", target: "art" },
    { source: "history", target: "finance" },
    { source: "art", target: "travel" },
    { source: "fitness", target: "food" },
    { source: "fitness", target: "science" },
    { source: "finance", target: "tech" },
  ];
}
