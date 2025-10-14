import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AppBar, Toolbar, Typography, Box, IconButton } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Link, useLocation } from "react-router-dom";
import { LightMode, DarkMode, Login } from "@mui/icons-material";
import { DarkButton } from "./ui/DarkButton";

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backdropFilter: "blur(20px)",
  borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
  boxShadow: "0 8px 30px rgba(0, 0, 0, 0.1)",
  fontFamily: "Poppins, sans-serif",
  background: "transparent",
}));

const NavLink = styled(Link)<{ $isdark: boolean; $forcewhite: boolean }>(
  ({ $isdark, $forcewhite }) => ({
    color: $forcewhite ? "#fff" : $isdark ? "#fff" : "#222",
    textDecoration: "none",
    fontFamily: "Poppins, sans-serif",
    fontWeight: 500,
    padding: "8px 16px",
    borderRadius: "var(--radius)",
    transition: "all 0.3s ease",
    "&:hover": {
      backgroundColor:
        $isdark || $forcewhite ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)",
      color: "#fff",
    },
  })
);

const LogoContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: "12px",
}));

export const Navigation: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Check for system preference
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setIsDarkMode(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setIsDarkMode(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  const navItems = [
    { label: "Portfolio", path: "/portfolio" },
    { label: "People", path: "/people" },
    { label: "Facilities", path: "/facilities" },
    { label: "Program", path: "/program" },
    { label: "Media", path: "/media" },
    { label: "Blogs", path: "/blogs" },
    { label: "Contact", path: "/contact" },
  ];

  // Only apply color change on home page
  const isHome = location.pathname === "/";

  return (
    <motion.div
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <StyledAppBar
        position="fixed"
        elevation={0}
        sx={{
          background: isDarkMode 
            ? (isHome ? "rgba(0, 0, 0, 0.3)" : "rgba(0, 0, 0, 0.9)")
            : "transparent",
          borderBottom: isDarkMode ? "1px solid rgba(255, 255, 255, 0.1)" : "1px solid rgba(255, 255, 255, 0.2)",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between", py: 1 }}>
          <Link to="/" style={{ textDecoration: "none" }}>
            <LogoContainer>
              <img
                src="/asset/TCE_TBI.png"
                alt="Logo"
                style={{ width: 72, height: 72, objectFit: "contain" }} // Increased size
              />
              <Box>
                <Typography
                  variant="h5" // Changed from h6 to h5 for bigger text
                  sx={{
                    color: "#d32f2f",
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 700,
                    lineHeight: 1,
                    fontSize: { xs: "22px", md: "28px" }, // Increased font size
                  }}
                >
                  Thiagarajar
                </Typography>
                <Typography
                  variant="subtitle1" // Changed from body2 to subtitle1 for bigger text
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
                    fontSize: { xs: "14px", md: "18px" }, // Increased font size
                  }}
                >
                  Business Incubation
                </Typography>
              </Box>
            </LogoContainer>
          </Link>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                $isdark={isDarkMode}
                $forcewhite={isHome && !scrolled}
                style={{
                  backgroundColor:
                    location.pathname === item.path
                      ? isDarkMode || (isHome && !scrolled)
                        ? "rgba(255,255,255,0.1)"
                        : "rgba(0,0,0,0.08)"
                      : "transparent",
                }}
              >
                {item.label}
              </NavLink>
            ))}
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <IconButton
              onClick={() => setIsDarkMode(!isDarkMode)}
              sx={{
                color:
                  isHome && !scrolled ? "#fff" : isDarkMode ? "#fff" : "#222",
              }}
            >
              {isDarkMode ? <LightMode /> : <DarkMode />}
            </IconButton>
            <Link to="/auth" style={{ textDecoration: 'none' }}>
              <DarkButton
                startIcon={<Login />}
                sx={{
                  color: "#fff",
                }}
              >
                Login
              </DarkButton>
            </Link>
          </Box>
        </Toolbar>
      </StyledAppBar>
    </motion.div>
  );
};
