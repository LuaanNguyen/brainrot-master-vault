import { Button } from "@/components/ui/button";
import { Search, Video } from "lucide-react";

export default function EmptyVideoState() {
  return (
    <div className="flex flex-col items-center justify-center h-full py-12 px-6 text-center">
      <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-5">
        <Video className="h-7 w-7 text-blue-500" />
      </div>
      <h2 className="text-xl font-semibold mb-3 text-gray-800">
        Explore Video Content
      </h2>
      <p className="text-muted-foreground text-sm mb-6 max-w-md">
        Select a category node from the graph to discover related videos and
        insights.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
        <Button variant="outline" className="gap-2">
          <Search size={16} />
          Search Videos
        </Button>
        <Button className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
          Browse Popular
        </Button>
      </div>
    </div>
  );
}
