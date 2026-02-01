import React from 'react';
import Hero from '@/components/home/Hero';
import CategoryGrid from '@/components/home/CategoryGrid';
import AboutSection from '@/components/home/AboutSection';
import AboutQuilting from '@/components/home/AboutQuilting';
import StatsSection from '@/components/home/StatsSection';
import WhyUs from '@/components/home/WhyUs';
import Newsletter from '@/components/home/Newsletter';
import config from '../config.json';
import Link from 'next/link';

async function getCategories() {
  // TODO: Use new service URL when provided by user.
  // const res = await fetch(`${config.service_url}getuserscategory`, { next: { revalidate: 3600 } });
  // if (!res.ok) return [];
  // const data = await res?.json() || [];
  // return data?.filter((c: any) => c.isactive === 1);

  return [
    {
      title: "Quilting Services",
      subtitle: "Longarm Quilting",
      imageurl: config.slider[0].image_url,
      category: "Service",
      type: "Service",
      button_text: "Know More",
      button_url: "/about"
    },
    {
      title: "Fabrics",
      subtitle: "100% Quilting Cotton",
      imageurl: config.slider[1].image_url,
      category: "",
      type: "Product",
      button_text: "Shop Now",
      button_url: "/shop"
    },
    {
      title: "Kits",
      subtitle: "DIY kits for quilting & Bags",
      imageurl: config.slider[1].image_url,
      category: "",
      type: "Product",
      button_text: "Shop Now",
      button_url: "/shop"
    }
  ];
}

export const metadata = {
  title: 'Home | Tsala Studio',
  description: 'Quilting, Selling, and Hobby Classes in Bengaluru.',
};

export default async function Home() {
  const categories = await getCategories();

  return (
    <div className="bg-gray-50 min-h-screen">
      <Hero />

      <CategoryGrid categories={categories} />

      <AboutSection />
      <AboutQuilting />
      <WhyUs />

      <StatsSection />

      <Newsletter />
    </div>
  );
}
