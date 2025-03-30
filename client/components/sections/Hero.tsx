"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, useAnimation, AnimatePresence } from "framer-motion";
import {
  Check,
  ChevronRight,
  Sparkles,
  HeadphonesIcon,
  BrainCircuit,
  Clock,
  ArrowUpRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Hero() {
  const [activeFeature, setActiveFeature] = useState(0);
  const controls = useAnimation();

  // Features with icons and descriptions
  const features = [
    {
      icon: <HeadphonesIcon className="size-4" />,
      title: "Smart Content Generator",
      description: "Curated podcasts tailored to your interests",
    },
    {
      icon: <BrainCircuit className="size-4" />,
      title: "Intelligent Organization",
      description: "AI-powered knowledge mapping",
    },
    {
      icon: <Clock className="size-4" />,
      title: "Collaborative Learning",
      description: "Collect information and learn with friends",
    },
  ];

  // Auto-rotate through features
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Floating elements animation
  const floatingElements = [
    { id: 1, icon: "🎧", x: "10%", y: "15%", size: "40px", delay: 0 },
    { id: 2, icon: "🧠", x: "85%", y: "25%", size: "48px", delay: 0.5 },
    { id: 3, icon: "⏱️", x: "75%", y: "85%", size: "36px", delay: 1 },
    { id: 4, icon: "📚", x: "15%", y: "75%", size: "44px", delay: 1.5 },
    { id: 5, icon: "💡", x: "50%", y: "5%", size: "32px", delay: 2 },
  ];

  return (
    <section className="w-full pt-20 pb-24 md:pt-28 md:pb-32 overflow-hidden relative">
      {/* Creative background with animated gradient mesh */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50 to-white"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-70"></div>

        {/* Animated blobs */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-blue-200/30 blur-[100px]"
          animate={{
            x: [0, 30, 0],
            y: [0, -30, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            repeat: Infinity,
            duration: 15,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/3 right-1/3 w-[400px] h-[400px] rounded-full bg-purple-200/20 blur-[100px]"
          animate={{
            x: [0, -40, 0],
            y: [0, 40, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            repeat: Infinity,
            duration: 20,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Floating elements */}
      {floatingElements.map((element) => (
        <motion.div
          key={element.id}
          className="absolute hidden md:flex z-10"
          style={{
            left: element.x,
            top: element.y,
            fontSize: element.size,
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: [0, 1, 1, 0],
            y: [20, 0, 0, -20],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 15,
            times: [0, 0.1, 0.9, 1],
            repeat: Infinity,
            delay: element.delay,
            ease: "easeInOut",
          }}
        >
          {element.icon}
        </motion.div>
      ))}

      <div className="container px-4 md:px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center max-w-4xl mx-auto mb-16"
        >
          <div className="mb-6 flex justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <Badge
                className="rounded-full px-5 py-2 text-sm font-medium bg-gradient-to-r from-blue-500 to-cyan-400 text-white border-0 shadow-md shadow-blue-200/50"
                variant="secondary"
              >
                <Sparkles className="mr-1.5 h-3.5 w-3.5" />
                <span>Say Goodbye to Doom Scrolling</span>
              </Badge>
            </motion.div>
          </div>

          <motion.h1
            className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7 }}
          >
            <span className="inline bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-violet-600 to-cyan-600">
              BRAINROT
            </span>
            <br />
            <motion.span
              className="text-gray-900 relative inline-block"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              MASTER VAULT
              <motion.div
                className="absolute -bottom-2 left-0 h-1.5 w-full bg-blue-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ delay: 1.2, duration: 0.8 }}
              />
            </motion.span>
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.7 }}
          >
            Transform short-formed videos into productive learning with our{" "}
            <br />
            <span className="text-blue-600 font-medium">
              {" "}
              AI-powered podcast platform
            </span>
            .
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.5 }}
          >
            {/* <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
              <Button
                size="lg"
                className="rounded-full h-14 px-8 text-base bg-gradient-to-r from-blue-600 to-violet-600 text-white border-0 shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30"
              >
                <Link href="/graph-view"> Try Now</Link>
                <ChevronRight className="ml-1 size-4" />
              </Button>
            </motion.div> */}

            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
              <Button
                size="lg"
                variant="outline"
                className="rounded-full h-14 px-8 text-base border-blue-200 text-blue-700 hover:bg-blue-50"
              >
                <Link href="/graph-view">Access Knowledge Vault</Link>

                <ArrowUpRight className="ml-1 size-4" />
              </Button>
            </motion.div>
          </motion.div>

          {/* Animated feature cards */}
          <div className="relative h-32 mb-8">
            <AnimatePresence mode="wait">
              {features.map(
                (feature, index) =>
                  activeFeature === index && (
                    <motion.div
                      key={index}
                      className="absolute inset-0 flex justify-center"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.5 }}
                    >
                      <div className="bg-white rounded-xl shadow-xl p-6 flex items-center gap-4 max-w-md border border-blue-100">
                        <div className="shrink-0 w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                          {feature.icon}
                        </div>
                        <div className="text-left">
                          <h3 className="font-bold text-gray-900">
                            {feature.title}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )
              )}
            </AnimatePresence>

            {/* Feature indicator dots */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex gap-3">
              {features.map((_, idx) => (
                <button
                  key={idx}
                  className="w-2.5 h-2.5 rounded-full transition-colors duration-300"
                  style={{
                    backgroundColor:
                      activeFeature === idx ? "#3b82f6" : "#e2e8f0",
                  }}
                  onClick={() => setActiveFeature(idx)}
                  aria-label={`View feature ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="relative mx-auto max-w-5xl"
        >
          {/* 3D perspective effect for the app screenshot */}
          <motion.div
            whileHover={{
              rotateX: -5,
              rotateY: 5,
              y: -10,
              transition: { duration: 0.4 },
            }}
            className="rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(8,112,240,0.2)] border border-blue-100"
            style={{ perspective: "1000px", transformStyle: "preserve-3d" }}
          >
            <div className="relative">
              {/* Decorative app window header */}
              <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-r from-blue-600 to-violet-600 flex items-center px-4 z-10">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
              </div>

              <Image
                src="demo.png"
                width={1280}
                height={720}
                alt="Brainrot Master Vault Dashboard"
                className="w-full h-auto"
                priority
                style={{ marginTop: "0px" }}
              />

              {/* Reflection overlay effect */}
              <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/10 pointer-events-none"></div>

              {/* Interactive hotspots */}
              <motion.div
                className="absolute top-1/4 left-1/4 w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center cursor-pointer"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-white">
                  <span className="text-xs">1</span>
                </div>
              </motion.div>

              <motion.div
                className="absolute bottom-1/3 right-1/4 w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center cursor-pointer"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.7 }}
              >
                <div className="w-5 h-5 rounded-full bg-purple-500 flex items-center justify-center text-white">
                  <span className="text-xs">2</span>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Decorative elements behind the app */}
          <div className="absolute -bottom-10 -right-10 -z-10 h-[300px] w-[300px] rounded-full bg-gradient-to-br from-blue-400/20 to-cyan-400/20 blur-3xl"></div>
          <div className="absolute -top-10 -left-10 -z-10 h-[300px] w-[300px] rounded-full bg-gradient-to-br from-violet-400/20 to-blue-400/20 blur-3xl"></div>

          {/* Code/script decorative elements */}
          <motion.div
            className="absolute -left-16 top-1/3 bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-lg hidden lg:block"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.5, duration: 0.5 }}
          >
            <div className="font-mono text-xs text-gray-600">
              <div className="text-blue-600">
                function <span className="text-purple-600">enhanceContent</span>
                () {`{`}
              </div>
              <div className="pl-4 text-gray-800">
                return podcast.<span className="text-green-600">filter</span>
                (quality);
              </div>
              <div>{`}`}</div>
            </div>
          </motion.div>

          {/* Stats card */}
          <motion.div
            className="absolute -right-10 md:-right-16 bottom-10 bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-lg"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.8, duration: 0.5 }}
          >
            <div className="text-xs text-gray-600">
              <div className="font-semibold text-gray-800">Time Reclaimed</div>
              <div className="text-green-600 font-bold text-lg">
                +42.5 hrs/month
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
