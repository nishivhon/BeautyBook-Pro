import React from "react";
import { usePublicTheme } from "../../theme/publicThemeContext";

const SunIcon = ({ size = 12, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="4.5" stroke={color} strokeWidth="1.8" />
    <path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

const MoonIcon = ({ size = 12, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M16.7 14.4A7.2 7.2 0 019.6 4.2a8.2 8.2 0 1011.6 11.6 7.2 7.2 0 01-4.5-1.4z" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export function ThemeToggle({ className = "" }) {
  const { themeMode, toggleTheme } = usePublicTheme();
  const isDark = themeMode === "dark";

  return (
    <button
      type="button"
      className={`public-theme-toggle ${className}`.trim()}
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      <span className={`public-theme-switch ${themeMode === "light" ? "is-light" : "is-dark"}`} aria-hidden="true">
        <span className="public-theme-switch-track" />
        <span className="public-theme-switch-thumb">{isDark ? <MoonIcon size={10} color="#fff" /> : <SunIcon size={10} color="#1a0f00" />}</span>
      </span>
    </button>
  );
}
