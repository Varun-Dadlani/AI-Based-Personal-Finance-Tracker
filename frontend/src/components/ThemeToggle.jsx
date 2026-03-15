import { useTheme } from "../context/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  console.log("Theme:", theme);
  return (
    <button
      onClick={toggleTheme}
      className="px-3 py-2 rounded-lg bg-gray-700 text-white"
    >
      {theme === "light" ? "🌙 Dark" : "☀️ Light"}
    </button>
  );
}
