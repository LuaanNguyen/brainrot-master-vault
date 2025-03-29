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

    // Initialize graph with simpler configuration
    graphRef.current = ForceGraph()(containerRef.current)
      .graphData(sampleData)
      .nodeId("id")
      .nodeVal("val")
      .nodeLabel("name")
      .nodeColor((node) => node.color)
      .nodeRelSize(8)
      .linkColor(() => "rgba(0, 0, 0, 0.7)")
      .linkWidth(2)
      .onNodeClick((node) => {
        if (onNodeClick) onNodeClick(node);
      });

    // Position nodes in a circle
    const nodes = sampleData.nodes;
    const numNodes = nodes.length;
    const angleStep = (2 * Math.PI) / numNodes;
    const radius = 250;

    nodes.forEach((node, i) => {
      const angle = i * angleStep;
      node.x = radius * Math.cos(angle) + containerRef.current.clientWidth / 2;
      node.y = radius * Math.sin(angle) + containerRef.current.clientHeight / 2;
      node.animPhase = Math.random() * 2 * Math.PI;
    });

    // Update graph with positioned nodes
    graphRef.current.graphData(sampleData);

    // Custom node rendering
    graphRef.current.nodeCanvasObject((node, ctx, globalScale) => {
      const time = Date.now() / 1000;
      const floatAmplitude = 2;
      const floatFrequency = 0.5;

      // Create floating effect
      const floatX =
        floatAmplitude * Math.sin(time * floatFrequency + node.animPhase);
      const floatY =
        floatAmplitude * Math.cos(time * floatFrequency + node.animPhase);

      const { x, y, color, val, name } = node;
      const size = val || 15;

      // Draw node with glow
      ctx.beginPath();
      ctx.shadowColor = color.replace(")", ", 0.5)").replace("rgb", "rgba");
      ctx.shadowBlur = 15;
      ctx.arc(x + floatX, y + floatY, size / globalScale, 0, 2 * Math.PI);
      ctx.fillStyle = color;
      ctx.fill();

      // Reset shadow and add border
      ctx.shadowBlur = 0;
      ctx.strokeStyle = "rgba(255, 255, 255, 0.8)";
      ctx.lineWidth = 1.5 / globalScale;
      ctx.stroke();

      // Draw label with black text instead of white
      if (name) {
        ctx.font = `${12 / globalScale}px Sans-Serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "black";
        ctx.fillText(name, x + floatX, y + floatY + (size + 10) / globalScale);
      }

      // Store display position for links
      node.displayX = x + floatX;
      node.displayY = y + floatY;
    });

    // Custom link rendering without animated particles
    graphRef.current.linkCanvasObject((link, ctx, globalScale) => {
      const start = link.source;
      const end = link.target;

      // Use display positions if available
      const startX = start.displayX || start.x;
      const startY = start.displayY || start.y;
      const endX = end.displayX || end.x;
      const endY = end.displayY || end.y;

      // Draw link line
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.strokeStyle = "rgba(0, 0, 0, 0.7)";
      ctx.lineWidth = 1.5 / globalScale;
      ctx.stroke();
    });

    // Animation loop
    const fixedTimeStep = 1000 / 60; // 60 fps
    let lastTime = 0;
    let animationFrameId;

    const animate = (time) => {
      if (!lastTime) lastTime = time;
      const deltaTime = time - lastTime;

      if (deltaTime > fixedTimeStep) {
        lastTime = time;

        if (graphRef.current) {
          // Force a redraw by slightly updating the nodes' positions
          const data = graphRef.current.graphData();
          const currentTime = Date.now() / 1000;

          // Update node positions for animation
          data.nodes.forEach((node) => {
            const floatAmplitude = 2;
            const floatFrequency = 0.5;

            // Calculate new floating positions without using fx/fy (which can interfere with force layout)
            const floatX =
              floatAmplitude *
              Math.sin(currentTime * floatFrequency + node.animPhase);
            const floatY =
              floatAmplitude *
              Math.cos(currentTime * floatFrequency + node.animPhase);

            // Store the display positions for custom rendering
            node.displayX = node.x + floatX;
            node.displayY = node.y + floatY;
          });
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    // Start the animation loop
    animationFrameId = requestAnimationFrame(animate);

    // Handle resize
    const handleResize = () => {
      if (graphRef.current && containerRef.current) {
        graphRef.current.width(containerRef.current.clientWidth);
        graphRef.current.height(containerRef.current.clientHeight);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      if (graphRef.current) {
        graphRef.current._destructor();
      }
      cancelAnimationFrame(animationFrameId);
    };
  }, [onNodeClick]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full min-h-[500px] bg-background"
    ></div>
  );
}
