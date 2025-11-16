import { motion } from "framer-motion";
import { Box, Typography, Container, CircularProgress } from "@mui/material";
import { useEffect, useState, useCallback } from "react";
import { CardContainer } from "../components/ui/CardContainer";
import LogoLoop from "../components/LogoLoop";
import {
  fetchPortfolioData,
  PortfolioData,
  Startup,
} from "@/api/portfolioService";
import { useNavigate } from "react-router-dom";

// ✨ Reusable glowing logo component
const GlowingLogo = ({ src, alt, size = 90 }: { src: string; alt: string; size?: number }) => (
  <Box
    sx={{
      display: "inline-flex",
      justifyContent: "center",
      alignItems: "center",
      p: 1.2,
      borderRadius: "14px",
      overflow: "hidden",
      height: size + 12,
      transition: "transform 0.3s ease, filter 0.3s ease",
      filter: "drop-shadow(0 0 4px rgba(255, 255, 255, 0.3))",
      "&:hover": {
        transform: "scale(1.05)",
        filter: "drop-shadow(0 0 8px rgba(255, 255, 255, 0.6))",
      },
    }}
  >
    <img
      src={src}
      alt={alt}
      style={{
        height: size,
        width: "auto",
        objectFit: "contain",
        display: "block",
      }}
    />
  </Box>
);


// 🧩 Current Startups Section
const CurrentStartupsSection = ({
  startups,
  onStartupClick,
}: {
  startups: Startup[];
  onStartupClick: (startup: Startup) => void;
}) => (
  <Box sx={{ py: 8, backgroundColor: "hsl(var(--background))" }}>
    <Container maxWidth="lg">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <Typography
          variant="h3"
          sx={{
            mb: 6,
            color: "hsl(var(--foreground))",
            fontFamily: "Poppins, sans-serif",
            fontWeight: 600,
          }}
        >
          Current Startups
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
            },
            gap: 3,
          }}
        >
          {startups.map((startup, index) => (
            <motion.div
              key={startup.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <CardContainer
                className="cursor-pointer h-full"
                onClick={() => onStartupClick(startup)}
              >
                <Box sx={{ textAlign: "center", p: 3 }}>
                  <motion.img
                    src={startup.logo}
                    alt={startup.name}
                    style={{
                      width: 140,
                      height: 140,
                      objectFit: "contain",
                      borderRadius: "16px",
                      marginBottom: 20,
                    }}
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  />
                  <Typography
                    variant="h6"
                    sx={{
                      mb: 2,
                      color: "hsl(var(--foreground))",
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: 600,
                    }}
                  >
                    {startup.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "hsl(var(--muted-foreground))",
                      fontFamily: "Poppins, sans-serif",
                      mb: 2,
                    }}
                  >
                    {startup.sector}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "hsl(var(--muted-foreground))",
                      fontFamily: "Poppins, sans-serif",
                      fontSize: "0.9rem",
                    }}
                  >
                    Founded: {startup.founded}
                  </Typography>
                </Box>
              </CardContainer>
            </motion.div>
          ))}
        </Box>
      </motion.div>
    </Container>
  </Box>
);

// 🧩 Graduated Startups Section
// 🧩 Graduated Startups Section
const GraduatedStartupsSection = ({
  startups,
  onStartupClick,
}: {
  startups: Startup[];
  onStartupClick: (startup: Startup) => void;
}) => {
  const logoData = startups.map((startup) => ({
    node: <GlowingLogo src={startup.logo} alt={startup.name} size={80} />, // ⬅️ Reduced size
    title: startup.name,
    href: "#",
  }));

  return (
    <Box sx={{ py: 8, backgroundColor: "hsl(var(--muted))" }}>
      <Container maxWidth="lg">
        <Typography
          variant="h3"
          sx={{
            mb: 6,
            color: "hsl(var(--foreground))",
            fontFamily: "Poppins, sans-serif",
            fontWeight: 600,
          }}
        >
          Graduated Startups
        </Typography>

        {/* 🔁 Rolling Logos */}
        <Box sx={{ mb: 6 }}>
          <LogoLoop
            logos={logoData}
            speed={16}
            direction="right"
            logoHeight={80} // ⬅️ Reduced from 140
            gap={60} // ⬅️ Reduced from 80
            pauseOnHover
            scaleOnHover
            fadeOut
            fadeOutColor="hsl(var(--muted))"
            ariaLabel="Graduated Startups"
          />
        </Box>

        {/* Grid of Startup Cards */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(4, 1fr)",
            },
            gap: 3,
          }}
        >
          {startups.map((startup, index) => (
            <motion.div
              key={startup.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <CardContainer
                className="cursor-pointer h-full"
                onClick={() => onStartupClick(startup)}
              >
                <Box sx={{ textAlign: "center", p: 3 }}>
                  <img
                    src={startup.logo}
                    alt={startup.name}
                    style={{
                      width: 90, // ⬅️ smaller size
                      height: 90,
                      objectFit: "contain",
                      borderRadius: "10px",
                      marginBottom: 14,
                      display: "block",
                      marginInline: "auto",
                    }}
                  />
                  <Typography
                    variant="h6"
                    sx={{
                      mb: 1,
                      color: "hsl(var(--foreground))",
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: 600,
                      fontSize: "0.95rem",
                    }}
                  >
                    {startup.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "hsl(var(--muted-foreground))",
                      fontFamily: "Poppins, sans-serif",
                      fontSize: "0.8rem",
                    }}
                  >
                    {startup.sector}
                  </Typography>
                </Box>
              </CardContainer>
            </motion.div>
          ))}
        </Box>
      </Container>
    </Box>
  );
};


// 🧩 Main Portfolio Page
export const Portfolio: React.FC = () => {
  const [portfolio, setPortfolio] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPortfolioData()
      .then((res) => setPortfolio(res))
      .catch((err) => console.error("❌ Failed to fetch portfolio:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", backgroundColor: "hsl(var(--background))" }}>
      <CircularProgress />
    </Box>
  );
  if (!portfolio) return <p>Failed to load portfolio data.</p>;

  const handleStartupClick = (startup: Startup) => {
    navigate(`/portfolio/${startup.id}`);
  };

  return (
    <Box
      sx={{
        pt: 16,
        pb: 8,
        minHeight: "100vh",
        backgroundColor: "hsl(var(--background))",
      }}
    >
      <Container maxWidth="lg">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Typography
            variant="h2"
            align="center"
            sx={{
              mb: 8,
              color: "hsl(var(--foreground))",
              fontFamily: "Poppins, sans-serif",
              fontWeight: 600,
            }}
          >
            <Box component="span" sx={{ color: "hsl(0 84.2% 60.2%)" }}>
              Our{" "}
            </Box>
            Portfolio
          </Typography>
        </motion.div>
      </Container>

      <CurrentStartupsSection
        startups={portfolio.current_startups}
        onStartupClick={handleStartupClick}
      />
      <GraduatedStartupsSection
        startups={portfolio.graduated_startups}
        onStartupClick={handleStartupClick}
      />
    </Box>
  );
};
