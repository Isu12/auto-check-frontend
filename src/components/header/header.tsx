import React from "react";
import { User, Settings } from "lucide-react"; // Icons for user and settings
import { Button } from "../ui/button";

const Header: React.FC = () => {
  return (
    <header className="text-white py-3 px-6 shadow-md flex items-center justify-between fixed top-0 left-0 right-0 z-10"
    style={{ backgroundColor: "#205781" }}>
      {/* Logo on the left */}
      <div className="flex items-center gap-3">
        <img src="/logo.png" alt="System Logo" className="w-8 h-8" /> {/* Logo path updated */}
        <h2 className="text-xl font-semibold tracking-wide">AutoCheck</h2>
      </div>

      {/* Clean middle space */}
      <div className="flex-1"></div> {/* This takes up the middle space */}

      {/* User details and actions on the right */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-gray-300">John Doe</span> {/* User name */}
          <span className="text-gray-400 text-sm">(Admin)</span> {/* User role */}
        </div>
        <Button variant="ghost">
        </Button>
        <Button variant="ghost">
          <User className="w-5 h-5 text-gray-300 hover:text-white" />
        </Button>
      </div>
    </header>
  );
};

export default Header;
