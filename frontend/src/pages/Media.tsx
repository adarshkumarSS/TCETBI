import { motion } from "framer-motion";
import {
  Box,
  Typography,
  Container,
  Dialog,
  DialogContent,
} from "@mui/material";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CardContainer } from "../components/ui/CardContainer";
import { useState, useMemo, useEffect } from "react";
import TargetCursor from "../components/ui/TargetCursor";
import { fetchMedia } from "../api/mediaService";
import { RotateCcw, Maximize, Minimize } from "lucide-react";

interface MediaItem {
  id: number;
  src: string;
  alt: string;
  category: "events" | "facilities" | "startups" | "programs";
  title: string;
  description: string;
  album?: string;
}

interface Album {
  id: string;
  title: string;
  coverImage: string;
  items: MediaItem[];
  category: "events" | "facilities" | "startups" | "programs";
}

const MediaGallery = () => {
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);

  // Your actual media items data
  useEffect(() => {
    (async () => {
      try {
        const data = await fetchMedia();
        setMediaItems(
          data.map((item) => ({
            id: item.id!,
            src: item.image, // Cloudinary URL 👈
            alt: item.title || "Media",
            title: item.title || item.album,
            description: item.description || "",
            category: item.category,
            album: item.album,
          }))
        );
      } catch (err) {
        console.error("Media fetch error:", err);
      }
    })();
  }, []);
  // Group media items into albums
  const albums: Album[] = useMemo(() => {
    const albumMap = new Map();

    mediaItems.forEach((item) => {
      if (!item.album) return;

      if (!albumMap.has(item.album)) {
        albumMap.set(item.album, {
          id: item.album,
          title: item.album
            .split("-")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" "),
          coverImage: item.src, // Use first image as cover
          items: [],
          category: item.category,
        });
      }

      albumMap.get(item.album).items.push(item);
    });

    return Array.from(albumMap.values());
  }, [mediaItems]);

  const categories = [
    { key: "all", label: "All Galleries", count: albums.length },
    {
      key: "events",
      label: "Events",
      count: albums.filter((album) => album.category === "events").length,
    },
    {
      key: "facilities",
      label: "Facilities",
      count: albums.filter((album) => album.category === "facilities").length,
    },
    {
      key: "startups",
      label: "Startups",
      count: albums.filter((album) => album.category === "startups").length,
    },
    {
      key: "programs",
      label: "Programs",
      count: albums.filter((album) => album.category === "programs").length,
    },
  ];

  const [activeCategory, setActiveCategory] = useState("all");

  const filteredAlbums =
    activeCategory === "all"
      ? albums
      : albums.filter((album) => album.category === activeCategory);

  const openAlbumModal = (album: Album) => {
    setSelectedAlbum(album);
    setCurrentImageIndex(0);
  };

  const closeAlbumModal = () => {
    setSelectedAlbum(null);
  };

  const navigateImage = (direction: "prev" | "next") => {
    if (!selectedAlbum) return;

    if (direction === "prev") {
      const newIndex =
        currentImageIndex > 0
          ? currentImageIndex - 1
          : selectedAlbum.items.length - 1;
      setCurrentImageIndex(newIndex);
    } else {
      const newIndex =
        currentImageIndex < selectedAlbum.items.length - 1
          ? currentImageIndex + 1
          : 0;
      setCurrentImageIndex(newIndex);
    }
  };

  const selectImageFromList = (index: number) => {
    setCurrentImageIndex(index);
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!selectedAlbum) return;

      if (e.key === "ArrowRight") navigateImage("next");
      if (e.key === "ArrowLeft") navigateImage("prev");
      if (e.key === "Escape") closeAlbumModal();
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [selectedAlbum, currentImageIndex]);

  useEffect(() => {
    setRotation(0);
  }, [currentImageIndex]);

  const MIN_WIDTH = 900; // threshold — adjust as needed
  const MIN_HEIGHT = 600;

  return (
    <Box sx={{ py: 8 }}>
      <Container maxWidth="xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          {/* Category Filter */}
          <Box
            sx={{
              mb: 6,
              display: "flex",
              justifyContent: "center",
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            {categories.map((category) => (
              <motion.button
                key={category.key}
                onClick={() => setActiveCategory(category.key)}
                style={{
                  padding: "12px 24px",
                  borderRadius: "12px",
                  border: "none",
                  backgroundColor:
                    activeCategory === category.key
                      ? "hsl(var(--primary))"
                      : "hsl(var(--secondary))",
                  color:
                    activeCategory === category.key
                      ? "hsl(var(--primary-foreground))"
                      : "hsl(var(--secondary-foreground))",
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 500,
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  fontSize: "0.95rem",
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {category.label} ({category.count})
              </motion.button>
            ))}
          </Box>

          {/* Perfectly Aligned Grid - All Same Size */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                md: "repeat(3, 1fr)",
                lg: "repeat(4, 1fr)",
                xl: "repeat(5, 1fr)",
              },
              gap: { xs: 3, sm: 3, md: 3.5, lg: 4 },
              justifyItems: "center",
              alignItems: "start",
            }}
          >
            {filteredAlbums.map((album, index) => (
              <motion.div
                key={`${activeCategory}-${album.id}`}
                className="cursor-target"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 100,
                  damping: 15,
                }}
                style={{
                  cursor: "pointer",
                  width: "100%",
                  height: "320px", // Fixed height for all boxes
                }}
                onClick={() => openAlbumModal(album)}
              >
                <CardContainer
                  hover={true}
                  className="overflow-hidden group p-0 h-full"
                  onClick={() => openAlbumModal(album)}
                >
                  <motion.div
                    style={{
                      height: "100%",
                      width: "100%",
                      overflow: "hidden",
                      borderRadius: "var(--radius)",
                      position: "relative",
                    }}
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                  >
                    <img
                      src={album.coverImage}
                      alt={album.title}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        borderRadius: "var(--radius)",
                        transition: "filter 0.3s ease",
                      }}
                      className="group-hover:brightness-110 group-hover:contrast-110"
                    />

                    {/* Album title - disappears on hover */}
                    <Box
                      sx={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        background:
                          "linear-gradient(transparent, rgba(0,0,0,0.7))",
                        p: 2,
                        borderBottomLeftRadius: "var(--radius)",
                        borderBottomRightRadius: "var(--radius)",
                        transition: "opacity 0.3s ease",
                        opacity: 1,
                      }}
                      className="group-hover:opacity-0"
                    >
                      <Typography
                        variant="h6"
                        sx={{
                          color: "white",
                          fontFamily: "Poppins, sans-serif",
                          fontWeight: 600,
                          fontSize: "1rem",
                          textAlign: "center",
                          textShadow: "0 2px 4px rgba(0,0,0,0.5)",
                        }}
                      >
                        {album.title}
                      </Typography>
                    </Box>

                    {/* Album overlay - appears on hover */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center p-4"
                      style={{ borderRadius: "var(--radius)" }}
                    >
                      <div className="text-white text-center">
                        <h4 className="font-semibold text-xl mb-3">
                          {album.title}
                        </h4>
                        <p className="text-sm text-white/80 mb-4">
                          {album.items.length} photo
                          {album.items.length > 1 ? "s" : ""}
                        </p>
                        <div className="flex justify-center space-x-2">
                          {album.items.slice(0, 4).map((item, idx) => (
                            <div
                              key={idx}
                              className="w-8 h-8 rounded overflow-hidden border-2 border-white"
                              style={{
                                transform: `rotate(${idx * 4 - 6}deg)`,
                                zIndex: 4 - idx,
                              }}
                            >
                              <img
                                src={item.src}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ))}
                          {album.items.length > 4 && (
                            <div className="w-8 h-8 rounded bg-white/30 flex items-center justify-center text-xs font-bold border-2 border-white backdrop-blur-sm">
                              +{album.items.length - 4}
                            </div>
                          )}
                        </div>
                        <p className="text-white/70 text-xs mt-4">
                          Click to view album
                        </p>
                      </div>
                    </motion.div>

                    {/* Album badge - stays visible */}
                    <Box
                      sx={{
                        position: "absolute",
                        top: 12,
                        right: 12,
                        px: 2,
                        py: 0.5,
                        backgroundColor: "hsl(var(--primary))",
                        color: "hsl(var(--primary-foreground))",
                        borderRadius: "16px",
                        fontSize: "0.7rem",
                        fontFamily: "Poppins, sans-serif",
                        textTransform: "capitalize",
                        fontWeight: 600,
                        backdropFilter: "blur(10px)",
                        border: "1px solid rgba(255,255,255,0.2)",
                        zIndex: 10,
                      }}
                    >
                      {album.category}
                    </Box>
                  </motion.div>
                </CardContainer>
              </motion.div>
            ))}
          </Box>
        </motion.div>
      </Container>

      {/* Album Modal */}
      <Dialog
        open={!!selectedAlbum}
        onClose={closeAlbumModal}
        maxWidth="xl"
        fullWidth
        disableScrollLock={true}
        PaperProps={{
          sx: {
            borderRadius: "24px",
            backgroundColor: "hsl(var(--card))",
            overflow: "hidden",
            maxHeight: "96vh",
            width: "min(1600px, 98vw)",
            height: "94vh",
          },
        }}
      >
        <DialogContent
          sx={{
            p: 0,
            position: "relative",
            height: "100%",
            overflow: "hidden !important",
          }}
        >
          {selectedAlbum && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, type: "spring", stiffness: 100 }}
              className="h-full flex"
            >
              {/* Left Side - Image List */}
              {/* Left Side - Image List */}
              {!isFullscreen && (
                <Box
                  sx={{
                    width: { xs: 0, md: "180px" },
                    display: { xs: "none", md: "flex" },
                    height: "100%",
                    backgroundColor: "hsl(var(--muted))",
                    overflow: "hidden",
                    flexDirection: "column",
                    borderRight: "1px solid hsl(var(--border))",
                  }}
                >
                  {/* Album Header */}
                  <Box
                    sx={{ p: 3, borderBottom: "1px solid hsl(var(--border))" }}
                  >
                    <Typography
                      variant="h5"
                      sx={{
                        color: "hsl(var(--foreground))",
                        fontFamily: "Poppins, sans-serif",
                        fontWeight: 600,
                        mb: 1,
                      }}
                    >
                      {selectedAlbum.title}
                    </Typography>

                    <Typography
                      variant="body2"
                      sx={{
                        color: "hsl(var(--muted-foreground))",
                        fontFamily: "Poppins, sans-serif",
                      }}
                    >
                      {selectedAlbum.items.length} photo
                      {selectedAlbum.items.length > 1 ? "s" : ""}
                    </Typography>
                  </Box>

                  {/* Scrollable List */}
                  <Box
                    sx={{
                      flex: 1,
                      overflow: "auto",
                      p: 2,

                      /* THEME-COLORED SCROLLBAR */
                      "&::-webkit-scrollbar": {
                        width: "10px",
                      },
                      "&::-webkit-scrollbar-track": {
                        background: "hsl(var(--muted))",
                        borderRadius: "10px",
                      },
                      "&::-webkit-scrollbar-thumb": {
                        background: "hsl(var(--primary))",
                        borderRadius: "10px",
                        border: "2px solid hsl(var(--muted))",
                      },
                      "&::-webkit-scrollbar-thumb:hover": {
                        background: "hsl(var(--primary) / 0.8)",
                      },
                    }}
                  >
                    <Box sx={{ display: "grid", gap: 1.5 }}>
                      {selectedAlbum.items.map((item, index) => (
                        <motion.div
                          key={item.id}
                          className="cursor-pointer"
                          onClick={() => selectImageFromList(index)}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          style={{
                            borderRadius: "8px",
                            overflow: "hidden",
                            border:
                              currentImageIndex === index
                                ? "2px solid hsl(var(--primary))"
                                : "1px solid hsl(var(--border))",
                            backgroundColor: "hsl(var(--card))",
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              p: 1.5,
                            }}
                          >
                            <img
                              src={item.src}
                              alt={item.alt}
                              style={{
                                width: "50px",
                                height: "50px",
                                objectFit: "cover",
                                borderRadius: "6px",
                                marginRight: "12px",
                              }}
                            />

                            <Box sx={{ flex: 1, minWidth: 0 }}>
                              {/* Title */}
                              <Typography
                                variant="body2"
                                sx={{
                                  fontWeight: 500,
                                  color: "hsl(var(--foreground))",
                                  fontFamily: "Poppins, sans-serif",
                                  fontSize: "0.8rem",
                                  lineHeight: 1.2,
                                  mb: 0.5,
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {item.title}
                              </Typography>

                              {/* Description */}
                              <Typography
                                variant="caption"
                                sx={{
                                  color: "hsl(var(--muted-foreground))",
                                  fontFamily: "Poppins, sans-serif",
                                  lineHeight: 1.2,
                                  display: "-webkit-box",
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: "vertical",
                                  overflow: "hidden",
                                  fontSize: "0.7rem",
                                }}
                              >
                                {item.description}
                              </Typography>
                            </Box>
                          </Box>
                        </motion.div>
                      ))}
                    </Box>
                  </Box>
                </Box>
              )}

              {/* Right Side - Main Image View */}
              <Box
                sx={{
                  flex: 1,
                  position: "relative",
                  height: "100%",
                  backgroundColor: "hsl(var(--muted))",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  overflow: "hidden",
                }}
              >
                {/* Centering Wrapper */}
                <Box
                  sx={{
                    maxWidth: "100%",
                    maxHeight: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    p: isFullscreen ? 0 : 2,
                  }}
                >
                  <motion.img
                    key={currentImageIndex}
                    src={selectedAlbum.items[currentImageIndex].src}
                    alt={selectedAlbum.items[currentImageIndex].alt}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    onClick={() => {
                      // Toggle zoom
                      setZoom((prev) => (prev === 1 ? 2 : 1));
                    }}
                    style={{
                      maxWidth: isFullscreen ? "100vw" : "100%",
                      maxHeight: isFullscreen ? "100vh" : "90vh",
                      objectFit: "contain",
                      borderRadius: isFullscreen ? "0px" : "12px",
                      cursor: zoom === 1 ? "zoom-in" : "zoom-out",
                      transition: "transform 0.3s ease",
                      transform: `rotate(${rotation}deg) scale(${zoom})`,
                    }}
                  />
                </Box>

                {/* Close button */}
                <motion.button
                  onClick={closeAlbumModal}
                  className="absolute top-4 right-4 bg-black/50 backdrop-blur-md text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-black/70 transition-all"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  ✕
                </motion.button>

                {/* Toolbar */}
                <Box
                  sx={{
                    position: "absolute",
                    top: 20,
                    left: "50%",
                    transform: "translateX(-50%)",
                    display: "flex",
                    gap: 2,
                    zIndex: 50,
                    background: "rgba(0,0,0,0.35)",
                    padding: "10px 18px",
                    borderRadius: "30px",
                    backdropFilter: "blur(10px)",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
                  }}
                >
                  {/* Rotate */}
                  <motion.button
                    onClick={() => setRotation((prev) => prev + 90)}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    title="Rotate"
                    className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                  >
                    <RotateCcw className="w-5 h-5 text-white" />
                  </motion.button>

                  {/* Fullscreen */}
                  <motion.button
                    onClick={() => setIsFullscreen((v) => !v)}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                    className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                  >
                    {isFullscreen ? (
                      <Minimize className="w-5 h-5 text-white" />
                    ) : (
                      <Maximize className="w-5 h-5 text-white" />
                    )}
                  </motion.button>
                </Box>

                {/* Navigation arrows */}
                {selectedAlbum.items.length > 1 && (
                  <>
                    <motion.button
                      onClick={() => navigateImage("prev")}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 backdrop-blur-md text-white rounded-full w-12 h-12 flex items-center justify-center hover:bg-black/70 transition-all shadow-lg"
                      whileHover={{ scale: 1.1, x: -2 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </motion.button>

                    <motion.button
                      onClick={() => navigateImage("next")}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 backdrop-blur-md text-white rounded-full w-12 h-12 flex items-center justify-center hover:bg-black/70 transition-all shadow-lg"
                      whileHover={{ scale: 1.1, x: 2 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <ChevronRight className="w-6 h-6" />
                    </motion.button>
                  </>
                )}

                {/* Counter */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm">
                  {currentImageIndex + 1} / {selectedAlbum.items.length}
                </div>

                {/* Info */}
                {!isFullscreen && (
                  <motion.div
                    className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-md text-white p-4 rounded-2xl max-w-md"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        color: "white",
                        fontFamily: "Poppins, sans-serif",
                        fontWeight: 600,
                        mb: 1,
                      }}
                    >
                      {selectedAlbum.items[currentImageIndex].title}
                    </Typography>

                    <Typography
                      variant="body2"
                      sx={{
                        color: "rgba(255,255,255,0.8)",
                        fontFamily: "Poppins, sans-serif",
                      }}
                    >
                      {selectedAlbum.items[currentImageIndex].description}
                    </Typography>
                  </motion.div>
                )}
              </Box>
            </motion.div>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export const Media: React.FC = () => {
  return (
    <Box
      sx={{
        pt: 16,
        pb: 8,
        minHeight: "100vh",
        backgroundColor: "hsl(var(--background))",
      }}
    >
      <TargetCursor spinDuration={2} hideDefaultCursor={true} />

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
            <Box component="span" sx={{ color: "hsl(var(--destructive))" }}>
              Media{" "}
            </Box>{" "}
            Gallery
          </Typography>
        </motion.div>
      </Container>

      <MediaGallery />
    </Box>
  );
};
