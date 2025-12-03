import React, { useEffect, useState } from "react";
import { AppBar, Box, IconButton, Toolbar, Typography } from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles";
import { DarkButton } from "./ui/DarkButton";
import { Moon, Sun, LogOut, User, LayoutDashboard, Building2, HelpingHand } from "lucide-react";

import { LogoutModal } from "./LogoutModal";

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: "hsl(var(--background) / 0.8) !important",
  color: "hsl(var(--foreground)) !important",
  backdropFilter: "blur(20px)",
  borderBottom: "1px solid hsl(var(--border))",
  boxShadow: "0 4px 24px rgba(0, 0, 0, 0.06)",
}));

const LogoContainer = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: "12px",
});

const NavLink = styled(Link, {
  shouldForwardProp: (prop) => prop !== '$active',
})<{ $active?: boolean }>(({ $active }) => ({
  display: "flex",
  alignItems: "center",
  gap: "8px",
  color: $active ? "hsl(var(--primary))" : "hsl(var(--foreground))",
  textDecoration: "none",
  fontFamily: "Poppins, sans-serif",
  fontWeight: 500,
  padding: "8px 16px",
  borderRadius: "var(--radius)",
  transition: "all 0.3s ease",
  backgroundColor: $active ? "hsl(var(--primary) / 0.1)" : "transparent",
  "&:hover": {
    backgroundColor: "hsl(var(--muted))",
    color: "hsl(var(--primary))",
  },
}));

export const UserNavigation: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    } else if (savedTheme === 'light') {
      setIsDarkMode(false);
      document.documentElement.classList.remove("dark");
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
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

  const handleLogoutClick = () => {
    setLogoutModalOpen(true);
  };

  const confirmLogout = () => {
    localStorage.removeItem('user_token');
    localStorage.removeItem('user_refresh');
    localStorage.removeItem('user_data');
    setLogoutModalOpen(false);
    navigate('/auth');
  };

  const navItems = [
    { label: "Dashboard", path: "/user/dashboard", icon: <LayoutDashboard size={18} /> },
    { label: "My Company", path: "/user/my-company", icon: <Building2 size={18} /> },
    { label: "Support", path: "/support", icon: <HelpingHand size={18} /> },
    // { label: "Profile", path: "/user/profile", icon: <User size={18} /> }, // Profile is inside dashboard now
  ];

  return (
    <>
      <StyledAppBar
        position="fixed"
        color="transparent"
        elevation={scrolled ? 2 : 0}
      >
        <Toolbar sx={{ justifyContent: "space-between", py: 1 }}>
          <Link to="/" style={{ textDecoration: "none" }}>
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

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                $active={location.pathname === item.path}
              >
                {item.icon}
                <Box component="span" sx={{ display: { xs: "none", md: "block" } }}>
                  {item.label}
                </Box>
              </NavLink>
            ))}
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <IconButton
              onClick={toggleDarkMode}
              sx={{
                color: "hsl(var(--foreground))",
                "&:hover": { backgroundColor: "hsl(var(--muted))" },
              }}
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </IconButton>

            <IconButton
              onClick={handleLogoutClick}
              sx={{
                color: "hsl(var(--destructive))",
                "&:hover": { backgroundColor: "hsl(var(--destructive) / 0.1)" },
              }}
              title="Logout"
            >
              <LogOut size={20} />
            </IconButton>
          </Box>
        </Toolbar>
      </StyledAppBar>

      <LogoutModal 
        open={logoutModalOpen} 
        onClose={() => setLogoutModalOpen(false)} 
        onConfirm={confirmLogout} 
      />
    </>
  );
};
