"use client";

import { createContext, useContext, type ReactNode } from "react";

type ThemeContextType = {
  colors: {
    primary: string;
    background: string;
    card: string;
    text: string;
    border: string;
    accent: string;
  };
};

const lightTheme: ThemeContextType = {
  colors: {
    primary: "#0878fe", // Spotify green
    background: "#181818",
    card: "#383f44",
    text: "#FFFFFF",
    border: "#2b2d2f",
    accent: "#1DB954",
  },
};

const ThemeContext = createContext<ThemeContextType>(lightTheme);

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  return (
    <ThemeContext.Provider value={lightTheme}>{children}</ThemeContext.Provider>
  );
};
