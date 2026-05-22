import React, { createContext, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

const themeStorageKey = "publicThemeMode";
const themeTransitionMs = 500;
const publicThemeRoutes = new Set(["/", "/landpage", "/how-it-works", "/about", "/services", "/operators/login"]);

const PublicThemeContext = createContext(null);

const getSystemTheme = () => {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") return "dark";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

const getInitialTheme = () => {
  if (typeof window === "undefined") return "dark";
  const savedTheme = window.localStorage.getItem(themeStorageKey);
  if (savedTheme === "dark" || savedTheme === "light") return savedTheme;
  return getSystemTheme();
};

export function PublicThemeProvider({ children }) {
  const themeTransitionTimerRef = useRef(null);
  const [themeMode, setThemeMode] = useState(getInitialTheme);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(themeStorageKey, themeMode);
  }, [themeMode]);

  useEffect(() => () => {
    if (themeTransitionTimerRef.current) {
      window.clearTimeout(themeTransitionTimerRef.current);
    }

    if (typeof document !== "undefined") {
      document.documentElement.classList.remove("theme-transitioning");
    }
  }, []);

  const toggleTheme = () => {
    if (typeof document !== "undefined") {
      document.documentElement.classList.add("theme-transitioning");

      if (themeTransitionTimerRef.current) {
        window.clearTimeout(themeTransitionTimerRef.current);
      }

      themeTransitionTimerRef.current = window.setTimeout(() => {
        document.documentElement.classList.remove("theme-transitioning");
      }, themeTransitionMs);
    }

    setThemeMode((mode) => (mode === "dark" ? "light" : "dark"));
  };

  const value = useMemo(() => ({
    themeMode,
    isDarkMode: themeMode === "dark",
    setThemeMode,
    toggleTheme,
  }), [themeMode]);

  return <PublicThemeContext.Provider value={value}>{children}</PublicThemeContext.Provider>;
}

export function usePublicTheme() {
  const context = useContext(PublicThemeContext);

  if (!context) {
    throw new Error("usePublicTheme must be used within a PublicThemeProvider");
  }

  return context;
}

export function PublicThemeRouteSync() {
  const location = useLocation();
  const { themeMode } = usePublicTheme();

  useLayoutEffect(() => {
    if (typeof document === "undefined") return;

    const pathname = location.pathname;
    const isAdminRoute = pathname.startsWith("/admin");
    const isPublicRoute = publicThemeRoutes.has(pathname);

    let nextTheme = "dark";

    if (isAdminRoute) {
      nextTheme = window.localStorage.getItem("adminThemeMode") === "dark" ? "dark" : "light";
    } else if (isPublicRoute) {
      nextTheme = themeMode;
    }

    document.documentElement.dataset.theme = nextTheme;
  }, [location.pathname, themeMode]);

  return null;
}
