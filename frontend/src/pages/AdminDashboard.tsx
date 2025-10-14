import { Box, Typography } from "@mui/material";
import { MagicBento } from "../components/ui/MagicBento";

const cardData = [
  {
    color: "hsl(var(--card))",
    title: "Update Page Content",
    description: "Edit and manage website content",
    label: "Content",
    path: "/admin/update-content"
  },
  {
    color: "hsl(var(--card))",
    title: "View Applications",
    description: "Review incubation applications",
    label: "Applications",
    path: "/admin/applications"
  },
  {
    color: "hsl(var(--card))",
    title: "Admin Settings",
    description: "Configure system preferences",
    label: "Settings",
    path: "/admin/settings"
  },
  {
    color: "hsl(var(--card))",
    title: "Rejected Applications",
    description: "View declined applications",
    label: "Rejected",
    path: "/admin/rejected"
  },
  {
    color: "hsl(var(--card))",
    title: "LinkedIn Posts",
    description: "Manage social media content",
    label: "Social",
    path: "/admin/linkedin"
  },
  {
    color: "hsl(var(--card))",
    title: "Current Incubators",
    description: "Active company directory",
    label: "Companies",
    path: "/admin/incubators"
  },
  {
    color: "hsl(var(--card))",
    title: "Admin Profile",
    description: "Manage your account",
    label: "Profile",
    path: "/admin/profile"
  }
];

export const AdminDashboard = () => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "hsl(var(--background))",
        pt: 12,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Typography
        variant="h3"
        sx={{
          fontFamily: "Poppins, sans-serif",
          fontWeight: 700,
          color: "hsl(var(--primary))",
          mb: 2,
          textAlign: "center",
        }}
      >
        Admin Dashboard
      </Typography>
      <Typography
        variant="subtitle1"
        sx={{
          fontFamily: "Poppins, sans-serif",
          color: "hsl(var(--muted-foreground))",
          mb: 6,
          textAlign: "center",
        }}
      >
        Manage your incubator platform
      </Typography>

      <MagicBento
        textAutoHide={true}
        enableStars={true}
        enableSpotlight={true}
        enableBorderGlow={true}
        enableTilt={true}
        enableMagnetism={true}
        clickEffect={true}
        spotlightRadius={300}
        particleCount={12}
        glowColor="220, 20, 60"
        cards={cardData}
      />
    </Box>
  );
};