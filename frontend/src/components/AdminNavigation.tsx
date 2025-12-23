import React, { useEffect, useState, useRef } from "react";
import { AppBar, Box, IconButton, Toolbar, Typography, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider } from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles";
import { DarkButton } from "./ui/DarkButton";

import { motion, useInView } from "framer-motion";
import { Moon, Sun, Bell, LogOut, LogIn, Menu, LayoutDashboard, FileEdit, ClipboardList, Settings, Linkedin, Building2, UserCog, CheckCircle, HelpingHand, Plus } from "lucide-react";
import { fetchNotifications } from "@/api/notificationservice";

export const AnimatedItem = ({ children, index, onClick }: any) => {
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.3, once: false });

  return (
    <motion.div
      ref={ref}
      data-index={index}
      onClick={onClick}
      initial={{ scale: 0.8, opacity: 0, y: 20 }}
      animate={
        inView
          ? { scale: 1, opacity: 1, y: 0 }
          : { scale: 0.8, opacity: 0, y: 20 }
      }
      transition={{ duration: 0.25 }}
      style={{ cursor: "pointer", marginBottom: "12px" }}
    >
      {children}
    </motion.div>
  );
};

export const AnimatedScroll = ({ children }: any) => {
  return (
    <div
      style={{
        width: "80%",
        height: "70vh",
        margin: "0 auto",
        overflowY: "auto",
        padding: "12px",
        borderRadius: "16px",
        background: "hsl(var(--card))",
        border: "1px solid hsl(var(--border))",

        // Scrollbar
        scrollbarWidth: "thin",
        scrollbarColor: "hsl(var(--muted)) transparent",
      }}
      className="
        [&::-webkit-scrollbar]:w-[8px]
        [&::-webkit-scrollbar-track]:bg-transparent
        [&::-webkit-scrollbar-thumb]:bg-[hsl(var(--muted))]
        [&::-webkit-scrollbar-thumb]:rounded-[4px]
      "
    >
      {children}
    </div>
  );
};

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: "hsl(var(--background) / 0.8) !important",
  color: "hsl(var(--foreground)) !important",
  backdropFilter: "blur(20px)",
  borderBottom: "1px solid hsl(var(--border))",
  boxShadow: "0 4px 24px rgba(0, 0, 0, 0.06)",
  zIndex: theme.zIndex.drawer + 1,
}));

const LogoContainer = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: "12px",
});

import { LogoutModal } from "./LogoutModal";

