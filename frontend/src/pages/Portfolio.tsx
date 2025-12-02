import { motion } from "framer-motion";
import {
  Box,
  Typography,
  Container,
  CircularProgress,
  TextField,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Avatar
} from "@mui/material";
import { useEffect, useState, useMemo } from "react";
import { Search } from "@mui/icons-material";
import {
  fetchPortfolioData,
  PortfolioData,
  Startup,
} from "@/api/portfolioService";
import { useNavigate } from "react-router-dom";

// 🧩 Company Row Component
const CompanyRow = ({
  startup,
  status,
  onClick,
  index
}: {
  startup: Startup;
  status: "Current" | "Graduated";
  onClick: (startup: Startup) => void;
  index: number;
}) => (
  <TableRow
    component={motion.tr}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay: index * 0.05 }}
    hover
    onClick={() => onClick(startup)}
    sx={{
      cursor: "pointer",
      "&:hover": {
        backgroundColor: "hsl(var(--muted) / 0.5)",
      }
    }}
  >
    <TableCell>
      <motion.div
        whileHover={{ scale: 1.1 }}
        transition={{ duration: 0.2 }}
      >
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: 2,
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "hsl(var(--muted))"
          }}
        >
          <img
            src={startup.logo}
            alt={startup.name}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              display: "block"
            }}
          />
        </Box>
      </motion.div>
    </TableCell>
    <TableCell>
      <Typography
        variant="h6"
        sx={{
          color: "hsl(var(--foreground))",
          fontFamily: "Poppins, sans-serif",
          fontWeight: 600,
          fontSize: "1rem",
        }}
      >
        {startup.name}
      </Typography>
    </TableCell>
    <TableCell>
      <Chip
        label={status}
        size="small"
        sx={{
          backgroundColor: status === "Current"
            ? "hsl(142 76% 36%)"
            : "hsl(221 83% 53%)",
          color: "white",
          fontWeight: 600,
          fontSize: "0.75rem",
        }}
      />
    </TableCell>
    <TableCell>
      <Typography
        variant="body2"
        sx={{
          color: "hsl(var(--foreground))",
          fontFamily: "Poppins, sans-serif",
          fontWeight: 500,
        }}
      >
        {startup.founded}
      </Typography>
    </TableCell>
    <TableCell>
      <Typography
        variant="body2"
        sx={{
          color: "hsl(var(--muted-foreground))",
          fontFamily: "Poppins, sans-serif",
        }}
      >
        {startup.sector}
      </Typography>
    </TableCell>
  </TableRow>
);

// 🧩 Main Portfolio Page
export const Portfolio: React.FC = () => {
  const [portfolio, setPortfolio] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchPortfolioData()
      .then((res) => setPortfolio(res))
      .catch((err) => console.error("❌ Failed to fetch portfolio:", err))
      .finally(() => setLoading(false));
  }, []);

  // Combine and filter companies
  const allCompanies = useMemo(() => {
    if (!portfolio) return [];

    const currentCompanies = portfolio.current_startups.map(startup => ({
      ...startup,
      status: "Current" as const
    }));

    const graduatedCompanies = portfolio.graduated_startups.map(startup => ({
      ...startup,
      status: "Graduated" as const
    }));

    return [...currentCompanies, ...graduatedCompanies].filter(company =>
      company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.sector.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [portfolio, searchTerm]);

  if (loading) return (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", backgroundColor: "hsl(var(--background))" }}>
      <CircularProgress />
    </Box>
  );

  if (!portfolio) return <p>Failed to load portfolio data.</p>;

  const handleCompanyClick = (startup: Startup) => {
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
      <Container maxWidth="xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Typography
            variant="h2"
            align="center"
            sx={{
              mb: 6,
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

          {/* Search Bar */}
          <Box sx={{ mb: 4, maxWidth: 600, mx: "auto" }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search companies by name or sector..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: "hsl(var(--muted-foreground))" }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "hsl(var(--card))",
                  borderRadius: 3,
                  "& fieldset": {
                    borderColor: "hsl(var(--border))",
                  },
                  "&:hover fieldset": {
                    borderColor: "hsl(var(--ring))",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "hsl(var(--ring))",
                  },
                },
                "& .MuiInputBase-input": {
                  color: "hsl(var(--foreground))",
                  fontFamily: "Poppins, sans-serif",
                },
              }}
            />
          </Box>

          {/* Companies Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <TableContainer
              component={Paper}
              sx={{
                backgroundColor: "hsl(var(--card))",
                borderRadius: 3,
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                overflow: "hidden",
              }}
            >
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: "hsl(var(--muted))" }}>
                    <TableCell sx={{ fontWeight: 600, color: "hsl(var(--foreground))", fontFamily: "Poppins, sans-serif" }}>
                      Logo
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, color: "hsl(var(--foreground))", fontFamily: "Poppins, sans-serif" }}>
                      Company Name
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, color: "hsl(var(--foreground))", fontFamily: "Poppins, sans-serif" }}>
                      Status
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, color: "hsl(var(--foreground))", fontFamily: "Poppins, sans-serif" }}>
                      Year
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, color: "hsl(var(--foreground))", fontFamily: "Poppins, sans-serif" }}>
                      Sector
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {allCompanies.map((company, index) => (
                    <CompanyRow
                      key={company.id}
                      startup={company}
                      status={company.status}
                      onClick={handleCompanyClick}
                      index={index}
                    />
                  ))}
                  {allCompanies.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                        <Typography
                          variant="body1"
                          sx={{
                            color: "hsl(var(--muted-foreground))",
                            fontFamily: "Poppins, sans-serif",
                          }}
                        >
                          {searchTerm ? "No companies found matching your search." : "No companies available."}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </motion.div>
        </motion.div>
      </Container>
    </Box>
  );
};
