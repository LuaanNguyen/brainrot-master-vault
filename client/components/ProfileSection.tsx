import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  ChevronUp,
  Plus,
  MoreHorizontal,
  GitBranch,
  GitCommit,
  GitPullRequest,
  Users,
  Activity,
  Clock,
  Eye,
  Shield,
  Star,
  FileText,
  Video as VideoIcon,
  Image as ImageIcon,
  Link as LinkIcon,
  Youtube,
  PlusCircle,
  RefreshCcw,
  Search,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";

// Mock data for team members
const teamMembers = [
  {
    id: 1,
    name: "Dianne Russell",
    email: "dianne@vault.io",
    role: "Admin",
    status: "online",
    avatar: "https://i.pravatar.cc/150?img=1",
  },
  {
    id: 2,
    name: "Wade Warren",
    email: "wade@vault.io",
    role: "Editor",
    status: "online",
    avatar: "https://i.pravatar.cc/150?img=2",
  },
  {
    id: 3,
    name: "Arlene McCoy",
    email: "arlene@vault.io",
    role: "Viewer",
    status: "offline",
    avatar: "https://i.pravatar.cc/150?img=3",
  },
  {
    id: 4,
    name: "Kristin Watson",
    email: "kristin@vault.io",
    role: "Editor",
    status: "away",
    avatar: "https://i.pravatar.cc/150?img=4",
  },
  {
    id: 5,
    name: "Albert Flores",
    email: "albert@vault.io",
    role: "Viewer",
    status: "offline",
    avatar: "https://i.pravatar.cc/150?img=5",
  },
];

// Define proper types for content type and action
type ContentType = "video" | "image" | "link" | "category" | "relationship";
type Action = "added" | "connected" | "created" | "updated" | "removed";

// Git-like activity feed with content additions
const commitHistory = [
  {
    id: "commit-1",
    user: teamMembers[1],
    action: "added" as Action,
    contentType: "video" as ContentType,
    content: "Deep Learning: Neural Networks Explained",
    category: "Tech",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    branch: "main",
    commitHash: "8f4d2a1",
  },
  {
    id: "commit-2",
    user: teamMembers[3],
    action: "connected" as Action,
    contentType: "relationship" as ContentType,
    content: "Quantum Physics",
    linkedContent: "AI Ethics",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
    branch: "connections",
    commitHash: "3e7f9b5",
    merged: true,
  },
  {
    id: "commit-3",
    user: teamMembers[4],
    action: "added" as Action,
    contentType: "image" as ContentType,
    content: "Climate Change Data Visualization",
    category: "Science",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    branch: "content/science",
    commitHash: "2c8d6f4",
  },
  {
    id: "commit-4",
    user: teamMembers[0],
    action: "created" as Action,
    contentType: "category" as ContentType,
    content: "Neuroscience",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
    branch: "main",
    commitHash: "9a4b7c2",
  },
  {
    id: "commit-5",
    user: teamMembers[2],
    action: "added" as Action,
    contentType: "link" as ContentType,
    content: "The Future of Renewable Energy",
    category: "Science",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
    branch: "content/resources",
    commitHash: "5d7e2f8",
  },
  {
    id: "commit-6",
    user: teamMembers[1],
    action: "updated" as Action,
    contentType: "video" as ContentType,
    content: "Intro to Blockchain Technology",
    category: "Tech",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4), // 4 days ago
    branch: "main",
    commitHash: "1b3c5d7",
  },
  {
    id: "commit-7",
    user: teamMembers[3],
    action: "removed" as Action,
    contentType: "video" as ContentType,
    content: "Outdated Programming Tutorial",
    category: "Tech",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5), // 5 days ago
    branch: "main",
    commitHash: "7e9f1a3",
  },
];

