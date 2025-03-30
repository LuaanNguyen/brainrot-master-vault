// Types
export interface Video {
  id: string;
  title: string;
  thumbnails: string;
  description: string;
  categoryId: string;
  channelTitle: string;
  publishedAt: string;
}

export interface Category {
  id: string;
  label: string;
  color: string;
}

// Sample videos data
export const VIDEOS: Video[] = [
  {
    id: "o4XRpgyz2O8",
    title: "Hot Sauce Must Be HOT! #funfact",
    description:
      "A supplier once told David Tran the creator Sriracha hot sauce that it was too spicy and suggested he add a tomato base to make it sweeter. David replied \"hot sauce must be hot! If you don't like it hot, use less. We don't make mayonnaise here.\"",
    thumbnails: "https://i.ytimg.com/vi/o4XRpgyz2O8/sddefault.jpg",
    categoryId: "food",
    channelTitle: "Doug Sharpe",
    publishedAt: "2023-06-13T19:00:28Z",
  },
  {
    id: "video2",
    title: "The Future of AI in 2024",
    description:
      "Exploring the latest advancements in artificial intelligence and what to expect in the coming year.",
    thumbnails: "https://placehold.co/600x400/png",
    categoryId: "tech",
    channelTitle: "Tech Insights",
    publishedAt: "2023-12-15T10:30:00Z",
  },
  // ... existing videos data

  // Food & Cooking
  {
    id: "food1",
    title: "Easy 15-Minute Pasta Recipes for Beginners",
    description:
      "Quick and delicious pasta recipes that anyone can make in just 15 minutes.",
    thumbnails: "https://placehold.co/600x400/FF6B6B/fff?text=Pasta+Recipes",
    categoryId: "food",
    channelTitle: "Easy Meals",
    publishedAt: "2023-05-22T14:30:00Z",
  },
  {
    id: "food2",
    title: "Authentic Thai Curry from Scratch",
    description:
      "Learn to make restaurant-quality Thai curry with homemade paste and fresh ingredients.",
    thumbnails: "https://placehold.co/600x400/FF6B6B/fff?text=Thai+Curry",
    categoryId: "food",
    channelTitle: "Global Cuisine",
    publishedAt: "2023-07-05T18:15:00Z",
  },
  {
    id: "food3",
    title: "Sourdough Bread: The Complete Guide",
    description:
      "Master the art of sourdough bread baking with this comprehensive tutorial.",
    thumbnails: "https://placehold.co/600x400/FF6B6B/fff?text=Sourdough",
    categoryId: "food",
    channelTitle: "Baking Masterclass",
    publishedAt: "2023-08-12T09:45:00Z",
  },
  {
    id: "food4",
    title: "10 Healthy Meal Prep Ideas for the Week",
    description:
      "Save time and eat well with these nutritious meal prep ideas that last all week.",
    thumbnails: "https://placehold.co/600x400/FF6B6B/fff?text=Meal+Prep",
    categoryId: "food",
    channelTitle: "Healthy Eats",
    publishedAt: "2023-09-03T11:20:00Z",
  },

  // Technology
  {
    id: "tech1",
    title: "Building a Next.js Application from Zero to Production",
    description:
      "Complete walkthrough of creating and deploying a modern web app with Next.js.",
    thumbnails: "https://placehold.co/600x400/4ECDC4/fff?text=Next.js",
    categoryId: "tech",
    channelTitle: "Web Dev Pro",
    publishedAt: "2023-11-18T08:30:00Z",
  },
  {
    id: "tech2",
    title: "Machine Learning Basics: Understanding Neural Networks",
    description:
      "An introduction to neural networks and how they form the foundation of modern AI.",
    thumbnails: "https://placehold.co/600x400/4ECDC4/fff?text=Neural+Networks",
    categoryId: "tech",
    channelTitle: "AI Academy",
    publishedAt: "2024-01-07T16:45:00Z",
  },
  {
    id: "tech3",
    title: "Blockchain Technology Explained Simply",
    description:
      "Break down complex blockchain concepts into easily digestible explanations.",
    thumbnails: "https://placehold.co/600x400/4ECDC4/fff?text=Blockchain",
    categoryId: "tech",
    channelTitle: "Tech Simplified",
    publishedAt: "2023-10-25T14:15:00Z",
  },
  {
    id: "tech4",
    title: "5 VS Code Extensions Every Developer Needs",
    description:
      "Essential extensions that will supercharge your coding workflow in Visual Studio Code.",
    thumbnails: "https://placehold.co/600x400/4ECDC4/fff?text=VS+Code",
    categoryId: "tech",
    channelTitle: "Coding Tools",
    publishedAt: "2024-02-03T10:00:00Z",
  },

  // Travel
  {
    id: "travel1",
    title: "Hidden Gems of Portugal: Beyond Lisbon",
    description:
      "Discover beautiful towns and natural landscapes off the beaten path in Portugal.",
    thumbnails: "https://placehold.co/600x400/FFD166/fff?text=Portugal",
    categoryId: "travel",
    channelTitle: "Wanderlust Adventures",
    publishedAt: "2023-06-28T09:30:00Z",
  },
  {
    id: "travel2",
    title: "Budget Travel in Japan: Tokyo Under $50/Day",
    description:
      "Tips and tricks for experiencing Tokyo on a tight budget without missing the essentials.",
    thumbnails: "https://placehold.co/600x400/FFD166/fff?text=Tokyo+Budget",
    categoryId: "travel",
    channelTitle: "Budget Nomads",
    publishedAt: "2023-09-14T17:25:00Z",
  },
  {
    id: "travel3",
    title: "Road Trip Guide: California Pacific Coast Highway",
    description:
      "Plan the perfect road trip along one of America's most scenic coastal routes.",
    thumbnails: "https://placehold.co/600x400/FFD166/fff?text=Pacific+Coast",
    categoryId: "travel",
    channelTitle: "Road Trip Masters",
    publishedAt: "2023-07-30T11:40:00Z",
  },
  {
    id: "travel4",
    title: "Solo Female Travel Safety Tips for Southeast Asia",
    description:
      "Essential advice for women traveling alone through Thailand, Vietnam, and beyond.",
    thumbnails: "https://placehold.co/600x400/FFD166/fff?text=Solo+Travel",
    categoryId: "travel",
    channelTitle: "Solo Explorer",
    publishedAt: "2024-01-15T13:10:00Z",
  },

  // Science
  {
    id: "science1",
    title: "How Black Holes Actually Work",
    description:
      "The physics behind black holes explained in an accessible way for non-scientists.",
    thumbnails: "https://placehold.co/600x400/6A0572/fff?text=Black+Holes",
    categoryId: "science",
    channelTitle: "Space Explored",
    publishedAt: "2023-08-05T15:20:00Z",
  },
  {
    id: "science2",
    title: "The Science of Sleep: Why We Need It and How to Improve It",
    description:
      "Research-backed explanation of sleep's importance and practical tips for better rest.",
    thumbnails: "https://placehold.co/600x400/6A0572/fff?text=Sleep+Science",
    categoryId: "science",
    channelTitle: "Health Science",
    publishedAt: "2023-11-10T19:45:00Z",
  },
  {
    id: "science3",
    title: "Quantum Computing for Beginners",
    description:
      "Breaking down quantum computing concepts in simple terms with real-world examples.",
    thumbnails:
      "https://placehold.co/600x400/6A0572/fff?text=Quantum+Computing",
    categoryId: "science",
    channelTitle: "Quantum Leap",
    publishedAt: "2024-02-18T08:55:00Z",
  },
  {
    id: "science4",
    title: "Climate Change: The Evidence and Solutions",
    description:
      "An evidence-based look at climate change impacts and the most promising solutions.",
    thumbnails: "https://placehold.co/600x400/6A0572/fff?text=Climate+Change",
    categoryId: "science",
    channelTitle: "Earth Science",
    publishedAt: "2023-10-07T12:30:00Z",
  },

  // History
  {
    id: "history1",
    title: "The Rise and Fall of the Roman Empire",
    description:
      "Comprehensive overview of how Rome became the ancient world's greatest power and why it collapsed.",
    thumbnails: "https://placehold.co/600x400/F7B801/fff?text=Roman+Empire",
    categoryId: "history",
    channelTitle: "Ancient Civilizations",
    publishedAt: "2023-07-12T16:40:00Z",
  },
  {
    id: "history2",
    title: "Women Who Changed History But Were Forgotten",
    description:
      "Profiles of remarkable women whose contributions were overlooked in traditional history books.",
    thumbnails: "https://placehold.co/600x400/F7B801/fff?text=Women+In+History",
    categoryId: "history",
    channelTitle: "Hidden History",
    publishedAt: "2023-09-25T10:15:00Z",
  },
  {
    id: "history3",
    title: "World War II in Color: Restored Footage",
    description:
      "Newly restored and colorized footage showing the reality of WWII with historical context.",
    thumbnails: "https://placehold.co/600x400/F7B801/fff?text=WWII+Restored",
    categoryId: "history",
    channelTitle: "History Archives",
    publishedAt: "2024-01-30T14:50:00Z",
  },
  {
    id: "history4",
    title: "The Space Race: From Sputnik to Apollo",
    description:
      "The dramatic Cold War competition that pushed humanity into the space age.",
    thumbnails: "https://placehold.co/600x400/F7B801/fff?text=Space+Race",
    categoryId: "history",
    channelTitle: "Modern History",
    publishedAt: "2023-12-04T11:25:00Z",
  },

  // Art & Culture
  {
    id: "art1",
    title: "Understanding Modern Art Movements",
    description:
      "From Impressionism to Abstract Expressionism - how to appreciate and understand modern art.",
    thumbnails: "https://placehold.co/600x400/1A535C/fff?text=Modern+Art",
    categoryId: "art",
    channelTitle: "Art Appreciation",
    publishedAt: "2023-08-19T13:45:00Z",
  },
  {
    id: "art2",
    title: "Digital Art Fundamentals for Beginners",
    description:
      "Getting started with digital art tools and techniques for aspiring digital artists.",
    thumbnails: "https://placehold.co/600x400/1A535C/fff?text=Digital+Art",
    categoryId: "art",
    channelTitle: "Digital Creator",
    publishedAt: "2023-10-31T09:10:00Z",
  },
  {
    id: "art3",
    title: "Cinema Techniques That Changed Filmmaking Forever",
    description:
      "Revolutionary film techniques that transformed how stories are told on screen.",
    thumbnails: "https://placehold.co/600x400/1A535C/fff?text=Cinema",
    categoryId: "art",
    channelTitle: "Film Studies",
    publishedAt: "2024-02-02T15:35:00Z",
  },
  {
    id: "art4",
    title: "World Music Traditions: Instruments and Styles",
    description:
      "Exploring diverse musical traditions from around the globe and their cultural significance.",
    thumbnails: "https://placehold.co/600x400/1A535C/fff?text=World+Music",
    categoryId: "art",
    channelTitle: "Global Music",
    publishedAt: "2023-11-28T18:20:00Z",
  },

  // Fitness & Health
  {
    id: "fitness1",
    title: "30-Day Strength Training Program: No Equipment Needed",
    description:
      "Complete body transformation program using only bodyweight exercises for all fitness levels.",
    thumbnails:
      "https://placehold.co/600x400/9BC53D/fff?text=Bodyweight+Training",
    categoryId: "fitness",
    channelTitle: "Home Workout Pro",
    publishedAt: "2023-06-05T07:30:00Z",
  },
  {
    id: "fitness2",
    title: "Yoga for Beginners: Essential Poses and Breathing",
    description:
      "Gentle introduction to yoga fundamentals with focus on proper form and mindfulness.",
    thumbnails: "https://placehold.co/600x400/9BC53D/fff?text=Yoga+Basics",
    categoryId: "fitness",
    channelTitle: "Mindful Movement",
    publishedAt: "2023-09-18T06:45:00Z",
  },
  {
    id: "fitness3",
    title: "Nutrition Myths Debunked by Science",
    description:
      "Evidence-based examination of common nutrition beliefs and misconceptions.",
    thumbnails: "https://placehold.co/600x400/9BC53D/fff?text=Nutrition+Facts",
    categoryId: "fitness",
    channelTitle: "Health Science",
    publishedAt: "2023-12-22T10:55:00Z",
  },
  {
    id: "fitness4",
    title: "How to Fix Your Posture: Daily Exercises for Office Workers",
    description:
      "Simple exercises to counteract the effects of sitting at a desk all day.",
    thumbnails: "https://placehold.co/600x400/9BC53D/fff?text=Posture+Fix",
    categoryId: "fitness",
    channelTitle: "Ergonomics Expert",
    publishedAt: "2024-01-15T16:10:00Z",
  },

  // Finance
  {
    id: "finance1",
    title: "Investing for Beginners: Building Your First Portfolio",
    description:
      "Step-by-step guide to start investing with explanations of stocks, bonds, and index funds.",
    thumbnails: "https://placehold.co/600x400/5C2A9D/fff?text=Investing+101",
    categoryId: "finance",
    channelTitle: "Financial Freedom",
    publishedAt: "2023-07-20T12:15:00Z",
  },
  {
    id: "finance2",
    title: "Cryptocurrency Explained: Beyond the Hype",
    description:
      "Balanced look at how cryptocurrencies work, their potential, and risks for investors.",
    thumbnails: "https://placehold.co/600x400/5C2A9D/fff?text=Crypto+Guide",
    categoryId: "finance",
    channelTitle: "Digital Assets",
    publishedAt: "2023-10-14T09:30:00Z",
  },
  {
    id: "finance3",
    title: "Retire Early: The FIRE Movement Strategy",
    description:
      "Financial Independence, Retire Early - principles and practical steps to achieve financial freedom.",
    thumbnails: "https://placehold.co/600x400/5C2A9D/fff?text=FIRE+Movement",
    categoryId: "finance",
    channelTitle: "Early Retirement",
    publishedAt: "2024-02-10T14:25:00Z",
  },
  {
    id: "finance4",
    title: "Personal Finance in Your 20s: Setting Up for Success",
    description:
      "Essential money management tips for young adults just starting their financial journey.",
    thumbnails: "https://placehold.co/600x400/5C2A9D/fff?text=20s+Finance",
    categoryId: "finance",
    channelTitle: "Money Mentor",
    publishedAt: "2023-11-05T11:40:00Z",
  },
];

// Categories
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
