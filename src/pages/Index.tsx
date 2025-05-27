
import React from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import HowItWorks from '@/components/HowItWorks';
import Footer from '@/components/Footer';

// 🎯 PerkPal Main Landing Page - Author: Alexander Levi
// 🌟 Complete landing experience to convert visitors into users

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* 🧭 Navigation */}
      <Navbar />
      
      {/* 🎯 Hero Section */}
      <Hero />
      
      {/* ✨ Features Section */}
      <Features />
      
      {/* 📝 How It Works */}
      <HowItWorks />
      
      {/* 🔗 Footer */}
      <Footer />
    </div>
  );
};

export default Index;
