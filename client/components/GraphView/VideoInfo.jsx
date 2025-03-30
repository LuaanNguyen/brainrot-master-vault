import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function VideoInfo({ categories }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [activeCategory, setActiveCategory] = useState(null);

  const toggleExpand = () => setIsExpanded(!isExpanded);

  const handleCategoryClick = (category) => {
    setActiveCategory(activeCategory === category.id ? null : category.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="absolute top-4 right-4 bg-white/95 backdrop-blur-md rounded-xl shadow-lg border border-gray-100 w-64 z-10 overflow-hidden"
    >
      {/* Header with collapse/expand functionality */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="23 7 16 12 23 17 23 7"></polygon>
              <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
            </svg>
          </div>
          <h2 className="text-base font-semibold">Video Graph</h2>
        </div>
        <button
          onClick={toggleExpand}
          className="text-gray-400 hover:text-gray-600 transition-colors"
          aria-label={isExpanded ? "Collapse panel" : "Expand panel"}
        >
          {isExpanded ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="18 15 12 9 6 15"></polyline>
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          )}
        </button>
      </div>

      {/* Collapsible content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="px-4 py-3">
              <p className="text-gray-600 text-xs">
                This graph visualizes connections between different video
                topics. Click on a node to explore related content.
              </p>

              <div className="mt-4 mb-2">
                <h3 className="text-xs font-medium text-gray-700 uppercase tracking-wide">
                  Topics
                </h3>
              </div>

              <div className="space-y-1.5">
                {categories.map((category) => (
                  <motion.button
                    key={category.id}
                    onClick={() => handleCategoryClick(category)}
                    className={`w-full text-left px-3 py-1.5 rounded-lg flex items-center gap-2 text-xs transition-colors ${
                      activeCategory === category.id
                        ? "bg-gray-100"
                        : "hover:bg-gray-50"
                    }`}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: category.color }}
                    ></span>
                    <span className="font-medium truncate">
                      {category.label}
                    </span>
                    <span className="ml-auto opacity-60">
                      {activeCategory === category.id ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="18 15 12 9 6 15"></polyline>
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="9 18 15 12 9 6"></polyline>
                        </svg>
                      )}
                    </span>
                  </motion.button>
                ))}
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-gray-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="8" x2="12" y2="12"></line>
                      <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                    <span>Interactive Tips</span>
                  </div>
                  <button className="text-blue-600 hover:text-blue-700 font-medium text-xs">
                    Help
                  </button>
                </div>

                <div className="mt-2 bg-blue-50 rounded-lg p-2.5 text-[11px] text-blue-800">
                  <ul className="space-y-1.5 list-disc list-inside">
                    <li>Drag to pan around the graph</li>
                    <li>Scroll to zoom in and out</li>
                    <li>Click on a node to see related videos</li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
