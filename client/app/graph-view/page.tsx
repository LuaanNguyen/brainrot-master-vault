"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

// Import GraphContainer with no SSR to prevent hydration issues
const GraphContainer = dynamic(
  () => import("@/components/GraphView/GraphContainer"),
  { ssr: false }
);

export default function GraphViewPage() {
  const [isMounted, setIsMounted] = useState(false);

  // Only render client-side
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="container py-6 max-w-7xl flex items-center justify-center h-[70vh]">
        <div className="animate-pulse text-xl">
          Loading graph visualization...
        </div>
      </div>
    );
  }

  return (
    <div className="container py-6 max-w-7xl">
      <GraphContainer />
    </div>
  );
}
