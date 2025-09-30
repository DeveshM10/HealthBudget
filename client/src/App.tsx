import { Switch, Route } from "wouter";
import { lazy, Suspense } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import Home from "@/pages/Home";
import Landing from "@/pages/Landing";
const DoctorProfile = lazy(() => import("@/pages/DoctorProfile"));
const DoctorSearch = lazy(() => import("@/pages/DoctorSearch"));
const PatientDashboard = lazy(() => import("@/pages/PatientDashboard"));
import NotFound from "@/pages/not-found";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Suspense fallback={<div style={{ padding: 20 }}>Loading…</div>}>
      <Switch>
      {isLoading || !isAuthenticated ? (
        <Route path="/" component={Landing} />
      ) : (
        <>
          <Route path="/" component={Home} />
          <Route path="/doctors" component={DoctorSearch} />
          <Route path="/doctor/:id" component={DoctorProfile} />
          <Route path="/dashboard" component={PatientDashboard} />
        </>
      )}
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
