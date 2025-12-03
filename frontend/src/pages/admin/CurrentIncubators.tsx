import { useState, useEffect } from "react";
import { Box, Typography, Chip, IconButton, CircularProgress } from "@mui/material";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Calendar, Users, ArrowLeft, MapPin, Globe } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { fetchPortfolioData, Startup } from "../../api/portfolioService";

export const CurrentIncubators = () => {
  const navigate = useNavigate();
  const [incubators, setIncubators] = useState<Startup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIncubators = async () => {
      try {
        const data = await fetchPortfolioData();
        setIncubators(data.current_startups);
      } catch (error) {
        console.error("Failed to fetch incubators:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchIncubators();
  }, []);

  if (loading) {
    return (
      <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "hsl(var(--background))",
        pt: 16,
        px: 4,
        pb: 8,
      }}
    >
      <Box
        sx={{
          maxWidth: "1200px",
          mx: "auto",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4 }}>
          <IconButton
            onClick={() => navigate("/admin")}
            sx={{
              color: "hsl(var(--foreground))",
              "&:hover": { backgroundColor: "hsl(var(--muted))" },
            }}
          >
            <ArrowLeft size={24} />
          </IconButton>
          <Typography
            variant="h4"
            sx={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 700,
              color: "hsl(var(--foreground))",
            }}
          >
            Current Incubators
          </Typography>
        </Box>

        {incubators.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <Typography variant="h6" sx={{ color: "hsl(var(--muted-foreground))" }}>
              No active incubators found.
            </Typography>
          </Box>
        ) : (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" },
              gap: 3,
            }}
          >
            {incubators.map((inc) => (
              <Card key={inc.id} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      {inc.logo ? (
                        <img 
                          src={inc.logo} 
                          alt={inc.name} 
                          style={{ width: 40, height: 40, borderRadius: "8px", objectFit: "cover" }} 
                        />
                      ) : (
                        <Box sx={{ 
                          width: 40, 
                          height: 40, 
                          borderRadius: "8px", 
                          bgcolor: "hsl(var(--primary) / 0.1)", 
                          display: "flex", 
                          alignItems: "center", 
                          justifyContent: "center", 
                          color: "hsl(var(--primary))"
                        }}>
                          <Building2 size={20} />
                        </Box>
                      )}
                      <Typography variant="h6" sx={{ fontFamily: "Poppins, sans-serif", fontWeight: 600 }}>
                        {inc.name}
                      </Typography>
                    </Box>
                    <Chip
                      label="Active"
                      size="small"
                      sx={{
                        backgroundColor: "#22c55e",
                        color: "#fff",
                        fontWeight: 600,
                        fontSize: "0.75rem"
                      }}
                    />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Typography variant="body2" sx={{ mb: 2, fontWeight: 600, fontFamily: "Poppins, sans-serif" }}>
                    Founder: {inc.ceos && inc.ceos.length > 0 ? inc.ceos.map(c => c.name).join(", ") : "N/A"}
                  </Typography>
                  
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Typography variant="body2" sx={{ color: "hsl(var(--muted-foreground))", fontFamily: "Poppins, sans-serif" }}>
                        Sector:
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500, fontFamily: "Poppins, sans-serif" }}>
                        {inc.sector}
                      </Typography>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Calendar size={14} className="text-muted-foreground" />
                      <Typography variant="caption" sx={{ color: "hsl(var(--muted-foreground))", fontFamily: "Poppins, sans-serif" }}>
                        Founded: {inc.founded || "N/A"}
                      </Typography>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <MapPin size={14} className="text-muted-foreground" />
                      <Typography variant="caption" sx={{ color: "hsl(var(--muted-foreground))", fontFamily: "Poppins, sans-serif" }}>
                        {inc.location || "Location not specified"}
                      </Typography>
                    </Box>

                    {inc.website && (
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Globe size={14} className="text-muted-foreground" />
                        <a 
                          href={inc.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          style={{ 
                            fontSize: "0.75rem", 
                            color: "hsl(var(--primary))", 
                            textDecoration: "none",
                            fontFamily: "Poppins, sans-serif"
                          }}
                        >
                          Visit Website
                        </a>
                      </Box>
                    )}
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
};
