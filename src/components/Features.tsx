
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { DollarSign, Users, Gift, User } from 'lucide-react';

// 🎯 PerkPal Features Section - Author: Alexander Levi  
// ✨ Showcase all the amazing ways users can earn money

const Features = () => {
  const features = [
    {
      icon: DollarSign,
      title: "Watch & Earn",
      description: "Get paid to watch ads and videos. Easy money for minimal effort!",
      color: "text-emerald-500",
      bgColor: "bg-emerald-50",
      amount: "₦50-200 per video"
    },
    {
      icon: User,
      title: "Social Media Tasks",
      description: "Like, share, and interact with posts on social media platforms.",
      color: "text-blue-500", 
      bgColor: "bg-blue-50",
      amount: "₦25-100 per task"
    },
    {
      icon: Users,
      title: "Referral Program",
      description: "Invite friends and earn ₦1,000 for each referral, plus ₦250 for their referrals!",
      color: "text-purple-500",
      bgColor: "bg-purple-50", 
      amount: "₦1,000 + ₦250"
    },
    {
      icon: Gift,
      title: "Daily Bonuses",
      description: "Login daily for bonus rewards and special task opportunities.",
      color: "text-amber-500",
      bgColor: "bg-amber-50",
      amount: "₦100-500 daily"
    }
  ];

  return (
    <section id="features" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 🎯 Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Multiple Ways to 
            <span className="text-gradient block">Earn Money! 💰</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            PerkPal offers various earning opportunities that fit your lifestyle. 
            From simple tasks to passive income - there's something for everyone!
          </p>
        </div>

        {/* 🎮 Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index}
              className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-0 shadow-lg"
            >
              <CardContent className="p-8 text-center">
                {/* 🎨 Icon */}
                <div className={`w-16 h-16 ${feature.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className={`w-8 h-8 ${feature.color}`} />
                </div>
                
                {/* 📝 Content */}
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 mb-4 leading-relaxed">{feature.description}</p>
                
                {/* 💵 Earning Amount */}
                <div className="bg-gray-100 rounded-lg py-2 px-4">
                  <span className="text-sm font-semibold text-gray-700">Earn: </span>
                  <span className={`font-bold ${feature.color}`}>{feature.amount}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 🎉 CTA Section */}
        <div className="text-center mt-16">
          <div className="bg-white rounded-2xl p-8 shadow-xl max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Start Earning? 🚀
            </h3>
            <p className="text-gray-600 mb-6">
              Join thousands of users who are already making money with PerkPal!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div className="bg-emerald-50 rounded-xl p-4 flex-1">
                <div className="text-2xl font-bold text-emerald-600">₦2,000</div>
                <div className="text-sm text-gray-600">Welcome Bonus</div>
              </div>
              <div className="bg-purple-50 rounded-xl p-4 flex-1">
                <div className="text-2xl font-bold text-purple-600">₦5,000</div>
                <div className="text-sm text-gray-600">Registration Fee</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
