/**
 * @file HomePage.jsx
 * @description Trang chủ SeatNow
 */
import React from 'react';
import HeroSection from '../components/HeroSection';
import FeaturedRestaurants from '../components/FeaturedRestaurants';
import WhyChooseUs from '../components/WhyChooseUs';
import HowItWorks from '../components/HowItWorks';
import Testimonials from '../components/Testimonials';
import CTASection from '../components/CTASection';

const HomePage = () => {
  return (
    <div className="bg-slate-50 w-full mb-0 pb-0 flex flex-col pt-0">
      <HeroSection />
      <FeaturedRestaurants />
      <WhyChooseUs />
      <HowItWorks />
      <Testimonials />
      <CTASection />
    </div>
  );
};

export default HomePage;
