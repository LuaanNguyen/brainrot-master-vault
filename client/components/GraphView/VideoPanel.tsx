import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Video, Category } from "@/types/video";
import CategoryHeader from "./CategoryHeader";
import VideoList from "./VideoList";
import EmptyVideoState from "./EmptyVideoState";
import { Button } from "@/components/ui/button";
import { Settings, Filter, SortAsc, Grid, List, Search } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface VideoPanelProps {
  selectedCategory: string | null;
  selectedVideos: Video[];
  categories: Category[];
}

export default function VideoPanel({
  selectedCategory,
  selectedVideos,
  categories,
}: VideoPanelProps) {
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortMode, setSortMode] = useState<"recent" | "popular">("recent");

  // Filter videos based on search query
  const filteredVideos = selectedVideos.filter(
    (video) =>
      video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.channelTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort videos based on sort mode
  const sortedVideos = [...filteredVideos].sort((a, b) => {
    if (sortMode === "recent") {
      return (
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      );
    } else {
      // This would ideally use a view count or likes for popularity
      // For now just mock it by using the ID as a proxy
      return (
        parseInt(b.id.replace(/\D/g, "0")) - parseInt(a.id.replace(/\D/g, "0"))
      );
    }
  });

  const currentCategory = categories.find((c) => c.id === selectedCategory);

  return (
    <ScrollArea className="h-full bg-gradient-to-b from-gray-50 to-white">
      <div className="p-3">
        {selectedCategory ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="w-full h-full"
          >
            <Card className="h-full flex flex-col border-none shadow-sm bg-white/95 backdrop-blur-sm rounded-xl overflow-hidden">
              {/* Header with enhanced styling */}
              <CardHeader className="pb-2 px-5 pt-5 flex flex-row items-center justify-between bg-gradient-to-r from-white to-gray-50">
                <CategoryHeader
                  category={currentCategory}
                  videosCount={selectedVideos.length}
                />

                <div className="flex items-center gap-1.5">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full hover:bg-gray-100"
                    title="Settings"
                  >
                    <Settings size={16} className="text-gray-500" />
                  </Button>
                </div>
              </CardHeader>

              {/* Search and filter controls */}
              <div className="px-5 py-3 border-b border-gray-100">
                <div className="flex items-center gap-2 mb-3">
                  <div className="relative flex-grow">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search videos..."
                      className="pl-9 h-9 border-gray-200 focus-visible:ring-blue-400 rounded-lg"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1 h-9 text-xs font-medium border-gray-200"
                  >
                    <Filter size={14} />
                    <span className="hidden sm:inline">Filter</span>
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <Tabs
                    defaultValue="recent"
                    value={sortMode}
                    onValueChange={(value) =>
                      setSortMode(value as "recent" | "popular")
                    }
                    className="w-[200px]"
                  >
                    <TabsList className="h-8 bg-gray-100">
                      <TabsTrigger value="recent" className="text-xs py-1.5">
                        Recently Added
                      </TabsTrigger>
                      <TabsTrigger value="popular" className="text-xs py-1.5">
                        Popular
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>

                  <div className="flex items-center border rounded-md overflow-hidden">
                    <Button
                      variant={viewMode === "list" ? "secondary" : "ghost"}
                      size="icon"
                      className="h-8 w-8 rounded-none border-0"
                      onClick={() => setViewMode("list")}
                    >
                      <List size={16} />
                    </Button>
                    <Button
                      variant={viewMode === "grid" ? "secondary" : "ghost"}
                      size="icon"
                      className="h-8 w-8 rounded-none border-0"
                      onClick={() => setViewMode("grid")}
                    >
                      <Grid size={16} />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Content with video list */}
              <CardContent className="flex-grow overflow-auto p-0">
                {/* Results status */}
                {filteredVideos.length > 0 && (
                  <div className="px-5 py-2 text-xs text-muted-foreground bg-gray-50/50 border-b border-gray-100">
                    Showing {filteredVideos.length} of {selectedVideos.length}{" "}
                    videos
                    {searchQuery && (
                      <span>
                        {" "}
                        for "<strong>{searchQuery}</strong>"
                      </span>
                    )}
                  </div>
                )}

                <div className="p-4">
                  <VideoList
                    videos={sortedVideos}
                    viewMode={viewMode}
                    categoryColor={currentCategory?.color}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <EmptyVideoState />
        )}
      </div>
    </ScrollArea>
  );
}
