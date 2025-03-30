"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Ellipsis,
  Download,
  Share2,
  Bell,
  Search,
  ChevronDown,
  User,
  Users,
  Plus,
  Settings,
  History,
  Star,
} from "lucide-react";
import Link from "next/link";

interface TopBarProps {
  title?: string;
  onExport?: () => void;
  onMenuClick?: () => void;
}

export default function TopBar({
  title = "Nga's Vault",
  onExport = () => console.log("Export clicked"),
  onMenuClick = () => console.log("Menu clicked"),
}: TopBarProps) {
  const [showVaultDropdown, setShowVaultDropdown] = useState(false);
  const [vaultType, setVaultType] = useState<"personal" | "group">("personal");
  const [notifications, setNotifications] = useState(3);
  const [showSearch, setShowSearch] = useState(false);

  const toggleVaultDropdown = () => setShowVaultDropdown(!showVaultDropdown);
  const toggleSearch = () => setShowSearch(!showSearch);

  return (
    <div className="flex flex-col w-full">
      <div className="flex items-center justify-between gap-2 p-4 border-b w-full">
        <div className="flex items-center gap-3">
          {/* Vault Selector with Dropdown */}
          <div className="relative">
            <button
              onClick={toggleVaultDropdown}
              className="flex items-center gap-2 font-medium hover:bg-gray-50 rounded-lg px-3 py-1.5 transition-colors"
              aria-expanded={showVaultDropdown}
              aria-haspopup="true"
            >
              <div className="w-8 h-8 rounded-md bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white">
                {vaultType === "personal" ? (
                  <User size={16} />
                ) : (
                  <Users size={16} />
                )}
              </div>
              <div className="flex flex-col items-start">
                <span className="text-sm font-semibold">{title}</span>
                <span className="text-xs text-gray-500 capitalize">
                  {vaultType} Vault
                </span>
              </div>
              <ChevronDown size={16} className="text-gray-500 ml-1" />
            </button>

            <AnimatePresence>
              {showVaultDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-0 mt-1 w-60 rounded-md shadow-lg bg-white border border-gray-100 z-10"
                  onMouseLeave={() => setShowVaultDropdown(false)}
                >
                  <div className="p-1">
                    <div className="px-3 py-2 text-xs font-medium text-gray-500 border-b mb-1">
                      SELECT VAULT
                    </div>

                    <button
                      className={`flex items-center gap-2 w-full text-left px-3 py-2 text-sm rounded-md ${
                        vaultType === "personal"
                          ? "bg-indigo-50 text-indigo-600"
                          : "hover:bg-gray-50"
                      }`}
                      onClick={() => {
                        setVaultType("personal");
                        setShowVaultDropdown(false);
                      }}
                    >
                      <User size={16} />
                      <span>Personal Vault</span>
                      {vaultType === "personal" && (
                        <Star size={12} className="ml-auto text-indigo-500" />
                      )}
                    </button>

                    <button
                      className={`flex items-center gap-2 w-full text-left px-3 py-2 text-sm rounded-md ${
                        vaultType === "group"
                          ? "bg-indigo-50 text-indigo-600"
                          : "hover:bg-gray-50"
                      }`}
                      onClick={() => {
                        setVaultType("group");
                        setShowVaultDropdown(false);
                      }}
                    >
                      <Users size={16} />
                      <span>Team Vault</span>
                      {vaultType === "group" && (
                        <Star size={12} className="ml-auto text-indigo-500" />
                      )}
                    </button>

                    <div className="border-t my-1"></div>

                    <button
                      className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm rounded-md opacity-50 cursor-not-allowed"
                      disabled
                    >
                      <Plus size={16} />
                      <span>Create New Vault</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-3">
          {/* Search toggle */}
          <button
            onClick={toggleSearch}
            className={`p-2 rounded-full hover:bg-gray-100 transition-colors ${
              showSearch ? "bg-indigo-50 text-indigo-600" : "text-gray-500"
            }`}
          >
            <Search size={18} />
          </button>

          {/* Notifications - Disabled */}
          <div className="relative">
            <button
              className="p-2 rounded-full text-gray-500 opacity-50 cursor-not-allowed"
              disabled
            >
              <Bell size={18} />
              {notifications > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white w-4 h-4 flex items-center justify-center rounded-full text-[10px]">
                  {notifications > 9 ? "9+" : notifications}
                </span>
              )}
            </button>
          </div>

          {/* History - Disabled */}
          <button
            className="p-2 rounded-full text-gray-500 opacity-50 cursor-not-allowed"
            disabled
          >
            <History size={18} />
          </button>

          {/* Settings - Disabled */}
          <button
            className="p-2 rounded-full text-gray-500 opacity-50 cursor-not-allowed"
            disabled
          >
            <Settings size={18} />
          </button>

          {/* Share - Disabled */}
          <button
            className="p-2 rounded-full text-gray-500 opacity-50 cursor-not-allowed"
            disabled
          >
            <Share2 size={18} />
          </button>

          {/* Export button */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            onClick={onExport}
            className="flex cursor-not-allowed items-center gap-2 px-4 py-1.5 rounded-lg bg-gradient-to-tr from-blue-500 to-cyan-400 text-white shadow-sm hover:shadow-md hover:opacity-90 transition-all"
          >
            <Download size={16} />
            <span className="font-medium text-sm">Export</span>
          </motion.button>

          {/* More options - Disabled */}
          <button
            className="p-2 rounded-full text-gray-500 opacity-50 cursor-not-allowed"
            disabled
          >
            <Ellipsis size={18} />
          </button>
        </div>
      </div>

      {/* Expandable search area */}
      <AnimatePresence>
        {showSearch && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="border-b overflow-hidden"
          >
            <div className="p-3 flex">
              <div className="relative flex-1 max-w-2xl mx-auto">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={16}
                />
                <input
                  type="text"
                  placeholder="Search by topic, keyword, or content..."
                  className="w-full py-2 pl-10 pr-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent transition-all"
                  autoFocus
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                  Press{" "}
                  <kbd className="px-1.5 py-0.5 bg-gray-100 rounded-md">
                    Esc
                  </kbd>{" "}
                  to close
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
