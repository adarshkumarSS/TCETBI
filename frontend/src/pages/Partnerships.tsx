import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Box,
  Typography,
  Container,
  Card,
  CardContent,
  Button,
  CircularProgress,
  useTheme,
  alpha,
} from "@mui/material";
import { ExternalLink } from "lucide-react";
import { fetchPartnerships, Partnership } from "@/api/partnershipService";

export const Partnerships: React.FC = () => {
  const [partnerships, setPartnerships] = useState<Partnership[]>([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchPartnerships();
        setPartnerships(data);
      } catch (err) {
        console.error("Failed to fetch partnerships:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          pt: 16,
          minHeight: "100vh",
          backgroundColor: "hsl(var(--background))",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress color="error" />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        pt: 16,
        pb: 12,
        minHeight: "100vh",
        backgroundColor: "hsl(var(--background))",
      }}
    >
      <Container maxWidth="lg">
        {/* Header section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Typography
            variant="h2"
            align="center"
            sx={{
              mb: 2,
              color: "hsl(var(--foreground))",
              fontFamily: "Poppins, sans-serif",
              fontWeight: 700,
            }}
          >
            Our{" "}
            <Box component="span" sx={{ color: "hsl(var(--destructive))" }}>
              Partnerships
            </Box>
          </Typography>
          <Typography
            variant="h5"
            align="center"
            sx={{
              mb: 8,
              color: "hsl(var(--muted-foreground))",
              maxWidth: "800px",
              mx: "auto",
              fontFamily: "Inter, sans-serif",
            }}
          >
            Collaborating with industry leaders and government institutions to
            foster innovation and accelerate startup growth.
          </Typography>
        </motion.div>

        {/* Partnerships Grid */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              lg: "repeat(3, 1fr)",
            },
            gap: 4,
          }}
        >
          {partnerships.map((partner, index) => (
            <motion.div
              key={partner.id || index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
            >
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: 4,
                  overflow: "hidden",
                  boxShadow: `0 4px 20px ${alpha(theme.palette.common.black, 0.1)}`,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    borderColor: "hsl(var(--destructive))",
                    boxShadow: `0 12px 30px ${alpha(theme.palette.error.main, 0.15)}`,
                  },
                }}
              >
                <Box
                  sx={{
                    p: 4,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: alpha(theme.palette.common.white, 0.03),
                    height: "180px",
                  }}
                >
                  <Box
                    component="img"
                    src={partner.logo}
                    alt={partner.name}
                    sx={{
                      maxWidth: "100%",
                      maxHeight: "100%",
                      objectFit: "contain",
                      filter: "drop-shadow(0px 4px 8px rgba(0,0,0,0.1))",
                    }}
                  />
                </Box>
                <CardContent sx={{ flexGrow: 1, p: 4 }}>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: 600,
                      color: "hsl(var(--foreground))",
                      mb: 2,
                    }}
                  >
                    {partner.name}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: "hsl(var(--muted-foreground))",
                      lineHeight: 1.7,
                      mb: 3,
                    }}
                  >
                    {partner.description}
                  </Typography>
                  {partner.website && (
                    <Button
                      variant="outlined"
                      color="error"
                      endIcon={<ExternalLink size={16} />}
                      href={partner.website}
                      target="_blank"
                      sx={{
                        borderRadius: 2,
                        textTransform: "none",
                        fontWeight: 600,
                        px: 3,
                        transition: "all 0.3s ease",
                        "&:hover": {
                          backgroundColor: "hsl(var(--destructive))",
                          color: "white",
                        },
                      }}
                    >
                      Visit Website
                    </Button>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </Box>
        
        {partnerships.length === 0 && (
          <Box sx={{ mt: 8, textAlign: "center" }}>
             <Typography variant="h6" color="text.secondary">
               No partnerships listed at the moment.
             </Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
};