// Helper function to format relative time
function formatRelativeTime(date: Date) {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.round(diffMs / 1000);
  const diffMin = Math.round(diffSec / 60);
  const diffHour = Math.round(diffMin / 60);
  const diffDay = Math.round(diffHour / 24);

  if (diffSec < 60) return `${diffSec} seconds ago`;
  if (diffMin < 60) return `${diffMin} minutes ago`;
  if (diffHour < 24) return `${diffHour} hours ago`;
  if (diffDay === 1) return "Yesterday";
  if (diffDay < 7) return `${diffDay} days ago`;

  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

// Content type icons
const contentTypeIcons: Record<ContentType, React.ReactNode> = {
  video: <VideoIcon className="w-3 h-3" />,
  image: <ImageIcon className="w-3 h-3" />,
  link: <LinkIcon className="w-3 h-3" />,
  category: <FileText className="w-3 h-3" />,
  relationship: <GitBranch className="w-3 h-3" />,
};

// Action colors
const actionColors: Record<Action, string> = {
  added: "bg-green-500",
  connected: "bg-blue-500",
  created: "bg-purple-500",
  updated: "bg-amber-500",
  removed: "bg-red-500",
};

export default function ProfileSection() {
  const [activeTab, setActiveTab] = useState<"team" | "activity" | "history">(
    "history"
  );
  const [expanded, setExpanded] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const timelineRef = useRef<HTMLDivElement>(null);
  const [expandedCommit, setExpandedCommit] = useState<string | null>(null);

  // Auto-scroll to the top of timeline on mount
  useEffect(() => {
    if (timelineRef.current) {
      timelineRef.current.scrollTop = 0;
    }
  }, [activeTab]);

  // Filter commits based on search query
  const filteredCommits = commitHistory.filter(
    (commit) =>
      commit.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      commit.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (commit.category &&
        commit.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="bg-white rounded-xl m-2 shadow-sm  overflow-hidden flex flex-col">
      {/* Profile Header */}
      <div className="px-4 py-3 bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-pink-500/5 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Avatar className="w-9 h-9 border-2 border-white shadow-sm">
                <AvatarImage
                  src={teamMembers[0].avatar}
                  alt={teamMembers[0].name}
                />
                <AvatarFallback>DR</AvatarFallback>
              </Avatar>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></span>
            </div>
            <div>
              <div className="font-medium text-sm flex items-center gap-2">
                {teamMembers[0].name}
                <Badge
                  variant="outline"
                  className="h-5 text-[10px] font-semibold bg-indigo-50 text-indigo-700 border-indigo-100 px-1.5"
                >
                  <Shield className="w-2.5 h-2.5 mr-1" /> Admin
                </Badge>
              </div>
              <div className="text-xs text-gray-500 flex items-center gap-1.5">
                <GitBranch className="w-3 h-3 text-gray-400" />
                <span>main</span>
                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                <span className="text-emerald-600 font-medium flex items-center">
                  <GitCommit className="w-3 h-3 mr-0.5" />
                  98 commits
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full hover:bg-gray-100"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col flex-grow min-h-0"
          >
            {/* Tab Navigation */}
            <div className="flex border-b border-gray-100">
              <button
                onClick={() => setActiveTab("history")}
                className={`flex-1 py-2 text-xs font-medium transition-colors flex items-center justify-center gap-1 ${
                  activeTab === "history"
                    ? "text-indigo-600 border-b-2 border-indigo-600"
                    : "text-gray-500 hover:text-gray-800"
                }`}
              >
                <GitCommit
                  className={`w-3.5 h-3.5 ${
                    activeTab === "history"
                      ? "text-indigo-600"
                      : "text-gray-400"
                  }`}
                />
                History
              </button>
              <button
                onClick={() => setActiveTab("team")}
                className={`flex-1 py-2 text-xs font-medium transition-colors flex items-center justify-center gap-1 ${
                  activeTab === "team"
                    ? "text-indigo-600 border-b-2 border-indigo-600"
                    : "text-gray-500 hover:text-gray-800"
                }`}
              >
                <Users
                  className={`w-3.5 h-3.5 ${
                    activeTab === "team" ? "text-indigo-600" : "text-gray-400"
                  }`}
                />
                Team
              </button>
              <button
                onClick={() => setActiveTab("activity")}
                className={`flex-1 py-2 text-xs font-medium transition-colors flex items-center justify-center gap-1 ${
                  activeTab === "activity"
                    ? "text-indigo-600 border-b-2 border-indigo-600"
                    : "text-gray-500 hover:text-gray-800"
                }`}
              >
                <Activity
                  className={`w-3.5 h-3.5 ${
                    activeTab === "activity"
                      ? "text-indigo-600"
                      : "text-gray-400"
                  }`}
                />
                Activity
              </button>
            </div>

            {/* Content */}
            <div className="flex-grow overflow-hidden">
              {activeTab === "history" && (
                <div className="flex flex-col h-full">
                  {/* Search and filter bar */}
                  <div className="p-2 border-b border-gray-100 flex gap-2">
                    <div className="relative flex-grow">
                      <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                      <Input
                        placeholder="Filter commits..."
                        className="h-8 pl-7 text-xs"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 text-xs gap-1"
                    >
                      <RefreshCcw className="w-3 h-3" />
                      <span className="hidden sm:inline">Refresh</span>
                    </Button>
                  </div>

                  {/* Git timeline visualization */}
                  <div
                    className="flex-grow overflow-y-auto p-2 space-y-1 bg-gray-50/50"
                    style={{ maxHeight: "250px" }}
                    ref={timelineRef}
                  >
                    {filteredCommits.length > 0 ? (
                      filteredCommits.map((commit) => (
                        <div
                          key={commit.id}
                          className="relative bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden hover:border-indigo-100 transition-colors"
                        >
                          {/* Commit header */}
                          <div
                            className="flex items-center gap-2 p-2 cursor-pointer"
                            onClick={() =>
                              setExpandedCommit(
                                expandedCommit === commit.id ? null : commit.id
                              )
                            }
                          >
                            <div
                              className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                                actionColors[commit.action]
                              } text-white`}
                            >
                              {contentTypeIcons[commit.contentType]}
                            </div>

                            <div className="min-w-0 flex-grow">
                              <div className="flex items-baseline gap-1">
                                <span className="font-medium text-xs truncate">
                                  {commit.user.name}
                                </span>
                                <span className="text-gray-500 text-xs">
                                  {commit.action}
                                </span>
                                <span className="font-medium text-xs text-gray-700 truncate">
                                  {commit.content}
                                </span>
                              </div>
                              <div className="flex items-center gap-1.5 text-[10px] text-gray-400">
                                <span>
                                  {formatRelativeTime(commit.timestamp)}
                                </span>
                                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                <span className="flex items-center">
                                  <GitCommit className="w-2.5 h-2.5 mr-0.5" />
                                  {commit.commitHash}
                                </span>
                                {commit.category && (
                                  <>
                                    <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                    <Badge
                                      variant="outline"
                                      className="h-4 text-[9px] font-medium bg-gray-50 border-gray-200 px-1 py-0"
                                    >
                                      {commit.category}
                                    </Badge>
                                  </>
                                )}
                              </div>
                            </div>

                            <div className="flex-shrink-0">
                              <Avatar className="w-6 h-6 border border-gray-100">
                                <AvatarImage
                                  src={commit.user.avatar}
                                  alt={commit.user.name}
                                />
                                <AvatarFallback>
                                  {commit.user.name.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                            </div>
                          </div>

                          {/* Expanded commit details */}
                          <AnimatePresence>
                            {expandedCommit === commit.id && (
                              <motion.div
                                initial={{ height: 0 }}
                                animate={{ height: "auto" }}
                                exit={{ height: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden"
                              >
                                <div className="px-4 py-2 border-t border-gray-100 bg-gray-50/70 text-xs">
                                  <div className="flex items-center gap-2 mb-2">
                                    <div className="flex items-center gap-1 text-[10px] bg-gray-100 px-1.5 py-0.5 rounded">
                                      <GitBranch className="w-3 h-3 text-gray-500" />
                                      <span className="text-gray-600">
                                        {commit.branch}
                                      </span>
                                    </div>
                                    {commit.merged && (
                                      <div className="flex items-center gap-1 text-[10px] bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded">
                                        <GitPullRequest className="w-3 h-3" />
                                        <span>Merged</span>
                                      </div>
                                    )}
                                  </div>

                                  <div className="pl-4 border-l-2 border-gray-200 mb-2">
                                    {commit.contentType === "relationship" ? (
                                      <span className="text-gray-600">
                                        Connected{" "}
                                        <strong>{commit.content}</strong> with{" "}
                                        <strong>{commit.linkedContent}</strong>
                                      </span>
                                    ) : (
                                      <span className="text-gray-600">
                                        {commit.action === "added" &&
                                          "New content added to the knowledge vault"}
                                        {commit.action === "updated" &&
                                          "Content was updated with new information"}
                                        {commit.action === "created" &&
                                          "New category was created"}
                                        {commit.action === "removed" &&
                                          "Content was removed from the vault"}
                                      </span>
                                    )}
                                  </div>

                                  <div className="flex justify-between items-center text-[10px]">
                                    <span className="text-gray-400">
                                      {commit.timestamp.toLocaleString(
                                        "en-US",
                                        {
                                          year: "numeric",
                                          month: "short",
                                          day: "numeric",
                                          hour: "2-digit",
                                          minute: "2-digit",
                                        }
                                      )}
                                    </span>
                                    <div className="flex gap-1">
                                      <TooltipProvider>
                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <Button
                                              variant="ghost"
                                              size="sm"
                                              className="h-6 px-1.5 text-[10px] text-gray-500 gap-1"
                                            >
                                              <Eye className="w-3 h-3" />
                                              View
                                            </Button>
                                          </TooltipTrigger>
                                          <TooltipContent>
                                            <p className="text-xs">
                                              View this content
                                            </p>
                                          </TooltipContent>
                                        </Tooltip>
                                      </TooltipProvider>

                                      <TooltipProvider>
                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <Button
                                              variant="ghost"
                                              size="sm"
                                              className="h-6 px-1.5 text-[10px] text-gray-500 gap-1"
                                            >
                                              <Star className="w-3 h-3" />
                                              Star
                                            </Button>
                                          </TooltipTrigger>
                                          <TooltipContent>
                                            <p className="text-xs">
                                              Star this content
                                            </p>
                                          </TooltipContent>
                                        </Tooltip>
                                      </TooltipProvider>
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ))
                    ) : (
                      <div className="flex flex-col items-center justify-center py-8 text-center">
                        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                          <GitCommit className="w-6 h-6 text-gray-400" />
                        </div>
                        <p className="text-sm text-gray-500 mb-1">
                          No commits found
                        </p>
                        <p className="text-xs text-gray-400">
                          {searchQuery
                            ? `No results for "${searchQuery}"`
                            : "Start adding content to your knowledge vault"}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Action bar */}
                  <div className="p-2 border-t border-gray-100 flex justify-between items-center">
                    <span className="text-xs text-gray-500">
                      {filteredCommits.length}{" "}
                      {filteredCommits.length === 1 ? "commit" : "commits"}
                    </span>
                    <Button className="h-7 text-xs gap-1 px-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                      <PlusCircle className="w-3.5 h-3.5" />
                      Add Content
                    </Button>
                  </div>
                </div>
              )}

              {activeTab === "team" && (
                <div
                  className="p-2 space-y-1 overflow-auto"
                  style={{ maxHeight: "300px" }}
                >
                  {teamMembers.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center py-1.5 px-2 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="relative mr-2">
                        <Avatar className="w-7 h-7 border border-gray-100">
                          <AvatarImage src={member.avatar} alt={member.name} />
                          <AvatarFallback>
                            {member.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span
                          className={`absolute bottom-0 right-0 w-2 h-2 border border-white rounded-full ${
                            member.status === "online"
                              ? "bg-green-500"
                              : member.status === "away"
                              ? "bg-amber-500"
                              : "bg-gray-300"
                          }`}
                        ></span>
                      </div>
                      <div className="flex-grow min-w-0">
                        <div className="flex items-center">
                          <span className="text-xs font-medium truncate">
                            {member.name}
                          </span>
                          {member.id === 1 && (
                            <span className="text-[10px] text-gray-400 ml-1">
                              (You)
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-gray-500 truncate">
                          {member.email}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className={`
                          h-5 text-[9px] px-1.5 font-medium 
                          ${
                            member.role === "Admin"
                              ? "bg-indigo-50 text-indigo-700 border-indigo-100"
                              : member.role === "Editor"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                              : "bg-gray-50 text-gray-700 border-gray-100"
                          }
                        `}
                        >
                          {member.role === "Admin" && (
                            <Shield className="w-2.5 h-2.5 mr-1" />
                          )}
                          {member.role}
                        </Badge>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 rounded-full"
                        >
                          <MoreHorizontal className="w-4 h-4 text-gray-400" />
                        </Button>
                      </div>
                    </div>
                  ))}

                  <Button
                    variant="outline"
                    className="w-full mt-2 h-8 text-xs gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Invite Team Member
                  </Button>
                </div>
              )}

              {activeTab === "activity" && (
                <div
                  className="p-2 overflow-auto"
                  style={{ maxHeight: "300px" }}
                >
                  <div className="space-y-2 pt-1">
                    {commitHistory.slice(0, 5).map((commit, index) => (
                      <div
                        key={index}
                        className="relative pl-7 pb-3 border-l-2 border-gray-100 ml-2 last:border-0 last:pb-0"
                      >
                        <div
                          className={`absolute left-[-5px] top-0 w-4 h-4 rounded-full ${
                            actionColors[commit.action]
                          } text-white flex items-center justify-center`}
                        >
                          {contentTypeIcons[commit.contentType]}
                        </div>
                        <div className="text-xs">
                          <span className="font-medium">
                            {commit.user.name}
                          </span>{" "}
                          <span className="text-gray-500">{commit.action}</span>{" "}
                          <span className="font-medium text-indigo-600">
                            {commit.content}
                          </span>
                          {commit.contentType === "relationship" && (
                            <>
                              {" "}
                              <span className="text-gray-500">with</span>{" "}
                              <span className="font-medium text-purple-600">
                                {commit.linkedContent}
                              </span>
                            </>
                          )}
                        </div>
                        <div className="text-[10px] text-gray-400 mt-0.5 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatRelativeTime(commit.timestamp)}
                          {commit.category && (
                            <>
                              <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                              <span className="bg-gray-100 px-1 rounded text-gray-600">
                                {commit.category}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    ))}

                    <Button className="w-full mt-2 py-1.5 text-xs gap-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                      <Eye className="w-3.5 h-3.5" />
                      View All Activity
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
