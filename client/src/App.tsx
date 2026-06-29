import { lazy, Suspense, useLayoutEffect, type ComponentType } from "react";
import { Route, Switch, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import SeoManager from "./components/SeoManager";
import Home from "./pages/Home";

const ApiProviders = lazy(() => import("./ApiProviders"));
const BrandIdentity = lazy(() => import("./pages/BrandIdentity"));
const IntranetLogin = lazy(() => import("./pages/IntranetLogin"));
const IntranetAdmin = lazy(() => import("./pages/IntranetAdmin"));
const IntranetSetup = lazy(() => import("./pages/IntranetSetup"));
const Dienstplan = lazy(() => import("./pages/Dienstplan"));
const Lohnabrechnung = lazy(() => import("./pages/Lohnabrechnung"));
const Personalakte = lazy(() => import("./pages/Personalakte"));
const NotFound = lazy(() => import("@/pages/NotFound"));

function withApiProviders(Component: ComponentType) {
  return function ApiRoute() {
    return (
      <ApiProviders>
        <Component />
      </ApiProviders>
    );
  };
}

const IntranetLoginRoute = withApiProviders(IntranetLogin);
const IntranetAdminRoute = withApiProviders(IntranetAdmin);
const IntranetSetupRoute = withApiProviders(IntranetSetup);
const DienstplanRoute = withApiProviders(Dienstplan);
const LohnabrechnungRoute = withApiProviders(Lohnabrechnung);
const PersonalakteRoute = withApiProviders(Personalakte);

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
        <Route path={"/intranet/login"} component={IntranetLoginRoute} />
        <Route path={"/intranet/setup"} component={IntranetSetupRoute} />
        <Route path={"/intranet/admin"} component={IntranetAdminRoute} />
        <Route path={"/dienstplan"} component={DienstplanRoute} />
        <Route path={"/lohnabrechnung"} component={LohnabrechnungRoute} />
        <Route path={"/personalakte"} component={PersonalakteRoute} />
        <Route path={"/404"} component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark" switchable>
        <LanguageProvider>
          <SeoManager />
          <ScrollToPagePosition />
          <Router />
        </LanguageProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
