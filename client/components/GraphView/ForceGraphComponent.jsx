"use client";

import { useEffect, useRef, useState } from "react";
import ForceGraph from "force-graph";
import * as d3 from "d3";
import { sampleData, categoryVideos } from "../../data/graphData";
import ProfileSection from "../ProfileSection";

export default function ForceGraphComponent({ onNodeClick }) {
  const containerRef = useRef(null);
  const graphRef = useRef(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleNodeClick = (node) => {
    setSelectedCategory(node.id);
    if (onNodeClick) onNodeClick(node);
  };

  const handleClosePanel = () => {
    setSelectedCategory(null);
  };

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
        handleNodeClick(node);
      })
      // Modify the force parameters correctly
      .d3AlphaDecay(0.02)
      .d3VelocityDecay(0.3)
      // Use d3Force to configure the link distance through the link force
      .d3Force("link", d3.forceLink().distance(100).strength(0.3))
      // Adjust the charge force for repulsion
      .d3Force("charge", d3.forceManyBody().strength(-150));

    // Position nodes in a circle
    const nodes = sampleData.nodes;
    const numNodes = nodes.length;
    const angleStep = (2 * Math.PI) / numNodes;
    const radius = 350; // Increased from 250 to 350 for wider initial spacing

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
    <div className="flex flex-col w-full h-full">
      <div
        ref={containerRef}
        className="w-full h-full min-h-[500px] bg-background"
      ></div>

      {selectedCategory && (
        <div className="p-4 bg-white shadow-md rounded-md mt-4 relative">
          <button
            onClick={handleClosePanel}
            className="absolute right-4 top-4 text-gray-500 hover:text-gray-800"
            aria-label="Close panel"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>

          <h2 className="text-xl font-bold mb-3 capitalize">
            {selectedCategory} Videos
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {categoryVideos[selectedCategory] ? (
              categoryVideos[selectedCategory].map((video, index) => (
                <div
                  key={index}
                  className="bg-gray-50 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                  <div className="relative cursor-pointer group">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-xs">
                      {video.duration}
                    </div>
                    <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs">
                      {video.platform}
                    </div>

                    {/* Play button overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <div className="bg-black bg-opacity-50 rounded-full p-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="32"
                          height="32"
                          viewBox="0 0 24 24"
                          fill="white"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polygon points="5 3 19 12 5 21 5 3"></polygon>
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="p-3">
                    <h3 className="font-medium text-sm">{video.title}</h3>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center py-4">
                No videos available for this category.
              </div>
            )}
          </div>

          <div className="mt-6 text-center">
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors duration-200">
              View All {selectedCategory} Videos
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
