
import React, { useState } from 'react';
import { Button } from './ui/button';
import { Menu, X, Zap } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "./ui/sheet";

// 🧭 CodeWave Navigation - Author: Alexander Levi
// 🎯 Responsive navbar with mobile menu

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const NavItems = () => (
    <>
      <a href="/auth" className="text-gray-700 hover:text-blue-600 transition-colors">
        🔐 Login
      </a>
      <Button asChild className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:opacity-90">
        <a href="/auth">🚀 Join CodeWave - Pay ₦5,000</a>
      </Button>
    </>
  );

  return (
    <nav className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* 🎯 Logo */}
          <div className="flex items-center">
            <a href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">CodeWave</span>
            </a>
          </div>

          {/* 🖥️ Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <NavItems />
          </div>

          {/* 📱 Mobile menu button */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Menu className="h-6 w-6" />
                </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col space-y-4 mt-6">
                  <NavItems />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
