import { Box, Typography, Chip, IconButton } from "@mui/material";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Calendar, Users, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Incubator {
  id: string;
  companyName: string;
  founder: string;
  industry: string;
  joinedDate: string;
  employees: number;
  status: "active" | "graduating" | "extended";
}

const mockIncubators: Incubator[] = [
  {
    id: "1",
    companyName: "AI Vision Labs",
    founder: "Dr. Priya Kumar",
    industry: "Artificial Intelligence",
    joinedDate: "2024-01-15",
    employees: 8,
    status: "active",
  },
  {
    id: "2",
    companyName: "EcoTech Solutions",
    founder: "Rajesh Sharma",
    industry: "Clean Energy",
    joinedDate: "2023-06-20",
    employees: 12,
    status: "graduating",
  },
  {
    id: "3",
    companyName: "HealthFirst Analytics",
    founder: "Dr. Anita Desai",
    industry: "Healthcare Tech",
    joinedDate: "2024-03-10",
    employees: 6,
    status: "active",
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "active":
      return "#22c55e";
    case "graduating":
      return "#3b82f6";
    case "extended":
      return "#f59e0b";
    default:
      return "hsl(var(--muted))";
  }
};

export const CurrentIncubators = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "hsl(var(--background))",
        pt: 12,
        px: 4,
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

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" },
            gap: 3,
          }}
        >
          {mockIncubators.map((inc) => (
            <Card key={inc.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Building2 size={20} />
                    {inc.companyName}
                  </Box>
                  <Chip
                    label={inc.status}
                    size="small"
                    sx={{
                      backgroundColor: getStatusColor(inc.status),
                      color: "#fff",
                      textTransform: "capitalize",
                    }}
                  />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Typography variant="body2" sx={{ mb: 2, fontWeight: 600 }}>
                  {inc.founder}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1, color: "hsl(var(--muted-foreground))" }}>
                  Industry: {inc.industry}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 1 }}>
                  <Calendar size={14} />
                  <Typography variant="caption" sx={{ color: "hsl(var(--muted-foreground))" }}>
                    Joined: {inc.joinedDate}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <Users size={14} />
                  <Typography variant="caption" sx={{ color: "hsl(var(--muted-foreground))" }}>
                    Team Size: {inc.employees}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>
    </Box>
  );
};
