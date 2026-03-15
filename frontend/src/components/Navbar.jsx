import { NavLink } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import LogoutButton from "./LogoutButton";

export default function Navbar() {
  return (
    <nav className="bg-slate-900 text-white px-6 py-4 shadow">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center gap-2 font-semibold text-lg">
          💸 FinanceTracker
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-6 text-sm">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              isActive ? "text-blue-400" : "hover:text-blue-300"
            }
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/transaction"
            className={({ isActive }) =>
              isActive ? "text-blue-400" : "hover:text-blue-300"
            }
          >
            Transactions
          </NavLink>

          <NavLink
            to="/categories"
            className={({ isActive }) =>
              isActive ? "text-blue-400" : "hover:text-blue-300"
            }
          >
            Categories
          </NavLink>

          <ThemeToggle />
          <LogoutButton />
        </div>
      </div>
    </nav>
  );
}
