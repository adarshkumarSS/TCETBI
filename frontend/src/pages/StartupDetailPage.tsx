import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Divider,
  Chip,
  Link,
  Card,
  CardContent,
  Avatar,
  Container,
  Button,
} from "@mui/material";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { fetchPortfolioData } from "@/api/portfolioService";
import { Linkedin, Twitter, Facebook, Globe } from "lucide-react";

export const StartupDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [startup, setStartup] = useState<any>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchPortfolioData();
        const all = [...data.current_startups, ...data.graduated_startups];
        const found = all.find((s) => s.id.toString() === id);
        setStartup(found);
      } catch (error) {
        console.error("❌ Failed to load startup:", error);
      }
    };
    loadData();
  }, [id]);

  if (!startup)
    return (
      <Typography
        sx={{
          mt: 10,
          textAlign: "center",
          color: "hsl(var(--muted-foreground))",
          fontFamily: "Poppins, sans-serif",
        }}
      >
        Loading startup details...
      </Typography>
    );

  const iconBtnStyle = {
    minWidth: 0,
    borderRadius: "50%",
    p: 1,
    border: "1px solid hsl(var(--border))",
    color: "hsl(var(--muted-foreground))",
    "&:hover": {
      color: "hsl(0 84.2% 60.2%)",
      borderColor: "hsl(0 84.2% 60.2%)",
    },
  };

  return (
    <Box
      sx={{
        backgroundColor: "hsl(var(--background))",
        minHeight: "100vh",
        pt: { xs: 10, md: 14 }, // ✅ Top padding for navigation space
        pb: 8,
        position: "relative",
      }}
    >
      <Container maxWidth="lg">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              gap: 4,
            }}
          >
            {/* Left section */}
            <Box sx={{ flex: "1 1 65%", minWidth: "320px" }}>
              {/* Header */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
                <Box
                  sx={{
                    width: 100,
                    height: 100,
                    borderRadius: "16px",
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    overflow: "hidden",
                    p: 1.5,
                  }}
                >
                  <img
                    src={startup.logo}
                    alt={startup.name}
                    style={{
                      width: "90%",
                      height: "90%",
                      objectFit: "contain",
                    }}
                  />
                </Box>
                <Box>
                  <Typography
                    variant="h4"
                    sx={{
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: 700,
                      color: "hsl(var(--foreground))",
                    }}
                  >
                    {startup.name}
                  </Typography>
                  <Typography
                    sx={{
                      color: "hsl(var(--muted-foreground))",
                      fontFamily: "Poppins, sans-serif",
                    }}
                  >
                    {startup.sector}
                  </Typography>
                </Box>
              </Box>

              {/* Tags */}
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 3 }}>
                <Chip
                  label={startup.category?.toUpperCase() || "INCUBATED"}
                  sx={{
                    fontFamily: "Poppins, sans-serif",
                    backgroundColor: "hsl(var(--muted))",
                    color: "hsl(var(--foreground))",
                    borderRadius: "8px",
                  }}
                />
                <Chip
                  label={`Founded ${startup.founded}`}
                  variant="outlined"
                  sx={{
                    fontFamily: "Poppins, sans-serif",
                    borderColor: "hsl(var(--border))",
                    color: "hsl(var(--muted-foreground))",
                    borderRadius: "8px",
                  }}
                />
              </Box>

              {/* Description */}
              <Divider sx={{ borderColor: "hsl(var(--border))", mb: 3 }} />
              <Typography
                sx={{
                  fontFamily: "Poppins, sans-serif",
                  color: "hsl(var(--foreground))",
                  lineHeight: 1.8,
                  mb: 5,
                }}
              >
                {startup.description}
              </Typography>

              {/* Products / Services */}
              {startup.products?.length > 0 && (
                <>
                  <Typography
                    variant="h6"
                    sx={{
                      mb: 2,
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: 600,
                      color: "hsl(var(--foreground))",
                    }}
                  >
                    Products & Services
                  </Typography>

                  {startup.products.map((item: any, i: number) => (
                    <Card
                      key={i}
                      sx={{
                        mb: 2,
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "12px",
                        transition: "0.2s",
                        "&:hover": {
                          transform: "translateY(-3px)",
                          boxShadow: "0 0 12px rgba(255,255,255,0.1)",
                        },
                      }}
                    >
                      <CardContent>
                        <Typography
                          variant="subtitle1"
                          sx={{
                            fontFamily: "Poppins, sans-serif",
                            fontWeight: 600,
                            color: "hsl(var(--foreground))",
                          }}
                        >
                          {item.title}
                        </Typography>
                        <Typography
                          sx={{
                            fontFamily: "Poppins, sans-serif",
                            color: "hsl(var(--muted-foreground))",
                            fontSize: "0.9rem",
                          }}
                        >
                          {item.desc}
                        </Typography>
                      </CardContent>
                    </Card>
                  ))}
                </>
              )}
            </Box>

            {/* Right Sidebar */}
            <Box
              sx={{
                flex: "1 1 30%",
                minWidth: "280px",
                display: "flex",
                flexDirection: "column",
                gap: 3,
              }}
            >
              {/* Info Card */}
              <Card
                sx={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "16px",
                }}
              >
                <CardContent>
                  <Typography
                    variant="h6"
                    sx={{
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: 600,
                      mb: 2,
                      color: "hsl(var(--foreground))",
                    }}
                  >
                    Company Info
                  </Typography>
                  <Typography
                    sx={{
                      color: "hsl(var(--muted-foreground))",
                      mb: 1,
                      fontFamily: "Poppins, sans-serif",
                    }}
                  >
                    Founded: {startup.founded}
                  </Typography>
                  <Typography
                    sx={{
                      color: "hsl(var(--muted-foreground))",
                      mb: 1,
                      fontFamily: "Poppins, sans-serif",
                    }}
                  >
                    Category: {startup.category || "Startup"}
                  </Typography>
                  <Typography
                    sx={{
                      color: "hsl(var(--muted-foreground))",
                      mb: 1,
                      fontFamily: "Poppins, sans-serif",
                    }}
                  >
                    Website:{" "}
                    <Link
                      href={startup.website}
                      target="_blank"
                      sx={{
                        color: "hsl(0 84.2% 60.2%)",
                        textDecoration: "none",
                        "&:hover": { textDecoration: "underline" },
                      }}
                    >
                      {startup.website}
                    </Link>
                  </Typography>
                  <Typography
                    sx={{
                      color: "hsl(var(--muted-foreground))",
                      fontFamily: "Poppins, sans-serif",
                    }}
                  >
                    Location: {startup.location || "Not specified"}
                  </Typography>
                </CardContent>
              </Card>

              {/* CEO / Founders Section */}
{startup.ceos && startup.ceos.length > 0 && (
  <Card
    sx={{
      backgroundColor: "hsl(var(--card))",
      border: "1px solid hsl(var(--border))",
      borderRadius: "16px",
    }}
  >
    <CardContent>
      <Typography
        variant="h6"
        sx={{
          fontFamily: "Poppins, sans-serif",
          fontWeight: 600,
          mb: 2,
          color: "hsl(var(--foreground))",
        }}
      >
        Founders / Leadership
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {startup.ceos.map((ceo: any, i: number) => (
          <Box
            key={i}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              backgroundColor: "hsl(var(--muted))",
              borderRadius: "12px",
              p: 1.5,
            }}
          >
            <Avatar
              src={ceo.image}
              alt={ceo.name}
              sx={{ width: 60, height: 60 }}
            />
            <Box>
              <Typography
                sx={{
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 600,
                  color: "hsl(var(--foreground))",
                }}
              >
                {ceo.name}
              </Typography>
              <Typography
                sx={{
                  color: "hsl(var(--muted-foreground))",
                  fontSize: "0.9rem",
                  fontFamily: "Poppins, sans-serif",
                }}
              >
                {ceo.bio.length > 100 ? ceo.bio.slice(0, 100) + "..." : ceo.bio}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </CardContent>
  </Card>
)}


              {/* Social Links */}
              <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
                {startup.linkedin && (
                  <Button href={startup.linkedin} target="_blank" sx={iconBtnStyle}>
                    <Linkedin size={18} />
                  </Button>
                )}
                {startup.twitter && (
                  <Button href={startup.twitter} target="_blank" sx={iconBtnStyle}>
                    <Twitter size={18} />
                  </Button>
                )}
                {startup.facebook && (
                  <Button href={startup.facebook} target="_blank" sx={iconBtnStyle}>
                    <Facebook size={18} />
                  </Button>
                )}
                {startup.website && (
                  <Button href={startup.website} target="_blank" sx={iconBtnStyle}>
                    <Globe size={18} />
                  </Button>
                )}
              </Box>
            </Box>
          </Box>
        </motion.div>
      </Container>

      {/* Floating Back Button */}
      <Button
        onClick={() => navigate(-1)}
        startIcon={<span style={{ fontSize: "1.3rem", lineHeight: "0.8" }}>←</span>}
        sx={{
          position: "fixed",
          top: 100,
          left: 60,
          zIndex: 10,
          px: 2,
          py: 1,
          borderRadius: "10px",
          fontFamily: "Poppins, sans-serif",
          fontWeight: 500,
          textTransform: "none",
          color: "hsl(0 84.2% 60.2%)",
          backgroundColor: "hsl(var(--card))",
          border: "1px solid hsl(var(--border))",
          boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
          "&:hover": {
            backgroundColor: "hsl(0 84.2% 60.2% / 0.1)",
            borderColor: "hsl(0 84.2% 60.2%)",
          },
        }}
      >
        Back to Portfolio
      </Button>
    </Box>
  );
};
