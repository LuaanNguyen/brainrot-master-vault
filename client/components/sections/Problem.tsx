"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Clock,
  BrainCircuit,
  AlertTriangle,
  Activity,
  TrendingDown,
  Smartphone,
  TimerOff,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Problem() {
  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  // Chart data for time spent
  const timeData = [
    { platform: "TikTok", hours: 2, color: "#ff0050" },
    { platform: "Instagram Reels", hours: 1.9, color: "#833AB4" },
    { platform: "YouTube Shorts", hours: 1.1, color: "#FF0000" },
    { platform: "Facebook Shorts", hours: 1, color: "	#1877F2" },
  ];

  // Impact metrics
  const negativeImpacts = [
    {
      title: "Reduced Attention Span",
      value: "-48%",
      description: "Average attention span reduction due to short-form content",
      icon: <BrainCircuit className="h-8 w-8 text-red-500" />,
    },
    {
      title: "Time Wasted",
      value: "550+ hrs",
      description: "Average annual hours spent on mindless scrolling",
      icon: <Clock className="h-8 w-8 text-amber-500" />,
    },
    {
      title: "Mental Health",
      value: "+32%",
      description: "Increase in anxiety and depression symptoms",
      icon: <Activity className="h-8 w-8 text-pink-500" />,
    },
    {
      title: "Productivity",
      value: "-27%",
      description: "Drop in productivity and task completion",
      icon: <TrendingDown className="h-8 w-8 text-purple-500" />,
    },
  ];

  // Chart for daily interruptions
  const interruptionData = [
    { time: "Morning", count: 23 },
    { time: "Afternoon", count: 37 },
    { time: "Evening", count: 42 },
    { time: "Night", count: 18 },
  ];

  const maxInterruptions = Math.max(...interruptionData.map((d) => d.count));

  return (
    <section
      className="w-full py-20 md:py-32 bg-gradient-to-b from-white to-gray-50"
      id="problem"
    >
      <div className="container px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center justify-center space-y-4 text-center mb-12"
        >
          <Badge
            className="rounded-full px-4 py-1.5 text-sm font-medium bg-red-100 text-red-800"
            variant="outline"
          >
            The Attention Crisis
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-purple-600">
            The Hidden Cost of Doom Scrolling
          </h2>
          <p className="max-w-[800px] text-slate-700 md:text-lg">
            Short-form content is engineered to capture your attention through
            instant gratification, leading to hours of wasted time and
            diminished cognitive capacity.
          </p>
        </motion.div>

        <Tabs defaultValue="stats" className="w-full max-w-4xl mx-auto">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="stats">Time Impact</TabsTrigger>
            <TabsTrigger value="brain">Cognitive Effects</TabsTrigger>
            <TabsTrigger value="habits">Habit Formation</TabsTrigger>
          </TabsList>

          <TabsContent value="stats" className="space-y-8">
            <motion.div
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid gap-8 md:grid-cols-2"
            >
              {/* Time Chart */}
              <motion.div variants={item} className="col-span-2">
                <Card className="overflow-hidden shadow-lg border-0">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-4">Daily Time Sink</h3>
                    <p className="text-sm text-slate-500 mb-6">
                      Average hours a person spends daily on short-form content
                      platforms
                    </p>
                    <div className="h-80 w-full flex items-end justify-around gap-4 pt-6">
                      {timeData.map((item, i) => (
                        <div key={i} className="flex flex-col items-center">
                          <div
                            className="w-16 md:w-24 rounded-t-lg transition-all duration-1000 ease-in-out"
                            style={{
                              height: `${(item.hours / 2) * 200}px`,
                              backgroundColor: item.color,
                              boxShadow: `0 4px 12px ${item.color}80`,
                            }}
                          />
                          <div className="text-sm font-medium mt-2">
                            {item.platform}
                          </div>
                          <div className="text-sm text-slate-500">
                            {item.hours} hrs
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Interruption Chart */}
              <motion.div variants={item}>
                <Card className="h-full overflow-hidden shadow-lg border-0">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <Smartphone className="h-5 w-5 mr-2 text-indigo-500" />
                      <h3 className="text-xl font-bold">Daily App Opens</h3>
                    </div>
                    <p className="text-sm text-slate-500 mb-4">
                      Average of 19 TikTok opens per day
                    </p>

                    <div className="space-y-3">
                      {interruptionData.map((item, i) => (
                        <div key={i} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>{item.time}</span>
                            <span className="font-medium">{item.count}×</span>
                          </div>
                          <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              whileInView={{
                                width: `${
                                  (item.count / maxInterruptions) * 100
                                }%`,
                              }}
                              transition={{ duration: 1, delay: i * 0.1 }}
                              className="h-full rounded-full bg-indigo-500"
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="flex items-center">
                        <TimerOff className="h-4 w-4 mr-2 text-orange-500" />
                        <span className="text-sm">
                          Interrupts focus every ~45 minutes
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Annual wasted time */}
              <motion.div variants={item}>
                <Card className="h-full overflow-hidden shadow-lg border-0 bg-gradient-to-br from-red-50 to-orange-50">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-2">Annual Time Cost</h3>
                    <div className="flex items-center justify-center my-6">
                      <div className="text-center">
                        <div className="text-5xl font-bold text-red-600">
                          2,439+
                        </div>
                        <div className="text-sm text-slate-600 mt-2">
                          Hours spent annually
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3 text-sm text-slate-600">
                      <div className="flex items-center">
                        <div className="h-2 w-2 rounded-full bg-teal-500 mr-2"></div>
                        <span>Equivalent to 101 full days</span>
                      </div>
                      <div className="flex items-center">
                        <div className="h-2 w-2 rounded-full bg-blue-500 mr-2"></div>
                        <span>Could read 16+ books</span>
                      </div>
                      <div className="flex items-center">
                        <div className="h-2 w-2 rounded-full bg-purple-500 mr-2"></div>
                        <span>Learn a new language to fluency</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </TabsContent>

          <TabsContent value="brain">
            <motion.div
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid gap-6 md:grid-cols-2"
            >
              <motion.div variants={item} className="col-span-2">
                <Card className="overflow-hidden shadow-lg border-0">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-4">
                      The Cognitive Impact
                    </h3>
                    <p className="text-slate-600 mb-6">
                      Short-form content drastically alters your brain's reward
                      pathways and attention mechanisms
                    </p>

                    <div className="relative h-[250px] w-full bg-[url('/brain-diagram.png')] bg-contain bg-center bg-no-repeat">
                      {/* Brain diagram would be displayed here in a real implementation */}
                      <div className="absolute top-[20%] left-[30%] h-6 w-6 rounded-full bg-red-500/20 animate-ping"></div>
                      <div className="absolute top-[50%] right-[25%] h-5 w-5 rounded-full bg-blue-500/20 animate-ping"></div>
                      <div className="absolute bottom-[30%] left-[40%] h-4 w-4 rounded-full bg-green-500/20 animate-ping"></div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mt-8">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-red-500">
                          -42%
                        </div>
                        <div className="text-xs text-slate-500 mt-1">
                          Deep focus ability
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-amber-500">
                          -37%
                        </div>
                        <div className="text-xs text-slate-500 mt-1">
                          Information retention
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-500">
                          +65%
                        </div>
                        <div className="text-xs text-slate-500 mt-1">
                          Dopamine dependency
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {negativeImpacts.map((impact, i) => (
                <motion.div key={i} variants={item}>
                  <Card className="h-full overflow-hidden shadow-lg border-0">
                    <CardContent className="p-6">
                      <div className="flex flex-col h-full">
                        <div className="mb-2">{impact.icon}</div>
                        <h3 className="text-lg font-bold mt-2">
                          {impact.title}
                        </h3>
                        <div className="text-3xl font-bold my-4">
                          {impact.value}
                        </div>
                        <p className="text-sm text-slate-500 mt-auto">
                          {impact.description}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </TabsContent>

          <TabsContent value="habits">
            <Card className="overflow-hidden shadow-lg border-0">
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-bold mb-4">The Habit Loop</h3>
                    <p className="text-slate-600 mb-6">
                      Apps like TikTok intentionally create addictive loops
                      through variable rewards
                    </p>

                    <div className="relative w-full h-[300px]">
                      {/* Circular habit loop diagram */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="relative w-[250px] h-[250px]">
                          <motion.div
                            initial={{ rotate: 0 }}
                            animate={{ rotate: 360 }}
                            transition={{
                              duration: 20,
                              repeat: Infinity,
                              ease: "linear",
                            }}
                            className="absolute inset-0 border-2 border-dashed border-gray-200 rounded-full"
                          />

                          <motion.div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-500 text-white p-3 rounded-full">
                            <AlertTriangle className="h-6 w-6" />
                          </motion.div>

                          <motion.div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 bg-red-500 text-white p-3 rounded-full">
                            <Activity className="h-6 w-6" />
                          </motion.div>

                          <motion.div className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 bg-amber-500 text-white p-3 rounded-full">
                            <BrainCircuit className="h-6 w-6" />
                          </motion.div>

                          <motion.div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 bg-green-500 text-white p-3 rounded-full">
                            <Clock className="h-6 w-6" />
                          </motion.div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-medium text-blue-700 mb-2">
                        Trigger: Boredom & FOMO
                      </h4>
                      <p className="text-sm text-slate-600">
                        Notifications and fear of missing out create powerful
                        psychological triggers
                      </p>
                    </div>

                    <div className="p-4 bg-red-50 rounded-lg">
                      <h4 className="font-medium text-red-700 mb-2">
                        Action: Endless Scrolling
                      </h4>
                      <p className="text-sm text-slate-600">
                        The simple action of swiping up delivers immediate
                        content without effort
                      </p>
                    </div>

                    <div className="p-4 bg-amber-50 rounded-lg">
                      <h4 className="font-medium text-amber-700 mb-2">
                        Variable Reward
                      </h4>
                      <p className="text-sm text-slate-600">
                        Unpredictable viral content creates a slot machine
                        effect that's highly addictive
                      </p>
                    </div>

                    <div className="p-4 bg-green-50 rounded-lg">
                      <h4 className="font-medium text-green-700 mb-2">
                        Investment: Time & Data
                      </h4>
                      <p className="text-sm text-slate-600">
                        As you invest more time, algorithms learn your
                        preferences creating a stronger loop
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
