import React, { createContext, useCallback, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

const themeStateStorageKey = "app-theme-state";
const legacyPublicThemeKey = "publicThemeMode";
const legacyStaffThemeKey = "adminThemeMode";
const legacySuperAdminThemeKey = "superAdminThemeMode";
const legacyCustomerThemeKey = "customerThemeMode";
const themeTransitionMs = 500;

const publicThemeRoutes = new Set(["/", "/landpage", "/how-it-works", "/about", "/services", "/operators/login"]);

const PublicThemeContext = createContext(null);

const scopeToThemeKey = {
  public: "publicThemeMode",
  staff: "staffThemeMode",
  customer: "customerThemeMode",
};

const getSystemTheme = () => {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") return "dark";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

const normalizeThemeMode = (value, fallback) => (value === "dark" || value === "light" ? value : fallback);

const createDefaultThemeState = () => {
  const systemTheme = getSystemTheme();

  return {
    publicThemeMode: systemTheme,
    staffThemeMode: systemTheme,
    customerThemeMode: systemTheme,
    lastActiveScope: "public",
  };
};

const readStoredThemeState = () => {
  if (typeof window === "undefined") return createDefaultThemeState();

  const systemTheme = getSystemTheme();
  const legacyPublicTheme = normalizeThemeMode(window.localStorage.getItem(legacyPublicThemeKey), systemTheme);
  const legacyStaffTheme = normalizeThemeMode(
    window.localStorage.getItem(legacyStaffThemeKey) || window.localStorage.getItem(legacySuperAdminThemeKey),
    systemTheme
  );
  const legacyCustomerTheme = normalizeThemeMode(window.localStorage.getItem(legacyCustomerThemeKey), systemTheme);

  try {
    const rawState = window.localStorage.getItem(themeStateStorageKey);

    if (rawState) {
      const parsed = JSON.parse(rawState);

      return {
        publicThemeMode: normalizeThemeMode(parsed.publicThemeMode, legacyPublicTheme),
        staffThemeMode: normalizeThemeMode(parsed.staffThemeMode, legacyStaffTheme),
        customerThemeMode: normalizeThemeMode(parsed.customerThemeMode, legacyCustomerTheme),
        lastActiveScope:
          parsed.lastActiveScope === "staff" || parsed.lastActiveScope === "customer" || parsed.lastActiveScope === "public"
            ? parsed.lastActiveScope
            : "public",
      };
    }
  } catch {
    // Fall back to legacy keys below.
  }

  const hasLegacyPublicTheme = window.localStorage.getItem(legacyPublicThemeKey) === "dark" || window.localStorage.getItem(legacyPublicThemeKey) === "light";
  const hasLegacyStaffTheme =
    window.localStorage.getItem(legacyStaffThemeKey) === "dark" ||
    window.localStorage.getItem(legacyStaffThemeKey) === "light" ||
    window.localStorage.getItem(legacySuperAdminThemeKey) === "dark" ||
    window.localStorage.getItem(legacySuperAdminThemeKey) === "light";
  const hasLegacyCustomerTheme = window.localStorage.getItem(legacyCustomerThemeKey) === "dark" || window.localStorage.getItem(legacyCustomerThemeKey) === "light";

  const initialScope = hasLegacyPublicTheme ? "public" : hasLegacyStaffTheme ? "staff" : hasLegacyCustomerTheme ? "customer" : "public";

  return {
    publicThemeMode: legacyPublicTheme,
    staffThemeMode: legacyStaffTheme,
    customerThemeMode: legacyCustomerTheme,
    lastActiveScope: initialScope,
  };
};

const resolveLandingThemeMode = (themeState) => {
  const activeScope = themeState.lastActiveScope in scopeToThemeKey ? themeState.lastActiveScope : "public";
  const activeKey = scopeToThemeKey[activeScope];
  return themeState[activeKey] || themeState.publicThemeMode;
};

const resolveThemeModeForScope = (themeState, scope) => {
  if (scope === "landing") {
    return resolveLandingThemeMode(themeState);
  }

  const themeKey = scopeToThemeKey[scope] || scopeToThemeKey.public;
  return themeState[themeKey] || themeState.publicThemeMode;
};

const syncThemeState = (themeState) => {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(themeStateStorageKey, JSON.stringify(themeState));
  window.localStorage.setItem(legacyPublicThemeKey, themeState.publicThemeMode);
  window.localStorage.setItem(legacyStaffThemeKey, themeState.staffThemeMode);
  window.localStorage.setItem(legacySuperAdminThemeKey, themeState.staffThemeMode);
  window.localStorage.setItem(legacyCustomerThemeKey, themeState.customerThemeMode);
};

const applyThemeTransition = (timerRef) => {
  if (typeof document === "undefined") return;

  document.documentElement.classList.add("theme-transitioning");

  if (timerRef.current) {
    window.clearTimeout(timerRef.current);
  }

  timerRef.current = window.setTimeout(() => {
    document.documentElement.classList.remove("theme-transitioning");
  }, themeTransitionMs);
};

export function PublicThemeProvider({ children }) {
  const themeTransitionTimerRef = useRef(null);
  const [themeState, setThemeState] = useState(readStoredThemeState);

  useEffect(() => {
    syncThemeState(themeState);
  }, [themeState]);

  useEffect(
    () => () => {
      if (themeTransitionTimerRef.current) {
        window.clearTimeout(themeTransitionTimerRef.current);
      }

      if (typeof document !== "undefined") {
        document.documentElement.classList.remove("theme-transitioning");
      }
    },
    []
  );

  const setThemeModeForScope = useCallback((scope, nextThemeMode) => {
    setThemeState((currentState) => {
      const resolvedScope = scope === "landing" ? "public" : scope;
      const safeThemeMode =
        nextThemeMode === "dark" || nextThemeMode === "light"
          ? nextThemeMode
          : currentState[scopeToThemeKey[resolvedScope] || scopeToThemeKey.public];

      if (resolvedScope === "public") {
        return {
          publicThemeMode: safeThemeMode,
          staffThemeMode: safeThemeMode,
          customerThemeMode: safeThemeMode,
          lastActiveScope: "public",
        };
      }

      const themeKey = scopeToThemeKey[resolvedScope] || scopeToThemeKey.public;

      return {
        ...currentState,
        [themeKey]: safeThemeMode,
        lastActiveScope: resolvedScope,
      };
    });
  }, []);

  const toggleTheme = useCallback((scope = "landing") => {
    applyThemeTransition(themeTransitionTimerRef);

    setThemeState((currentState) => {
      const resolvedScope = scope === "landing" ? "public" : scope;
      const themeKey = scopeToThemeKey[resolvedScope] || scopeToThemeKey.public;
      const nextThemeMode = currentState[themeKey] === "dark" ? "light" : "dark";

      if (resolvedScope === "public") {
        return {
          publicThemeMode: nextThemeMode,
          staffThemeMode: nextThemeMode,
          customerThemeMode: nextThemeMode,
          lastActiveScope: "public",
        };
      }

      return {
        ...currentState,
        [themeKey]: nextThemeMode,
        lastActiveScope: resolvedScope,
      };
    });
  }, []);

  const value = useMemo(
    () => ({
      themeState,
      landingThemeMode: resolveLandingThemeMode(themeState),
      publicThemeMode: themeState.publicThemeMode,
      staffThemeMode: themeState.staffThemeMode,
      customerThemeMode: themeState.customerThemeMode,
      setThemeModeForScope,
      toggleTheme,
    }),
    [setThemeModeForScope, themeState, toggleTheme]
  );

  return <PublicThemeContext.Provider value={value}>{children}</PublicThemeContext.Provider>;
}

export function useThemeScope(scope = "landing") {
  const context = useContext(PublicThemeContext);

  if (!context) {
    throw new Error("usePublicTheme must be used within a PublicThemeProvider");
  }

  const themeMode = resolveThemeModeForScope(context.themeState, scope);
  const isDarkMode = themeMode === "dark";

  return {
    ...context,
    themeMode,
    isDarkMode,
    setThemeMode: (nextThemeMode) => context.setThemeModeForScope(scope, nextThemeMode),
    toggleTheme: () => context.toggleTheme(scope),
  };
}

export function usePublicTheme() {
  return useThemeScope("landing");
}

export function PublicThemeRouteSync() {
  const location = useLocation();
  const { themeState } = useThemeScope("landing");

  useLayoutEffect(() => {
    if (typeof document === "undefined") return;

    const pathname = location.pathname;
    const isAdminRoute = pathname.startsWith("/admin");
    const isSuperAdminRoute = pathname.startsWith("/superadmin");
    const isCustomerRoute = pathname.startsWith("/customer");
    const isPublicRoute = publicThemeRoutes.has(pathname);

    let nextTheme = resolveLandingThemeMode(themeState);

    if (isAdminRoute || isSuperAdminRoute) {
      nextTheme = themeState.staffThemeMode;
    } else if (isCustomerRoute) {
      nextTheme = themeState.customerThemeMode;
    } else if (!isPublicRoute) {
      nextTheme = resolveLandingThemeMode(themeState);
    }

    document.documentElement.dataset.theme = nextTheme;
  }, [location.pathname, themeState]);

  return null;
}
