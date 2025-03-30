"use client";

import { useEffect, useRef, useState } from "react";
import ForceGraph from "force-graph";
import * as d3 from "d3";
import { sampleData, categoryVideos } from "../../data/graphData";

export default function ForceGraphComponent({ onNodeClick }) {
  const containerRef = useRef(null);
  const graphRef = useRef(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [infoExpanded, setInfoExpanded] = useState(false);

  const handleNodeClick = (node) => {
    if (onNodeClick) onNodeClick(node);
  };

  const handleClosePanel = () => {
    setSelectedCategory(null);
  };

  const toggleInfoPanel = () => {
    setInfoExpanded(!infoExpanded);
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
    <div className="flex flex-col w-full h-full relative">
      <div
        ref={containerRef}
        className="w-full h-full min-h-[500px] bg-background"
      ></div>

      <div className="absolute top-2 right-2 z-10">
        {infoExpanded ? (
          <div className="bg-white p-4 shadow-md rounded-lg w-64 relative">
            <button
              onClick={toggleInfoPanel}
              className="absolute right-3 top-3 text-gray-500 hover:text-gray-800"
              aria-label="Collapse panel"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
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

            <h2 className="text-xl font-semibold mb-4 pr-6">Graph Info</h2>
            <p className="text-muted-foreground text-sm mb-6">
              Click on nodes to explore the knowledge graph.
            </p>
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium">Hot Topics</h3>
                <ul className="mt-2 space-y-1 text-sm">
                  {Array.isArray(sampleData.nodes) &&
                    sampleData.nodes.map((category) => (
                      <li key={category.id} className="flex items-center gap-2">
                        <span
                          className={`w-2 h-2 rounded-full`}
                          style={{ backgroundColor: category.color }}
                        ></span>
                        <span>{category.name}</span>
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={toggleInfoPanel}
            className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors"
            aria-label="Show info panel"
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
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
