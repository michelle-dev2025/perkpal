
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowDown, DollarSign, Users, Gift } from 'lucide-react';

// 🌟 PerkPal Hero Section - Author: Alexander Levi
// 💫 Eye-catching hero with 3D animations and engaging copy

const Hero = () => {
  return (
    <section className="relative min-h-screen bg-gradient-to-br from-emerald-50 via-white to-purple-50 overflow-hidden">
      {/* 🎨 Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-amber-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float" style={{animationDelay: '4s'}}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        <div className="text-center">
          {/* 🎯 Main Headline */}
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-8 leading-tight">
            Earn Money
            <span className="block text-gradient animate-pulse-slow">Doing Fun Tasks!</span>
          </h1>

          {/* 💰 Value Proposition */}
          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Join PerkPal today and start earning real money! Get ₦2,000 bonus when you register with just ₦5,000. 
            Complete tasks, refer friends, and watch your wallet grow! 🚀
          </p>

          {/* 🎮 Feature Pills */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg">
              <DollarSign className="w-5 h-5 text-emerald-500" />
              <span className="font-semibold text-gray-700">₦2,000 Welcome Bonus</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg">
              <Users className="w-5 h-5 text-purple-500" />
              <span className="font-semibold text-gray-700">₦1,000 Per Referral</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg">
              <Gift className="w-5 h-5 text-amber-500" />
              <span className="font-semibold text-gray-700">Daily Rewards</span>
            </div>
          </div>

          {/* 🚀 CTA Button */}
          <div className="space-y-4">
            <Button 
              size="lg" 
              className="gradient-primary text-white font-bold py-6 px-12 rounded-2xl text-xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 glow-effect"
            >
              🎉 Start Earning Now - Get ₦2,000 Free!
            </Button>
            <p className="text-sm text-gray-500">No credit card required • Instant ₦2,000 bonus • Start earning in minutes</p>
          </div>

          {/* 📊 Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
            <div className="text-center">
              <div className="text-4xl font-bold text-emerald-600 mb-2">₦50M+</div>
              <div className="text-gray-600">Total Paid Out</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">100K+</div>
              <div className="text-gray-600">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-amber-600 mb-2">1M+</div>
              <div className="text-gray-600">Tasks Completed</div>
            </div>
          </div>
        </div>
      </div>

      {/* 🔽 Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <ArrowDown className="w-6 h-6 text-gray-400 animate-bounce" />
      </div>
    </section>
  );
};

export default Hero;
