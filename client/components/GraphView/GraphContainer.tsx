"use client";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import {
  Circle as CircleIcon,
  Search as MagnifyingGlassIcon,
  Video as VideoCameraIcon,
  ListTodo as ListBulletIcon,
  Home as HomeIcon,
  Settings as Cog6ToothIcon,
  Maximize as ArrowsPointingOutIcon,
  Menu as Bars3Icon,
} from "lucide-react";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { ChartNetwork, Smartphone, Ellipsis } from "lucide-react";
import Link from "next/link";
import ProfileSection from "../ProfileSection";
import TopBar from "./TopBar";

// Import ForceGraphComponent with no SSR to prevent hydration issues
const ForceGraphComponent = dynamic(() => import("./ForceGraphComponent"), {
  ssr: false,
});

// Types
interface Video {
  id: string;
  title: string;
  thumbnails: string;
  description: string;
  categoryId: string;
  channelTitle: string;
  publishedAt: string;
}

interface Category {
  id: string;
  label: string;
  color: string;
}

// Sample videos data
const VIDEOS: Video[] = [
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
  {
    id: "video3",
    title: "Hidden Gems of South America",
    description:
      "Discover breathtaking locations off the beaten path in South America.",
    thumbnails: "https://placehold.co/600x400/png",
    categoryId: "travel",
    channelTitle: "Wanderlust",
    publishedAt: "2024-01-22T14:45:00Z",
  },
  {
    id: "video4",
    title: "Understanding Black Holes",
    description:
      "A simplified explanation of the physics behind black holes and their significance in the universe.",
    thumbnails: "https://placehold.co/600x400/png",
    categoryId: "science",
    channelTitle: "Science Explained",
    publishedAt: "2023-11-05T08:20:00Z",
  },
  {
    id: "video5",
    title: "The Rise and Fall of Ancient Rome",
    description:
      "Examining the key events that led to the rise and eventual collapse of the Roman Empire.",
    thumbnails: "https://placehold.co/600x400/png",
    categoryId: "history",
    channelTitle: "History Chronicles",
    publishedAt: "2024-02-18T16:10:00Z",
  },
  {
    id: "video6",
    title: "Modern Art Movements Explained",
    description:
      "Breaking down the most influential art movements of the 20th century.",
    thumbnails: "https://placehold.co/600x400/png",
    categoryId: "art",
    channelTitle: "Art Appreciation",
    publishedAt: "2023-09-30T11:15:00Z",
  },
  {
    id: "video7",
    title: "5-Minute Full Body Workout",
    description:
      "Quick and effective exercises that target your entire body with no equipment needed.",
    thumbnails: "https://placehold.co/600x400/png",
    categoryId: "fitness",
    channelTitle: "FitLife",
    publishedAt: "2024-03-10T07:00:00Z",
  },
  {
    id: "video8",
    title: "Investing Basics for Beginners",
    description:
      "Learn the fundamentals of investing and how to build a diversified portfolio.",
    thumbnails: "https://placehold.co/600x400/png",
    categoryId: "finance",
    channelTitle: "Money Matters",
    publishedAt: "2023-08-05T13:25:00Z",
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

export default function GraphContainer() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedVideos, setSelectedVideos] = useState<Video[]>([]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  const handleExport = () => {
    console.log("Exporting data...");
    // Add your export logic here
  };

  const handleMenuClick = () => {
    // You can implement menu functionality here
    console.log("Menu clicked");
  };

  return (
    <div
      className={`bg-background rounded-2xl border border-blue-100 overflow-hidden shadow-[0_20px_50px_rgba(8,112,240,0.2)] ${
        isFullscreen ? "fixed inset-0 z-50 " : " h-[calc(100vh-6rem)]"
      }`}
    >
      <div className="flex h-full ">
        {/* Sidebar for desktop */}
        <div className="hidden md:flex flex-col w-16 border-r shrink-0 bg-muted/30">
          <div className="flex flex-col items-center py-4 gap-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-3 font-bold"
            >
              <div className="size-10 rounded-xl bg-gradient-to-tr from-blue-500 to-cyan-400 flex items-center justify-center text-white shadow-lg shadow-blue-200">
                <ChartNetwork className="size-5" />
              </div>
            </motion.div>
            {/*<Button variant="ghost" size="icon" className="rounded-full">
              <Link href="/">
                <HomeIcon className="h-5 w-5" />
              </Link>
            </Button>
           <Button variant="ghost" size="icon" className="rounded-full">
              <CircleIcon className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full">
              <VideoCameraIcon className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full">
              <ListBulletIcon className="h-5 w-5" />
            </Button> */}
          </div>
          <div className="mt-auto pb-4 flex flex-col items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={toggleFullscreen}
            >
              <ArrowsPointingOutIcon className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Link href="/">
                <Smartphone className="h-5 w-5" />
              </Link>
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Link href="/">
                <HomeIcon className="h-5 w-5" />
              </Link>
            </Button>

            <Button variant="ghost" size="icon" className="rounded-full">
              <Link href="/">
                <Cog6ToothIcon className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Main content area */}
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          {/* Top search bar - replaced with the new component */}
          <TopBar
            title="Nga's Vault"
            onExport={handleExport}
            onMenuClick={handleMenuClick}
          />

          {/* Main content with resizable panels */}
          <ResizablePanelGroup
            direction="horizontal"
            className="flex-1 overflow-hidden"
          >
            <ResizablePanel
              defaultSize={70}
              minSize={30}
              className="overflow-hidden"
            >
              <div className="h-full overflow-auto p-6">
                <ForceGraphComponent
                  onNodeClick={(node: any) => {
                    // Handle node click
                    console.log("Node clicked:", node);

                    const categoryId = node.id;
                    setSelectedCategory(categoryId);

                    // Filter videos by the selected category
                    const filteredVideos = VIDEOS.filter(
                      (video) => video.categoryId === categoryId
                    );
                    setSelectedVideos(filteredVideos);
                  }}
                />
              </div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel
              defaultSize={30}
              minSize={20}
              className="flex flex-col h-full"
            >
              {/* Profile Section */}
              <ProfileSection />
              <ScrollArea className="h-full bg-gray-50">
                <div className="p-2">
                  {selectedCategory ? (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                      className="w-full h-full"
                    >
                      <Card className="h-full flex flex-col border-none shadow-sm bg-white/95 backdrop-blur-sm">
                        <CardHeader className="pb-2 flex-shrink-0 px-4 pt-4 flex flex-row items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-white">
                              {CATEGORIES.find(
                                (c) => c.id === selectedCategory
                              )?.label?.charAt(0) || "C"}
                            </div>
                            <CardTitle className="text-base font-medium">
                              {CATEGORIES.find((c) => c.id === selectedCategory)
                                ?.label || "Category"}
                            </CardTitle>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {selectedVideos.length} videos
                          </div>
                        </CardHeader>

                        <div className="px-4 pb-2">
                          <div className="w-full h-px bg-gray-100"></div>
                        </div>

                        <CardContent className="flex-grow overflow-auto px-4 py-2">
                          <div className="space-y-2 w-full">
                            {selectedVideos.length > 0 ? (
                              selectedVideos.map((video) => (
                                <motion.div
                                  key={video.id}
                                  initial={{ opacity: 0, x: 20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: 0.1 }}
                                  className="flex items-center rounded-lg p-2 gap-3 hover:bg-gray-50 transition-colors duration-200 w-full group cursor-pointer"
                                >
                                  {/* Thumbnail with Spotify-like play button on hover */}
                                  <div className="w-[30%] max-w-24 min-w-16 aspect-video flex-shrink-0 rounded-md overflow-hidden relative">
                                    <img
                                      src={video.thumbnails}
                                      alt={video.title}
                                      className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                                    />

                                    {/* Spotify-like play button that appears on hover */}
                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                                      <div className="bg-primary rounded-full w-8 h-8 flex items-center justify-center transform translate-y-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-lg">
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="16"
                                          height="16"
                                          viewBox="0 0 24 24"
                                          fill="white"
                                          stroke="white"
                                          strokeWidth="0"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                        >
                                          <polygon points="5 3 19 12 5 21 5 3"></polygon>
                                        </svg>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Content area that flexes with available space */}
                                  <div className="flex flex-col justify-between flex-grow min-w-0 h-full py-0.5">
                                    <h3 className="font-medium text-sm leading-tight line-clamp-1 group-hover:text-black transition-colors duration-200">
                                      {video.title}
                                    </h3>

                                    <div className="flex items-center gap-2 mt-1">
                                      <span className="text-xs text-muted-foreground truncate">
                                        {video.channelTitle}
                                      </span>
                                      <span className="w-1 h-1 rounded-full bg-gray-300 flex-shrink-0"></span>
                                      <span className="text-xs text-muted-foreground flex-shrink-0 hidden xs:block">
                                        {new Date(
                                          video.publishedAt
                                        ).toLocaleDateString(undefined, {
                                          year: "numeric",
                                          month: "short",
                                          day: "numeric",
                                        })}
                                      </span>
                                    </div>
                                  </div>
                                </motion.div>
                              ))
                            ) : (
                              <div className="flex flex-col items-center justify-center h-40 text-center">
                                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="text-gray-400"
                                  >
                                    <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12s4.48 10 10 10 10-4.48 10-10z"></path>
                                    <path d="M12 16v-4"></path>
                                    <path d="M12 8h.01"></path>
                                  </svg>
                                </div>
                                <p className="text-muted-foreground text-sm">
                                  No videos found for this category.
                                </p>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ) : (
                    <>
                      <h2 className="text-xl font-semibold mb-4">Video Info</h2>
                      <p className="text-muted-foreground text-sm mb-6">
                        Select a node to see related videos and details.
                      </p>
                    </>
                  )}
                </div>
              </ScrollArea>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </div>

      {/* Mobile sidebar */}
      <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
        <SheetContent side="left" className="w-[240px] sm:w-[280px]">
          <SheetHeader>
            <SheetTitle>BrainRot Vault</SheetTitle>
            <SheetDescription>
              Explore video topics and connections
            </SheetDescription>
          </SheetHeader>
          <div className="py-6">
            <div className="space-y-3">
              <Button variant="ghost" className="w-full justify-start">
                <HomeIcon className="mr-2 h-4 w-4" />
                Home
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <CircleIcon className="mr-2 h-4 w-4" />
                Topics
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <VideoCameraIcon className="mr-2 h-4 w-4" />
                Videos
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <ListBulletIcon className="mr-2 h-4 w-4" />
                Categories
              </Button>
            </div>
          </div>
          <SheetFooter>
            <Button variant="outline" className="w-full">
              <Cog6ToothIcon className="mr-2 h-4 w-4" />
              Settings
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
