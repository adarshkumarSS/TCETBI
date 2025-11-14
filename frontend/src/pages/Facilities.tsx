import { motion } from "framer-motion";
import {
  Box,
  Typography,
  Container,
  Dialog,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { CardContainer } from "../components/ui/CardContainer";

import {
  fetchFacilitiesData,
  Facility,
  FacilityVideo,
} from "../api/facilityService";

// Extract YouTube ID from ANY full link
const extractYouTubeId = (url: string) => {
  try {
    const reg =
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/;
    const match = url.match(reg);
    return match ? match[1] : "";
  } catch {
    return "";
  }
};

export const Facilities: React.FC = () => {
  const [loading, setLoading] = useState(true);

  const [videos, setVideos] = useState<FacilityVideo[]>([]);
  const [facilities, setFacilities] = useState<Facility[]>([]);

  const [openVideo, setOpenVideo] = useState<string | null>(null);
  const [openImage, setOpenImage] = useState<string | null>(null);

  // Categorized Facilities
  const shared = facilities.filter((f) => f.category === "SHARED");
  const tcetbi = facilities.filter((f) => f.category === "TCETBI");

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchFacilitiesData();
        setVideos(data.videos);
        setFacilities(data.facilities);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <Box sx={{ textAlign: "center", mt: 20 }}>
        <CircularProgress />
      </Box>
    );
  }

  // -------------------------------
  // Facility Grid Section
  // -------------------------------
  const renderFacilityGrid = (items: Facility[], title: string) => (
    <Box sx={{ mb: 10 }}>
      <Typography
        variant="h4"
        align="center"
        sx={{
          mb: 6,
          color: "hsl(var(--primary))",
          fontFamily: "Poppins",
          fontWeight: 600,
        }}
      >
        {title}
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
        {items.map((facility, idx) => (
          <motion.div
            key={facility.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: idx * 0.12 }}
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
                  cursor: "pointer",
                }}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
                onClick={() => setOpenImage(facility.image)}
              />

              <Typography
                variant="h6"
                sx={{
                  color: "hsl(var(--foreground))",
                  fontFamily: "Poppins",
                  fontWeight: 600,
                  mb: 1.5,
                }}
              >
                {facility.name}
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  color: "hsl(var(--muted-foreground))",
                  fontFamily: "Poppins",
                  mb: 3,
                }}
              >
                {facility.description}
              </Typography>

              <Box sx={{}}>
                {facility.features.map((f, i) => (
                  <Box
                    key={i}
                    sx={{
                      display: "inline-block",
                      backgroundColor: "hsl(var(--secondary))",
                      color: "hsl(var(--secondary-foreground))",
                      padding: "4px 8px",
                      borderRadius: "12px",
                      fontSize: "0.75rem",
                      fontFamily: "Poppins",
                      mr: 1,
                      mb: 1,
                    }}
                  >
                    {f}
                  </Box>
                ))}
              </Box>
            </CardContainer>
          </motion.div>
        ))}
      </Box>
    </Box>
  );

  return (
    <Box
      sx={{
        pt: 16,
        backgroundColor: "hsl(var(--background))",
        minHeight: "100vh",
      }}
    >
      {/* ===============================================================
          🎥 SHOWCASE VIDEOS
      =============================================================== */}
      <Box sx={{ py: 10 }}>
        <Container maxWidth="lg">
          {/* Title */}
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
                fontFamily: "Poppins",
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
                color: "hsl(var(--muted-foreground))",
                fontFamily: "Poppins",
                mb: 8,
              }}
            >
              State-of-the-art infrastructure designed for innovation
            </Typography>
          </motion.div>

          {/* Video Cards */}
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
                fontFamily: "Poppins",
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
              {videos.map((video, idx) => {
                const videoId = extractYouTubeId(video.url);

                return (
                  <motion.div
                    key={video.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: idx * 0.12 }}
                    viewport={{ once: true }}
                  >
                    <CardContainer>
                      {/* Thumbnail */}
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
                        onClick={() => setOpenVideo(videoId)}
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

                        {/* Play Icon */}
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
                            transition: "0.3s",
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

                      {/* Title + Description */}
                      <Typography
                        variant="h6"
                        sx={{
                          mb: 2,
                          color: "hsl(var(--foreground))",
                          fontFamily: "Poppins",
                          fontWeight: 600,
                        }}
                      >
                        {video.title}
                      </Typography>

                      <Typography
                        variant="body2"
                        sx={{
                          color: "hsl(var(--muted-foreground))",
                          fontFamily: "Poppins",
                          lineHeight: 1.5,
                        }}
                      >
                        {video.description}
                      </Typography>
                    </CardContainer>
                  </motion.div>
                );
              })}
            </Box>
          </motion.div>
        </Container>

        {/* Video Modal */}
        <Dialog
          open={!!openVideo}
          onClose={() => setOpenVideo(null)}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              backgroundColor: "transparent",
              boxShadow: "none",
              overflow: "hidden",
            },
          }}
        >
          <Box sx={{ position: "relative", pt: "56.25%" }}>
            <IconButton
              onClick={() => setOpenVideo(null)}
              sx={{
                position: "absolute",
                top: 10,
                right: 10,
                zIndex: 10,
                color: "white",
                backgroundColor: "rgba(0,0,0,0.5)",
                "&:hover": { backgroundColor: "rgba(0,0,0,0.7)" },
              }}
            >
              <X size={22} />
            </IconButton>

            {openVideo && (
              <iframe
                src={`https://www.youtube.com/embed/${openVideo}?autoplay=1`}
                allow="autoplay; encrypted-media"
                allowFullScreen
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  border: "none",
                  borderRadius: "8px",
                }}
              />
            )}
          </Box>
        </Dialog>
      </Box>

      {/* ===============================================================
          🏢 INFRASTRUCTURE
      =============================================================== */}
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
                fontFamily: "Poppins",
                fontWeight: 600,
              }}
            >
              Infrastructure
            </Typography>

            {renderFacilityGrid(shared, "Shared Infrastructure")}
            {renderFacilityGrid(tcetbi, "TCETBI Infrastructure")}
          </motion.div>
        </Container>

        {/* Image Modal */}
        <Dialog
          open={!!openImage}
          onClose={() => setOpenImage(null)}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: { backgroundColor: "transparent", boxShadow: "none" },
          }}
        >
          <Box
            sx={{
              p: 3,
              position: "relative",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <IconButton
              onClick={() => setOpenImage(null)}
              sx={{
                position: "absolute",
                top: 10,
                right: 10,
                color: "white",
                backgroundColor: "rgba(0,0,0,0.5)",
              }}
            >
              <X size={22} />
            </IconButton>

            {openImage && (
              <img
                src={openImage}
                alt="expanded"
                style={{
                  width: "80%",
                  maxWidth: "700px",
                  borderRadius: "12px",
                  boxShadow: "0 8px 30px rgba(0,0,0,0.35)",
                }}
              />
            )}
          </Box>
        </Dialog>
      </Box>
    </Box>
  );
};
