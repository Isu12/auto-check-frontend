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
import { authApi } from "../../app/auth/services/auth/auth";
import { UserDetails } from "../../app/auth/types/user/user-details.interface";

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [user, setUser] = useState<UserDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check auth status and get user details
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Get access token from cookies or local storage
        const accessToken = document.cookie
          .split('; ')
          .find(row => row.startsWith('accessToken='))
          ?.split('=')[1] || localStorage.getItem('accessToken');

        if (accessToken) {
          const userDetails = await authApi.getUserDetails(accessToken);
          setUser(userDetails);
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [pathname]);

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

  const handleLogout = async () => {
    try {
      const accessToken = document.cookie
        .split('; ')
        .find(row => row.startsWith('accessToken='))
        ?.split('=')[1] || localStorage.getItem('accessToken');

      if (accessToken) {
        await authApi.logout(accessToken);
      }
      
      // Clear client-side tokens
      document.cookie = 'accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      document.cookie = 'refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      
      setUser(null);
      router.push('/login');
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (isLoading) {
    return null; // Or return a loading spinner
  }

  return (
    <nav className="fixed top-0 left-0 w-full bg-gray-900 shadow-lg backdrop-blur-lg bg-opacity-90 px-6 py-4 z-50">
      <div className="max-w-8xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-white text-2xl font-extrabold flex items-center gap-2 no-underline">
          {/* <Car className="w-8 h-9 text-white-600" /> */}
          <span className="hidden md:block"><img src="/images/Logoo.png" className="w-40 h-7" // or use specific pixel sizes: "w-[50px] h-[20px]"
    alt="AutoCheck Logo"></img></span>
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

            {/* Services Dropdown Menu */}
            {isDropdownOpen && (
              <ul className="absolute left-0 mt-2 w-48 bg-gray-800 text-white rounded-lg shadow-lg">
                <li className={`px-4 py-2 transition-all ${
                  isActive("/ServiceRecord/Records") 
                    ? "bg-blue-600 text-white" 
                    : "hover:bg-gray-700"
                }`}>
                  <Link 
                    href="/ServiceRecord/Records" 
                    className="no-underline"
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
            >
              <Cog className="w-6 h-6 text-[#d9f7ff]" />
              Modifications
            </Link>
          </li>
        </ul>

        <div className="relative hidden md:flex items-center gap-4">
          {user ? (
            <>
              <span className="text-blue-200">{user.name}</span>
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)} 
                className="flex items-center gap-2 text-blue-200 no-underline"
              >
                <User className="w-8 h-8 rounded-full border border-blue-300" />
              </button>

              {isProfileOpen && (
                <ul className="absolute right-0 top-full mt-2 w-48 bg-gray-800 text-white rounded-lg shadow-lg">
                  <li className={`px-4 py-2 transition-all ${
                    isActive("/profile") 
                      ? "bg-blue-600 text-white" 
                      : "hover:bg-gray-700"
                  }`}>
                    <Link 
                      href="/profile" 
                      className="no-underline"
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
                    >
                      Settings
                    </Link>
                  </li>
                  <li className="hover:bg-red-600 text-white px-4 py-2 transition-all">
                    <button 
                      className="no-underline w-full text-left"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              )}
            </>
          ) : (
            <Link 
              href="/login" 
              className="text-blue-200 no-underline hover:text-blue-400"
            >
              Login
            </Link>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden text-blue-900 no-underline" 
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="w-8 h-8 text-blue-300" /> : <Menu className="w-8 h-8 text-blue-300" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <ul className="md:hidden bg-gray-800 rounded-lg p-4 mt-2 space-y-4 text-white">
          {user && (
            <li className="flex items-center gap-3 px-4 py-2">
              <User className="w-6 h-6 rounded-full border border-blue-300" />
              <span>{user.name}</span>
            </li>
          )}
          
          <li>
            <Link 
              href="/" 
              className={`block py-2 px-4 rounded-lg transition-all no-underline ${
                isActive("/") 
                  ? "bg-blue-600 text-white" 
                  : "hover:bg-gray-700"
              }`}
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
                  isActive("/ServiceRecord/Records") 
                    ? "bg-blue-600 text-white" 
                    : "hover:bg-gray-600"
                }`}>
                  <Link 
                    href="/ServiceRecord/Records" 
                    className="no-underline"
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
            >
              Profile
            </Link>
          </li>
          
          {user ? (
            <li className="hover:bg-red-600 text-white px-4 py-2 transition-all rounded-lg">
              <button 
                className="no-underline w-full text-left"
                onClick={handleLogout}
              >
                Logout
              </button>
            </li>
          ) : (
            <li>
              <Link 
                href="/login" 
                className="block py-2 px-4 rounded-lg transition-all no-underline hover:bg-gray-700"
              >
                Login
              </Link>
            </li>
          )}
        </ul>
      )}
    </nav>
  );
};

export default Navbar;