import { Paper, Typography, Box, Button, TextField, Chip } from "@mui/material";
import { Edit, Save, Cancel, AccountCircle, Lock } from "@mui/icons-material";
import { useState } from "react";
import { toast } from "sonner";
import userService from "../../api/userService";

interface ProfileTabProps {
  user: any;
}

export const ProfileTab = ({ user }: ProfileTabProps) => {
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    full_name: user?.full_name || "",
    phone: user?.phone || ""
  });

  const handleEditProfile = () => {
    setIsEditingProfile(true);
  };

  const handleCancelProfile = () => {
    setIsEditingProfile(false);
    setProfileData({
      full_name: user?.full_name || "",
      phone: user?.phone || ""
    });
  };

  const handleSaveProfile = async () => {
    try {
      const response = await userService.updateUserProfile(profileData);
      const updatedUser = response.user;
      setProfileData({
        full_name: updatedUser.full_name || "",
        phone: updatedUser.phone || ""
      });
      localStorage.setItem('user_data', JSON.stringify(updatedUser));
      setIsEditingProfile(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error("Failed to update profile");
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
      {/* Profile Information Cards */}
      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: 4 }}>
        {/* Personal Information Card */}
        <Paper
          sx={{
            backgroundColor: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "var(--radius)",
            p: 4,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4 }}>
            {user?.profile_image ? (
              <Box 
                component="img" 
                src={user.profile_image} 
                sx={{ 
                  width: 40, 
                  height: 40, 
                  borderRadius: "50%", 
                  objectFit: "cover",
                  border: "2px solid hsl(var(--primary))"
                }} 
              />
            ) : (
              <AccountCircle sx={{ color: "hsl(var(--primary))", fontSize: "2rem" }} />
            )}
            <Typography
              variant="h5"
              sx={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 600,
                color: "hsl(var(--foreground))",
              }}
            >
              Personal Information
            </Typography>
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <Box sx={{ display: "flex", gap: 3, flexDirection: { xs: "column", md: "row" } }}>
              <TextField
                fullWidth
                label="Full Name"
                value={isEditingProfile ? profileData.full_name : (user?.full_name || "")}
                onChange={(e) => setProfileData({ ...profileData, full_name: e.target.value })}
                disabled={!isEditingProfile}
                sx={{
                  fontFamily: "Poppins, sans-serif",
                  '& .MuiOutlinedInput-root': {
                    borderRadius: "12px",
                  }
                }}
                helperText={isEditingProfile ? "Your full legal name" : ""}
              />
              <TextField
                fullWidth
                label="Phone Number"
                value={isEditingProfile ? profileData.phone : (user?.phone || "")}
                onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                disabled={!isEditingProfile}
                sx={{
                  fontFamily: "Poppins, sans-serif",
                  '& .MuiOutlinedInput-root': {
                    borderRadius: "12px",
                  }
                }}
                helperText={isEditingProfile ? "Contact number for important updates" : ""}
              />
            </Box>

            <TextField
              fullWidth
              label="Email Address"
              value={user?.email || ""}
              disabled
              sx={{
                fontFamily: "Poppins, sans-serif",
                '& .MuiOutlinedInput-root': {
                  borderRadius: "12px",
                  backgroundColor: "hsl(var(--muted) / 0.5)",
                }
              }}
              helperText="Email cannot be changed - contact admin for updates"
            />


          </Box>

          {/* Action Buttons */}
          <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end", mt: 4 }}>
            {!isEditingProfile ? (
              <Button
                variant="contained"
                startIcon={<Edit />}
                onClick={handleEditProfile}
                sx={{
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 600,
                  px: 4,
                  py: 1.5,
                  borderRadius: "12px",
                  boxShadow: "0 4px 12px hsl(var(--primary) / 0.3)",
                  '&:hover': {
                    boxShadow: "0 6px 20px hsl(var(--primary) / 0.4)",
                  }
                }}
              >
                Edit Profile
              </Button>
            ) : (
              <>
                <Button
                  variant="outlined"
                  startIcon={<Cancel />}
                  onClick={handleCancelProfile}
                  sx={{
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 600,
                    px: 3,
                    py: 1.5,
                    borderRadius: "12px",
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  startIcon={<Save />}
                  onClick={handleSaveProfile}
                  sx={{
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 600,
                    px: 4,
                    py: 1.5,
                    borderRadius: "12px",
                    boxShadow: "0 4px 12px hsl(var(--primary) / 0.3)",
                    '&:hover': {
                      boxShadow: "0 6px 20px hsl(var(--primary) / 0.4)",
                    }
                  }}
                >
                  Save Changes
                </Button>
              </>
            )}
          </Box>
        </Paper>

        {/* Account Security Card */}
        <Paper
          sx={{
            backgroundColor: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "var(--radius)",
            p: 4,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4 }}>
            <Lock sx={{ color: "hsl(var(--primary))", fontSize: "2rem" }} />
            <Typography
              variant="h5"
              sx={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 600,
                color: "hsl(var(--foreground))",
              }}
            >
              Account Security
            </Typography>
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <Box sx={{ p: 3, backgroundColor: "hsl(var(--muted) / 0.3)", borderRadius: "12px" }}>
              <Typography
                variant="subtitle2"
                sx={{
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 600,
                  color: "hsl(var(--foreground))",
                  mb: 2,
                }}
              >
                Account Status
              </Typography>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Typography variant="body2" sx={{ fontFamily: "Poppins, sans-serif" }}>
                    Account Type:
                  </Typography>
                  <Chip
                    label="Standard User"
                    size="small"
                    sx={{ fontFamily: "Poppins, sans-serif" }}
                  />
                </Box>

                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Typography variant="body2" sx={{ fontFamily: "Poppins, sans-serif" }}>
                    Last Login:
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontFamily: "Poppins, sans-serif",
                      color: "hsl(var(--muted-foreground))"
                    }}
                  >
                    {user?.last_login ? new Date(user.last_login).toLocaleDateString() : "Never"}
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Typography variant="body2" sx={{ fontFamily: "Poppins, sans-serif" }}>
                    Member Since:
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontFamily: "Poppins, sans-serif",
                      color: "hsl(var(--muted-foreground))"
                    }}
                  >
                    {user?.date_joined ? new Date(user.date_joined).toLocaleDateString() : "Unknown"}
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Box sx={{ p: 3, backgroundColor: "hsl(var(--warning) / 0.1)", border: "1px solid hsl(var(--warning) / 0.3)", borderRadius: "12px" }}>
              <Typography
                variant="subtitle2"
                sx={{
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 600,
                  color: "hsl(var(--warning))",
                  mb: 1,
                }}
              >
                Security Tips
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  fontFamily: "Poppins, sans-serif",
                  color: "hsl(var(--foreground))",
                  lineHeight: 1.5,
                }}
              >
                • Keep your contact information updated for important notifications
                • Your account is secured with JWT authentication
                • All communications are encrypted and secure
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};
