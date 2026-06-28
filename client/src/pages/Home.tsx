import { lazy, Suspense, useEffect, useState } from "react";
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
  const [renderSections, setRenderSections] = useState(() => {
    if (typeof window === "undefined") return false;
    return Boolean(window.location.hash && window.location.hash !== "#home");
  });

  useEffect(() => {
    if (renderSections) return;

    const loadSections = () => setRenderSections(true);

    const onHashChange = () => {
      if (window.location.hash && window.location.hash !== "#home") {
        loadSections();
      }
    };

    window.addEventListener("hashchange", onHashChange);
    window.addEventListener("scroll", loadSections, {
      once: true,
      passive: true,
    });

    return () => {
      window.removeEventListener("hashchange", onHashChange);
      window.removeEventListener("scroll", loadSections);
    };
  }, [renderSections]);

  useEffect(() => {
    if (!renderSections || !window.location.hash) return;

    const targetId = decodeURIComponent(window.location.hash.slice(1));
    const frame = window.requestAnimationFrame(() => {
      document.getElementById(targetId)?.scrollIntoView({
        block: "start",
        behavior: "smooth",
      });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [renderSections]);

  return (
    <div className="bb-site">
      <Navbar />
      <HeroSection />
      {renderSections && (
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
      )}
    </div>
  );
}
