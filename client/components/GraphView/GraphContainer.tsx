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
const CATEGORIES: Category[] = [
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
          {/* Top search bar */}
          <div className="flex items-center justify-between gap-2 p-4 border-b w-full">
            <p className="font-medium">Nga's Vault</p>
            {/* <div className="relative flex-1 max-w-md">
              <MagnifyingGlassIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search for videos or topics..."
                className="pl-8 bg-muted/30"
              />
            </div> */}
            <div className="flex gap-5">
              {" "}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="flex items-center gap-3 font-bold"
              >
                <div className="font-normal px-4 py-1 rounded-lg bg-gradient-to-tr from-blue-500 to-cyan-400 flex items-center justify-center text-white shadow-lg shadow-blue-200">
                  Export
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="flex items-center gap-3 font-bold"
              >
                <div className="px-1 py-1 rounded-lg flex items-center justify-center border border-gray-100 ">
                  <Ellipsis />
                </div>
              </motion.div>
            </div>
          </div>

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
                <div className="p-6">
                  {selectedCategory ? (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle>
                            {CATEGORIES.find((c) => c.id === selectedCategory)
                              ?.label || "Category"}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {selectedVideos.length > 0 ? (
                            selectedVideos.map((video) => (
                              <motion.div
                                key={video.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="flex flex-col space-y-2 border rounded-lg p-3"
                              >
                                <div className="aspect-video overflow-hidden rounded-md">
                                  <img
                                    src={video.thumbnails}
                                    alt={video.title}
                                    className="object-cover w-full h-full"
                                  />
                                </div>
                                <h3 className="font-medium leading-tight">
                                  {video.title}
                                </h3>
                                <p className="text-xs text-muted-foreground line-clamp-2">
                                  {video.description}
                                </p>
                                <div className="flex justify-between items-center text-xs text-muted-foreground">
                                  <span>{video.channelTitle}</span>
                                  <span>
                                    {new Date(
                                      video.publishedAt
                                    ).toLocaleDateString()}
                                  </span>
                                </div>
                                <Button variant="outline" size="sm">
                                  Watch Video
                                </Button>
                              </motion.div>
                            ))
                          ) : (
                            <p className="text-muted-foreground">
                              No videos found for this category.
                            </p>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  ) : (
                    <>
                      <h2 className="text-xl font-semibold mb-4">Video Info</h2>
                      <p className="text-muted-foreground text-sm mb-6">
                        Select a node to see related videos and details.
                      </p>
                      <div className="space-y-4">
                        <div className="p-4 border rounded-lg">
                          <h3 className="font-medium">Hot Topics</h3>
                          <ul className="mt-2 space-y-1 text-sm">
                            {CATEGORIES.map((category) => (
                              <li
                                key={category.id}
                                className="flex items-center gap-2"
                              >
                                <span
                                  className={`w-2 h-2 rounded-full`}
                                  style={{ backgroundColor: category.color }}
                                ></span>
                                <span>{category.label}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
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
