
import React from 'react';
import { Separator } from '@/components/ui/separator';

// 🎯 PerkPal Footer - Author: Alexander Levi
// 🔗 Professional footer with all important links and info

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* 💎 Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">P</span>
              </div>
              <span className="text-2xl font-bold">PerkPal</span>
            </div>
            <p className="text-gray-300 mb-6 max-w-md">
              The easiest way to earn money online. Complete simple tasks, refer friends, 
              and watch your earnings grow every day! 🚀
            </p>
            <div className="flex space-x-4">
              <div className="text-sm text-gray-400">
                Made with ❤️ by Alexander Levi
              </div>
            </div>
          </div>

          {/* 🔗 Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#features" className="text-gray-300 hover:text-white transition-colors">Features</a></li>
              <li><a href="#how-it-works" className="text-gray-300 hover:text-white transition-colors">How It Works</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Pricing</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">FAQ</a></li>
            </ul>
          </div>

          {/* 🛡️ Legal */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Support</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>

        <Separator className="my-8 bg-gray-700" />

        {/* 📄 Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-400 text-sm mb-4 md:mb-0">
            © 2024 PerkPal. All rights reserved. Built with 🚀 for Nigerian entrepreneurs.
          </div>
          <div className="flex items-center space-x-6">
            <div className="text-sm text-gray-400">
              💰 Total Paid: ₦50M+ | 👥 Active Users: 100K+
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
