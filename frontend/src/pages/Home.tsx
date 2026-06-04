import { motion } from "framer-motion";
import { Box, Typography, Container } from "@mui/material";
import { CardContainer } from "../components/ui/CardContainer";
import { Loader } from "../components/ui/Loader";
import { SuccessStoryCarousel } from "../components/ui/SuccessStoryCarousel";
import { DarkButton } from "../components/ui/DarkButton";
import ShinyText from "../components/ShinyText";
import LogoLoop from "../components/LogoLoop";
import { Link } from "react-router-dom";
import { useEffect, useState, useRef, useLayoutEffect } from "react";
import { fetchHomeData, HomeData } from "../api/homeService";
import PageLoader from "../components/PageLoader";

const HeroSection = () => (
  <Box
    sx={{
      height: "100vh",
      position: "relative",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden", // Ensure content doesn't overflow
      backgroundColor: "#000", // Keep a black screen in both light and dark mode
    }}
  >
    <Container maxWidth="lg">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        style={{ textAlign: "center" }}
      >
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-8"
        >
          <Box
            sx={{
              width: 200,
              height: 200,
              margin: "0 auto 2rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              src="/asset/TCE_TBI.png"
              alt="TBI Logo"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                display: "block",
                filter: "drop-shadow(0 4px 24px rgba(0,0,0,0.35))", // Drop shadow effect
              }}
            />
          </Box>
        </motion.div>

        <Typography
          variant="h3"
          sx={{
            color: "#fdfdfd",
            fontFamily: "Poppins, sans-serif",
            fontWeight: 600,
            mb: 3,
            textShadow: "0 3px 12px rgba(255,255,255,0.5)",
            lineHeight: 1.2,
          }}
        >
          <ShinyText
            text="Building entrepreneurial ecosystem towards impactful social ventures"
            disabled={false}
            speed={10}
            className="custom-class"
          />
        </Typography>

        <Typography
          variant="h5"
          sx={{
            color: "rgba(255,255,255,0.9)",
            fontFamily: "Poppins, sans-serif",
            fontWeight: 400,
            mb: 4,
            textShadow: "0 2px 10px rgba(0,0,0,0.3)",
          }}
        >
          Bridging academics with startups and startup again @ TBI
        </Typography>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
          style={{ 
            display: "flex", 
            justifyContent: "center", 
            gap: "1.5rem", 
            flexWrap: "wrap",
            marginTop: "1rem" 
          }}
        >
          <Link to="/apply-incubation" style={{ textDecoration: "none" }}>
            <DarkButton
              size="large"
              sx={{
                fontSize: "1.1rem",
                px: 4,
                py: 2,
                transition: "all 0.3s ease",
                "&:hover": {
                  backgroundColor: "#fff",
                  color: "#000",
                  transform: "translateY(-3px)",
                },
              }}
            >
              Apply for Incubation
            </DarkButton>
          </Link>
          <Link to="/support/apply-mentor" style={{ textDecoration: "none" }}>
            <DarkButton
              size="large"
              sx={{
                fontSize: "1.1rem",
                px: 4,
                py: 2,
                transition: "all 0.3s ease",
                backgroundColor: "transparent",
                border: "2px solid #fff",
                "&:hover": {
                  backgroundColor: "#fff",
                  color: "#000",
                  transform: "translateY(-3px)",
                },
              }}
            >
              Apply for Mentorship
            </DarkButton>
          </Link>
        </motion.div>
      </motion.div>
    </Container>
  </Box>
);

const KnowUsBetterSection: React.FC<{ data: HomeData["vision_mission"] }> = ({ data }) => {
  const [maxHeight, setMaxHeight] = useState(0);
  const visionRef = useRef<HTMLDivElement>(null);
  const missionRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (visionRef.current && missionRef.current) {
      const vHeight = visionRef.current.offsetHeight;
      const mHeight = missionRef.current.offsetHeight;
      setMaxHeight(Math.max(vHeight, mHeight));
    }
  }, [data.vision, data.mission]);

  return (
    <Box sx={{ py: 8, backgroundColor: "hsl(var(--background))" }}>
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
              mb: 6,
              color: "hsl(var(--foreground))",
              fontFamily: "Poppins, sans-serif",
              fontWeight: 600,
            }}
          >
            Know Us Better
          </Typography>

          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              gap: 4,
            }}
          >
            <Box sx={{ flex: 1 }} ref={visionRef}>
              <CardContainer style={maxHeight ? { height: maxHeight } : {}}>
                <Typography
                  variant="h5"
                  sx={{
                    mb: 3,
                    color: "hsl(var(--primary))",
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 600,
                  }}
                >
                  Our Vision
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: "hsl(var(--foreground))",
                    fontFamily: "Poppins, sans-serif",
                    lineHeight: 1.6,
                  }}
                >
                  {data.vision}
                </Typography>
              </CardContainer>
            </Box>

            <Box sx={{ flex: 1 }} ref={missionRef}>
              <CardContainer style={maxHeight ? { height: maxHeight } : {}}>
                <Typography
                  variant="h5"
                  sx={{
                    mb: 3,
                    color: "hsl(var(--primary))",
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 600,
                  }}
                >
                  Our Mission
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: "hsl(var(--foreground))",
                    fontFamily: "Poppins, sans-serif",
                    lineHeight: 1.6,
                  }}
                >
                  {data.mission}
                </Typography>
              </CardContainer>
            </Box>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

