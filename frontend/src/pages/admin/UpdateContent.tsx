import { useState, useEffect } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useNavigate, useBlocker } from "react-router-dom";
import { LeaveReminderModal } from "@/components/LeaveReminderModal";

// pages
import { HomePage } from "./updates/HomePage";
import { PortfolioPage } from "./updates/PortfolioPage";
import { PeoplePage } from "./updates/PeoplePage";
import { FacilitiesPage } from "./updates/FacilitiesPage";
import { EventsManagement } from "./updates/EventsManagement";
import { MediaPage } from "./updates/MediaPage";
import { BlogPage } from "./updates/BlogPage";
import { ContactPage } from "./updates/ContactPage";
import { PartnershipsManagement } from "./updates/PartnershipsManagement";

const pages = [
  "Home",
  "Portfolio",
  "People",
  "Facilities",
  "Events",
  "Media",
  "Blogs",
  "Contact",
  "Partnerships",
];

export const UpdateContent = () => {
  const [selectedPage, setSelectedPage] = useState<string>("Home");
  const [isDirty, setIsDirty] = useState(false);
  const navigate = useNavigate();
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Block navigation if there are unsaved changes
  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      isDirty && currentLocation.pathname !== nextLocation.pathname
  );

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      navigate('/auth');
    } else {
      setIsAuthenticated(true);
    }
    setIsAuthLoading(false);
  }, [navigate]);

  if (isAuthLoading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor: "hsl(var(--background))",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Loader2 size={32} className="animate-spin" />
          <Typography variant="body1">Checking authentication...</Typography>
        </Box>
      </Box>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const handleBack = () => {
    navigate("/admin");
  };

  const handlePageChange = (value: string) => {
    if (isDirty) {
      if (window.confirm("You have unsaved changes. Are you sure you want to switch pages?")) {
        setIsDirty(false);
        setSelectedPage(value);
      }
    } else {
      setSelectedPage(value);
    }
  };

  const renderPageContent = () => {
    switch (selectedPage) {
      case "Home":
        return <HomePage setIsDirty={setIsDirty} />;
      case "Portfolio":
        return <PortfolioPage />;
      case "People":
        return <PeoplePage />;
      case "Facilities":
        return <FacilitiesPage />;
      case "Events":
        return <EventsManagement />;
      case "Media":
        return <MediaPage />;
      case "Blogs":
        return <BlogPage />;
      case "Contact":
        return <ContactPage />;
      case "Partnerships":
        return <PartnershipsManagement />;
      default:
        return <HomePage setIsDirty={setIsDirty} />;
    }
  };

  return (
    <>
      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor: "hsl(var(--background))",
          pt: 12,
          px: 4,
        }}
      >
        <Box sx={{ maxWidth: "1200px", mx: "auto" }}>
          {/* Header */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 4,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <IconButton
                onClick={handleBack}
                sx={{
                  color: "hsl(var(--foreground))",
                  "&:hover": { backgroundColor: "hsl(var(--muted))" },
                }}
              >
                <ArrowLeft size={24} />
              </IconButton>

              <Typography
                variant="h4"
                sx={{
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 700,
                  color: "hsl(var(--foreground))",
                }}
              >
                Update Page Content
              </Typography>
            </Box>
          </Box>

          {/* Main Content */}
          <Box
            sx={{
              backgroundColor: "hsl(var(--card))",
              borderRadius: "var(--radius)",
              p: 4,
              border: "1px solid hsl(var(--border))",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 600,
                color: "hsl(var(--foreground))",
                mb: 3,
              }}
            >
              Select Page to Edit
            </Typography>

            <Select value={selectedPage} onValueChange={handlePageChange}>
              <SelectTrigger className="w-full max-w-xs text-foreground">
                <SelectValue placeholder="Select a page" />
              </SelectTrigger>
              <SelectContent>
                {pages.map((page) => (
                  <SelectItem key={page} value={page}>
                    {page}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Render Selected Page */}
            {renderPageContent()}
          </Box>
        </Box>
      </Box>

      {/* Reminder Modal controlled by blocker */}
      {blocker.state === "blocked" && (
        <LeaveReminderModal
          open={true}
          onStay={() => blocker.reset()}
          onLeave={() => blocker.proceed()}
        />
      )}
    </>
  );
};
