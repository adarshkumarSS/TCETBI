import { Paper, Typography, Box, Button, Avatar } from "@mui/material";
import { Logout, AccountCircle } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import userService from "../api/userService";
import { ProfileTab } from "./components/ProfileTab";

export const UserDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [companyLogo, setCompanyLogo] = useState<string>("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Confirmation dialogs
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    title: "",
    message: "",
    action: "",
    onConfirm: () => {}
  });

  useEffect(() => {
    // Check if user is logged in (not admin)
    const token = localStorage.getItem('user_token');
    const adminToken = localStorage.getItem('admin_token');

    if (adminToken) {
      // Redirect admin users to admin dashboard
      navigate('/admin');
      return;
    }

    if (!token) {
      navigate('/auth');
      return;
    }

    // Check for mandatory password change
    const userStr = localStorage.getItem('user_user');
    if (userStr) {
      const userObj = JSON.parse(userStr);
      if (userObj.must_change_password) {
        navigate('/auth');
        return;
      }
    }

    setIsAuthenticated(true);

    // Fetch user profile and company data
    const fetchData = async () => {
      try {
        const profileResponse = await userService.getUserProfile();
        const userData = profileResponse.user;
        setUser(userData);
        localStorage.setItem('user_data', JSON.stringify(userData));

        // Fetch company logo
        try {
          const companyResponse = await userService.getCompanyRequest();
          if (companyResponse.company_request?.logo) {
            setCompanyLogo(companyResponse.company_request.logo);
          }
        } catch (err) {
          console.log("No company data found or failed to fetch");
        }

      } catch (error) {
        console.error("Failed to fetch user data:", error);
        toast.error("Failed to load profile");
        // Fallback to localStorage
        const userData = localStorage.getItem('user_data');
        if (userData) {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
        }
      }
    };

    fetchData();
  }, [navigate]);

  const handleLogout = () => {
    // Direct logout for now, can add dialog later if needed
    localStorage.removeItem('user_token');
    localStorage.removeItem('user_refresh');
    localStorage.removeItem('user_data');
    navigate('/auth');
    toast.success("Logged out successfully");
  };

  if (!isAuthenticated) {
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
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "hsl(var(--background))",
        pt: 12,
        px: 4,
        pb: 8,
      }}
    >
      <Box
        sx={{
          maxWidth: "1200px",
          mx: "auto",
        }}
      >
        {/* Header */}
        <Box sx={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center", 
          mb: 6,
          flexDirection: { xs: "column", sm: "row" },
          gap: 2
        }}>
          <Box>
            <Typography
              variant="h3"
              sx={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 700,
                color: "hsl(var(--foreground))",
                mb: 1,
              }}
            >
              User Dashboard
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "hsl(var(--muted-foreground))",
                fontFamily: "Poppins, sans-serif",
              }}
            >
              Manage your profile and company portfolio
            </Typography>
          </Box>
          
          <Button
            variant="outlined"
            color="error"
            startIcon={<Logout />}
            onClick={handleLogout}
            sx={{
              fontFamily: "Poppins, sans-serif",
              borderRadius: "12px",
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            Logout
          </Button>
        </Box>

        {/* User Header Card */}
        <Paper
          sx={{
            backgroundColor: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "var(--radius)",
            p: 4,
            mb: 4,
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Background Pattern */}
          <Box
            sx={{
              position: "absolute",
              top: 0,
              right: 0,
              width: "300px",
              height: "300px",
              background: "radial-gradient(circle, hsl(var(--primary) / 0.1) 0%, transparent 70%)",
              transform: "translate(30%, -30%)",
              zIndex: 0,
            }}
          />

          <Box sx={{ display: "flex", alignItems: "center", gap: 4, position: "relative", zIndex: 1, flexDirection: { xs: "column", md: "row" }, textAlign: { xs: "center", md: "left" } }}>
            <Avatar
              src={user?.profile_image || companyLogo}
              sx={{
                width: 120,
                height: 120,
                bgcolor: "hsl(var(--primary))",
                fontSize: "3rem",
                border: "4px solid hsl(var(--background))",
                boxShadow: "0 8px 32px hsl(var(--primary) / 0.2)",
              }}
            >
              {!user?.profile_image && !companyLogo && (user?.full_name?.charAt(0) || <AccountCircle sx={{ fontSize: "4rem" }} />)}
            </Avatar>

            <Box sx={{ flex: 1 }}>
              <Typography
                variant="h4"
                sx={{
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 700,
                  color: "hsl(var(--foreground))",
                  mb: 1,
                }}
              >
                {user?.full_name || user?.username || "User"}
              </Typography>

              <Typography
                variant="h6"
                sx={{
                  fontFamily: "Poppins, sans-serif",
                  color: "hsl(var(--muted-foreground))",
                  mb: 2,
                  fontWeight: 400
                }}
              >
                {user?.email}
              </Typography>

              <Box sx={{ display: "flex", gap: 2, justifyContent: { xs: "center", md: "flex-start" } }}>
                <Box sx={{ px: 2, py: 0.5, bgcolor: "hsl(var(--primary) / 0.1)", borderRadius: "20px", color: "hsl(var(--primary))", fontSize: "0.875rem", fontWeight: 600 }}>
                  Member
                </Box>
                <Box sx={{ px: 2, py: 0.5, bgcolor: "hsl(var(--muted))", borderRadius: "20px", color: "hsl(var(--muted-foreground))", fontSize: "0.875rem", fontWeight: 600 }}>
                  {user?.phone || "No phone"}
                </Box>
              </Box>
            </Box>
          </Box>
        </Paper>

        {/* Profile Section */}
        <Box sx={{ animation: "fadeIn 0.5s ease-in-out" }}>
          <ProfileTab user={user} />
        </Box>
      </Box>
    </Box>
  );
};
