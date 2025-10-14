import React, { useEffect, useState } from "react";
import { AppBar, Box, IconButton, Toolbar, Typography } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import { styled } from "@mui/material/styles";
import { DarkButton } from "./ui/DarkButton";
import { motion } from "framer-motion";
import { Moon, Sun, Bell, LogOut, LogIn } from "lucide-react";

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: "hsl(var(--background) / 0.8)",
  backdropFilter: "blur(20px)",
  borderBottom: "1px solid hsl(var(--border))",
  boxShadow: "0 4px 24px rgba(0, 0, 0, 0.06)",
}));

const LogoContainer = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: "12px",
});

export const AdminNavigation: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";

  useEffect(() => {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setIsDarkMode(prefersDark);
    if (prefersDark) {
      document.documentElement.classList.add("dark");
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
  };

  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <StyledAppBar
        position="fixed"
        elevation={scrolled ? 2 : 0}
        sx={{
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <Toolbar sx={{ 
          minHeight: "80px",
          justifyContent: "space-between" // This will push items to the edges
        }}>
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
                  color:
                    isHome && !scrolled
                      ? "#fff"
                      : isDarkMode
                      ? "#fff"
                      : "#222",
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

          {/* Right-aligned buttons */}
          <Box sx={{ 
            display: "flex", 
            alignItems: "center", 
            gap: 1,
            marginLeft: "auto" // This ensures it stays on the right
          }}>
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
              sx={{
                color: "hsl(var(--foreground))",
                "&:hover": {
                  backgroundColor: "hsl(var(--muted))",
                },
              }}
            >
              <Bell size={20} />
            </IconButton>

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
          </Box>
        </Toolbar>
      </StyledAppBar>
    </motion.div>
  );
};