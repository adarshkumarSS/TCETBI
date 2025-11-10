import { motion } from "framer-motion";
import { Box, Typography, Container, Link, CircularProgress } from "@mui/material";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import { CardContainer } from "../components/ui/CardContainer";
import { useEffect, useState } from "react";
import { fetchPeopleData, PeopleData } from "../api/peopleService";

// 🟢 Founder Section
const FounderSection = ({ data }: { data: PeopleData["founder"] }) => {
  if (!data) return null;

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
              mb: 8,
              color: "hsl(var(--foreground))",
              fontFamily: "Poppins, sans-serif",
              fontWeight: 600,
            }}
          >
            Our Founder
          </Typography>

          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              gap: 6,
              alignItems: "center",
            }}
          >
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <motion.img
                src={data.image}
                alt={data.name}
                style={{
                  width: 300,
                  height: 400,
                  objectFit: "cover",
                  borderRadius: "var(--radius)",
                  boxShadow: "var(--shadow-elegant)",
                }}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              style={{ flex: 1 }}
            >
              <CardContainer>
                <Typography
                  variant="h4"
                  sx={{
                    mb: 2,
                    color: "hsl(var(--foreground))",
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 600,
                  }}
                >
                  {data.name}
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    mb: 3,
                    color: "hsl(var(--primary))",
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 500,
                  }}
                >
                  {data.position}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    mb: 3,
                    color: "hsl(var(--foreground))",
                    fontFamily: "Poppins, sans-serif",
                    lineHeight: 1.6,
                  }}
                >
                  {data.bio}
                </Typography>
                <Box sx={{ display: "flex", gap: 4, mt: 3 }}>
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "hsl(var(--muted-foreground))",
                        fontFamily: "Poppins, sans-serif",
                        mb: 0.5,
                      }}
                    >
                      Experience
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        color: "hsl(var(--primary))",
                        fontFamily: "Poppins, sans-serif",
                        fontWeight: 600,
                      }}
                    >
                      {data.experience}
                    </Typography>
                  </Box>
                </Box>
              </CardContainer>
            </motion.div>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

// 🟣 CEO Section
const CEOSection = ({ data }: { data: PeopleData["ceo"] }) => {
  if (!data) return null;

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
            Leadership
          </Typography>

          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <CardContainer className="text-center max-w-md">
                <motion.img
                  src={data.image}
                  alt={data.name}
                  style={{
                    width: 200,
                    height: 240,
                    objectFit: "cover",
                    borderRadius: "var(--radius)",
                    margin: "0 auto 24px",
                    display: "block",
                  }}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                />
                <Typography
                  variant="h5"
                  sx={{
                    mb: 1,
                    color: "hsl(var(--foreground))",
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 600,
                  }}
                >
                  {data.name}
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    mb: 3,
                    color: "hsl(var(--primary))",
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 500,
                  }}
                >
                  {data.position}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    mb: 3,
                    color: "hsl(var(--foreground))",
                    fontFamily: "Poppins, sans-serif",
                    lineHeight: 1.6,
                  }}
                >
                  {data.bio}
                </Typography>
                {data.email && (
                  <Typography
                    variant="body2"
                    sx={{
                      color: "hsl(var(--primary))",
                      fontFamily: "Poppins, sans-serif",
                    }}
                  >
                    {data.email}
                  </Typography>
                )}
                {data.linkedin && (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mt: 2,
                    }}
                  >
                    <Link
                      href={data.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      underline="none"
                      aria-label="Visit LinkedIn Profile"
                      sx={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 0.8,
                        color: "hsl(var(--primary))",
                        padding: "6px 12px",
                        borderRadius: "var(--radius)",
                        transition: "all 0.2s ease-in-out",
                        "&:hover": {
                          backgroundColor: "hsla(var(--primary), 0.1)",
                          transform: "translateY(-1px)",
                        },
                      }}
                    >
                      <LinkedInIcon sx={{ fontSize: 28 }} />
                      <Typography
                        component="span"
                        variant="body1"
                        sx={{
                          fontFamily: "Poppins, sans-serif",
                          fontWeight: 500,
                          fontSize: "1.1rem",
                        }}
                      >
                        LinkedIn Profile
                      </Typography>
                    </Link>
                  </Box>
                )}
              </CardContainer>
            </motion.div>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

