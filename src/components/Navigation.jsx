import { useState } from "react";
import { Button } from "@/components/ui/button";
import { BookOpen, Menu, X, Bell, Settings, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import ThemeToggle from "./ui/ThemeToggle";

const Navigation = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navigationItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      current: location.pathname === "/dashboard",
    },
    {
      name: "Upload Notes",
      href: "/upload",
      current: location.pathname === "/upload",
    },
    {
      name: "Study Tools",
      href: "/study-tools",
      current: location.pathname === "/study-tools",
    },
    {
      name: "Library",
      href: "/library",
      current: location.pathname === "/library",
    },
  ];

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-black dark:bg-white rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white dark:text-black" />
            </div>
            <span className="text-xl font-bold text-black dark:text-white">
              StudyAI Hub
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  item.current
                    ? "text-black dark:text-white bg-gray-100 dark:bg-gray-800"
                    : "text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Right side items */}
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            {/* Notifications */}
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-black dark:bg-white rounded-full text-xs flex items-center justify-center">
                <span className="w-1.5 h-1.5 bg-white dark:bg-black rounded-full"></span>
              </span>
            </Button>

            {/* Settings */}
            <Button variant="ghost" size="sm">
              <Settings className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </Button>

            {/* Profile */}
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center space-x-2"
            >
              <div className="w-8 h-8 bg-black dark:bg-white rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white dark:text-black" />
              </div>
              <span className="hidden md:block text-sm font-medium text-gray-700 dark:text-gray-300">
                Alex
              </span>
            </Button>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                ) : (
                  <Menu className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 dark:border-gray-800">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    item.current
                      ? "text-black dark:text-white bg-gray-100 dark:bg-gray-800"
                      : "text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
