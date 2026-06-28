"use client";

import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ConceptSection from "@/components/ConceptSection";
import BrandSystemSection from "@/components/BrandSystemSection";
import HighlightsSection from "@/components/HighlightsSection";
import MenuSection from "@/components/MenuSection";
import QualityStandardsSection from "@/components/QualityStandardsSection";
import ExperienceSection from "@/components/ExperienceSection";
import OperationsSection from "@/components/OperationsSection";
import BusinessPlanSection from "@/components/BusinessPlanSection";
import LaunchSection from "@/components/LaunchSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="bb-site">
      <Navbar />
      <HeroSection />
      <ConceptSection />
      <BrandSystemSection />
      <HighlightsSection />
      <MenuSection />
      <QualityStandardsSection />
      <ExperienceSection />
      <OperationsSection />
      <BusinessPlanSection />
      <LaunchSection />
      <Footer />
    </div>
  );
}
