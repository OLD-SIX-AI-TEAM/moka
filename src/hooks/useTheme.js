/** @jsxImportSource react */
import { useEffect, useState } from "react";

const THEME_KEY = "imarticle-theme";

export function useTheme() {
  const [theme, setTheme] = useState(() => {
    // 从localStorage读取，默认light
    if (typeof window !== "undefined") {
      return localStorage.getItem(THEME_KEY) || "light";
    }
    return "light";
  });

  useEffect(() => {
    // 保存到localStorage
    localStorage.setItem(THEME_KEY, theme);
    // 设置data-theme属性
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const setLightTheme = () => setTheme("light");
  const setDarkTheme = () => setTheme("dark");

  return {
    theme,
    isLight: theme === "light",
    isDark: theme === "dark",
    toggleTheme,
    setLightTheme,
    setDarkTheme,
  };
}