export const AdminNavigation: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === "/";

  useEffect(() => {
    // Check for saved theme in localStorage first
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    } else if (savedTheme === 'light') {
      setIsDarkMode(false);
      document.documentElement.classList.remove("dark");
    } else {
      // Fallback to system preference
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      setIsDarkMode(prefersDark);
      if (prefersDark) {
        document.documentElement.classList.add("dark");
      }
    }

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
    const isDark = document.documentElement.classList.contains("dark");
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  };

  const [notifCount, setNotifCount] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const token = localStorage.getItem('admin_token');
        setIsLoggedIn(!!token);
        if (token) {
          const notifs = await fetchNotifications();
          setNotifCount(notifs.filter((n) => !n.is_read).length);
        }
      } catch (error) {
        console.log('Error loading notifications:', error);
        setNotifCount(0);
        // If we get a 401, token might be invalid - this will be handled by the interceptor
      }
    };
    load();
  }, []);

  const handleLogoutClick = () => {
    setLogoutModalOpen(true);
  };

  const confirmLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_refresh');
    localStorage.removeItem('admin_user');
    setIsLoggedIn(false);
    setLogoutModalOpen(false);
    window.location.href = '/';
  };

  const menuItems = [
    { text: "Dashboard", icon: <LayoutDashboard size={20} />, path: "/admin" },
    { text: "Update Content", icon: <FileEdit size={20} />, path: "/admin/update-content" },
    { text: "Create Event", icon: <Plus size={20} />, path: "/admin/create-event" },
    { text: "Applications", icon: <ClipboardList size={20} />, path: "/admin/applications" },
    { text: "User Management", icon: <UserCog size={20} />, path: "/admin/users" },
    { text: "Company Requests", icon: <CheckCircle size={20} />, path: "/admin/company-requests" },
    { text: "Support Requests", icon: <HelpingHand size={20} />, path: "/admin/support-requests" },
    { text: "Edit Requests", icon: <FileEdit size={20} />, path: "/admin/company-requests?tab=edit" },
    { text: "Current Incubators", icon: <Building2 size={20} />, path: "/admin/incubators" },

    { text: "Mentors", icon: <UserCog size={20} />, path: "/admin/mentors" },
    { text: "Settings", icon: <Settings size={20} />, path: "/admin/settings" },
  ];

  const DrawerList = (
    <Box sx={{ width: 280, height: '100%', bgcolor: 'hsl(var(--background))', color: 'hsl(var(--foreground))' }} role="presentation" onClick={() => setDrawerOpen(false)}>
      <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <img src="/asset/TCE_TBI.png" alt="Logo" style={{ width: 40, height: 40 }} />
        <Typography variant="h6" sx={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700 }}>
          Admin Panel
        </Typography>
      </Box>
      <Divider sx={{ borderColor: 'hsl(var(--border))' }} />
      <List sx={{ p: 2 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
            <ListItemButton
              onClick={() => navigate(item.path)}
              selected={location.pathname + location.search === item.path}
              sx={{
                borderRadius: '8px',
                '&.Mui-selected': {
                  bgcolor: 'hsl(var(--primary) / 0.1)',
                  color: 'hsl(var(--primary))',
                  '&:hover': {
                    bgcolor: 'hsl(var(--primary) / 0.2)',
                  },
                  '& .MuiListItemIcon-root': {
                    color: 'hsl(var(--primary))',
                  },
                },
                '&:hover': {
                  bgcolor: 'hsl(var(--muted))',
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: (item as any).color || 'hsl(var(--muted-foreground))' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text} 
                primaryTypographyProps={{ 
                  fontFamily: 'Poppins, sans-serif', 
                  fontSize: '14px',
                  fontWeight: location.pathname + location.search === item.path ? 600 : 400,
                  color: (item as any).color || 'inherit'
                }} 
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <StyledAppBar
        position="fixed"
        color="transparent"
        elevation={scrolled ? 2 : 0}
        sx={{
          backgroundColor: "hsl(var(--background) / 0.8) !important",
        }}
      >
        <Toolbar
          sx={{
            justifyContent: "space-between",
            py: 1
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {isLoggedIn && (
              <IconButton onClick={() => setDrawerOpen(true)} sx={{ color: "hsl(var(--foreground))" }}>
                <Menu size={24} />
              </IconButton>
            )}
            <Link to="/admin" style={{ textDecoration: "none" }}>
              <LogoContainer>
                <img
                  src="/asset/TCE_TBI.png"
                  alt="Logo"
                  style={{ width: 72, height: 72, objectFit: "contain" }}
                />
                <Box>
                  <Typography
                    variant="h5"
                    sx={{
                      color: "#d32f2f",
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: 700,
                      lineHeight: 1,
                      fontSize: { xs: "22px", md: "28px" },
                    }}
                  >
                    Thiagarajar
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      color: "hsl(var(--foreground))",
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: 500,
                      lineHeight: 1.1,
                      fontSize: { xs: "14px", md: "18px" },
                    }}
                  >
                    Business Incubation
                  </Typography>
                </Box>
              </LogoContainer>
            </Link>
          </Box>

          {/* Right-aligned buttons */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              marginLeft: "auto",
            }}
          >
            <IconButton
              onClick={toggleDarkMode}
              sx={{
                color: "hsl(var(--foreground))",
                "&:hover": {
                  backgroundColor: "hsl(var(--muted))",
                },
              }}
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </IconButton>

            <IconButton
              component={Link}
              to="/admin/notifications"
              sx={{
                position: "relative",
                color: "hsl(var(--foreground))",
                "&:hover": { backgroundColor: "hsl(var(--muted))" },
              }}
            >
              <Bell size={20} />

              {notifCount > 0 && (
                <Box
                  sx={{
                    position: "absolute",
                    top: -2,
                    right: -2,
                    backgroundColor: "#ef4444",
                    color: "white",
                    borderRadius: "50%",
                    width: 18,
                    height: 18,
                    fontSize: 12,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {notifCount}
                </Box>
              )}
            </IconButton>

            {isLoggedIn ? (
              <IconButton
                onClick={handleLogoutClick}
                sx={{
                  color: "hsl(var(--destructive))",
                  "&:hover": {
                    backgroundColor: "hsl(var(--destructive) / 0.1)",
                  },
                }}
                title="Logout"
              >
                <LogOut size={20} />
              </IconButton>
            ) : (
              <Link to="/auth" style={{ textDecoration: "none" }}>
                <IconButton
                  sx={{
                    color: "hsl(var(--foreground))",
                    "&:hover": {
                      backgroundColor: "hsl(var(--muted))",
                    },
                  }}
                >
                  <LogIn size={20} />
                </IconButton>
              </Link>
            )}
          </Box>
        </Toolbar>
      </StyledAppBar>

      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        {DrawerList}
      </Drawer>

      <LogoutModal 
        open={logoutModalOpen} 
        onClose={() => setLogoutModalOpen(false)} 
        onConfirm={confirmLogout} 
      />
    </>
  );
};
