'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/landingpage/HeaderComponent';
import HeroSection from '@/components/landingpage/HeroSection';
import FeaturesSection from '@/components/landingpage/FeaturesSection';
import ProcessSection from '@/components/landingpage/ProcessSection';
import CTASection from '@/components/landingpage/CTAComponent';
import Footer from '@/components/landingpage/FooterComponent';

export default function HomePage() {
  const router = useRouter();

  const handleRegister = () => {
    // Navigate to registration page
    router.push('/register');
    console.log("Navigate to register");
  };

  const handleLogin = () => {
    // Navigate to login page
    router.push('/login');
    console.log("Navigate to login");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <Header onLogin={handleLogin} onRegister={handleRegister} />
      
      <main className="flex-1">
        <HeroSection onRegister={handleRegister} />
        <FeaturesSection />
        <ProcessSection />
        <CTASection onRegister={handleRegister} />
      </main>

      <Footer />
    </div>
  );
}