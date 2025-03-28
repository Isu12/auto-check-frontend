"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  Home, 
  LayoutGrid, 
  Wrench, 
  Menu, 
  X,  
  User, 
  ChevronDown, 
  Car,
  Cog
} from "lucide-react";

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Close all dropdowns when route changes
  useEffect(() => {
    const handleRouteChange = () => {
      setIsOpen(false);
      setIsProfileOpen(false);
      setIsDropdownOpen(false);
    };

    handleRouteChange();
  }, [pathname]);

  const isActive = (path: string) => {
    return pathname === path || 
          (path !== '/' && pathname.startsWith(path));
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-gray-900 shadow-lg backdrop-blur-lg bg-opacity-90 px-6 py-4 z-50">
      <div className="max-w-8xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-white text-2xl font-extrabold flex items-center gap-2 no-underline">
          <Car className="w-8 h-9 text-white-600" />
          <span className="hidden md:block">AUTOCHECK</span>
        </Link>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex gap-6 text-white font-medium">
          <li>
            <Link 
              href="/" 
              className={`flex items-center gap-2 transition-all no-underline ${
                isActive("/") 
                  ? "text-blue-400 font-bold" 
                  : "hover:text-blue-600"
              }`}
              onClick={() => router.replace('/')}
            >
              <Home className="w-6 h-6 text-[#d9f7ff]" />
              Home
            </Link>
          </li>
          <li>
            <Link 
              href="/dashboard" 
              className={`flex items-center gap-2 transition-all no-underline ${
                isActive("/dashboard") 
                  ? "text-blue-400 font-bold" 
                  : "hover:text-blue-600"
              }`}
              onClick={() => router.replace('/dashboard')}
            >
              <LayoutGrid className="w-6 h-6 text-[#d9f7ff]" />
              Dashboard
            </Link>
          </li>
          <li className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className={`flex items-center gap-2 transition-all no-underline ${
                isActive("/services") 
                  ? "text-blue-400 font-bold" 
                  : "hover:text-blue-600"
              }`}
            >
              <Wrench className="w-6 h-6 text-[#d9f7ff]" />
              Services
              <ChevronDown className="w-4 h-4 text-blue-300" />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <ul className="absolute left-0 mt-2 w-48 bg-gray-800 text-white rounded-lg shadow-lg">
                <li className={`px-4 py-2 transition-all ${
                  isActive("/services/repairs") 
                    ? "bg-blue-600 text-white" 
                    : "hover:bg-gray-700"
                }`}>
                  <Link 
                    href="/ServiceRecord/Records" 
                    className="no-underline"
                    onClick={() => router.replace('/ServiceRecord/Records')}
                  >
                    Repairs
                  </Link>
                </li>
                <li className={`px-4 py-2 transition-all ${
                  isActive("/services/inspection") 
                    ? "bg-blue-600 text-white" 
                    : "hover:bg-gray-700"
                }`}>
                  <Link 
                    href="/services/inspection" 
                    className="no-underline"
                    onClick={() => router.replace('/services/inspection')}
                  >
                    Echo Test
                  </Link>
                </li>
                <li className={`px-4 py-2 transition-all ${
                  isActive("/services/insurance") 
                    ? "bg-blue-600 text-white" 
                    : "hover:bg-gray-700"
                }`}>
                  <Link 
                    href="/services/insurance" 
                    className="no-underline"
                    onClick={() => router.replace('/services/insurance')}
                  >
                    Insurance
                  </Link>
                </li>
              </ul>
            )}
          </li>
          <li>
            <Link 
              href="/modifications" 
              className={`flex items-center gap-2 transition-all no-underline ${
                isActive("/modifications") 
                  ? "text-blue-400 font-bold" 
                  : "hover:text-blue-600"
              }`}
              onClick={() => router.replace('/modifications')}
            >
              <Cog className="w-6 h-6 text-[#d9f7ff]" />
              Modifications
            </Link>
          </li>
        </ul>

        {/* Profile Section */}
        <div className="relative hidden md:block">
          <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="flex items-center gap-2 text-blue-200 no-underline">
            <User className="w-8 h-8 rounded-full border border-blue-300" />
          </button>

          {isProfileOpen && (
            <ul className="absolute right-0 mt-2 w-48 bg-gray-800 text-white rounded-lg shadow-lg">
              <li className={`px-4 py-2 transition-all ${
                isActive("/profile") 
                  ? "bg-blue-600 text-white" 
                  : "hover:bg-gray-700"
              }`}>
                <Link 
                  href="/profile" 
                  className="no-underline"
                  onClick={() => router.replace('/profile')}
                >
                  Profile
                </Link>
              </li>
              <li className={`px-4 py-2 transition-all ${
                isActive("/settings") 
                  ? "bg-blue-600 text-white" 
                  : "hover:bg-gray-700"
              }`}>
                <Link 
                  href="/settings" 
                  className="no-underline"
                  onClick={() => router.replace('/settings')}
                >
                  Settings
                </Link>
              </li>
              <li className="hover:bg-red-600 text-white px-4 py-2 transition-all">
                <button className="no-underline">Logout</button>
              </li>
            </ul>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button className="md:hidden text-blue-900 no-underline" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className="w-8 h-8 text-blue-300" /> : <Menu className="w-8 h-8 text-blue-300" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <ul className="md:hidden bg-gray-800 rounded-lg p-4 mt-2 space-y-4 text-white">
          <li>
            <Link 
              href="/" 
              className={`block py-2 px-4 rounded-lg transition-all no-underline ${
                isActive("/") 
                  ? "bg-blue-600 text-white" 
                  : "hover:bg-gray-700"
              }`}
              onClick={() => router.replace('/')}
            >
              Home
            </Link>
          </li>
          <li>
            <Link 
              href="/dashboard" 
              className={`block py-2 px-4 rounded-lg transition-all no-underline ${
                isActive("/dashboard") 
                  ? "bg-blue-600 text-white" 
                  : "hover:bg-gray-700"
              }`}
              onClick={() => router.replace('/dashboard')}
            >
              Dashboard
            </Link>
          </li>
          <li>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className={`block w-full py-2 px-4 rounded-lg transition-all no-underline ${
                isActive("/services") 
                  ? "bg-blue-600 text-white" 
                  : "hover:bg-gray-700"
              }`}
            >
              Services
            </button>
            {isDropdownOpen && (
              <ul className="mt-2 space-y-2 bg-gray-700 rounded-lg p-2">
                <li className={`px-4 py-2 transition-all ${
                  isActive("/services/repairs") 
                    ? "bg-blue-600 text-white" 
                    : "hover:bg-gray-600"
                }`}>
                  <Link 
                    href="/services/repairs" 
                    className="no-underline"
                    onClick={() => router.replace('/services/repairs')}
                  >
                    Repairs
                  </Link>
                </li>
                <li className={`px-4 py-2 transition-all ${
                  isActive("/services/inspection") 
                    ? "bg-blue-600 text-white" 
                    : "hover:bg-gray-600"
                }`}>
                  <Link 
                    href="/services/inspection" 
                    className="no-underline"
                    onClick={() => router.replace('/services/inspection')}
                  >
                    Echo Test
                  </Link>
                </li>
                <li className={`px-4 py-2 transition-all ${
                  isActive("/services/insurance") 
                    ? "bg-blue-600 text-white" 
                    : "hover:bg-gray-600"
                }`}>
                  <Link 
                    href="/services/insurance" 
                    className="no-underline"
                    onClick={() => router.replace('/services/insurance')}
                  >
                    Insurance
                  </Link>
                </li>
              </ul>
            )}
          </li>
          <li>
            <Link 
              href="/modifications" 
              className={`block py-2 px-4 rounded-lg transition-all no-underline ${
                isActive("/modifications") 
                  ? "bg-blue-600 text-white" 
                  : "hover:bg-gray-700"
              }`}
              onClick={() => router.replace('/modifications')}
            >
              Modifications
            </Link>
          </li>
          <li>
            <Link 
              href="/profile" 
              className={`block py-2 px-4 rounded-lg transition-all no-underline ${
                isActive("/profile") 
                  ? "bg-blue-600 text-white" 
                  : "hover:bg-gray-700"
              }`}
              onClick={() => router.replace('/profile')}
            >
              Profile
            </Link>
          </li>
        </ul>
      )}
    </nav>
  );
};

export default Navbar;