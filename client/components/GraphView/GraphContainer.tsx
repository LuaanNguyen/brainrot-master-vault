"use client";
import dynamic from "next/dynamic";
import { useState } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import ProfileSection from "../ProfileSection";
import TopBar from "./TopBar";
import Sidebar from "./Sidebar";
import VideoPanel from "./VideoPanel";
import MobileSidebar from "./MobileSidebar";
import { VIDEOS, CATEGORIES } from "./data";

// Import ForceGraphComponent with no SSR to prevent hydration issues
const ForceGraphComponent = dynamic(() => import("./ForceGraphComponent"), {
  ssr: false,
});

// Types
import { Video, Category } from "@/types/video";

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
    console.log("Menu clicked");
  };

  const handleNodeClick = (node: any) => {
    console.log("Node clicked:", node);

    const categoryId = node.id;
    setSelectedCategory(categoryId);

    // Filter videos by the selected category
    const filteredVideos = VIDEOS.filter(
      (video) => video.categoryId === categoryId
    );
    setSelectedVideos(filteredVideos);
  };

  return (
    <div
      className={`bg-background rounded-2xl border border-blue-100 overflow-hidden shadow-[0_20px_50px_rgba(8,112,240,0.2)] ${
        isFullscreen ? "fixed inset-0 z-50 " : " h-[calc(100vh-6rem)]"
      }`}
    >
      <div className="flex h-full">
        <Sidebar toggleFullscreen={toggleFullscreen} />

        <div className="flex-1 flex flex-col h-full overflow-hidden">
          <TopBar
            title="Nga's Vault"
            onExport={handleExport}
            onMenuClick={handleMenuClick}
          />

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
                <ForceGraphComponent onNodeClick={handleNodeClick} />
              </div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel
              defaultSize={30}
              minSize={20}
              className="flex flex-col h-full"
            >
              <ProfileSection />
              <VideoPanel
                selectedCategory={selectedCategory}
                selectedVideos={selectedVideos}
                categories={CATEGORIES}
              />
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </div>

      <MobileSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
    </div>
  );
}
