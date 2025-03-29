"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ChartNetwork,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Youtube,
  Mail,
  MapPin,
  Phone,
  ArrowRight,
  Heart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Footer() {
  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <footer className="w-full border-t bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-blue-50 blur-3xl opacity-50"></div>
      <div className="absolute bottom-0 left-24 w-80 h-80 rounded-full bg-purple-50 blur-3xl opacity-40"></div>

      {/* Footer content */}
      <div className="container relative">
        {/* Newsletter section */}
        {/* <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mx-auto max-w-4xl -mt-16 mb-20 bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          <div className="p-8 md:p-12 bg-gradient-to-r from-blue-600 to-indigo-600">
            <div className="grid md:grid-cols-5 gap-8 items-center">
              <div className="md:col-span-3 text-white">
                <h3 className="text-2xl font-bold mb-3">Stay in the loop</h3>
                <p className="text-blue-100">
                  Get the latest updates, podcasts recommendations, and
                  productivity tips delivered straight to your inbox.
                </p>
              </div>
              <div className="md:col-span-2">
                <div className="flex flex-col sm:flex-row gap-3">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    className="bg-white/10 text-white placeholder:text-blue-200 border-blue-300 focus-visible:ring-blue-200"
                  />
                  <Button className="bg-white text-blue-600 hover:bg-blue-50 rounded-lg whitespace-nowrap">
                    Subscribe
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-blue-200 mt-2">
                  We respect your privacy. Unsubscribe at any time.
                </p>
              </div>
            </div>
          </div>
        </motion.div> */}

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid gap-12 px-4 py-10 md:px-6 lg:py-16 md:grid-cols-10"
        >
          {/* Brand column */}
          <motion.div variants={item} className="space-y-6 md:col-span-4">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-gradient-to-tr from-blue-500 to-cyan-400 flex items-center justify-center text-white shadow-lg shadow-blue-200">
                <ChartNetwork className="size-5" />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-lg font-bold tracking-tight">
                  Brainrot
                </span>
                <span className="text-xs text-blue-600 font-medium">
                  Master Vault
                </span>
              </div>
            </div>

            <p className="text-sm text-gray-600 max-w-sm leading-relaxed">
              The all-in-one productive podcast platform to replace doom
              scrolling with passive learning. Reclaim your wasted time with
              meaningful content.
            </p>

            <div className="flex items-center space-x-4">
              <motion.a
                href="#"
                className="size-10 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Facebook size={18} />
              </motion.a>
              <motion.a
                href="#"
                className="size-10 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Twitter size={18} />
              </motion.a>
              <motion.a
                href="#"
                className="size-10 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Linkedin size={18} />
              </motion.a>
              <motion.a
                href="#"
                className="size-10 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Instagram size={18} />
              </motion.a>
            </div>
          </motion.div>

          {/* Navigation columns */}
          <motion.div variants={item} className="md:col-span-2">
            <h4 className="text-sm font-bold uppercase tracking-wider text-gray-900 mb-5">
              Resources
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="#"
                  className="text-gray-600 hover:text-blue-600 transition-colors inline-flex items-center"
                >
                  <ArrowRight className="mr-2 h-3 w-3 opacity-0 group-hover:opacity-100" />
                  Getting Started
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-600 hover:text-blue-600 transition-colors inline-flex items-center"
                >
                  Documentation
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-600 hover:text-blue-600 transition-colors inline-flex items-center"
                >
                  API Reference
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-600 hover:text-blue-600 transition-colors inline-flex items-center"
                >
                  Help Center
                </Link>
              </li>
            </ul>
          </motion.div>

          <motion.div variants={item} className="md:col-span-2">
            <h4 className="text-sm font-bold uppercase tracking-wider text-gray-900 mb-5">
              Company
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="#"
                  className="text-gray-600 hover:text-blue-600 transition-colors inline-flex items-center"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-600 hover:text-blue-600 transition-colors inline-flex items-center"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-600 hover:text-blue-600 transition-colors inline-flex items-center"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-600 hover:text-blue-600 transition-colors inline-flex items-center"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </motion.div>

          <motion.div variants={item} className="md:col-span-2">
            <h4 className="text-sm font-bold uppercase tracking-wider text-gray-900 mb-5">
              Contact
            </h4>
            <ul className="space-y-4 text-sm">
              <li>
                <div className="flex items-start">
                  <Mail className="mr-3 h-4 w-4 text-blue-600 mt-0.5" />
                  <span className="text-gray-600">
                    support@brainrotvault.com
                  </span>
                </div>
              </li>
              <li>
                <div className="flex items-start">
                  <Phone className="mr-3 h-4 w-4 text-blue-600 mt-0.5" />
                  <span className="text-gray-600">+1 (555) 123-4567</span>
                </div>
              </li>
              <li>
                <div className="flex items-start">
                  <MapPin className="mr-3 h-4 w-4 text-blue-600 mt-0.5" />
                  <span className="text-gray-600">
                    Princeton University
                    <br />
                    Princeton, NJ 08544
                  </span>
                </div>
              </li>
            </ul>
          </motion.div>
        </motion.div>

        {/* Bottom section with copyright */}
        <div className="border-t border-gray-200 py-8 px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500 flex items-center">
              &copy; {new Date().getFullYear()} HackPrinceton. Made with{" "}
              <Heart className="h-3 w-3 mx-1 text-red-500" /> at Princeton
            </p>

            <div className="flex items-center gap-6">
              <Link
                href="#"
                className="text-xs text-gray-500 hover:text-blue-600 transition-colors"
              >
                Privacy
              </Link>
              <Link
                href="#"
                className="text-xs text-gray-500 hover:text-blue-600 transition-colors"
              >
                Terms
              </Link>
              <Link
                href="#"
                className="text-xs text-gray-500 hover:text-blue-600 transition-colors"
              >
                Cookies
              </Link>
              <Link
                href="#"
                className="text-xs text-gray-500 hover:text-blue-600 transition-colors"
              >
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
