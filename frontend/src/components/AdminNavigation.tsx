import React, { useEffect, useState, useRef } from "react";
import { AppBar, Box, IconButton, Toolbar, Typography } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import { styled } from "@mui/material/styles";
import { DarkButton } from "./ui/DarkButton";

import { motion, useInView } from "framer-motion";
import { Moon, Sun, Bell, LogOut, LogIn } from "lucide-react";
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
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
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

  const [notifCount, setNotifCount] = useState(0);

  useEffect(() => {
    const load = async () => {
      try {
        const notifs = await fetchNotifications();
        setNotifCount(notifs.filter((n) => !n.is_read).length);
      } catch {}
    };
    load();
  }, []);





  return (
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
            minHeight: "80px",
            justifyContent: "space-between", // This will push items to the edges
          }}
        >
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
                    isHome && !scrolled ? "#fff" : isDarkMode ? "#fff" : "#222",
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
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              marginLeft: "auto", // This ensures it stays on the right
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
  );
};
