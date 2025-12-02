import { useEffect, useState } from "react";
import { Box, Typography, Avatar, IconButton } from "@mui/material";
import { Card, CardContent } from "@/components/ui/card";
import { OutlinedTextField } from "@/components/ui/OutlinedTextField";
import { DarkButton } from "@/components/ui/DarkButton";
import { User, Mail, Phone, MapPin, ArrowLeft, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const AdminProfile = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: "Admin User",
    email: "admin@tce-tbi.edu",
    phone: "+91 98765 43210",
    location: "Madurai, Tamil Nadu"
  });

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      navigate('/auth');
    } else {
      setIsAuthenticated(true);
      // Load saved profile data if exists
      const savedProfile = localStorage.getItem('admin_profile');
      if (savedProfile) {
        setProfileData(JSON.parse(savedProfile));
      }
    }
    setIsLoading(false);
  }, [navigate]);

  const handleSave = () => {
    localStorage.setItem('admin_profile', JSON.stringify(profileData));
    setIsEditing(false);
    // toast.success("Profile updated successfully"); // Assuming toast is available or will be added
  };

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
        px: 4,
      }}
    >
      <Box
        sx={{
          maxWidth: "800px",
          mx: "auto",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4 }}>
          <IconButton
            onClick={() => navigate("/admin")}
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
            Admin Profile
          </Typography>
        </Box>

        <Card>
          <CardContent className="p-4">
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                mb: 4,
              }}
            >
              <Avatar
                sx={{
                  width: 120,
                  height: 120,
                  mb: 2,
                  backgroundColor: "hsl(var(--primary))",
                  fontSize: "2.5rem",
                }}
              >
                {profileData.fullName.charAt(0)}
              </Avatar>
              <DarkButton size="small" onClick={() => alert("Photo upload coming soon")}>Change Photo</DarkButton>
            </Box>

            <Box sx={{ display: "grid", gap: 3 }}>
              <OutlinedTextField
                fullWidth
                label="Full Name"
                value={profileData.fullName}
                onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                disabled={!isEditing}
                InputProps={{
                  startAdornment: <User size={20} style={{ marginRight: 8, opacity: 0.5 }} />,
                }}
              />
              <OutlinedTextField
                fullWidth
                label="Email"
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                disabled={!isEditing}
                InputProps={{
                  startAdornment: <Mail size={20} style={{ marginRight: 8, opacity: 0.5 }} />,
                }}
              />
              <OutlinedTextField
                fullWidth
                label="Phone"
                value={profileData.phone}
                onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                disabled={!isEditing}
                InputProps={{
                  startAdornment: <Phone size={20} style={{ marginRight: 8, opacity: 0.5 }} />,
                }}
              />
              <OutlinedTextField
                fullWidth
                label="Location"
                value={profileData.location}
                onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                disabled={!isEditing}
                InputProps={{
                  startAdornment: <MapPin size={20} style={{ marginRight: 8, opacity: 0.5 }} />,
                }}
              />
            </Box>

            <Box sx={{ display: "flex", gap: 2, mt: 4, justifyContent: "flex-end" }}>
              {!isEditing ? (
                <DarkButton onClick={() => setIsEditing(true)}>Edit Profile</DarkButton>
              ) : (
                <>
                  <DarkButton variant="outlined" onClick={() => setIsEditing(false)}>Cancel</DarkButton>
                  <DarkButton onClick={handleSave}>Save Changes</DarkButton>
                </>
              )}
            </Box>
          </CardContent>
        </Card>

        {/* Change Password Section */}
        <Card className="mt-6">
          <CardContent className="p-4">
            <Typography variant="h6" sx={{ mb: 3, fontFamily: "Poppins, sans-serif", fontWeight: 600 }}>
              Change Password
            </Typography>
            <Box sx={{ display: "grid", gap: 3 }}>
              <OutlinedTextField
                fullWidth
                label="Current Password"
                type="password"
              />
              <OutlinedTextField
                fullWidth
                label="New Password"
                type="password"
              />
              <OutlinedTextField
                fullWidth
                label="Confirm New Password"
                type="password"
              />
              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <DarkButton onClick={() => alert("Password updated successfully!")}>
                  Update Password
                </DarkButton>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};
