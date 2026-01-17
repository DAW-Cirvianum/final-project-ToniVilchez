// src/components/Header.jsx (MODIFICADO)
import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { useNavigate, NavLink, useLocation } from "react-router-dom";
import { LogOut, Moon, Sun, Grid, Gamepad2, Shield } from "lucide-react";
import LanguageSwitcher from "./LanguageSwitcher";

export function Header() {
  const { user, logout, theme, toggleTheme } = useContext(AppContext);
  const navigate = useNavigate();
  const location = useLocation();

  const hiddenRoutes = [
    "/login",
    "/register",
    "/signup",
    "/forgot-password",
    "/",
  ];
  const shouldHide = hiddenRoutes.includes(location.pathname);

  if (shouldHide) {
    return null;
  }

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const navItems = [
    {
      path: "/categories",
      label: "Categorías",
      icon: <Grid className="w-4 h-4" />,
    },
    {
      path: "/games",
      label: "Historial",
      icon: <Gamepad2 className="w-4 h-4" />,
    },
  ];

  // Añadir opción de admin si el usuario es admin
  if (user?.role === "admin") {
    navItems.push({
      path: "/admin/users",
      label: "Admin",
      icon: <Shield className="w-4 h-4" />,
    });
  }

  return (
    <header className="sticky top-0 z-50 backdrop-blur-lg bg-white/5 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate("/categories")}
              className="flex items-center space-x-2 text-white hover:text-primary-400 transition-colors"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">I</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-transparent">
                Impostor
              </span>
            </button>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? "bg-white/10 text-white"
                      : "text-gray-300 hover:text-white hover:bg-white/5"
                  }`
                }
              >
                {item.icon}
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>

          {/* Right section */}
          <div className="flex items-center space-x-3">
            <LanguageSwitcher />

            <div className="h-6 w-px bg-white/10"></div>

            {/* User menu */}
            {user ? (
              <div className="flex items-center space-x-3">
                <div className="hidden md:flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {user.name?.charAt(0) || user.email?.charAt(0) || "U"}
                  </div>
                  <button
                    onClick={() => navigate("/profile")}
                    className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-sm font-medium text-white transition-all"
                  >
                    <div className="text-sm">
                      <p className="text-white font-medium">
                        {user.name || user.email}
                      </p>
                      {user.role === "admin" && (
                        <span className="text-xs bg-yellow-500 text-yellow-950 px-2 py-0.5 rounded-full font-bold">
                          ADMIN
                        </span>
                      )}
                    </div>
                  </button>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-sm font-medium text-white transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden md:inline">Salir</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="px-4 py-2 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-lg font-medium transition-all shadow-lg hover:shadow-primary-500/25"
              >
                Iniciar sesión
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
