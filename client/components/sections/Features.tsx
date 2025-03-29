"use client";

import React from "react";
import { motion } from "framer-motion";
import { BarChart, Layers, Shield, Star, Users, Zap } from "lucide-react";
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

  const features = [
    {
      title: "Smart Filtering",
      description:
        "Filter out unproductive content to focus on valuable, enriching podcasts that make the most of your time.",
      icon: <Shield className="size-5" />,
    },
    {
      title: "Knowledge Vaults",
      description:
        "Create and share collections of your favorite podcast insights with friends to spread valuable knowledge.",
      icon: <Layers className="size-5" />,
    },
    {
      title: "Intelligent Organization",
      description:
        "Navigate content through intuitive list and node representations for better information retention.",
      icon: <BarChart className="size-5" />,
    },
  ];

  return (
    <section id="features" className="w-full py-20 md:py-32">
      <div className="container px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center justify-center space-y-4 text-center mb-12"
        >
          <Badge
            className="rounded-full px-4 py-1.5 text-sm font-medium"
            variant="secondary"
          >
            Features
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Replace Doom Scrolling with Deep Learning
          </h2>
          <p className="max-w-[800px] text-muted-foreground md:text-lg">
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
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((feature, i) => (
            <motion.div key={i} variants={item}>
              <Card className="h-full overflow-hidden border-border/40 bg-gradient-to-b from-background to-muted/10 backdrop-blur transition-all hover:shadow-md">
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="size-10 rounded-full bg-[#63e2ff] text-black flex items-center justify-center text-primary mb-4 ">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
