import { motion } from "framer-motion";
import { Box, Typography, Container } from "@mui/material";
import { CardContainer } from "../components/ui/CardContainer";

interface VideoCard {
  id: number;
  title: string;
  description: string;
  videoId: string;
  thumbnail: string;
}

interface Facility {
  id: number;
  name: string;
  description: string;
  image: string;
  features: string[];
}

const ShowcaseVideosSection = () => {
  const videos: VideoCard[] = [
    {
      id: 1,
      title: "Innovation Lab Tour",
      description:
        "Take a virtual tour of our cutting-edge innovation laboratories equipped with the latest technology.",
      videoId: "_qEG9X3G7q0",
      thumbnail: "https://img.youtube.com/vi/_qEG9X3G7q0/hqdefault.jpg",
    },
    {
      id: 2,
      title: "Startup Workspaces",
      description:
        "Explore our collaborative workspaces designed to foster creativity and entrepreneurship.",
      videoId: "VpiqscrcbME",
      thumbnail: "https://img.youtube.com/vi/VpiqscrcbME/hqdefault.jpg",
    },
    {
      id: 3,
      title: "Conference & Meeting Rooms",
      description:
        "Professional conference facilities for meetings, pitches, and networking events.",
      videoId: "XmUYtekm_EU",
      thumbnail: "https://img.youtube.com/vi/XmUYtekm_EU/hqdefault.jpg",
    },
    {
      id: 4,
      title: "Prototyping Facility",
      description:
        "Advanced prototyping and fabrication facilities for bringing ideas to life.",
      videoId: "8Ome0BKLgqQ",
      thumbnail: "https://img.youtube.com/vi/8Ome0BKLgqQ/hqdefault.jpg",
    },
    {
      id: 5,
      title: "Mentorship Spaces",
      description:
        "Dedicated spaces for one-on-one mentoring and guidance sessions.",
      videoId: "TChiE1FDXdY",
      thumbnail: "https://img.youtube.com/vi/TChiE1FDXdY/hqdefault.jpg",
    },
    {
      id: 6,
      title: "Event Auditorium",
      description:
        "Large auditorium for workshops, seminars, and startup showcases.",
      videoId: "tc4aTZ0K3uw",
      thumbnail: "https://img.youtube.com/vi/tc4aTZ0K3uw/hqdefault.jpg",
    },
  ];

  return (
    <Box sx={{ py: 10, backgroundColor: "hsl(var(--background))" }}>
      <Container maxWidth="lg">
        {/* ✅ Title Section (replaces HeroSection) */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Typography
            variant="h2"
            align="center"
            sx={{
              color: "hsl(var(--foreground))",
              fontFamily: "Poppins, sans-serif",
              fontWeight: 700,
              mb: 2,
            }}
          >
            <Box component="span" sx={{ color: "hsl(var(--destructive))" }}>
              World-Class
            </Box>{" "}
            Facilities
          </Typography>

          <Typography
            variant="h5"
            align="center"
            sx={{
              mb: 8,
              color: "hsl(var(--muted-foreground))",
              fontFamily: "Poppins, sans-serif",
              fontWeight: 400,
            }}
          >
            State-of-the-art infrastructure designed for innovation
          </Typography>
        </motion.div>

        {/* 🎥 Facility Showcase Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Typography
            variant="h3"
            align="center"
            sx={{
              mb: 8,
              color: "hsl(var(--foreground))",
              fontFamily: "Poppins, sans-serif",
              fontWeight: 600,
            }}
          >
            Facility Showcase
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                md: "repeat(3, 1fr)",
              },
              gap: 4,
            }}
          >
            {videos.map((video, index) => (
              <Box key={video.id}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <CardContainer>
                    <Box
                      sx={{
                        position: "relative",
                        paddingBottom: "56.25%",
                        height: 0,
                        overflow: "hidden",
                        borderRadius: "var(--radius)",
                        mb: 3,
                        cursor: "pointer",
                      }}
                      onClick={() =>
                        window.open(
                          `https://www.youtube.com/watch?v=${video.videoId}`,
                          "_blank"
                        )
                      }
                    >
                      <motion.img
                        src={video.thumbnail}
                        alt={video.title}
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                      />
                      <Box
                        sx={{
                          position: "absolute",
                          top: "50%",
                          left: "50%",
                          transform: "translate(-50%, -50%)",
                          width: 60,
                          height: 60,
                          borderRadius: "50%",
                          backgroundColor: "rgba(255,255,255,0.9)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "hsl(var(--primary))",
                          transition: "all 0.3s ease",
                          "&:hover": {
                            backgroundColor: "hsl(var(--primary))",
                            color: "white",
                            transform: "translate(-50%, -50%) scale(1.1)",
                          },
                        }}
                      >
                        <Box
                          sx={{
                            width: 0,
                            height: 0,
                            borderLeft: "12px solid currentColor",
                            borderTop: "8px solid transparent",
                            borderBottom: "8px solid transparent",
                            marginLeft: "4px",
                          }}
                        />
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
                      {video.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "hsl(var(--muted-foreground))",
                        fontFamily: "Poppins, sans-serif",
                        lineHeight: 1.5,
                      }}
                    >
                      {video.description}
                    </Typography>
                  </CardContainer>
                </motion.div>
              </Box>
            ))}
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

const InfrastructureSection = () => {
  const sharedInfra: Facility[] = [
    {
      id: 1,
      name: "Co-working Spaces",
      description:
        "Flexible workspaces with modern amenities for startups at different stages.",
      image: "/api/placeholder/300/200",
      features: [
        "24/7 Access",
        "High-Speed Internet",
        "Meeting Rooms",
        "Coffee Station",
      ],
    },
    {
      id: 2,
      name: "Innovation Labs",
      description:
        "Fully equipped laboratories for research, development, and testing.",
      image: "/api/placeholder/300/200",
      features: [
        "Latest Equipment",
        "Testing Facilities",
        "Research Support",
        "Safety Protocols",
      ],
    },
    {
      id: 3,
      name: "Fabrication Workshop",
      description:
        "Complete fabrication facility with 3D printing and prototyping tools.",
      image: "/api/placeholder/300/200",
      features: [
        "3D Printing",
        "CNC Machines",
        "Electronics Lab",
        "Material Testing",
      ],
    },
  ];

  const tcetbiInfra: Facility[] = [
    {
      id: 4,
      name: "Auditorium",
      description:
        "State-of-the-art auditorium for events, presentations, and workshops.",
      image: "/api/placeholder/300/200",
      features: [
        "200 Seating",
        "AV Equipment",
        "Stage Lighting",
        "Recording Setup",
      ],
    },
    {
      id: 5,
      name: "Conference Halls",
      description:
        "Professional conference facilities for meetings and networking events.",
      image: "/api/placeholder/300/200",
      features: [
        "Video Conferencing",
        "Presentation Setup",
        "Comfortable Seating",
        "Catering Services",
      ],
    },
    {
      id: 6,
      name: "Library & Resource Center",
      description:
        "Comprehensive library with business resources and quiet study areas.",
      image: "/api/placeholder/300/200",
      features: [
        "Business Books",
        "Digital Resources",
        "Study Areas",
        "Research Support",
      ],
    },
  ];

  const renderFacilityGrid = (facilities: Facility[], title: string) => (
    <Box sx={{ mb: 8 }}>
      <Typography
        variant="h4"
        align="center"
        sx={{
          mb: 6,
          color: "hsl(var(--primary))",
          fontFamily: "Poppins, sans-serif",
          fontWeight: 600,
        }}
      >
        {title}
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
          gap: 4,
        }}
      >
        {facilities.map((facility, index) => (
          <Box key={facility.id}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <CardContainer className="h-full">
                <motion.img
                  src={facility.image}
                  alt={facility.name}
                  style={{
                    width: "100%",
                    height: 200,
                    objectFit: "cover",
                    borderRadius: "var(--radius)",
                    marginBottom: 16,
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
                  {facility.name}
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    mb: 3,
                    color: "hsl(var(--muted-foreground))",
                    fontFamily: "Poppins, sans-serif",
                    lineHeight: 1.5,
                  }}
                >
                  {facility.description}
                </Typography>

                <Box>
                  {facility.features.map((feature, idx) => (
                    <Box
                      key={idx}
                      sx={{
                        display: "inline-block",
                        backgroundColor: "hsl(var(--secondary))",
                        color: "hsl(var(--secondary-foreground))",
                        padding: "4px 8px",
                        borderRadius: "12px",
                        fontSize: "0.75rem",
                        fontFamily: "Poppins, sans-serif",
                        mr: 1,
                        mb: 1,
                      }}
                    >
                      {feature}
                    </Box>
                  ))}
                </Box>
              </CardContainer>
            </motion.div>
          </Box>
        ))}
      </Box>
    </Box>
  );

  return (
    <Box sx={{ py: 8, backgroundColor: "hsl(var(--muted))" }}>
      <Container maxWidth="lg">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Typography
            variant="h3"
            align="center"
            sx={{
              mb: 8,
              color: "hsl(var(--foreground))",
              fontFamily: "Poppins, sans-serif",
              fontWeight: 600,
            }}
          >
            Infrastructure
          </Typography>

          {renderFacilityGrid(sharedInfra, "Shared Infrastructure")}
          {renderFacilityGrid(tcetbiInfra, "TCETBI Infrastructure")}
        </motion.div>
      </Container>
    </Box>
  );
};

export const Facilities: React.FC = () => {
  return (
    <Box
      sx={{
        pt: 16,
        minHeight: "100vh",
        backgroundColor: "hsl(var(--background))",
      }}
    >
      <ShowcaseVideosSection />
      <InfrastructureSection />
    </Box>
  );
};
