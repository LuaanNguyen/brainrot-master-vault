/**
 * This is a simplified declaration file for d3-force to resolve type issues
 */
declare module 'd3-force';

import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, Dimensions, Pressable, FlatList, Animated } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Circle, Line, G, Text as SvgText } from "react-native-svg";
import * as d3 from "d3-force";

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

// Sample video data
const SAMPLE_VIDEOS = [
  { id: '1', title: 'Introduction to React Native', duration: '10:23' },
  { id: '2', title: 'Building Custom Hooks', duration: '15:45' },
  { id: '3', title: 'State Management Best Practices', duration: '8:12' },
  { id: '4', title: 'Performance Optimization Tips', duration: '12:38' },
  { id: '5', title: 'Navigation in React Native', duration: '9:51' },
];

const { width, height } = Dimensions.get("window");

// This is our knowledge graph visualization component
export default function ExploreScreen() {
  const [nodes, setNodes] = useState<NodeType[]>(initialNodes);
  const [links, setLinks] = useState<LinkType[]>(initialLinks);
  const [selectedNode, setSelectedNode] = useState<NodeType | null>(null);
  const [showVideoSheet, setShowVideoSheet] = useState(false);
  
  // Animation for bottom sheet
  const bottomSheetAnim = useRef(new Animated.Value(0)).current;
  
  // Simulation reference
  const simulationRef = useRef<d3.Simulation<NodeType, LinkType> | null>(null);
  
  // Handle node tap
  const handleNodePress = (node: NodeType) => {
    setSelectedNode(selectedNode?.id === node.id ? null : node);
    if (selectedNode?.id !== node.id) {
      setShowVideoSheet(true);
      // Animate bottom sheet to slide up
      Animated.timing(bottomSheetAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };
  
  // Close the video sheet
  const closeVideoSheet = () => {
    // Animate bottom sheet to slide down
    Animated.timing(bottomSheetAnim, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      setShowVideoSheet(false);
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
    
    // Update node positions on each tick
    simulation.on("tick", () => {
      setNodes([...simulation.nodes()]);
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
  }, []);
  
  // Calculate bottom sheet transform based on animation value
  const translateY = bottomSheetAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [height, height / 2],
  });
  
  // Render video item
  const renderVideoItem = ({ item }: { item: { id: string, title: string, duration: string } }) => (
    <View style={styles.videoItem}>
      <View style={styles.videoThumbnail}>
        <Text style={styles.videoPlayIcon}>▶</Text>
      </View>
      <View style={styles.videoInfo}>
        <Text style={styles.videoTitle}>{item.title}</Text>
        <Text style={styles.videoDuration}>{item.duration}</Text>
      </View>
    </View>
  );
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Knowledge Graph</Text>
        <Text style={styles.subtitle}>Explore your interconnected notes</Text>
      </View>
      
      <View style={styles.graphContainer}>
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
            {nodes.map((node) => {
              if (node.x === undefined || node.y === undefined) return null;
              
              const isSelected = selectedNode?.id === node.id;
              
              // Check if the node is connected to the selected node
              const isConnected = selectedNode && links.some(link => {
                const sourceId = typeof link.source === 'number' ? link.source : link.source.id;
                const targetId = typeof link.target === 'number' ? link.target : link.target.id;
                
                return (
                  (sourceId === selectedNode.id && targetId === node.id) ||
                  (targetId === selectedNode.id && sourceId === node.id)
                );
              });
              
              return (
                <React.Fragment key={`node-${node.id}`}>
                  {/* Glow effect for selected/connected nodes */}
                  {(isSelected || isConnected) && (
                    <Circle
                      cx={node.x}
                      cy={node.y}
                      r={node.radius + 6}
                      fill={node.color}
                      opacity={0.3}
                    />
                  )}
                  
                  {/* Node circle */}
                  <Circle
                    cx={node.x}
                    cy={node.y}
                    r={node.radius}
                    fill={node.color}
                    opacity={isSelected || !selectedNode || isConnected ? 1 : 0.4}
                    onPress={() => handleNodePress(node)}
                  />
                  
                  {/* Display node name if selected or connected */}
                  {(isSelected || isConnected) && (
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
            })}
          </G>
        </Svg>
      </View>
      
      {/* Video Bottom Sheet */}
      {showVideoSheet && (
        <Animated.View 
          style={[
            styles.videoSheet,
            { transform: [{ translateY }] }
          ]}
        >
          <View style={styles.videoSheetHeader}>
            <Text style={styles.videoSheetTitle}>
              {selectedNode ? `${selectedNode.name} Videos` : 'Videos'}
            </Text>
            <Pressable 
              style={styles.closeButton} 
              onPress={closeVideoSheet}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </Pressable>
          </View>
          
          <FlatList
            data={SAMPLE_VIDEOS}
            renderItem={renderVideoItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.videosList}
          />
        </Animated.View>
      )}
      
      {/* Node information panel */}
      {/* {selectedNode && (
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
      )} */}
      
      <View style={styles.instructions}>
        <Text style={styles.instructionsText}>
          Tap nodes to explore related videos
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
  // Video sheet styles
  videoSheet: {
    position: "absolute",
    left: 0,
    right: 0,
    height: '50%',
    backgroundColor: "#1F2937",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  videoSheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  videoSheetTitle: {
    fontSize: 18,
    fontFamily: "Inter_600SemiBold",
    color: "#FFFFFF",
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
  videosList: {
    padding: 16,
  },
  videoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 12,
  },
  videoThumbnail: {
    width: 80,
    height: 45,
    backgroundColor: '#000000',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  videoPlayIcon: {
    color: '#FFFFFF',
    fontSize: 20,
  },
  videoInfo: {
    flex: 1,
  },
  videoTitle: {
    fontSize: 14,
    fontFamily: "Inter_500Medium",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  videoDuration: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    color: "#9CA3AF",
  },
}); 