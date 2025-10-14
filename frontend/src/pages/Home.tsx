import { motion } from "framer-motion";
import { Box, Typography, Container } from "@mui/material";
import { CardContainer } from "../components/ui/CardContainer";
import { Loader } from "../components/ui/Loader";
import { SuccessStoryCarousel } from "../components/ui/SuccessStoryCarousel";
import { DarkButton } from "../components/ui/DarkButton";
import ShinyText from "../components/ShinyText";
import LogoLoop from "../components/LogoLoop";
import { Link } from "react-router-dom";

const HeroSection = () => (
  <Box
    sx={{
      height: "100vh",
      position: "relative",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden", // Ensure video doesn't overflow
      // Remove background and ::before overlay
    }}
  >
    <video
      autoPlay
      loop
      muted
      playsInline
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        objectFit: "cover",
        zIndex: -1,
      }}
    >
      <source src="/asset/home_asset.mp4" type="video/mp4" />
      {/* Add more <source> tags for other formats if needed */}
      Your browser does not support the video tag.
    </video>
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
        >
          <Link to="/apply-incubation" style={{ textDecoration: 'none' }}>
          <DarkButton size="large" sx={{ fontSize: "1.1rem", px: 4, py: 2 }}>
            Apply for Incubation
          </DarkButton>
          </Link>
        </motion.div>
      </motion.div>
    </Container>
  </Box>
);

const KnowUsBetterSection = () => (
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
          <Box sx={{ flex: 1 }}>
            <CardContainer>
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
                To create a thriving ecosystem that nurtures innovative startups
                and bridges the gap between academic research and practical
                business solutions, fostering sustainable growth and social
                impact.
              </Typography>
            </CardContainer>
          </Box>

          <Box sx={{ flex: 1 }}>
            <CardContainer>
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
                To provide comprehensive support, mentorship, and resources to
                budding entrepreneurs, enabling them to transform innovative
                ideas into successful ventures that contribute to economic
                growth and societal well-being.
              </Typography>
            </CardContainer>
          </Box>
        </Box>
      </motion.div>
    </Container>
  </Box>
);

const AchievementsSection = () => {
  const achievements = [
    { number: 150, suffix: "+", label: "Startups Incubated" },
    { number: 500, suffix: "+", label: "Jobs Created" },
    { number: 50, suffix: "+", label: "Success Stories" },
    { number: 25, suffix: "+", label: "Awards Won" },
  ];

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
            {achievements.map((achievement, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <CardContainer className="text-center glow-hover">
                  <Loader
                    targetNumber={achievement.number}
                    suffix={achievement.suffix}
                    duration={2000 + index * 500}
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
};



interface Logo {
  id: number;
  name: string;
  src: string;
}

const PartnersSection = () => {
  const govtLogos: Logo[] = [
    { id: 1, name: "Ministry of MSME", src: "/asset/ministry_msme.png" },
    { id: 2, name: "Startup India", src: "/asset/startup_india.png" },
    { id: 3, name: "NSTEDB", src: "/asset/nstedb.png" },
  ];

  const stateLogos: Logo[] = [
    { id: 4, name: "Tamil Nadu Govt", src: "/asset/govt_india.png" },
    { id: 5, name: "TIDCO", src: "/asset/tidco.png" },
    { id: 6, name: "TNSCST", src: "/asset/tnscst.png" },
  ];

  return (
    <Box sx={{ py: 8, backgroundColor: "hsl(var(--background))" }}>
      <Container maxWidth="lg">
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
              node: <img src={l.src} alt={l.name} style={{ height: 140 }} />,
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
              node: <img src={l.src} alt={l.name} style={{ height: 140 }} />,
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
};

export default PartnersSection;


const SuccessStoriesSection = () => {
  const successStories = [
    {
      id: 1,
      title: "Revolutionary Water Purification",
      description:
        "EcoTech Solutions developed an innovative water purification system that has provided clean water access to over 50,000 rural households across Tamil Nadu.",
      image: "/asset/SuccessStoryimages/water.jpg",
      sector: "Environmental Technology",
      impact: "50,000+ households served",
    },
    {
      id: 2,
      title: "Smart Agriculture Platform",
      description:
        "AgriConnect created an IoT-based platform that has helped 10,000+ farmers increase their crop yields by 40% through data-driven farming techniques.",
      image: "/asset/SuccessStoryimages/agriculture.jpg",
      sector: "AgriTech",
      impact: "40% yield increase for farmers",
    },
    {
      id: 3,
      title: "Rural Healthcare Innovation",
      description:
        "HealthTech Innovations launched AI-powered diagnostic tools that have improved healthcare access in 200+ rural health centers.",
      image: "/asset/SuccessStoryimages/healthcare.png",
      sector: "HealthTech",
      impact: "200+ health centers equipped",
    },
    {
      id: 4,
      title: "Digital Financial Inclusion",
      description:
        "FinTech Solutions created a digital banking platform that has brought banking services to 25,000+ unbanked individuals in rural areas.",
      image: "/asset/SuccessStoryimages/fintech.jpg",
      sector: "FinTech",
      impact: "25,000+ people financially included",
    },
    {
      id: 5,
      title: "Educational Technology Revolution",
      description:
        "EduTech Platform developed personalized learning solutions that have improved learning outcomes for 15,000+ students across Tamil Nadu.",
      image: "/asset/SuccessStoryimages/education.jpg",
      sector: "EdTech",
      impact: "15,000+ students impacted",
    },
  ];

  return (
    <Box sx={{ py: 8, backgroundColor: "hsl(var(--accent))" }}>
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
              color: "hsl(var(--accent-foreground))",
              fontFamily: "Poppins, sans-serif",
              fontWeight: 600,
            }}
          >
            Success Stories
          </Typography>

          <SuccessStoryCarousel stories={successStories} />
        </motion.div>
      </Container>
    </Box>
  );
};

export const Home: React.FC = () => {
  return (
    <Box>
      <HeroSection />
      <KnowUsBetterSection />
      <AchievementsSection />
      <PartnersSection />
      <SuccessStoriesSection />
    </Box>
  );
};
