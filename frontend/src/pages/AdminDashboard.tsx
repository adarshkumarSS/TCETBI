import { useState, useEffect } from "react";
import { Box, Typography, Grid, Paper, CircularProgress } from "@mui/material";
import { Users, FileText, Building2, TrendingUp, UserPlus, AlertCircle, FileEdit } from "lucide-react";
import { useNavigate } from "react-router-dom";
import userService from "../api/userService";
import { getIncubationApplications } from "../api/incubationService";
import { motion } from "framer-motion";

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    pendingUsers: 0,
    totalApplications: 0,
    pendingApplications: 0,
    totalCompanyRequests: 0,
    pendingCompanyRequests: 0,
    editRequests: 0,
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      navigate('/auth');
    } else {
      setIsAuthenticated(true);
      fetchStats();
    }
  }, [navigate]);

  const fetchStats = async () => {
    try {
      const [usersData, pendingUsersData, applicationsData, companyRequestsData] = await Promise.all([
        userService.getUsers(),
        userService.getPendingUsers(),
        getIncubationApplications(),
        userService.getCompanyRequestsAdmin()
      ]);

      const pendingApps = applicationsData.applications.filter((app: any) => app.status === 'pending').length;
      const pendingRequests = companyRequestsData.company_requests.filter((req: any) => !req.is_edit_request && req.status === 'submitted').length;
      const editReqs = companyRequestsData.company_requests.filter((req: any) => req.is_edit_request && req.status === 'submitted').length;

      setStats({
        totalUsers: usersData.users.length,
        pendingUsers: pendingUsersData.users.length,
        totalApplications: applicationsData.applications.length,
        pendingApplications: pendingApps,
        totalCompanyRequests: companyRequestsData.company_requests.length,
        pendingCompanyRequests: pendingRequests,
        editRequests: editReqs,
      });
    } catch (error) {
      console.error("Failed to fetch dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) return null;

  if (loading) {
    return (
      <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  const StatCard = ({ title, value, icon: Icon, color, delay }: any) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <Paper
        elevation={0}
        sx={{
          p: 3,
          height: "100%",
          border: "1px solid hsl(var(--border))",
          borderRadius: "var(--radius)",
          backgroundColor: "hsl(var(--card))",
          transition: "transform 0.2s, box-shadow 0.2s",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: "0 12px 24px -10px hsl(var(--primary) / 0.1)",
            borderColor: "hsl(var(--primary) / 0.5)",
          },
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
          <Box
            sx={{
              p: 1.5,
              borderRadius: "12px",
              backgroundColor: `${color}15`,
              color: color,
            }}
          >
            <Icon size={24} />
          </Box>
          {value > 0 && (
            <Typography
              variant="caption"
              sx={{
                bgcolor: `${color}15`,
                color: color,
                px: 1,
                py: 0.5,
                borderRadius: "20px",
                fontWeight: 600,
              }}
            >
              Active
            </Typography>
          )}
        </Box>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, fontFamily: "Poppins, sans-serif" }}>
          {value}
        </Typography>
        <Typography variant="body2" sx={{ color: "hsl(var(--muted-foreground))", fontFamily: "Poppins, sans-serif" }}>
          {title}
        </Typography>
      </Paper>
    </motion.div>
  );

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "hsl(var(--background))",
        backgroundImage: "radial-gradient(circle at 10% 20%, hsl(var(--primary) / 0.03) 0%, transparent 20%), radial-gradient(circle at 90% 80%, hsl(var(--primary) / 0.03) 0%, transparent 20%)",
        pt: 16,
        px: 4,
        pb: 8,
      }}
    >
      <Box sx={{ maxWidth: "1200px", mx: "auto" }}>
        <Box sx={{ mb: 6 }}>
          <Typography
            variant="h3"
            sx={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 700,
              color: "hsl(var(--foreground))",
              mb: 2,
            }}
          >
            Admin Dashboard
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "hsl(var(--muted-foreground))",
              maxWidth: "600px",
            }}
          >
            Welcome back. Here's what's happening with your incubation center today.
          </Typography>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard
              title="Total Users"
              value={stats.totalUsers}
              icon={Users}
              color="#3b82f6"
              delay={0.1}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard
              title="Pending Approvals"
              value={stats.pendingUsers}
              icon={UserPlus}
              color="#f59e0b"
              delay={0.2}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard
              title="Total Applications"
              value={stats.totalApplications}
              icon={FileText}
              color="#8b5cf6"
              delay={0.3}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard
              title="Pending Applications"
              value={stats.pendingApplications}
              icon={AlertCircle}
              color="#ef4444"
              delay={0.4}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <StatCard
              title="Portfolio Requests"
              value={stats.pendingCompanyRequests}
              icon={Building2}
              color="#10b981"
              delay={0.5}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <StatCard
              title="Edit Requests"
              value={stats.editRequests}
              icon={FileEdit}
              color="#f97316" // Orange
              delay={0.6}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <StatCard
              title="Total Companies"
              value={stats.totalCompanyRequests}
              icon={TrendingUp}
              color="#ec4899"
              delay={0.7}
            />
          </Grid>
        </Grid>
        </Box>

        <Box sx={{ mt: 8, mb: 4 }}>
          <Typography
            variant="h4"
            sx={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 700,
              color: "hsl(var(--foreground))",
              mb: 3,
            }}
          >
            Quick Actions
          </Typography>
          <Grid container spacing={3}>
            {[
              { title: "Manage Users", icon: Users, path: "/admin/users", color: "#3b82f6", desc: "View and manage user accounts" },
              { title: "Review Applications", icon: FileText, path: "/admin/applications", color: "#8b5cf6", desc: "Process incubation applications" },
              { title: "Company Requests", icon: Building2, path: "/admin/company-requests", color: "#10b981", desc: "Approve new portfolios" },
              { title: "Edit Requests", icon: FileEdit, path: "/admin/company-requests?tab=edit", color: "#f97316", desc: "Review portfolio updates" },
              { title: "Update Content", icon: FileText, path: "/admin/update-content", color: "#f59e0b", desc: "Edit website content" },
            ].map((action, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.7 + (index * 0.1) }}
                >
                  <Paper
                    elevation={0}
                    onClick={() => navigate(action.path)}
                    sx={{
                      p: 3,
                      height: "100%",
                      cursor: "pointer",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "var(--radius)",
                      backgroundColor: "hsl(var(--card))",
                      transition: "all 0.2s ease-in-out",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: `0 12px 24px -10px ${action.color}30`,
                        borderColor: `${action.color}80`,
                      },
                    }}
                  >
                    <Box>
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          borderRadius: "12px",
                          backgroundColor: `${action.color}15`,
                          color: action.color,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          mb: 2,
                        }}
                      >
                        <action.icon size={24} />
                      </Box>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, fontFamily: "Poppins, sans-serif" }}>
                        {action.title}
                      </Typography>
                      <Typography variant="body2" sx={{ color: "hsl(var(--muted-foreground))", fontFamily: "Poppins, sans-serif" }}>
                        {action.desc}
                      </Typography>
                    </Box>
                  </Paper>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};
