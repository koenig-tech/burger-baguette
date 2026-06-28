import { lazy, Suspense } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";

const ConceptSection = lazy(() => import("@/components/ConceptSection"));
const BrandSystemSection = lazy(
  () => import("@/components/BrandSystemSection")
);
const HighlightsSection = lazy(() => import("@/components/HighlightsSection"));
const MenuSection = lazy(() => import("@/components/MenuSection"));
const QualityStandardsSection = lazy(
  () => import("@/components/QualityStandardsSection")
);
const ExperienceSection = lazy(() => import("@/components/ExperienceSection"));
const OperationsSection = lazy(() => import("@/components/OperationsSection"));
const BusinessPlanSection = lazy(
  () => import("@/components/BusinessPlanSection")
);
const LaunchSection = lazy(() => import("@/components/LaunchSection"));
const Footer = lazy(() => import("@/components/Footer"));

export default function Home() {
  return (
    <div className="bb-site">
      <Navbar />
      <HeroSection />
      <Suspense fallback={null}>
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
      </Suspense>
    </div>
  );
}
