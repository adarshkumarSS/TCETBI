import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  IconButton,
} from "@mui/material";
import Grid from "@mui/material/Grid"; // ✅ regular Grid import
import {
  FileEdit,
  ClipboardList,
  Settings,
  XCircle,
  Linkedin,
  Building2,
  UserCog,
  Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const cards = [
  {
    icon: <FileEdit size={28} color="#4F46E5" />, // Indigo
    title: "Update Page Content",
    description: "Edit and manage website content",
    path: "/admin/update-content",
  },
  {
    icon: <ClipboardList size={28} color="#059669" />, // Green
    title: "View Applications",
    description: "Review incubation applications",
    path: "/admin/applications",
  },
  {
    icon: <Settings size={28} color="#D97706" />, // Amber
    title: "Admin Settings",
    description: "Configure system preferences",
    path: "/admin/settings",
  },
  {
    icon: <XCircle size={28} color="#DC2626" />, // Red
    title: "Rejected Applications",
    description: "View declined applications",
    path: "/admin/rejected",
  },
  {
    icon: <Linkedin size={28} color="#2563EB" />, // Blue
    title: "LinkedIn Posts",
    description: "Manage social media content",
    path: "/admin/linkedin",
  },
  {
    icon: <Building2 size={28} color="#7C3AED" />, // Purple
    title: "Current Incubators",
    description: "Active company directory",
    path: "/admin/incubators",
  },
  {
    icon: <UserCog size={28} color="#10B981" />, // Emerald
    title: "Admin Profile",
    description: "Manage your account",
    path: "/admin/profile",
  },
];

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      navigate('/auth');
    } else {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, [navigate]);

  if (isLoading) {
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

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "hsl(var(--background))",
        pt: 12,
        px: { xs: 3, sm: 6 },
      }}
    >
      {/* Header */}
      <Typography
        variant="h3"
        align="center"
        sx={{
          fontFamily: "Poppins, sans-serif",
          fontWeight: 700,
          color: "hsl(var(--primary))",
          mb: 1,
        }}
      >
        Admin Dashboard
      </Typography>

      <Typography
        variant="subtitle1"
        align="center"
        sx={{
          color: "hsl(var(--muted-foreground))",
          mb: 6,
          fontFamily: "Poppins, sans-serif",
        }}
      >
        Manage your incubator platform
      </Typography>

      {/* Cards Grid */}
      <Grid
        container
        spacing={3}
        justifyContent="center"
        sx={{ maxWidth: "1200px", mx: "auto" }}
      >
        {cards.map((card, index) => (
          <Grid
            size={{ xs: 12, sm: 6, md: 4 }}
            key={index}
          >
            <Card
              onClick={() => navigate(card.path)}
              sx={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "16px",
                transition: "all 0.3s ease",
                cursor: "pointer",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: "0 6px 20px rgba(0,0,0,0.2)",
                },
              }}
            >
              <CardContent
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  gap: 1.5,
                  py: 4,
                }}
              >
                <IconButton
                  sx={{
                    width: 60,
                    height: 60,
                    backgroundColor: "hsl(var(--muted))",
                    borderRadius: "50%",
                    "&:hover": {
                      backgroundColor: "hsl(var(--accent))",
                    },
                  }}
                >
                  {card.icon}
                </IconButton>

                <Typography
                  variant="h6"
                  sx={{
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 600,
                    color: "hsl(var(--foreground))",
                    mt: 1,
                  }}
                >
                  {card.title}
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    color: "hsl(var(--muted-foreground))",
                    fontFamily: "Poppins, sans-serif",
                    maxWidth: "240px",
                  }}
                >
                  {card.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
