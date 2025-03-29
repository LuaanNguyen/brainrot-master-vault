/**
 * This is a simplified declaration file for d3-force to resolve type issues
 */
declare module 'd3-force';

import React, { useEffect, useRef, useState, useCallback } from "react";
import { View, Text, StyleSheet, Dimensions, Pressable, GestureResponderEvent } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Circle, Line, G, Text as SvgText } from "react-native-svg";
import { PanGestureHandler, PinchGestureHandler, State } from "react-native-gesture-handler";
import * as d3 from "d3-force";
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
  useAnimatedReaction,
} from "react-native-reanimated";

// Define custom node type
interface NodeType {
  id: number;
  name: string;
  category: string;
  color: string;
  radius: number;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  fx?: number | null;
  fy?: number | null;
  index?: number;
}

// Define custom link type
interface LinkType {
  source: number | NodeType;
  target: number | NodeType;
  index?: number;
}

// Define node categories and their colors
const CATEGORIES = {
  Tech: "#3B82F6", // Blue
  Health: "#10B981", // Green
  Gym: "#F59E0B", // Amber
  Nutrition: "#EC4899", // Pink
  Finance: "#8B5CF6", // Purple
  Books: "#EF4444", // Red
  Travel: "#06B6D4", // Cyan
  Study: "#6366F1", // Indigo
  Projects: "#F97316", // Orange
  Ideas: "#A855F7", // Purple
};

// Sample nodes data
const initialNodes: NodeType[] = Object.entries(CATEGORIES).map(([category, color], index) => ({
  id: index,
  name: category,
  category,
  color,
  radius: category === "Study" ? 22 : 18, // Make Study node slightly larger
}));

// Sample links between nodes
const initialLinks: LinkType[] = [
  { source: 0, target: 7 }, // Tech to Study
  { source: 1, target: 2 }, // Health to Gym
  { source: 1, target: 3 }, // Health to Nutrition
  { source: 4, target: 7 }, // Finance to Study
  { source: 5, target: 7 }, // Books to Study
  { source: 6, target: 9 }, // Travel to Ideas
  { source: 7, target: 8 }, // Study to Projects
  { source: 8, target: 9 }, // Projects to Ideas
  { source: 0, target: 8 }, // Tech to Projects
  { source: 2, target: 3 }, // Gym to Nutrition
  { source: 5, target: 9 }, // Books to Ideas
];

const { width, height } = Dimensions.get("window");

