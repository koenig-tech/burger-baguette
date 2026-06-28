import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { lazy, Suspense, useLayoutEffect } from "react";
import { Route, Switch, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import SeoManager from "./components/SeoManager";
import Home from "./pages/Home";

const BrandIdentity = lazy(() => import("./pages/BrandIdentity"));
const IntranetLogin = lazy(() => import("./pages/IntranetLogin"));
const IntranetAdmin = lazy(() => import("./pages/IntranetAdmin"));
const IntranetSetup = lazy(() => import("./pages/IntranetSetup"));
const Dienstplan = lazy(() => import("./pages/Dienstplan"));
const Lohnabrechnung = lazy(() => import("./pages/Lohnabrechnung"));
const Personalakte = lazy(() => import("./pages/Personalakte"));
const NotFound = lazy(() => import("@/pages/NotFound"));

function ScrollToPagePosition() {
  const [location] = useLocation();

  useLayoutEffect(() => {
    const hash = window.location.hash;

    if (!hash) {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      return;
    }

    const hashTarget = decodeURIComponent(hash.slice(1));
    const frame = window.requestAnimationFrame(() => {
      document.getElementById(hashTarget)?.scrollIntoView({
        block: "start",
        behavior: "auto",
      });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [location]);

  return null;
}

function Router() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <Switch>
        <Route path={"/"} component={Home} />
        <Route path={"/brand"} component={BrandIdentity} />
        <Route path={"/intranet/login"} component={IntranetLogin} />
        <Route path={"/intranet/setup"} component={IntranetSetup} />
        <Route path={"/intranet/admin"} component={IntranetAdmin} />
        <Route path={"/dienstplan"} component={Dienstplan} />
        <Route path={"/lohnabrechnung"} component={Lohnabrechnung} />
        <Route path={"/personalakte"} component={Personalakte} />
        <Route path={"/404"} component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <LanguageProvider>
          <TooltipProvider>
            <SeoManager />
            <Toaster />
            <ScrollToPagePosition />
            <Router />
          </TooltipProvider>
        </LanguageProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
