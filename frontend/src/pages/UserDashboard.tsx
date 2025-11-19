import { Paper, Typography, Box, Grid, Button, Chip, Avatar } from "@mui/material";
import { Business, CheckCircle, People, EventNote, Logout, AccountCircle } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export const UserDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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

    setIsAuthenticated(true);

    // Parse user data from localStorage (assuming it's stored after login)
    const userData = localStorage.getItem('user_data');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user_token');
    localStorage.removeItem('user_refresh');
    localStorage.removeItem('user_data');
    navigate('/auth');
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
      }}
    >
      <Box
        sx={{
          maxWidth: "1200px",
          mx: "auto",
        }}
      >
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h3"
            sx={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 700,
              color: "hsl(var(--primary))",
              mb: 2,
            }}
          >
            Welcome to Your Dashboard
          </Typography>
          <Typography
            sx={{
              fontFamily: "Poppins, sans-serif",
              color: "hsl(var(--muted-foreground))",
              fontSize: "18px",
            }}
          >
            Your incubation journey starts here. Track your progress and manage your applications.
          </Typography>
        </Box>

        {/* User Info Card */}
        <Paper
          sx={{
            backgroundColor: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "var(--radius)",
            p: 4,
            mb: 6,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
            <Avatar
              sx={{
                width: 80,
                height: 80,
                bgcolor: "hsl(var(--primary))",
                fontSize: "2rem",
              }}
            >
              <AccountCircle sx={{ fontSize: "3rem" }} />
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="h5"
                sx={{
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 600,
                  color: "hsl(var(--foreground))",
                  mb: 1,
                }}
              >
                {user?.full_name || user?.username || "User"}
              </Typography>
              <Typography
                sx={{
                  fontFamily: "Poppins, sans-serif",
                  color: "hsl(var(--muted-foreground))",
                  mb: 2,
                }}
              >
                {user?.email}
              </Typography>
              <Chip
                label="Approved User"
                color="success"
                size="small"
                icon={<CheckCircle />}
              />
            </Box>
            <Button
              variant="outlined"
              color="error"
              startIcon={<Logout />}
              onClick={handleLogout}
              sx={{
                fontFamily: "Poppins, sans-serif",
              }}
            >
              Logout
            </Button>
          </Box>
        </Paper>

        {/* Quick Actions */}
        <Grid container spacing={4}>
          <Grid size={{xs:12, md:6}}>
            <Paper
              sx={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "var(--radius)",
                p: 4,
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 600,
                  color: "hsl(var(--primary))",
                  mb: 3,
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <Business />
                Incubation Program
              </Typography>
              <Typography
                sx={{
                  fontFamily: "Poppins, sans-serif",
                  color: "hsl(var(--muted-foreground))",
                  mb: 3,
                  flex: 1,
                }}
              >
                Apply for the TCE-TBI incubation program. Submit your business application for review by our experts.
              </Typography>
              <Link to="/apply-incubation" style={{ textDecoration: 'none' }}>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 600,
                  }}
                >
                  Apply for Incubation
                </Button>
              </Link>
            </Paper>
          </Grid>

          <Grid size={{xs:12, md:6}}>
            <Paper
              sx={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "var(--radius)",
                p: 4,
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 600,
                  color: "hsl(var(--primary))",
                  mb: 3,
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <People />
                Network & Support
              </Typography>
              <Typography
                sx={{
                  fontFamily: "Poppins, sans-serif",
                  color: "hsl(var(--muted-foreground))",
                  mb: 3,
                  flex: 1,
                }}
              >
                Connect with fellow entrepreneurs, mentors, and industry experts. Access our comprehensive support network.
              </Typography>
              <Link to="/contact" style={{ textDecoration: 'none' }}>
                <Button
                  variant="outlined"
                  color="primary"
                  fullWidth
                  sx={{
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 600,
                  }}
                >
                  Get Connected
                </Button>
              </Link>
            </Paper>
          </Grid>
        </Grid>

        {/* Status Overview */}
        <Paper
          sx={{
            backgroundColor: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "var(--radius)",
            p: 4,
            mt: 6,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 600,
              color: "hsl(var(--primary))",
              mb: 3,
            }}
          >
            Your Status Overview
          </Typography>

          <Grid container spacing={3}>
            <Grid size={{xs:12, sm:6, md:3}}>
              <Box
                sx={{
                  textAlign: "center",
                  p: 2,
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "var(--radius)",
                  backgroundColor: "hsl(var(--muted))",
                }}
              >
                <CheckCircle sx={{ fontSize: "2rem", color: "hsl(var(--success))", mb: 1 }} />
                <Typography
                  sx={{
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 600,
                    color: "hsl(var(--foreground))",
                  }}
                >
                  Account Verified
                </Typography>
              </Box>
            </Grid>

            <Grid size={{xs:12, sm:6, md:3}}>
              <Box
                sx={{
                  textAlign: "center",
                  p: 2,
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "var(--radius)",
                  backgroundColor: "hsl(var(--muted))",
                }}
              >
                <EventNote sx={{ fontSize: "2rem", color: "hsl(var(--primary))", mb: 1 }} />
                <Typography
                  sx={{
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 600,
                    color: "hsl(var(--foreground))",
                  }}
                >
                  Ready to Apply
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Box>
  );
};
