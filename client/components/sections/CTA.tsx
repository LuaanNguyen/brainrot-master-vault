"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, ChartNetwork } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";

export default function CTA() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay: 0.5 }}
      className="my-20 mx-auto max-w-lg text-center"
    >
      <div className="bg-gradient-to-r from-blue-600 to-violet-600 p-px rounded-xl overflow-hidden shadow-xl">
        <div className="bg-white px-8 py-6 rounded-xl">
          <h3 className="text-xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-violet-600">
            Ready to transform how you learn?
          </h3>
          <p className="text-slate-600 mb-4">
            Join thousands of users reclaiming their time with meaningful
            content.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {/* <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-violet-600 text-white font-medium shadow-lg"
            >
              Get Started Now
            </motion.button> */}

            <Link
              href="/graph-view"
              className={buttonVariants({
                size: "default",
                variant: "outline",
                className: "rounded-full gap-1.5 font-medium",
              })}
            >
              <ChartNetwork className="h-4 w-4" />
              Explore Knowledge Vault
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
