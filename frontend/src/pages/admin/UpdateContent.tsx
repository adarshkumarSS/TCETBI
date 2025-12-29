import { useState, useEffect } from "react";
import { Box, Typography, IconButton, Grid, Paper, Chip } from "@mui/material";
import { 
  ArrowLeft, 
  Loader2, 
  Home as HomeIcon,
  Briefcase,
  Users,
  Building2,
  Calendar,
  Image as ImageIcon,
  FileText,
  Mail,
  Handshake,
  CheckCircle2
} from "lucide-react";
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
  { name: "Home", icon: HomeIcon, color: "#DC143C", description: "Landing page content" },
  { name: "Portfolio", icon: Briefcase, color: "#FF6B6B", description: "Startups & companies" },
  { name: "People", icon: Users, color: "#4ECDC4", description: "Team & board members" },
  { name: "Facilities", icon: Building2, color: "#45B7D1", description: "Infrastructure & amenities" },
  { name: "Events", icon: Calendar, color: "#FFA07A", description: "Upcoming & past events" },
  { name: "Media", icon: ImageIcon, color: "#98D8C8", description: "Photo galleries" },
  { name: "Blogs", icon: FileText, color: "#F7DC6F", description: "Blog posts & articles" },
  { name: "Contact", icon: Mail, color: "#BB8FCE", description: "Contact information" },
  { name: "Partnerships", icon: Handshake, color: "#85C1E2", description: "Partner organizations" },
];

export const UpdateContent = () => {
  const [selectedPage, setSelectedPage] = useState<string>("Home");
  const [showEditor, setShowEditor] = useState(false);
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
    if (showEditor) {
      if (isDirty) {
        if (window.confirm("You have unsaved changes. Are you sure you want to go back?")) {
          setShowEditor(false);
          setIsDirty(false);
        }
      } else {
        setShowEditor(false);
      }
    } else {
      navigate("/admin");
    }
  };

  const handlePageSelect = (pageName: string) => {
    if (isDirty) {
      if (window.confirm("You have unsaved changes. Are you sure you want to switch pages?")) {
        setIsDirty(false);
        setSelectedPage(pageName);
        setShowEditor(true);
      }
    } else {
      setSelectedPage(pageName);
      setShowEditor(true);
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
          pb: 6,
        }}
      >
        <Box sx={{ maxWidth: "1400px", mx: "auto" }}>
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
                {showEditor ? `Edit ${selectedPage}` : "Update Page Content"}
              </Typography>
            </Box>
            
            {showEditor && (
              <Chip 
                icon={<CheckCircle2 size={16} />}
                label={`Editing: ${selectedPage}`}
                sx={{ 
                  bgcolor: 'hsl(var(--primary))',
                  color: 'white',
                  fontWeight: 600,
                  px: 2
                }}
              />
            )}
          </Box>

          {/* Page Selector or Editor */}
          {!showEditor ? (
            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 600,
                  color: "hsl(var(--foreground))",
                  mb: 2,
                }}
              >
                Select a page to edit
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "hsl(var(--muted-foreground))",
                  mb: 4,
                }}
              >
                Choose from the pages below to update their content
              </Typography>

              <Grid container spacing={3}>
                {pages.map((page) => {
                  const Icon = page.icon;
                  return (
                    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={page.name}>
                      <Paper
                        onClick={() => handlePageSelect(page.name)}
                        sx={{
                          p: 3,
                          cursor: "pointer",
                          border: "2px solid",
                          borderColor: "hsl(var(--border))",
                          borderRadius: "12px",
                          transition: "all 0.3s ease",
                          position: "relative",
                          overflow: "hidden",
                          "&:hover": {
                            borderColor: page.color,
                            transform: "translateY(-4px)",
                            boxShadow: `0 8px 24px ${page.color}40`,
                            "& .page-icon": {
                              transform: "scale(1.1) rotate(5deg)",
                              color: page.color,
                            },
                            "& .page-bg": {
                              opacity: 0.1,
                            },
                          },
                        }}
                      >
                        {/* Background decoration */}
                        <Box
                          className="page-bg"
                          sx={{
                            position: "absolute",
                            top: -20,
                            right: -20,
                            width: 100,
                            height: 100,
                            borderRadius: "50%",
                            bgcolor: page.color,
                            opacity: 0,
                            transition: "opacity 0.3s ease",
                          }}
                        />

                        <Box sx={{ position: "relative", zIndex: 1 }}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 2,
                              mb: 2,
                            }}
                          >
                            <Box
                              className="page-icon"
                              sx={{
                                width: 48,
                                height: 48,
                                borderRadius: "12px",
                                bgcolor: `${page.color}20`,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                transition: "all 0.3s ease",
                              }}
                            >
                              <Icon size={24} color={page.color} />
                            </Box>
                            <Typography
                              variant="h6"
                              sx={{
                                fontFamily: "Poppins, sans-serif",
                                fontWeight: 700,
                                color: "hsl(var(--foreground))",
                              }}
                            >
                              {page.name}
                            </Typography>
                          </Box>
                          <Typography
                            variant="body2"
                            sx={{
                              color: "hsl(var(--muted-foreground))",
                              lineHeight: 1.6,
                            }}
                          >
                            {page.description}
                          </Typography>
                        </Box>
                      </Paper>
                    </Grid>
                  );
                })}
              </Grid>
            </Box>
          ) : (
            <Box
              sx={{
                backgroundColor: "hsl(var(--card))",
                borderRadius: "var(--radius)",
                p: 4,
                border: "1px solid hsl(var(--border))",
              }}
            >
              {renderPageContent()}
            </Box>
          )}
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
