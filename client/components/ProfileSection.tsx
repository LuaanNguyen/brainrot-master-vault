import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ProfileSection() {
  const [activeTab, setActiveTab] = useState<"team" | "activity">("team");
  const [expanded, setExpanded] = useState(false);

  const activities = [
    {
      user: "Wade Warren",
      action: "added a note to",
      topic: "Neural Networks",
      time: "2h ago",
      avatar: "https://i.pravatar.cc/40?img=2",
    },
    {
      user: "Arlene McCoy",
      action: "connected",
      topic: "Quantum Physics with AI Ethics",
      time: "4h ago",
      avatar: "https://i.pravatar.cc/40?img=3",
    },
    {
      user: "Kristin Watson",
      action: "explored",
      topic: "Climate Science",
      time: "Yesterday",
      avatar: "https://i.pravatar.cc/40?img=4",
    },
  ];

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-lg m-2 pb-4 shadow-sm border border-gray-100 overflow-hidden">
      {/* Profile Card */}
      <div className="px-4 py-3 bg-gradient-to-r from-indigo-50 to-purple-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src="https://i.pravatar.cc/40?img=1"
                alt="Dianne Russell"
                className="w-10 h-10 rounded-full ring-2 ring-white"
              />
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
            </div>
            <div>
              <div className="font-medium text-sm">Dianne Russell</div>
              <div className="text-xs text-gray-500">russel@hey.com</div>
            </div>
          </div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            {expanded ? (
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
                <path d="M18 15l-6-6-6 6"></path>
              </svg>
            ) : (
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
                <path d="M6 9l6 6 6-6"></path>
              </svg>
            )}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Tab Navigation */}
            <div className="flex border-b">
              <button
                onClick={() => setActiveTab("team")}
                className={`flex-1 py-2 text-xs font-medium transition-colors ${
                  activeTab === "team"
                    ? "text-indigo-600 border-b-2 border-indigo-600"
                    : "text-gray-500 hover:text-gray-800"
                }`}
              >
                Team
              </button>
              <button
                onClick={() => setActiveTab("activity")}
                className={`flex-1 py-2 text-xs font-medium transition-colors ${
                  activeTab === "activity"
                    ? "text-indigo-600 border-b-2 border-indigo-600"
                    : "text-gray-500 hover:text-gray-800"
                }`}
              >
                Activity
              </button>
            </div>

            {/* Content */}
            <div className="px-4 py-2">
              {activeTab === "team" ? (
                <div className="space-y-2">
                  {[
                    "Dianne Russell",
                    "Wade Warren",
                    "Arlene McCoy",
                    "Kristin Watson",
                    "Albert Flores",
                  ].map((name, index) => (
                    <div key={name} className="flex items-center py-1.5">
                      <div className="relative">
                        <img
                          src={`https://i.pravatar.cc/40?img=${index + 1}`}
                          alt={name}
                          className="w-7 h-7 rounded-full mr-2"
                        />
                        {index === 0 && (
                          <span className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 border border-white rounded-full"></span>
                        )}
                      </div>
                      <span className="text-xs font-medium">
                        {name}{" "}
                        {index === 0 && (
                          <span className="text-gray-400 font-normal">
                            (You)
                          </span>
                        )}
                      </span>
                      {index === 0 ? (
                        <span className="ml-auto bg-indigo-100 text-indigo-800 text-[10px] px-1.5 py-0.5 rounded-full">
                          Admin
                        </span>
                      ) : (
                        <button className="ml-auto text-gray-400 hover:text-gray-600">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <circle cx="12" cy="12" r="1"></circle>
                            <circle cx="19" cy="12" r="1"></circle>
                            <circle cx="5" cy="12" r="1"></circle>
                          </svg>
                        </button>
                      )}
                    </div>
                  ))}

                  <button className="w-full mt-2 py-1.5 text-xs text-gray-500 hover:text-indigo-600 flex items-center justify-center gap-1 transition-colors">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 5v14M5 12h14"></path>
                    </svg>
                    <span>Invite team member</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-3 pt-1">
                  {activities.map((activity, index) => (
                    <div
                      key={index}
                      className="relative pl-7 pb-3 border-l border-gray-100 ml-2 last:border-0 last:pb-0"
                    >
                      <div className="absolute left-0 top-0 w-5 h-5 rounded-full overflow-hidden ring-2 ring-white">
                        <img
                          src={activity.avatar}
                          alt={activity.user}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="text-xs">
                        <span className="font-medium">{activity.user}</span>{" "}
                        <span className="text-gray-500">{activity.action}</span>{" "}
                        <span className="font-medium text-indigo-600">
                          {activity.topic}
                        </span>
                      </div>
                      <div className="text-[10px] text-gray-400 mt-0.5">
                        {activity.time}
                      </div>
                    </div>
                  ))}

                  <button className="w-full mt-2 py-1.5 text-xs text-indigo-600 flex items-center justify-center gap-1 bg-indigo-50 rounded-md hover:bg-indigo-100 transition-colors">
                    View all activity
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
