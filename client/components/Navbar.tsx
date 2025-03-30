"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  Menu,
  Moon,
  Sun,
  X,
  ChartNetwork,
  Sparkles,
  BookOpen,
  Crown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";

interface NavbarProps {
  isScrolled: boolean;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  mounted: boolean;
}

export default function Navbar({
  isScrolled,
  mobileMenuOpen,
  setMobileMenuOpen,
  mounted,
}: NavbarProps) {
  const { theme, setTheme } = useTheme();
  const [hoveredNavItem, setHoveredNavItem] = useState<string | null>(null);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  // Define navigation items
  const navItems = [
    {
      id: "problem",
      label: "The Problem",
      icon: <BookOpen className="size-3.5" />,
    },
    {
      id: "features",
      label: "Features",
      icon: <Sparkles className="size-3.5" />,
    },
  ];

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled ? "bg-white/90 shadow-md backdrop-blur-lg" : "bg-transparent"
      }`}
    >
      <div className="container flex h-20 items-center justify-between">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3 font-bold"
        >
          <div className="size-10 rounded-xl bg-gradient-to-tr from-blue-500 to-cyan-400 flex items-center justify-center text-white shadow-lg shadow-blue-200">
            <ChartNetwork className="size-5" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-lg tracking-tight">Brainrot</span>
            <span className="text-xs text-blue-600 font-medium">
              Master Vault
            </span>
          </div>
        </motion.div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <nav className="flex gap-6 mr-4">
            {navItems.map((item) => (
              <Link
                key={item.id}
                href={`#${item.id}`}
                onMouseEnter={() => setHoveredNavItem(item.id)}
                onMouseLeave={() => setHoveredNavItem(null)}
                className="relative py-1.5 px-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  {item.icon}
                  {item.label}
                </div>
                {hoveredNavItem === item.id && (
                  <motion.div
                    layoutId="nav-underline"
                    className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500 rounded-full"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  />
                )}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                size="sm"
                className="rounded-full border-blue-200 text-blue-700 hover:bg-blue-50 cursor-not-allowed"
              >
                Sign In
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button className="rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md shadow-blue-200/50 hover:shadow-lg hover:shadow-blue-300/50 border-0">
                <Link href="/graph-view">Get Started</Link>
                <ChevronRight className="ml-1 size-4" />
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Mobile buttons */}
        <div className="flex items-center gap-4 md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-gray-700"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={mobileMenuOpen ? "open" : "closed"}
                initial={{ opacity: 0, rotate: -90 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 90 }}
                transition={{ duration: 0.2 }}
              >
                {mobileMenuOpen ? (
                  <X className="size-5" />
                ) : (
                  <Menu className="size-5" />
                )}
              </motion.div>
            </AnimatePresence>
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden overflow-hidden absolute top-20 inset-x-0 bg-white shadow-lg border-b border-gray-100"
          >
            <div className="container py-6 flex flex-col gap-5">
              {navItems.map((item) => (
                <Link
                  key={item.id}
                  href={`#${item.id}`}
                  className="py-3 px-4 flex items-center gap-3 text-gray-700 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className="size-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                    {item.icon}
                  </div>
                  <span className="font-medium">{item.label}</span>
                </Link>
              ))}

              <div className="space-y-3 pt-4 mt-2 border-t border-gray-100">
                <Button
                  variant="outline"
                  className="w-full justify-center rounded-lg border-blue-200 text-blue-700"
                >
                  Sign In
                </Button>
                <Button className="w-full justify-center rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 text-white">
                  Get Started
                  <ChevronRight className="ml-1 size-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
