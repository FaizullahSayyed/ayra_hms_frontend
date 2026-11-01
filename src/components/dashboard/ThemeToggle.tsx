import { HiOutlineMoon, HiOutlineSun } from "react-icons/hi2";
import { useTheme } from "../../context/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      className="dashboard-icon-button"
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
      title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      {theme === "light" ? <HiOutlineMoon /> : <HiOutlineSun />}
    </button>
  );
}
