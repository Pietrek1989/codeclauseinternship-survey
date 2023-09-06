"use client";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import "../toggle.css";

const ThemeChanger = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, [!mounted]);

  if (!mounted) {
    return null;
  }
  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  };

  console.log(theme);
  return (
    <div>
      <div className="toggle">
        <label className="switch">
          <input type="checkbox" onClick={toggleTheme} />
          <span className="slider"></span>
        </label>
      </div>
    </div>
  );
};

export default ThemeChanger;
