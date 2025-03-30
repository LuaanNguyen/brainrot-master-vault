"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Layers,
  Shield,
  Star,
  Users,
  Zap,
  Sparkles,
  BrainCircuit,
  Workflow,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export default function Features() {
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

  // Add state for tracking which card is being hovered
  const [activeCard, setActiveCard] = useState<number | null>(null);

  const features = [
    {
      title: "Knowledge Vaults",
      description:
        "Create and share collections of your favorite podcast insights with friends to spread valuable knowledge.",
      icon: <Layers className="size-6" />,
      color: "from-violet-500 to-purple-400",
      shadowColor: "shadow-violet-400/20",
    },
    {
      title: "Intelligent Organization",
      description:
        "Navigate content through intuitive list and node representations for better information retention.",
      icon: <Workflow className="size-6" />,
      color: "from-amber-500 to-orange-400",
      shadowColor: "shadow-amber-400/20",
    },
    {
      title: "Smart Filtering",
      description:
        "Filter out unproductive content to focus on valuable, enriching podcasts that make the most of your time.",
      icon: <Shield className="size-6" />,
      color: "from-blue-500 to-cyan-400",
      shadowColor: "shadow-blue-400/20",
    },
    // {
    //   title: "Content Discovery",
    //   description:
    //     "Discover high-quality podcasts through smart recommendations that prioritize depth over shallow entertainment.",
    //   icon: <Sparkles className="size-6" />,
    //   color: "from-emerald-500 to-green-400",
    //   shadowColor: "shadow-emerald-400/20",
    // },
    // {
    //   title: "Friend Competition",
    //   description:
    //     "Stay motivated with friendly competition features that encourage productive listening habits.",
    //   icon: <Users className="size-6" />,
    //   color: "from-pink-500 to-rose-400",
    //   shadowColor: "shadow-pink-400/20",
    // },
    // {
    //   title: "Enhanced Learning",
    //   description:
    //     "Leverage AI-powered tools to enhance comprehension and retention of complex topics from podcasts.",
    //   icon: <BrainCircuit className="size-6" />,
    //   color: "from-red-500 to-orange-400",
    //   shadowColor: "shadow-red-400/20",
    // },
  ];

  return (
    <section
      id="features"
      className="w-full py-20 md:py-32 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden"
    >
      {/* Decorative background elements */}
      <div className="absolute inset-0 -z-10 opacity-20">
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-blue-200 blur-3xl"></div>
        <div className="absolute top-1/2 -right-24 w-80 h-80 rounded-full bg-purple-200 blur-3xl"></div>
        <div className="absolute -bottom-24 left-1/3 w-64 h-64 rounded-full bg-amber-200 blur-3xl"></div>
      </div>

      <div className="container px-4 md:px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center justify-center space-y-4 text-center mb-16"
        >
          <Badge
            className="rounded-full px-4 py-1.5 text-sm font-medium bg-blue-100 text-blue-800 border-none"
            variant="secondary"
          >
            There's a Better Way
          </Badge>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-violet-600">
            Replace Doom Scrolling with Deep Learning
          </h2>
          <p className="max-w-[800px] text-slate-600 md:text-xl">
            Our podcast platform enables productive multitasking during daily
            activities, helping you reclaim hours spent on shallow content for
            meaningful knowledge acquisition.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((feature, i) => (
            <motion.div
              key={i}
              variants={item}
              onHoverStart={() => setActiveCard(i)}
              onHoverEnd={() => setActiveCard(null)}
              style={{ perspective: "1000px" }}
            >
              <motion.div
                animate={{
                  rotateX: activeCard === i ? 5 : 0,
                  rotateY: activeCard === i ? 5 : 0,
                  z: activeCard === i ? 25 : 0,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
                whileHover={{ scale: 1.05 }}
                className={`h-full overflow-hidden rounded-xl bg-white transition-all hover:shadow-xl ${feature.shadowColor}`}
                style={{ transformStyle: "preserve-3d" }}
              >
                <CardContent className="p-8 flex flex-col h-full">
                  {/* 3D perspective floating gradient icon */}
                  <motion.div
                    animate={{
                      y: activeCard === i ? -10 : 0,
                      rotateZ: activeCard === i ? 5 : 0,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                    }}
                    className={`size-16 rounded-full bg-gradient-to-br ${feature.color} text-white flex items-center justify-center mb-6 shadow-lg`}
                    style={{
                      transformStyle: "preserve-3d",
                      transform: "translateZ(20px)",
                    }}
                  >
                    {feature.icon}
                  </motion.div>

                  {/* Content with 3D effect */}
                  <motion.div
                    style={{
                      transformStyle: "preserve-3d",
                      transform: "translateZ(10px)",
                    }}
                  >
                    <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                    <p className="text-slate-600 text-lg">
                      {feature.description}
                    </p>
                  </motion.div>

                  {/* Decorative element */}
                  <motion.div
                    animate={{
                      rotate: activeCard === i ? 45 : 0,
                      scale: activeCard === i ? 1.2 : 1,
                    }}
                    className="absolute bottom-4 right-4 w-20 h-20 rounded-full bg-gradient-to-br from-gray-50 to-gray-100 opacity-30"
                  />
                </CardContent>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* Added a floating call-to-action */}
      </div>
    </section>
  );
}
