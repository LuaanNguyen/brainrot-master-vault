import type React from "react";
import "@/styles/globals.css";
import { Inter } from "next/font/google";
import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BrainRot Vault | Knowledge Graph Visualization",
  description:
    "Visualize and explore your knowledge connections with an interactive force-directed graph. Organize your thoughts, ideas, and learnings in a personal or team vault.",
  keywords: [
    "knowledge graph",
    "visualization",
    "brainstorming",
    "mind mapping",
    "force-directed graph",
    "personal knowledge management",
    "PKM",
    "knowledge vault",
  ],
  authors: [{ name: "BrainRot Team" }],
  creator: "BrainRot",
  publisher: "BrainRot",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://brainrot.vercel.app",
    title: "BrainRot Vault | Knowledge Graph Visualization",
    description:
      "Visualize and explore your knowledge connections with an interactive force-directed graph.",
    siteName: "BrainRot Vault",
    images: [
      {
        url: "/og-image.png", // You'll need to create this image
        width: 1200,
        height: 630,
        alt: "BrainRot Vault Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BrainRot Vault | Knowledge Graph Visualization",
    description:
      "Visualize and explore your knowledge connections with an interactive force-directed graph.",
    images: ["/twitter-image.png"], // You'll need to create this image
  },
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#3b82f6", // Blue color from your UI
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-icon.png", // You'll need to create these icons
  },
  category: "Knowledge Management",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

import "./globals.css";
