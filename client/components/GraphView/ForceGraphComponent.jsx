"use client";

import { useEffect, useRef } from "react";
import ForceGraph from "force-graph";

// Sample data
const sampleData = {
  nodes: [
    { id: "food", name: "Food & Cooking", color: "#FF6B6B", val: 20 },
    { id: "tech", name: "Technology", color: "#4ECDC4", val: 20 },
    { id: "travel", name: "Travel", color: "#FFD166", val: 20 },
    { id: "science", name: "Science", color: "#6A0572", val: 20 },
    { id: "history", name: "History", color: "#F7B801", val: 20 },
    { id: "art", name: "Art & Culture", color: "#1A535C", val: 20 },
    { id: "fitness", name: "Fitness & Health", color: "#9BC53D", val: 20 },
    { id: "finance", name: "Finance", color: "#5C2A9D", val: 20 },
  ],
  links: [
    { source: "food", target: "science" },
    { source: "food", target: "fitness" },
    { source: "tech", target: "science" },
    { source: "tech", target: "finance" },
    { source: "travel", target: "art" },
    { source: "science", target: "history" },
    { source: "history", target: "art" },
    { source: "fitness", target: "food" },
    { source: "fitness", target: "science" },
    { source: "finance", target: "history" },
  ],
};

export default function ForceGraphComponent({ onNodeClick }) {
  const containerRef = useRef(null);
  const graphRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize graph
    graphRef.current = ForceGraph()(containerRef.current)
      .graphData(sampleData)
      .nodeId("id")
      .nodeVal("val")
      .nodeLabel("name")
      .nodeColor((node) => node.color)
      .nodeRelSize(8)
      .linkColor(() => "rgba(255,255,255,0.2)")
      .linkWidth(1)
      .d3AlphaDecay(0.02)
      .d3VelocityDecay(0.2)
      .cooldownTicks(100)
      .onNodeClick((node) => {
        if (onNodeClick) onNodeClick(node);
      });

    // Custom node paint function
    graphRef.current.nodeCanvasObject((node, ctx, globalScale) => {
      const { x, y, color, id, val, name } = node;
      const size = val || 15;

      // Draw node circle
      ctx.beginPath();
      ctx.arc(x, y, size / globalScale, 0, 2 * Math.PI);
      ctx.fillStyle = color;
      ctx.fill();

      // Draw label
      if (name) {
        ctx.font = `${12 / globalScale}px Sans-Serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "white";
        ctx.fillText(name, x, y + (size + 10) / globalScale);
      }
    });

    // Handle resize
    const handleResize = () => {
      if (graphRef.current) {
        graphRef.current.width(containerRef.current.clientWidth);
        graphRef.current.height(containerRef.current.clientHeight);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Set initial size

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      if (graphRef.current) {
        graphRef.current._destructor();
      }
    };
  }, [onNodeClick]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full min-h-[500px] bg-background"
    ></div>
  );
}
