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

// Import ForceGraphComponent with no SSR to prevent hydration issues
const ForceGraphComponent = dynamic(() => import("./ForceGraphComponent"), {
  ssr: false,
});

export default function GraphContainer() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

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
      className={`bg-background rounded-lg border overflow-hidden ${
        isFullscreen ? "fixed inset-0 z-50" : "h-[calc(100vh-6rem)]"
      }`}
    >
      <div className="flex h-full">
        {/* Sidebar for desktop */}
        <div className="hidden md:flex flex-col w-16 border-r shrink-0 bg-muted/30">
          <div className="flex flex-col items-center py-4 gap-2">
            <Button variant="ghost" size="icon" className="rounded-full">
              <HomeIcon className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full">
              <CircleIcon className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full">
              <VideoCameraIcon className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full">
              <ListBulletIcon className="h-5 w-5" />
            </Button>
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
              <Cog6ToothIcon className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Main content area */}
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          {/* Top search bar */}
          <div className="flex items-center gap-2 p-4 border-b">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden rounded-full"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Bars3Icon className="h-5 w-5" />
            </Button>
            <div className="relative flex-1 max-w-md">
              <MagnifyingGlassIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search for videos or topics..."
                className="pl-8 bg-muted/30"
              />
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
              <ScrollArea className="h-full">
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Video Info</h2>
                  <p className="text-muted-foreground text-sm mb-6">
                    Select a node to see related videos and details.
                  </p>
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg">
                      <h3 className="font-medium">Hot Topics</h3>
                      <ul className="mt-2 space-y-1 text-sm">
                        <li className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-[#FF6B6B]"></span>
                          <span>Food & Cooking</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-[#4ECDC4]"></span>
                          <span>Technology</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-[#FFD166]"></span>
                          <span>Travel</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-[#6A0572]"></span>
                          <span>Science</span>
                        </li>
                      </ul>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h3 className="font-medium">Recent Videos</h3>
                      <div className="mt-2 space-y-3">
                        <div className="flex gap-2">
                          <div className="w-16 h-9 bg-muted rounded shrink-0"></div>
                          <div className="text-xs">
                            <div className="font-medium">
                              Hot Sauce Must Be HOT!
                            </div>
                            <div className="text-muted-foreground mt-1">
                              2.4M views
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <div className="w-16 h-9 bg-muted rounded shrink-0"></div>
                          <div className="text-xs">
                            <div className="font-medium">The Future of AI</div>
                            <div className="text-muted-foreground mt-1">
                              1.8M views
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
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
