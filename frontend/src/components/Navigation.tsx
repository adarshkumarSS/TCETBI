import { useState, useEffect, forwardRef } from "react";
import { motion } from "framer-motion";
import { AppBar, Toolbar, Typography, Box, IconButton, Menu, MenuItem, MenuProps, Fade } from "@mui/material";
import { styled, alpha } from "@mui/material/styles";
import { Link, useLocation } from "react-router-dom";
import { LightMode, DarkMode, Login, KeyboardArrowDown } from "@mui/icons-material";
import { DarkButton } from "./ui/DarkButton";

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backdropFilter: "blur(20px)",
  borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
  boxShadow: "0 8px 30px rgba(0, 0, 0, 0.1)",
  fontFamily: "Poppins, sans-serif",
  background: "transparent",
}));

const NavLink = styled(Link, {
  shouldForwardProp: (prop) =>
    typeof prop === "string" && !["$isdark", "$forcewhite"].includes(prop),
})<{ $isdark?: boolean; $forcewhite?: boolean }>(({ $isdark, $forcewhite }) => ({
  color: $forcewhite ? "#fff" : $isdark ? "#fff" : "#222",
  textDecoration: "none",
  fontFamily: "Poppins, sans-serif",
  fontWeight: 500,
  padding: "8px 16px",
  borderRadius: "var(--radius)",
  transition: "all 0.3s ease",
  display: "flex",
  alignItems: "center",
  gap: "4px",
  "&:hover": {
    backgroundColor:
      $isdark || $forcewhite ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)",
    color: "#fff",
  },
}));

const NavButton = styled("button", {
  shouldForwardProp: (prop) =>
    typeof prop === "string" && !["$isdark", "$forcewhite"].includes(prop),
})<{ $isdark?: boolean; $forcewhite?: boolean }>(({ $isdark, $forcewhite }) => ({
  color: $forcewhite ? "#fff" : $isdark ? "#fff" : "#222",
  background: "transparent",
  border: "none",
  cursor: "pointer",
  fontFamily: "Poppins, sans-serif",
  fontWeight: 500,
  padding: "8px 16px",
  borderRadius: "var(--radius)",
  transition: "all 0.3s ease",
  display: "flex",
  alignItems: "center",
  gap: "4px",
  fontSize: "1rem",
  "&:hover": {
    backgroundColor:
      $isdark || $forcewhite ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)",
    color: "#fff",
  },
}));

const Transition = forwardRef((props: any, ref: any) => (
  <motion.div
    ref={ref}
    initial={{ opacity: 0, y: -10, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: -10, scale: 0.95 }}
    transition={{ duration: 0.2, ease: "easeOut" }}
    {...props}
  />
));

const LogoContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: "12px",
}));

export const Navigation: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Check for saved theme in localStorage first
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
    } else if (savedTheme === 'light') {
      setIsDarkMode(false);
    } else {
      // Fallback to system preference
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      setIsDarkMode(mediaQuery.matches);
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, menu: string) => {
    setAnchorEl(event.currentTarget);
    setActiveMenu(menu);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setActiveMenu(null);
  };

  const navItems = [
    { label: "Portfolio", path: "/portfolio" },
    { label: "People", path: "/people" },
    { label: "Facilities", path: "/facilities" },
    { label: "Program", path: "/program" },
    { 
      label: "Media", 
      path: "/media",
      children: [
        { label: "Gallery", path: "/media" },
        { label: "Blogs", path: "/blogs" }
      ]
    },
    { label: "Support", path: "/support" },
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
            : (isHome ? "transparent" : "hsl(var(--background))"),
          borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
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
              item.children ? (
                <Box key={item.label}>
                  <NavButton
                    onClick={(e) => handleMenuOpen(e, item.label)}
                    $isdark={isDarkMode}
                    $forcewhite={isHome && !scrolled}
                  >
                    {item.label} <KeyboardArrowDown fontSize="small" />
                  </NavButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl) && activeMenu === item.label}
                    onClose={handleMenuClose}
                    TransitionComponent={Fade}
                    PaperProps={{
                      sx: {
                        mt: 1.5,
                        borderRadius: "16px",
                        minWidth: 180,
                        backgroundColor: "hsl(var(--card))",
                        color: "hsl(var(--foreground))",
                        border: "1px solid hsl(var(--border))",
                        boxShadow: "0 10px 40px -10px rgba(0,0,0,0.2)",
                        overflow: "hidden",
                        '& .MuiList-root': {
                          padding: '8px',
                        }
                      }
                    }}
                  >
                    {item.children.map((child) => (
                      <MenuItem 
                        key={child.path} 
                        onClick={handleMenuClose}
                        component={Link}
                        to={child.path}
                        sx={{ 
                          fontFamily: "Poppins, sans-serif",
                          fontSize: "14px",
                          fontWeight: 500,
                          borderRadius: "8px",
                          mb: 0.5,
                          '&:last-child': { mb: 0 },
                          '&:hover': {
                            backgroundColor: "hsl(var(--primary) / 0.1)",
                            color: "hsl(var(--primary))",
                          }
                        }}
                      >
                        {child.label}
                      </MenuItem>
                    ))}
                  </Menu>
                </Box>
              ) : (
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
              )
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
