import React from "react";
import { User, Settings } from "lucide-react";
import { Button } from "../ui/button";

const Header: React.FC = () => {
  return (
    <header className="text-white py-3 px-6 shadow-md flex items-center justify-between fixed top-0 left-0 right-0 z-10"
    style={{ backgroundColor: "#205781" }}>

      <div className="flex items-center gap-3">
        <img src="/images/logoo.png" alt="System Logo" className="w-60 h-12" /> 
      </div>

      <div className="flex-1"></div> 

      
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-gray-300">John Doe</span> 
          <span className="text-gray-400 text-sm">(Admin)</span>
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