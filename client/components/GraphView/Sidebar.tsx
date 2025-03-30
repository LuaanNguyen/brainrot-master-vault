"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ChartNetwork,
  Smartphone,
  Home,
  Settings,
  Maximize,
  Bookmark,
  Clock,
  Compass,
  Folder,
  Users,
  HelpCircle,
  Grid3X3,
  LayoutDashboard,
} from "lucide-react";
import { cn } from "@/lib/utils";
import VideoGallery from "../Example";

interface SidebarProps {
  toggleFullscreen: () => void;
}

export default function Sidebar({ toggleFullscreen }: SidebarProps) {
  const [activeItem, setActiveItem] = useState<string>("graph");

  const menuItems = [
    {
      id: "dashboard",
      icon: LayoutDashboard,
      label: "Dashboard",
      disabled: true,
    },
    {
      id: "graph",
      icon: ChartNetwork,
      label: "Knowledge Graph",
      disabled: false,
    },
    { id: "explore", icon: Compass, label: "Explore", disabled: true },
    { id: "collections", icon: Folder, label: "Collections", disabled: true },
    { id: "saved", icon: Bookmark, label: "Saved", disabled: true },
    { id: "history", icon: Clock, label: "History", disabled: true },
  ];

  const bottomItems = [
    { id: "community", icon: Users, label: "Community", disabled: true },
    { id: "mobile", icon: Smartphone, label: "Mobile App", disabled: true },
    {
      id: "home",
      icon: Home,
      label: "Home",
      disabled: false,
      href: "/",
    },
    {
      id: "fullscreen",
      icon: Maximize,
      label: "Fullscreen",
      action: toggleFullscreen,
      disabled: false,
    },
    { id: "settings", icon: Settings, label: "Settings", disabled: true },
    { id: "help", icon: HelpCircle, label: "Help & Support", disabled: true },
  ];

  return (
    <div className="hidden md:flex flex-col w-16 border-r shrink-0 bg-muted/30 transition-all duration-300 hover:w-56 group h-full">
      {/* Logo */}
      <div className="flex items-center justify-center py-6 px-3">
        <div className="flex items-center w-full">
          <div className="size-10 rounded-xl bg-gradient-to-tr from-blue-500 to-cyan-400 flex items-center justify-center text-white shadow-lg shadow-blue-200 flex-shrink-0">
            <Grid3X3 className="size-5" />
          </div>
          <span className="ml-3 font-bold text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300 truncate">
            BrainRot Vault
          </span>
        </div>
      </div>

      {/* Main Menu - Scrollable */}
      <div className="flex-grow overflow-y-auto scrollbar-hide">
        <div className="flex flex-col gap-1 px-3 pt-4 pb-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.id;

            return (
              <Button
                key={item.id}
                variant="ghost"
                className={cn(
                  "justify-start relative rounded-lg w-full h-10 px-3",
                  isActive
                    ? "bg-blue-50 text-blue-600"
                    : "hover:bg-gray-100 text-gray-600",
                  item.disabled &&
                    "opacity-50 cursor-not-allowed hover:bg-transparent hover:text-gray-600"
                )}
                onClick={() => !item.disabled && setActiveItem(item.id)}
                disabled={item.disabled}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-r"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                )}
                <Icon className="h-5 w-5 flex-shrink-0" />
                <span className="ml-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 truncate">
                  {item.label}
                </span>
              </Button>
            );
          })}
        </div>
      </div>

      {/* Bottom Menu - Fixed */}
      <div className="flex-shrink-0 pb-6 flex flex-col gap-1 px-3 mt-auto">
        {bottomItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeItem === item.id;

          return (
            <Button
              key={item.id}
              variant="ghost"
              className={cn(
                "justify-start relative rounded-lg w-full h-10 px-3",
                isActive
                  ? "bg-blue-50 text-blue-600"
                  : "hover:bg-gray-100 text-gray-600",
                item.disabled &&
                  "opacity-50 cursor-not-allowed hover:bg-transparent hover:text-gray-600"
              )}
              onClick={() => {
                if (item.disabled) return;
                if (item.action) {
                  item.action();
                } else if (!item.href) {
                  setActiveItem(item.id);
                }
              }}
              disabled={item.disabled}
            >
              {isActive && (
                <motion.div
                  layoutId="bottomActiveIndicator"
                  className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-r"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                />
              )}
              <Icon className="h-5 w-5 flex-shrink-0" />
              <span className="ml-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 truncate">
                {item.label}
              </span>
              {item.id === "fullscreen" ? null : (
                <span className="sr-only">
                  <Link href={item.href || "/"}>Go to {item.label}</Link>
                </span>
              )}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
