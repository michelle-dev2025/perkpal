
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { User, ChevronDown } from 'lucide-react';

// 🎯 PerkPal Navigation Component - Author: Alexander Levi
// 🚀 Beautiful navbar with smooth animations and modern design

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* 💎 Logo Section */}
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">P</span>
            </div>
            <span className="text-2xl font-bold text-gradient">PerkPal</span>
          </div>

          {/* 🎮 Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-600 hover:text-primary transition-colors duration-300 font-medium">
              Features
            </a>
            <a href="#how-it-works" className="text-gray-600 hover:text-primary transition-colors duration-300 font-medium">
              How It Works
            </a>
            <a href="#rewards" className="text-gray-600 hover:text-primary transition-colors duration-300 font-medium">
              Rewards
            </a>
          </div>

          {/* 🔐 Auth Dropdown */}
          <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                className="flex items-center space-x-2 bg-white hover:bg-gray-50 border-2 border-primary/20 hover:border-primary/40 transition-all duration-300"
              >
                <User className="w-4 h-4" />
                <span>Account</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-white border-primary/20 shadow-xl">
              <DropdownMenuItem className="cursor-pointer hover:bg-primary/5 transition-colors">
                <span className="text-primary font-medium">🚀 Sign Up</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer hover:bg-primary/5 transition-colors">
                <span className="text-gray-700 font-medium">🔑 Login</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
