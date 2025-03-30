import { CardTitle } from "@/components/ui/card";
import { Category } from "@/types/video";

interface CategoryHeaderProps {
  category?: Category;
  videosCount: number;
}

export default function CategoryHeader({
  category,
  videosCount,
}: CategoryHeaderProps) {
  return (
    <>
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-white">
          {category?.label?.charAt(0) || "C"}
        </div>
        <CardTitle className="text-base font-medium">
          {category?.label || "Category"}
        </CardTitle>
      </div>
      <div className="text-xs text-muted-foreground">{videosCount} videos</div>
    </>
  );
}
