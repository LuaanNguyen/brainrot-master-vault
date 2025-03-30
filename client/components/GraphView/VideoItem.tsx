import { motion } from "framer-motion";
import { Video } from "@/types/video";
import { Play, Clock, Share2, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VideoItemProps {
  video: Video;
  viewMode: "list" | "grid";
  categoryColor?: string;
}

export default function VideoItem({
  video,
  viewMode,
  categoryColor = "#4C1D95",
}: VideoItemProps) {
  const formattedDate = new Date(video.publishedAt).toLocaleDateString(
    undefined,
    {
      year: "numeric",
      month: "short",
      day: "numeric",
    }
  );

  if (viewMode === "grid") {
    return (
      <div className="flex flex-col rounded-xl overflow-hidden bg-white border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all duration-200 h-full group">
        <div className="w-full aspect-video relative overflow-hidden">
          <img
            src={video.thumbnails}
            alt={video.title}
            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
          />

          {/* Overlay with play button */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="bg-white rounded-full w-12 h-12 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg"
            >
              <Play size={20} className="text-gray-800 ml-1" />
            </motion.div>
          </div>

          {/* Duration badge */}
          <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded">
            10:28
          </div>
        </div>

        <div className="p-3 flex-grow flex flex-col">
          <h3 className="font-medium text-sm line-clamp-2 mb-1 group-hover:text-blue-600 transition-colors">
            {video.title}
          </h3>

          <div className="flex items-center gap-1.5 mt-1 mb-2">
            <span className="text-xs text-muted-foreground truncate">
              {video.channelTitle}
            </span>
          </div>

          <div className="mt-auto pt-2 flex items-center justify-between">
            <div className="flex items-center text-xs text-gray-500">
              <Clock size={12} className="mr-1" />
              <span>{formattedDate}</span>
            </div>

            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-full hover:bg-gray-100"
              >
                <Bookmark size={14} className="text-gray-600" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // List view
  return (
    <div className="flex items-start rounded-xl p-2 gap-3 hover:bg-gray-50 transition-colors duration-200 w-full group cursor-pointer">
      <div className="w-[30%] max-w-32 min-w-[120px] aspect-video flex-shrink-0 rounded-lg overflow-hidden relative">
        <img
          src={video.thumbnails}
          alt={video.title}
          className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
          <div
            className="bg-white/90 rounded-full w-9 h-9 flex items-center justify-center transform translate-y-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-lg"
            style={{ backgroundColor: `${categoryColor}20` }} // 20 is for opacity
          >
            <Play
              size={18}
              className="ml-0.5"
              style={{ color: categoryColor }}
            />
          </div>
        </div>

        {/* Duration badge */}
        <div className="absolute bottom-1.5 right-1.5 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded text-[10px]">
          10:28
        </div>
      </div>

      <div className="flex flex-col justify-between flex-grow min-w-0 h-full py-0.5">
        <div>
          <h3 className="font-medium text-sm leading-tight line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
            {video.title}
          </h3>

          <p className="text-xs text-gray-500 mt-1 line-clamp-2 hidden sm:block">
            {video.description.substring(0, 120)}
            {video.description.length > 120 ? "..." : ""}
          </p>
        </div>

        <div className="flex items-center justify-between mt-1.5">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground truncate font-medium">
              {video.channelTitle}
            </span>
            <span className="w-1 h-1 rounded-full bg-gray-300 flex-shrink-0"></span>
            <span className="text-xs text-gray-400 flex-shrink-0">
              {formattedDate}
            </span>
          </div>

          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-full"
            >
              <Share2 size={14} className="text-gray-600" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-full"
            >
              <Bookmark size={14} className="text-gray-600" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
