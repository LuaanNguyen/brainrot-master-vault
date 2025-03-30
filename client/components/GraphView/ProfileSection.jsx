import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PlusCircle, RefreshCcw, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import AddContentModal from "../AddContentModal";

// Mock data for team members
const teamMembers = [
  {
    id: 1,
    name: "Your Name",
    email: "you@example.com",
    role: "Admin",
    status: "online",
    avatar: "https://i.pravatar.cc/150?img=1",
  },
  // Add more team members if needed
];

// Mock commit history
const commitHistory = [];

export default function ProfileSection() {
  const [activeTab, setActiveTab] = useState("history");
  const [expanded, setExpanded] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const timelineRef = useRef(null);
  const [expandedCommit, setExpandedCommit] = useState(null);

  const [showModal, setShowModal] = useState(false);

  // Filter commits based on search query
  const filteredCommits = commitHistory.filter(
    (commit) =>
      commit.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (commit.category &&
        commit.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleContentAdded = (content) => {
    console.log("Content added:", content);
    const newCommit = {
      id: `commit-${Date.now()}`,
      user: teamMembers[0],
      action: "added",
      contentType: "video",
      content: content.title,
      category: content.source === "youtube" ? "Videos" : "TikTok",
      timestamp: new Date(),
      branch: "main",
      commitHash: content.id.substring(0, 7),
    };

    commitHistory.unshift(newCommit);
    console.log("Updated commit history:", commitHistory);

    // Force a refresh
    setSearchQuery(searchQuery + " ");
  };

  return (
    <div className="bg-white rounded-xl m-2 shadow-sm overflow-hidden flex flex-col">
      <div className="px-4 py-3 bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-pink-500/5 border-b border-gray-100">
        <h3 className="text-sm font-medium">Profile Section</h3>
      </div>

      <div className="p-2 border-t border-gray-100 flex justify-between items-center">
        <span className="text-xs text-gray-500">
          {filteredCommits.length}{" "}
          {filteredCommits.length === 1 ? "commit" : "commits"}
        </span>
        <Button
          className="h-7 text-xs gap-1 px-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
          onClick={() => {
            console.log("hello");
            setShowModal(true);
          }}
        >
          <PlusCircle className="w-3.5 h-3.5" />
          Add Content
        </Button>
      </div>

      <AddContentModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onContentAdded={handleContentAdded}
      />
    </div>
  );
}