const AchievementsSection = ({ data }: { data: HomeData["achievements"] }) => (
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
            mb: 6,
            color: "hsl(var(--foreground))",
            fontFamily: "Poppins, sans-serif",
            fontWeight: 600,
          }}
        >
          Our Achievements
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "1fr 1fr",
              md: "1fr 1fr 1fr 1fr",
            },
            gap: 4,
          }}
        >
          {data.map((achievement, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <CardContainer className="text-center hover-lift">
                <Loader
                  targetNumber={achievement.number}
                  suffix={achievement.suffix}
                  duration={1000 + index * 200}
                />
                <Typography
                  variant="h6"
                  sx={{
                    mt: 2,
                    color: "hsl(var(--foreground))",
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 500,
                  }}
                >
                  {achievement.label}
                </Typography>
              </CardContainer>
            </motion.div>
          ))}
        </Box>
      </motion.div>
    </Container>
  </Box>
);

interface Logo {
  id: number;
  name: string;
  src: string;
}

// Add this small reusable component above PartnersSection 👇
const PartnerLogo = ({
  src,
  alt,
  size = 140,
}: {
  src: string;
  alt: string;
  size?: number;
}) => {
  return (
    <Box
      sx={{
        display: "inline-flex",
        justifyContent: "center",
        alignItems: "center",
        p: 2,
        borderRadius: "16px",
        height: size + 20,
        transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        "&:hover": {
          transform: "scale(1.1)",
        },
      }}
    >
      <img
        src={src}
        alt={alt}
        style={{
          height: size,
          width: "auto",
          objectFit: "contain",
          display: "block",
        }}
      />
    </Box>
  );
};


const PartnersSection = ({
  govtLogos,
  stateLogos,
}: {
  govtLogos: HomeData["govt_logos"];
  stateLogos: HomeData["state_logos"];
}) => (
  <Box
    sx={{
      position: "relative",
      py: 8,
      overflow: "hidden",
      backgroundColor: "hsl(var(--background))",
    }}
  >
    {/* ✨ Glow background */}
    <Box
      sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        width: "70%",
        height: "120%",
        transform: "translate(-50%, -50%)",
        background:
          "radial-gradient(circle at center, rgba(255, 255, 255, 0.12), rgba(0, 0, 0, 0) 70%)",
        filter: "blur(80px)",
        zIndex: 0,
      }}
    />

    <Container maxWidth="lg" sx={{ position: "relative", zIndex: 2 }}>
      <Typography
        variant="h3"
        align="center"
        sx={{
          mb: 6,
          color: "hsl(var(--foreground))",
          fontFamily: "Poppins, sans-serif",
          fontWeight: 600,
        }}
      >
        Our Partners
      </Typography>

      {/* Government of India */}
      <Box sx={{ mb: 6 }}>
        <Typography
          variant="h5"
          align="center"
          sx={{
            mb: 3,
            color: "hsl(var(--primary))",
            fontFamily: "Poppins, sans-serif",
            fontWeight: 500,
          }}
        >
          Government of India
        </Typography>
        <LogoLoop
          logos={govtLogos.map((l) => ({
            node: <PartnerLogo src={l.src} alt={l.name} />,
            title: l.name,
            href: "#",
          }))}
          speed={20}
          direction="right"
          logoHeight={140}
          gap={60}
          pauseOnHover
          scaleOnHover
          fadeOut
          fadeOutColor="hsl(var(--background))"
          ariaLabel="Government of India Partners"
        />
      </Box>

      {/* Government of Tamil Nadu */}
      <Box>
        <Typography
          variant="h5"
          align="center"
          sx={{
            mb: 3,
            color: "hsl(var(--primary))",
            fontFamily: "Poppins, sans-serif",
            fontWeight: 500,
          }}
        >
          Government of Tamil Nadu
        </Typography>
        <LogoLoop
          logos={stateLogos.map((l) => ({
            node: <PartnerLogo src={l.src} alt={l.name} />,
            title: l.name,
            href: "#",
          }))}
          speed={20}
          direction="left"
          logoHeight={140}
          gap={90}
          pauseOnHover
          scaleOnHover
          fadeOut
          fadeOutColor="hsl(var(--background))"
          ariaLabel="Government of Tamil Nadu Partners"
        />
      </Box>
    </Container>
  </Box>
);

export default PartnersSection;

const SuccessStoriesSection = ({ stories }: { stories: HomeData["success_stories"] }) => (
  <Box
    sx={{
      py: 12, // Increased padding
      position: "relative",
      background: "linear-gradient(135deg, hsl(var(--background)) 0%, hsl(var(--muted)) 100%)",
      overflow: "hidden",
    }}
  >
    {/* Decorative Elements */}


    <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
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
            mb: 2,
            color: "hsl(var(--foreground))",
            fontFamily: "Poppins, sans-serif",
            fontWeight: 600,
          }}
        >
          Success Stories
        </Typography>
        <Typography
          variant="h6"
          align="center"
          sx={{
            mb: 8,
            color: "hsl(var(--muted-foreground))",
            fontFamily: "Poppins, sans-serif",
            fontWeight: 400,
            maxWidth: "600px",
            mx: "auto",
          }}
        >
          Discover how our incubation center has helped startups transform their innovative ideas into impactful realities.
        </Typography>

        <SuccessStoryCarousel stories={stories} />
      </motion.div>
    </Container>
  </Box>
);

export const Home: React.FC = () => {
  const [data, setData] = useState<HomeData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHomeData()
      .then((res) => {
        setData(res);
      })
      .catch(() => console.error("Failed to load home data"))
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) return <PageLoader />;

  if (!data) return <p>Error loading homepage data.</p>;

  return (
    <Box>
      <HeroSection />
      <KnowUsBetterSection data={data.vision_mission} />
      <AchievementsSection data={data.achievements} />
      <PartnersSection
        govtLogos={data.govt_logos}
        stateLogos={data.state_logos}
      />
      <SuccessStoriesSection stories={data.success_stories} />
    </Box>
  );
};
