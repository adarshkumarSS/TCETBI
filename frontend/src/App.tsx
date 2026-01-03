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
import { Events } from "./pages/Events";
import { CreateEvent } from "./pages/admin/CreateEvent";
import { Media } from "./pages/Media";
import { Blogs } from "./pages/Blogs";
import { Contact } from "./pages/Contact";
import { Partnerships } from "./pages/Partnerships";
import { Auth } from "./pages/Auth";
import { ApplyIncubation } from "./pages/ApplyIncubation";
import { AdminDashboard } from "./pages/AdminDashboard";
import { UpdateContent } from "./pages/admin/UpdateContent";
import { Applications } from "./pages/admin/Applications";
import { Settings } from "./pages/admin/Settings";
import { RejectedApplications } from "./pages/admin/RejectedApplications";

import { CurrentIncubators } from "./pages/admin/CurrentIncubators";
import { StartupDetailPage } from "./pages/StartupDetailPage";
import { NotificationsPage } from "./pages/admin/NotificationPage";
import { UserManagement } from "./pages/admin/UserManagement";
import { CompanyRequests } from "./pages/admin/CompanyRequests";
import { UserDashboard } from "./pages/UserDashboard";
import { Support } from "./pages/Support";
import { MyCompany } from "./pages/MyCompany";
import { SupportRequests } from "./pages/admin/SupportRequests";
import { AdminMentors } from "./pages/admin/AdminMentors";
import { FundingSupport } from "./pages/support/FundingSupport";
import { MentoringSupport } from "./pages/support/MentoringSupport";
import { IdeaValidation } from "./pages/support/IdeaValidation";
import { ApplyMentor } from "./pages/support/ApplyMentor";
import { FormBuilder } from "./pages/admin/FormBuilder";
import { FormSubmissions } from "./pages/admin/FormSubmissions";

import NotFound from "./pages/NotFound";
import CubeCarousel from "./pages/Test";

const queryClient = new QueryClient();

import { UserNavigation } from "./components/UserNavigation";

// --- Navigation Wrapper ---
const AppContent = () => {
  const location = useLocation();
  const hideNav = ["/auth", "/apply-incubation"].includes(location.pathname);
  const isAdminRoute = location.pathname.startsWith("/admin");
  const isUserRoute = location.pathname.startsWith("/user");

  return (
    <>
      {!hideNav && !isAdminRoute && !isUserRoute && <Navigation />}
      {!hideNav && isAdminRoute && <AdminNavigation />}
      {!hideNav && isUserRoute && <UserNavigation />}
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
      path: "/partnerships",
      element: (
        <>
          <AppContent />
          <Partnerships />
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
      path: "/events",
      element: (
        <>
          <AppContent />
          <Events />
        </>
      ),
    },
    {
      path: "/admin/create-event",
      element: (
        <>
          <AppContent />
          <CreateEvent />
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
      path: "/support",
      element: (
        <>
          <AppContent />
          <Support />
        </>
      ),
    },
    {
      path: "/support/funding",
      element: (
        <>
          <AppContent />
          <FundingSupport />
        </>
      ),
    },
    {
      path: "/support/mentoring",
      element: (
        <>
          <AppContent />
          <MentoringSupport />
        </>
      ),
    },
    {
      path: "/support/validation",
      element: (
        <>
          <AppContent />
          <IdeaValidation />
        </>
      ),
    },
    {
      path: "/support/apply-mentor",
      element: (
        <>
          <AppContent />
          <ApplyMentor />
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
      path: "/user/dashboard",
      element: (
        <>
          <AppContent />
          <UserDashboard />
        </>
      ),
    },
    {
      path: "/user/my-company",
      element: (
        <>
          <AppContent />
          <MyCompany />
        </>
      ),
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
      path: "/admin/incubators",
      element: (
        <>
          <AppContent />
          <CurrentIncubators />
        </>
      ),
    },
    {
      path: "/admin/notifications",
      element: (
        <>
          <AppContent />
          <NotificationsPage />
        </>
      ),
    },
    {
      path: "/admin/users",
      element: (
        <>
          <AppContent />
          <UserManagement />
        </>
      ),
    },


    {
      path: "/admin/company-requests",
      element: (
        <>
          <AppContent />
          <CompanyRequests />
        </>
      ),
    },
    {
      path: "/admin/support-requests",
      element: (
        <>
          <AppContent />
          <SupportRequests />
        </>
      ),
    },
    {
      path: "/admin/mentors",
      element: (
        <>
          <AppContent />
          <AdminMentors />
        </>
      ),
    },
    {
      path: "/admin/forms",
      element: (
        <>
          <AppContent />
          <FormBuilder />
        </>
      ),
    },
    {
      path: "/admin/submissions",
      element: (
        <>
          <AppContent />
          <FormSubmissions />
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
const App = () => {
  const [themeMode, setThemeMode] = useState<"light" | "dark">("light");

  useEffect(() => {
    // Load saved theme from localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (savedTheme === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      // Fallback to system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        document.documentElement.classList.add('dark');
      }
    }

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          const isDark = document.documentElement.classList.contains('dark');
          setThemeMode(isDark ? 'dark' : 'light');
          // Save to localStorage when theme changes
          localStorage.setItem('theme', isDark ? 'dark' : 'light');
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    // Initial set
    const initialDark = document.documentElement.classList.contains('dark');
    setThemeMode(initialDark ? 'dark' : 'light');

    return () => observer.disconnect();
  }, []);

  const theme = createTheme({
    typography: {
      fontFamily: "Poppins, sans-serif",
    },
    palette: {
      mode: themeMode,
      primary: {
        main: "#e60000",
      },
    },
  });

  return (
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
};

export default App;
