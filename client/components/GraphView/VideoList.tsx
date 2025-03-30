import { Video } from "@/types/video";
import VideoItem from "./VideoItem";
import { motion } from "framer-motion";

interface VideoListProps {
  videos: Video[];
  viewMode: "list" | "grid";
  categoryColor?: string;
}

export default function VideoList({
  videos,
  viewMode,
  categoryColor,
}: VideoListProps) {
  if (videos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
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
        <p className="text-muted-foreground text-sm mb-2">No videos found</p>
        <p className="text-xs text-gray-400 max-w-md">
          Try adjusting your search or filter criteria to find what you're
          looking for.
        </p>
      </div>
    );
  }

  return viewMode === "list" ? (
    <div className="space-y-2.5 w-full">
      {videos.map((video, index) => (
        <motion.div
          key={video.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05, duration: 0.2 }}
        >
          <VideoItem
            video={video}
            viewMode="list"
            categoryColor={categoryColor}
          />
        </motion.div>
      ))}
    </div>
  ) : (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {videos.map((video, index) => (
        <motion.div
          key={video.id}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.05, duration: 0.2 }}
        >
          <VideoItem
            video={video}
            viewMode="grid"
            categoryColor={categoryColor}
          />
        </motion.div>
      ))}
    </div>
  );
}
