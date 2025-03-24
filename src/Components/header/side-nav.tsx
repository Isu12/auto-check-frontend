"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Home, 
  LayoutGrid, 
  Wrench, 
  PhoneCall, 
  Menu, 
  X,  
  User, 
  ChevronDown, 
  Car
} from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
<nav className="fixed top-0 left-0 w-full bg-[#050626] shadow-lg backdrop-blur-lg bg-opacity-90 px-6 py-4 z-50">
<div className="max-w-8xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-white text-2xl font-extrabold flex items-center gap-2">
          <Car className="w-8 h-9 text-white-600" />
          <span className="hidden md:block">AUTOCHECK</span>
        </Link>

       

        {/* Desktop Navigation */}
        <ul className="hidden md:flex gap-6 text-white font-medium">
          <li>
            <Link href="/" className="flex items-center gap-2 hover:text-blue-600 transition-all">
              <Home className="w-6 h-6 text-[#d9f7ff]" />
              Home
            </Link>
          </li>
          <li>
            <Link href="/dashboard" className="flex items-center gap-2 hover:text-blue-600 transition-all">
            <LayoutGrid className="w-6 h-6 text-[#d9f7ff]" />
              Dashboard
            </Link>
          </li>
          <li className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 hover:text-blue-600 transition-all"
            >
              <Wrench className="w-6 h-6 text-[#d9f7ff]" />
              Services
              <ChevronDown className="w-4 h-4 text-blue-300" />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <ul className="absolute left-0 mt-2 w-48 bg-white text-blue-900 rounded-lg shadow-lg">
                <li className="hover:bg-blue-300 px-4 py-2 transition-all"><Link href="/services/repairs">Repairs</Link></li>
                <li className="hover:bg-blue-300 px-4 py-2 transition-all"><Link href="/services/inspection">Inspection</Link></li>
                <li className="hover:bg-blue-300 px-4 py-2 transition-all"><Link href="/services/insurance">Insurance</Link></li>
              </ul>
            )}
          </li>
          <li>
            <Link href="/contact" className="flex items-center gap-2 hover:text-blue-600 transition-all">
              <PhoneCall className="w-6 h-6 text-[#d9f7ff]" />
              Contact
            </Link>
          </li>
        </ul>

        {/* Profile Section */}
        <div className="relative hidden md:block">
          <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="flex items-center gap-2 text-blue-200">
            <User className="w-8 h-8 rounded-full border border-blue-300" />
          </button>

          {isProfileOpen && (
            <ul className="absolute right-0 mt-2 w-48 bg-white text-blue-900 rounded-lg shadow-lg">
              <li className="hover:bg-blue-300 px-4 py-2 transition-all"><Link href="/profile">Profile</Link></li>
              <li className="hover:bg-blue-300 px-4 py-2 transition-all"><Link href="/settings">Settings</Link></li>
              <li className="hover:bg-red-400 text-red-700 px-4 py-2 transition-all"><button>Logout</button></li>
            </ul>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button className="md:hidden text-blue-900" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className="w-8 h-8 text-blue-300" /> : <Menu className="w-8 h-8 text-blue-300" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <ul className="md:hidden bg-white bg-opacity-90 rounded-lg p-4 mt-2 space-y-4 text-blue-900">
          <li>
            <Link href="/" className="block py-2 px-4 hover:bg-blue-300 rounded-lg transition-all">
              Home
            </Link>
          </li>
          <li>
            <Link href="/dashboard" className="block py-2 px-4 hover:bg-blue-300 rounded-lg transition-all">
              Dashboard
            </Link>
          </li>
          <li>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="block w-full py-2 px-4 hover:bg-blue-300 rounded-lg transition-all"
            >
              Services
            </button>
            {isDropdownOpen && (
              <ul className="mt-2 space-y-2 bg-white rounded-lg p-2">
                <li className="hover:bg-blue-300 px-4 py-2 transition-all"><Link href="/services/repairs">Repairs</Link></li>
                <li className="hover:bg-blue-300 px-4 py-2 transition-all"><Link href="/services/inspection">Inspection</Link></li>
                <li className="hover:bg-blue-300 px-4 py-2 transition-all"><Link href="/services/insurance">Insurance</Link></li>
              </ul>
            )}
          </li>
          <li>
            <Link href="/contact" className="block py-2 px-4 hover:bg-blue-300 rounded-lg transition-all">
              Contact
            </Link>
          </li>
          <li>
            <Link href="/profile" className="block py-2 px-4 hover:bg-blue-300 rounded-lg transition-all">
              Profile
            </Link>
          </li>
        </ul>
      )}
    </nav>
  );
};

export default Navbar;
