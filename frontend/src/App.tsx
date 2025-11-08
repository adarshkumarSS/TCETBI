import React, { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  createBrowserRouter,
  RouterProvider,
  useLocation,
} from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import { Navigation } from "./components/Navigation";
import { AdminNavigation } from "./components/AdminNavigation";

import { Home } from "./pages/Home";
import { Portfolio } from "./pages/Portfolio";
import { People } from "./pages/People";
import { Facilities } from "./pages/Facilities";
import { Program } from "./pages/Program";
import { Media } from "./pages/Media";
import { Blogs } from "./pages/Blogs";
import { Contact } from "./pages/Contact";
import { Auth } from "./pages/Auth";
import { ApplyIncubation } from "./pages/ApplyIncubation";
import { AdminDashboard } from "./pages/AdminDashboard";
import { UpdateContent } from "./pages/admin/UpdateContent";
import { Applications } from "./pages/admin/Applications";
import { Settings } from "./pages/admin/Settings";
import { RejectedApplications } from "./pages/admin/RejectedApplications";
import { LinkedinPosts } from "./pages/admin/LinkedinPosts";
import { CurrentIncubators } from "./pages/admin/CurrentIncubators";
import { AdminProfile } from "./pages/admin/AdminProfile";
import { StartupDetailPage } from "./pages/StartupDetailPage";

import NotFound from "./pages/NotFound";
import CubeCarousel from "./pages/Test";
import CommonLoader from "./components/CommonLoader";

const queryClient = new QueryClient();

const theme = createTheme({
  typography: {
    fontFamily: "Poppins, sans-serif",
  },
  palette: {
    mode: "light",
  },
});

// --- Navigation Wrapper ---
const AppContent = () => {
  const location = useLocation();
  const hideNav = ["/auth", "/apply-incubation"].includes(location.pathname);
  const isAdminRoute = location.pathname.startsWith("/admin");
  const [loading, setLoading] = useState(location.pathname === "/");

  useEffect(() => {
    if (location.pathname === "/") {
      setLoading(true);
      const timer = setTimeout(() => setLoading(false), 1000);
      return () => clearTimeout(timer);
    } else {
      setLoading(false);
    }
  }, [location.pathname]);

  if (loading) return <CommonLoader />;

  return (
    <>
      {!hideNav && !isAdminRoute && <Navigation />}
      {!hideNav && isAdminRoute && <AdminNavigation />}
    </>
  );
};

// --- Define all routes ---
const router = createBrowserRouter(
  [
    {
      path: "/",
      element: (
        <>
          <AppContent />
          <Home />
        </>
      ),
    },
    {
      path: "/portfolio",
      element: (
        <>
          <AppContent />
          <Portfolio />
        </>
      ),
    },
    {
      path: "/portfolio/:id",
      element: (
        <>
          <AppContent />
          <StartupDetailPage />
        </>
      ),
    },

    {
      path: "/people",
      element: (
        <>
          <AppContent />
          <People />
        </>
      ),
    },
    {
      path: "/facilities",
      element: (
        <>
          <AppContent />
          <Facilities />
        </>
      ),
    },
    {
      path: "/program",
      element: (
        <>
          <AppContent />
          <Program />
        </>
      ),
    },
    {
      path: "/media",
      element: (
        <>
          <AppContent />
          <Media />
        </>
      ),
    },
    {
      path: "/blogs",
      element: (
        <>
          <AppContent />
          <Blogs />
        </>
      ),
    },
    {
      path: "/contact",
      element: (
        <>
          <AppContent />
          <Contact />
        </>
      ),
    },
    {
      path: "/auth",
      element: <Auth />,
    },
    {
      path: "/apply-incubation",
      element: <ApplyIncubation />,
    },
    {
      path: "/admin",
      element: (
        <>
          <AppContent />
          <AdminDashboard />
        </>
      ),
    },
    {
      path: "/admin/update-content",
      element: (
        <>
          <AppContent />
          <UpdateContent />
        </>
      ),
    },
    {
      path: "/admin/applications",
      element: (
        <>
          <AppContent />
          <Applications />
        </>
      ),
    },
    {
      path: "/admin/settings",
      element: (
        <>
          <AppContent />
          <Settings />
        </>
      ),
    },
    {
      path: "/admin/rejected",
      element: (
        <>
          <AppContent />
          <RejectedApplications />
        </>
      ),
    },
    {
      path: "/admin/linkedin",
      element: (
        <>
          <AppContent />
          <LinkedinPosts />
        </>
      ),
    },
    {
      path: "/admin/incubators",
      element: (
        <>
          <AppContent />
          <CurrentIncubators />
        </>
      ),
    },
    {
      path: "/admin/profile",
      element: (
        <>
          <AppContent />
          <AdminProfile />
        </>
      ),
    },
    {
      path: "/test",
      element: (
        <>
          <AppContent />
          <CubeCarousel />
        </>
      ),
    },
    { path: "*", element: <NotFound /> },
  ],
  {
    // ✅ future-proof React Router v7 behavior
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true,
    },
  }
);

// --- Main App ---
const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <RouterProvider router={router} />
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