// This is our knowledge graph visualization component
export default function ExploreScreen() {
  const [nodes, setNodes] = useState<NodeType[]>(initialNodes);
  const [links, setLinks] = useState<LinkType[]>(initialLinks);
  const [selectedNode, setSelectedNode] = useState<NodeType | null>(null);
  const [draggingNode, setDraggingNode] = useState<number | null>(null);
  
  // For gestures and animations
  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  
  // Simulation reference to stop/start force
  const simulationRef = useRef<d3.Simulation<NodeType, LinkType> | null>(null);
  
  // Function to update node position during dragging
  // This sets a fixed position (fx, fy) on the node that the simulation respects
  const updateNodePosition = (nodeId: number, x: number, y: number) => {
    setNodes(prevNodes => 
      prevNodes.map(node => 
        node.id === nodeId 
          ? { ...node, x, y, fx: x, fy: y } // Set fixed position so the simulation doesn't move it
          : node
      )
    );
  };
  
  // Function to release node when drag is finished
  // This removes the fixed position constraints so the simulation can take over again
  const releaseNode = () => {
    if (draggingNode === null) return;
    
    setNodes(prevNodes => 
      prevNodes.map(node => 
        node.id === draggingNode 
          ? { ...node, fx: null, fy: null } // Release fixed position
          : node
      )
    );
    
    // Restart simulation briefly for a nice animation effect
    const simulation = simulationRef.current;
    if (simulation) {
      simulation.alpha(0.1).restart();
      setTimeout(() => simulation.alpha(0).stop(), 500);
    }
    
    setDraggingNode(null);
  };
  
  // Handle node press/tap
  const handleNodePress = (node: NodeType) => {
    // Only select node if we weren't dragging
    if (draggingNode === null) {
      setSelectedNode(selectedNode?.id === node.id ? null : node);
      
      // Restart simulation briefly for animation
      const simulation = simulationRef.current;
      if (simulation) {
        simulation.alpha(0.1).restart();
        setTimeout(() => simulation.stop(), 500);
      }
    }
  };
  
  // Start dragging a node
  const handleStartDrag = (nodeId: number) => {
    setDraggingNode(nodeId);
    
    // Pause simulation while dragging
    const simulation = simulationRef.current;
    if (simulation) {
      simulation.stop();
    }
  };
  
  // Create a new drag handler for each node to avoid context issues
  const createNodeDragHandler = (nodeId: number, nodeX: number, nodeY: number) => {
    return useAnimatedGestureHandler({
      onStart: () => {
        runOnJS(handleStartDrag)(nodeId);
      },
      onActive: (event) => {
        // Calculate the new position
        const newX = nodeX + event.translationX / scale.value;
        const newY = nodeY + event.translationY / scale.value;
        
        // Update node position
        runOnJS(updateNodePosition)(nodeId, newX, newY);
      },
      onEnd: () => {
        runOnJS(releaseNode)();
      },
    });
  };
  
  useEffect(() => {
    // Create force simulation
    const simulation = d3
      .forceSimulation<NodeType>()
      .force(
        "link",
        d3.forceLink<NodeType, LinkType>().id((d) => d.id).distance(100)
      )
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide<NodeType>().radius(d => d.radius + 10));
    
    simulationRef.current = simulation;
    
    // Set nodes and links for simulation
    simulation.nodes(nodes);
    const linkForce = simulation.force("link") as d3.ForceLink<NodeType, LinkType>;
    if (linkForce) {
      linkForce.links(links);
    }
    
    // Update node positions on each tick (only if not dragging)
    simulation.on("tick", () => {
      if (draggingNode === null) {
        setNodes([...simulation.nodes()]);
      }
    });
    
    // Run simulation for some time then stop for performance
    simulation.alpha(1).restart();
    
    const timer = setTimeout(() => {
      simulation.alpha(0).stop();
    }, 2000);
    
    return () => {
      clearTimeout(timer);
      simulation.stop();
    };
  }, [draggingNode]);
  
  // Pinch gesture handler for zoom
  const pinchHandler = useAnimatedGestureHandler({
    onActive: (event: any) => {
      scale.value = event.scale;
    },
    onEnd: () => {
      if (scale.value < 0.5) {
        scale.value = withSpring(0.5);
      } else if (scale.value > 3) {
        scale.value = withSpring(3);
      }
    },
  });
  
  // Pan gesture handler for moving around
  const panHandler = useAnimatedGestureHandler({
    onStart: (_, ctx: any) => {
      ctx.startX = translateX.value;
      ctx.startY = translateY.value;
    },
    onActive: (event: any, ctx: any) => {
      translateX.value = ctx.startX + event.translationX;
      translateY.value = ctx.startY + event.translationY;
    },
  });
  
  // Animated style for graph container
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { scale: scale.value },
      ],
    };
  });
  
  // Add useCallback to memoize the node render function
  const renderNode = useCallback((node: NodeType) => {
    if (node.x === undefined || node.y === undefined) return null;
    
    const isSelected = selectedNode?.id === node.id;
    const isDragging = draggingNode === node.id;
    
    // Check if the node is connected to the selected node
    const isConnected = selectedNode && links.some(link => {
      const sourceId = typeof link.source === 'number' ? link.source : link.source.id;
      const targetId = typeof link.target === 'number' ? link.target : link.target.id;
      
      return (
        (sourceId === selectedNode.id && targetId === node.id) ||
        (targetId === selectedNode.id && sourceId === node.id)
      );
    });
    
    // Create a unique drag handler for this node with its current position
    const nodeHandler = createNodeDragHandler(node.id, node.x, node.y);
    
    return (
      <React.Fragment key={`node-${node.id}`}>
        {/* Glow effect for selected/connected/dragging nodes */}
        {(isSelected || isConnected || isDragging) && (
          <Circle
            cx={node.x}
            cy={node.y}
            r={node.radius + (isDragging ? 10 : 6)}
            fill={node.color}
            opacity={isDragging ? 0.4 : 0.3}
          />
        )}
        
        {/* Node circle with drag gesture handler */}
        <PanGestureHandler
          onGestureEvent={nodeHandler}
          shouldCancelWhenOutside={false}
        >
          <Animated.View>
            <Circle
              cx={node.x}
              cy={node.y}
              r={node.radius}
              fill={node.color}
              opacity={isSelected || !selectedNode || isConnected || isDragging ? 1 : 0.4}
              onPress={() => runOnJS(handleNodePress)(node)}
            />
          </Animated.View>
        </PanGestureHandler>
        
        {/* Display node name if selected or connected or being dragged */}
        {(isSelected || isConnected || isDragging) && (
          <G x={node.x} y={node.y + node.radius + 15}>
            <SvgText
              x={0}
              y={0}
              textAnchor="middle"
              fill="#FFFFFF"
              fontWeight="bold"
              fontSize={12}
            >
              {node.name}
            </SvgText>
          </G>
        )}
      </React.Fragment>
    );
  }, [selectedNode, draggingNode, links, handleNodePress, createNodeDragHandler, scale.value]);
  
  return (
    <SafeAreaView 
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Knowledge Graph</Text>
        <Text style={styles.subtitle}>Explore your interconnected notes</Text>
      </View>
      
      <PinchGestureHandler
        onGestureEvent={pinchHandler as any}
        onHandlerStateChange={({ nativeEvent }) => {
          if (nativeEvent.state === State.END) {
            // Additional logic if needed
          }
        }}
        enabled={draggingNode === null} // Disable pinch while dragging
      >
        <Animated.View style={styles.graphContainer}>
          <PanGestureHandler 
            onGestureEvent={panHandler as any}
            enabled={draggingNode === null} // Disable pan while dragging
          >
            <Animated.View style={[styles.graphView, animatedStyle]}>
              <Svg width={width} height={height * 0.8}>
                <G>
                  {/* Draw links */}
                  {links.map((link, i) => {
                    const sourceId = typeof link.source === 'number' ? link.source : link.source.id;
                    const targetId = typeof link.target === 'number' ? link.target : link.target.id;
                    
                    const source = nodes.find(n => n.id === sourceId);
                    const target = nodes.find(n => n.id === targetId);
                    
                    if (!source || !target || source.x === undefined || source.y === undefined || 
                        target.x === undefined || target.y === undefined) return null;
                    
                    const isHighlighted = 
                      selectedNode && 
                      (selectedNode.id === source.id || selectedNode.id === target.id);
                      
                    return (
                      <Line
                        key={`link-${i}`}
                        x1={source.x}
                        y1={source.y}
                        x2={target.x}
                        y2={target.y}
                        stroke={isHighlighted ? "#FFFFFF" : "#444444"}
                        strokeWidth={isHighlighted ? 2 : 1}
                        strokeOpacity={isHighlighted ? 0.9 : 0.5}
                      />
                    );
                  })}
                  
                  {/* Draw nodes */}
                  {nodes.map(renderNode)}
                </G>
              </Svg>
            </Animated.View>
          </PanGestureHandler>
        </Animated.View>
      </PinchGestureHandler>
      
      {/* Node information panel */}
      {selectedNode && (
        <View style={styles.infoPanel}>
          <Text style={styles.infoPanelTitle}>{selectedNode.name}</Text>
          <Text style={styles.infoPanelSubtitle}>
            Connected to {
              links.filter(link => {
                const sourceId = typeof link.source === 'number' ? link.source : link.source.id;
                const targetId = typeof link.target === 'number' ? link.target : link.target.id;
                
                return sourceId === selectedNode.id || targetId === selectedNode.id;
              }).length
            } topics
          </Text>
          <Pressable 
            style={styles.button}
            onPress={() => console.log(`Explore ${selectedNode.name} notes`)}
          >
            <Text style={styles.buttonText}>Explore Notes</Text>
          </Pressable>
        </View>
      )}
      
      <View style={styles.instructions}>
        <Text style={styles.instructionsText}>
          Pinch to zoom • Drag to move • Tap nodes to explore • Press and drag nodes to rearrange
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111111",
  },
  header: {
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontFamily: "Inter_700Bold",
    marginBottom: 8,
    color: "#FFFFFF",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    fontFamily: "Inter_400Regular",
    color: "#9CA3AF",
    textAlign: "center",
    marginBottom: 10,
  },
  graphContainer: {
    flex: 1,
    overflow: "hidden",
  },
  graphView: {
    flex: 1,
  },
  infoPanel: {
    position: "absolute",
    bottom: 80,
    left: 20,
    right: 20,
    backgroundColor: "rgba(31, 41, 55, 0.9)",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
  },
  infoPanelTitle: {
    fontSize: 20,
    fontFamily: "Inter_700Bold",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  infoPanelSubtitle: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    color: "#9CA3AF",
    marginBottom: 16,
  },
  button: {
    backgroundColor: "#3B82F6",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    width: "100%",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
    textAlign: "center",
  },
  instructions: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  instructionsText: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    color: "#6B7280",
    textAlign: "center",
  },
}); 