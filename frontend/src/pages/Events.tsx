import { motion } from 'framer-motion';
import { Box, Typography, Container, Tabs, Tab } from '@mui/material';
import { CardContainer } from '../components/ui/CardContainer';
import { OutlinedTextField } from '../components/ui/OutlinedTextField';
import { useState, useEffect } from 'react';
import { fetchEvents, Event as EventType } from "../api/eventService";

interface Event extends EventType {}

const EventCard = ({ event }: { event: Event }) => {
  const getStatusBadgeColor = (status: string) => {
    const s = status.toLowerCase();

    if (s === "live") return "#00b436ff";      // green
    if (s === "upcoming") return "#af24ffff";  // purple
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
      <Box 
        component={event.link ? 'a' : 'div'}
        href={event.link}
        target={event.link ? '_blank' : undefined}
        rel={event.link ? 'noopener noreferrer' : undefined}
        sx={{ 
          display: 'block', 
          height: '100%', 
          textDecoration: 'none',
          cursor: event.link ? 'pointer' : 'default'
        }}
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
            src={event.image}
            alt={event.title}
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
              backgroundColor: getStatusBadgeColor(event.status),
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
            {event.status}
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
          {event.title}
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
          {event.description}
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
              {event.duration}
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
              {event.startDate}
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
              {event.endDate}
            </Typography>
          </Box>
        </Box>
        </CardContainer>
      </Box>
    </motion.div>
  );
};

export const Events: React.FC = () => {
  const [selectedCategory, setSelectedCategory] =
    useState<"all" | "live" | "ended" | "upcoming">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchEvents();
        // Sort events: live first, then upcoming, then ended
        const sortedData = [...data].sort((a, b) => {
          const statusOrder: Record<string, number> = { live: 0, upcoming: 1, ended: 2 };
          return (statusOrder[a.status.toLowerCase()] ?? 3) - (statusOrder[b.status.toLowerCase()] ?? 3);
        });
        setEvents(sortedData);
      } catch (err) {
        console.error("Event fetch failed:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filteredEvents = events.filter((event) => {
    const matchCategory =
      selectedCategory === "all" || event.status  === selectedCategory;

    const matchSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchCategory && matchSearch;
  });

  const getCategoryCount = (cat: "all" | "live" | "ended" | "upcoming") =>
    cat === "all"
      ? events.length
      : events.filter((p) => p.status === cat).length;

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
            Events
          </Typography>

          <Box sx={{ mb: 6, display: "flex", justifyContent: "center" }}>
            <OutlinedTextField
              placeholder="Search events..."
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
          ) : filteredEvents.length > 0 ? (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
                gap: 4,
              }}
            >
              {filteredEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <EventCard event={event} />
                </motion.div>
              ))}
            </Box>
          ) : (
            <Typography align="center" sx={{ py: 8 }}>
              No events found matching your criteria.
            </Typography>
          )}
        </motion.div>
      </Container>
    </Box>
  );
};
