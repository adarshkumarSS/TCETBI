import { motion } from 'framer-motion';
import { Box, Typography, Container, Tabs, Tab } from '@mui/material';
import { CardContainer } from '../components/ui/CardContainer';
import { OutlinedTextField } from '../components/ui/OutlinedTextField';
import { useState, useEffect } from 'react';
import { fetchPrograms, Program as ProgramType } from "../api/programService";

interface Program extends ProgramType {}

const ProgramCard = ({ program }: { program: Program }) => {
  const getStatusBadgeColor = (status: string) => {
    const s = status.toLowerCase();

    if (s === "live") return "#00b436ff";      // violet
    if (s === "upcoming") return "#af24ffff";  // yellow
    if (s === "ended") return "#EF4444";     // red

    return "#6B7280"; // default grey fallback
  };


  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      whileHover={{ y: -8 }}
      className="h-full"
    >
      <CardContainer className="h-full flex flex-col">
        <Box sx={{ position: 'relative', marginBottom: 3 }}>
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              borderRadius: "var(--radius)",
              background:
                "linear-gradient(to bottom, rgba(0,0,0,0.25), rgba(0,0,0,0.6))",
              pointerEvents: "none",
            }}
          />

          <motion.img
            src={program.image}
            alt={program.title}
            style={{
              width: "100%",
              height: 200,
              objectFit: "cover",
              borderRadius: "var(--radius)",
            }}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          />

          <Box
            sx={{
              position: "absolute",
              top: 14,
              right: 14,
              backgroundColor: getStatusBadgeColor(program.status),
              color: "white",
              padding: "6px 16px",
              borderRadius: "999px",
              fontSize: "0.75rem",
              fontFamily: "Poppins, sans-serif",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
            }}
          >
            {program.status}
          </Box>
        </Box>

        <Typography
          variant="h6"
          sx={{
            mb: 2,
            color: "hsl(var(--foreground))",
            fontFamily: "Poppins, sans-serif",
            fontWeight: 600,
          }}
        >
          {program.title}
        </Typography>

        <Typography
          variant="body2"
          sx={{
            mb: 3,
            color: "hsl(var(--muted-foreground))",
            flexGrow: 1,
            fontFamily: "Poppins, sans-serif",
            lineHeight: 1.5,
          }}
        >
          {program.description}
        </Typography>

        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Box>
            <Typography
              variant="body2"
              sx={{
                color: "hsl(var(--muted-foreground))",
                fontFamily: "Poppins, sans-serif",
                fontSize: "0.8rem",
              }}
            >
              Duration
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "hsl(var(--primary))",
                fontFamily: "Poppins, sans-serif",
                fontWeight: 600,
              }}
            >
              {program.duration}
            </Typography>
          </Box>


        </Box>

        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box>
            <Typography
              variant="body2"
              sx={{
                color: "hsl(var(--muted-foreground))",
                fontFamily: "Poppins, sans-serif",
                fontSize: "0.8rem",
              }}
            >
              Start Date
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "hsl(var(--foreground))",
                fontFamily: "Poppins, sans-serif",
                fontWeight: 500,
              }}
            >
              {program.startDate}
            </Typography>
          </Box>

          <Box>
            <Typography
              variant="body2"
              sx={{
                color: "hsl(var(--muted-foreground))",
                fontFamily: "Poppins, sans-serif",
                fontSize: "0.8rem",
              }}
            >
              End Date
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "hsl(var(--foreground))",
                fontFamily: "Poppins, sans-serif",
                fontWeight: 500,
              }}
            >
              {program.endDate}
            </Typography>
          </Box>
        </Box>
      </CardContainer>
    </motion.div>
  );
};

export const Program: React.FC = () => {
  const [selectedCategory, setSelectedCategory] =
    useState<"all" | "live" | "ended" | "upcoming">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchPrograms();
        setPrograms(data);
      } catch (err) {
        console.error("Program fetch failed:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filteredPrograms = programs.filter((program) => {
    const matchCategory =
      selectedCategory === "all" || program.status  === selectedCategory;

    const matchSearch =
      program.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      program.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchCategory && matchSearch;
  });

  const getCategoryCount = (cat: "all" | "live" | "ended" | "upcoming") =>
    cat === "all"
      ? programs.length
      : programs.filter((p) => p.status === cat).length;

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
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
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
            <Box component="span" sx={{ color: "hsl(var(--destructive))" }}>
              Our{" "}
            </Box>
            Programs
          </Typography>

          <Box sx={{ mb: 6, display: "flex", justifyContent: "center" }}>
            <OutlinedTextField
              placeholder="Search programs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ maxWidth: 400, width: "100%" }}
            />
          </Box>

          <Box sx={{ mb: 6 }}>
            <Tabs
              value={selectedCategory}
              onChange={(_, v) => setSelectedCategory(v)}
              centered
              sx={{
                "& .MuiTab-root": {
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 500,
                  textTransform: "none",
                  fontSize: "1rem",
                  color: "hsl(var(--muted-foreground))",
                  "&.Mui-selected": {
                    color: "hsl(var(--primary))",
                  },
                },
                "& .MuiTabs-indicator": {
                  backgroundColor: "hsl(var(--primary))",
                },
              }}
            >
              <Tab label={`All (${getCategoryCount("all")})`} value="all" />
              <Tab label={`Live (${getCategoryCount("live")})`} value="live" />
              <Tab label={`Upcoming (${getCategoryCount("upcoming")})`} value="upcoming" />
              <Tab label={`Ended (${getCategoryCount("ended")})`} value="ended" />
            </Tabs>
          </Box>

          {loading ? (
            <Typography align="center">Loading...</Typography>
          ) : filteredPrograms.length > 0 ? (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
                gap: 4,
              }}
            >
              {filteredPrograms.map((program, index) => (
                <motion.div
                  key={program.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <ProgramCard program={program} />
                </motion.div>
              ))}
            </Box>
          ) : (
            <Typography align="center" sx={{ py: 8 }}>
              No programs found matching your criteria.
            </Typography>
          )}
        </motion.div>
      </Container>
    </Box>
  );
};
