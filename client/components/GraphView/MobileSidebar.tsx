import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import {
  Circle as CircleIcon,
  Video as VideoCameraIcon,
  ListTodo as ListBulletIcon,
  Home as HomeIcon,
  Settings as Cog6ToothIcon,
} from "lucide-react";

interface MobileSidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export default function MobileSidebar({
  isOpen,
  setIsOpen,
}: MobileSidebarProps) {
  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
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
  );
}