// 🟡 Board Members Section
const BoardMembersSection = ({ data }: { data: PeopleData["board_members"] }) => {
  const [hoveredMember, setHoveredMember] = useState<number | null>(null);
  if (!data?.length) return null;

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
              mb: 8,
              color: "hsl(var(--foreground))",
              fontFamily: "Poppins, sans-serif",
              fontWeight: 600,
            }}
          >
            Board Members
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
            {data.map((member, index) => (
              <Box key={member.id || index}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  onMouseEnter={() => setHoveredMember(member.id)}
                  onMouseLeave={() => setHoveredMember(null)}
                >
                  <CardContainer
                    className="text-center h-full relative overflow-hidden"
                    style={{
                      transition: "all 0.3s ease",
                      transform:
                        hoveredMember === member.id ? "scale(1.03)" : "scale(1)",
                      boxShadow:
                        hoveredMember === member.id
                          ? "0 8px 24px rgba(0,0,0,0.25)"
                          : "0 2px 8px rgba(0,0,0,0.1)",
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "var(--radius)",
                    }}
                  >
                    <motion.img
                      src={member.image}
                      alt={member.name}
                      style={{
                        width: 120,
                        height: 120,
                        objectFit: "cover",
                        borderRadius: "50%",
                        margin: "0 auto 16px",
                        display: "block",
                      }}
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.3 }}
                    />
                    <Typography
                      variant="h6"
                      sx={{
                        mb: 1,
                        color: "hsl(var(--foreground))",
                        fontFamily: "Poppins, sans-serif",
                        fontWeight: 600,
                      }}
                    >
                      {member.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        mb: 2,
                        color: "hsl(var(--primary))",
                        fontFamily: "Poppins, sans-serif",
                        fontWeight: 500,
                      }}
                    >
                      {member.position}
                    </Typography>

                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{
                        opacity: hoveredMember === member.id ? 1 : 0,
                        height: hoveredMember === member.id ? "auto" : 0,
                      }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      style={{
                        overflow: "hidden",
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          color: "hsl(var(--muted-foreground))",
                          fontFamily: "Poppins, sans-serif",
                          lineHeight: 1.4,
                          mb: 2,
                        }}
                      >
                        {member.bio}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "hsl(var(--primary))",
                          fontFamily: "Poppins, sans-serif",
                          fontSize: "0.85rem",
                          mb: 2,
                        }}
                      >
                        Experience: {member.experience}
                      </Typography>

                      {member.linkedin && (
                        <Box sx={{ display: "flex", justifyContent: "center" }}>
                          <Link
                            href={member.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            underline="none"
                            aria-label="Visit LinkedIn Profile"
                            sx={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 0.8,
                              color: "hsl(var(--primary))",
                              padding: "6px 12px",
                              borderRadius: "var(--radius)",
                              transition: "all 0.2s ease-in-out",
                              "&:hover": {
                                backgroundColor: "hsla(var(--primary), 0.1)",
                                transform: "translateY(-1px)",
                              },
                            }}
                          >
                            <LinkedInIcon sx={{ fontSize: 24 }} />
                            <Typography
                              component="span"
                              variant="body2"
                              sx={{
                                fontFamily: "Poppins, sans-serif",
                                fontWeight: 500,
                                fontSize: "1rem",
                              }}
                            >
                              LinkedIn
                            </Typography>
                          </Link>
                        </Box>
                      )}
                    </motion.div>
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


// 🧠 Main Component
export const People: React.FC = () => {
  const [data, setData] = useState<PeopleData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPeopleData()
      .then((res) => setData(res))
      .catch(() => console.error("❌ Failed to load people data"))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress color="primary" size={80} />
      </Box>
    );

  if (!data) return <p>Error loading people data.</p>;

  return (
    <Box sx={{ pt: 16, pb: 8, minHeight: "100vh", backgroundColor: "hsl(var(--background))" }}>
      <Container maxWidth="lg">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
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
            </Box>{" "}
            People
          </Typography>
        </motion.div>
      </Container>

      <FounderSection data={data.founder} />
      <CEOSection data={data.ceo} />
      <BoardMembersSection data={data.board_members} />
    </Box>
  );
};
