
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { UserPlus, DollarSign, Gift, Users } from 'lucide-react';

// 🎯 How It Works Section - Author: Alexander Levi
// 📝 Step-by-step guide to getting started with PerkPal

const HowItWorks = () => {
  const steps = [
    {
      icon: UserPlus,
      step: "1",
      title: "Sign Up",
      description: "Create your account with ₦5,000 registration fee and get ₦2,000 bonus instantly!",
      color: "text-emerald-500",
      bgColor: "bg-emerald-50"
    },
    {
      icon: Gift,
      step: "2", 
      title: "Complete Tasks",
      description: "Watch ads, engage with social media posts, and complete simple tasks to earn money.",
      color: "text-blue-500",
      bgColor: "bg-blue-50"
    },
    {
      icon: Users,
      step: "3",
      title: "Refer Friends", 
      description: "Share your unique referral code and earn ₦1,000 for each friend who joins!",
      color: "text-purple-500",
      bgColor: "bg-purple-50"
    },
    {
      icon: DollarSign,
      step: "4",
      title: "Cash Out",
      description: "Withdraw your earnings directly to your bank account. Minimum withdrawal: ₦1,000",
      color: "text-amber-500", 
      bgColor: "bg-amber-50"
    }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 🎯 Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            How PerkPal
            <span className="text-gradient block">Works 🎮</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Getting started is super easy! Follow these simple steps and you'll be earning money in no time.
          </p>
        </div>

        {/* 🎮 Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <Card 
              key={index}
              className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-0 shadow-lg relative overflow-hidden"
            >
              <CardContent className="p-8 text-center relative z-10">
                {/* 🔢 Step Number */}
                <div className="absolute top-4 right-4 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-gray-600">{step.step}</span>
                </div>
                
                {/* 🎨 Icon */}
                <div className={`w-16 h-16 ${step.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <step.icon className={`w-8 h-8 ${step.color}`} />
                </div>
                
                {/* 📝 Content */}
                <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">{step.description}</p>
              </CardContent>
              
              {/* ✨ Decorative Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white opacity-50 group-hover:opacity-70 transition-opacity duration-300"></div>
            </Card>
          ))}
        </div>

        {/* 💡 Additional Info */}
        <div className="mt-16 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-2xl p-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              💎 Pro Tips for Maximum Earnings
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="text-3xl mb-3">⏰</div>
                <h4 className="font-semibold text-gray-900 mb-2">Be Consistent</h4>
                <p className="text-gray-600 text-sm">Login daily to maximize your earning potential</p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="text-3xl mb-3">🎯</div>
                <h4 className="font-semibold text-gray-900 mb-2">Focus on Referrals</h4>
                <p className="text-gray-600 text-sm">The referral program offers the highest payouts</p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="text-3xl mb-3">📱</div>
                <h4 className="font-semibold text-gray-900 mb-2">Stay Active</h4>
                <p className="text-gray-600 text-sm">Complete tasks regularly for bonus multipliers</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
