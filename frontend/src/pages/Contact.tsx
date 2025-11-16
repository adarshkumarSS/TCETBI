// src/pages/Contact.tsx
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Box, Typography, Container, CircularProgress } from "@mui/material";
import { Phone } from "@mui/icons-material";

import { CardContainer } from "../components/ui/CardContainer";
import { OutlinedTextField } from "../components/ui/OutlinedTextField";
import { DarkButton } from "../components/ui/DarkButton";

import {
  fetchTBIContactData,
  TBICEO,
  TBIContactInfo,
} from "@/api/contactService";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleChange =
    (field: string) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: event.target.value,
      }));
    };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // You can later hook this to backend / email service
    console.log("Form submitted:", formData);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <CardContainer>
        <Typography
          variant="h5"
          sx={{
            mb: 4,
            color: "hsl(var(--foreground))",
            fontFamily: "Poppins, sans-serif",
            fontWeight: 600,
          }}
        >
          Get in Touch
        </Typography>

        <form onSubmit={handleSubmit}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <Box
              sx={{
                display: "flex",
                gap: 2,
                flexDirection: { xs: "column", sm: "row" },
              }}
            >
              <OutlinedTextField
                label="Full Name"
                value={formData.name}
                onChange={handleChange("name")}
                required
                fullWidth
              />
              <OutlinedTextField
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={handleChange("email")}
                required
                fullWidth
              />
            </Box>

            <Box
              sx={{
                display: "flex",
                gap: 2,
                flexDirection: { xs: "column", sm: "row" },
              }}
            >
              <OutlinedTextField
                label="Phone Number"
                value={formData.phone}
                onChange={handleChange("phone")}
                fullWidth
              />
              <OutlinedTextField
                label="Subject"
                value={formData.subject}
                onChange={handleChange("subject")}
                required
                fullWidth
              />
            </Box>

            <OutlinedTextField
              label="Message"
              multiline
              rows={4}
              value={formData.message}
              onChange={handleChange("message")}
              required
              fullWidth
            />

            <Box sx={{ mt: 2 }}>
              <DarkButton type="submit" size="large" fullWidth>
                Send Message
              </DarkButton>
            </Box>
          </Box>
        </form>
      </CardContainer>
    </motion.div>
  );
};

const ContactInfo = ({ contact }: { contact: TBIContactInfo | null }) => {
  const address =
    contact?.address ||
    "Thiagarajar Business Incubation Centre\nThiagarajar College of Engineering\nMadurai - 625015, Tamil Nadu, India";

  const phone = contact?.phone || "+91 452 2482240";
  const email = contact?.email || "info@tbi.edu.in";
  const workingHours =
    contact?.working_hours ||
    "Monday - Friday: 9:00 AM - 6:00 PM\nSaturday: 9:00 AM - 1:00 PM";

  const contactDetails = [
    {
      label: "Address",
      value: address,
    },
    {
      label: "Phone",
      value: phone,
    },
    {
      label: "Email",
      value: email,
    },
    {
      label: "Working Hours",
      value: workingHours,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <CardContainer>
        <Typography
          variant="h5"
          sx={{
            mb: 4,
            color: "hsl(var(--foreground))",
            fontFamily: "Poppins, sans-serif",
            fontWeight: 600,
          }}
        >
          Contact Information
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {contactDetails.map((detail, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Typography
                variant="h6"
                sx={{
                  mb: 1,
                  color: "hsl(var(--primary))",
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 600,
                }}
              >
                {detail.label}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: "hsl(var(--foreground))",
                  fontFamily: "Poppins, sans-serif",
                  lineHeight: 1.6,
                  whiteSpace: "pre-line",
                }}
              >
                {detail.value}
              </Typography>
            </motion.div>
          ))}
        </Box>
      </CardContainer>
    </motion.div>
  );
};

const CEOInfo = ({ ceo }: { ceo: TBICEO | null }) => {
  if (!ceo) return null;

  return (
    <Box
      sx={{
        py: 8,
        backgroundColor: "hsl(var(--muted))",
      }}
    >
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
            Leadership Contact
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
              {ceo.image ? (
                <motion.img
                  src={ceo.image}
                  alt={ceo.name}
                  style={{
                    width: 300,
                    height: 360,
                    objectFit: "cover",
                    borderRadius: "var(--radius)",
                    boxShadow: "var(--shadow-elegant)",
                  }}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                />
              ) : (
                <Box
                  sx={{
                    width: 300,
                    height: 360,
                    borderRadius: "var(--radius)",
                    background:
                      "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--destructive)))",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontSize: 32,
                    fontWeight: 600,
                    fontFamily: "Poppins, sans-serif",
                    boxShadow: "var(--shadow-elegant)",
                  }}
                >
                  {ceo.name.charAt(0)}
                </Box>
              )}
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
                  {ceo.name}
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    mb: 1,
                    color: "hsl(var(--primary))",
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 500,
                  }}
                >
                  {ceo.position}
                </Typography>

                {ceo.experience && (
                  <Typography
                    variant="body2"
                    sx={{
                      mb: 2,
                      color: "hsl(var(--muted-foreground))",
                      fontFamily: "Poppins, sans-serif",
                    }}
                  >
                    Experience: {ceo.experience}
                  </Typography>
                )}

                <Typography
                  variant="body1"
                  sx={{
                    mb: 4,
                    color: "hsl(var(--foreground))",
                    fontFamily: "Poppins, sans-serif",
                    lineHeight: 1.6,
                  }}
                >
                  {ceo.bio}
                </Typography>

                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {ceo.email && (
                    <Box>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "hsl(var(--muted-foreground))",
                          fontFamily: "Poppins, sans-serif",
                          mb: 0.5,
                        }}
                      >
                        Email
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          color: "hsl(var(--primary))",
                          fontFamily: "Poppins, sans-serif",
                          fontWeight: 600,
                        }}
                      >
                        {ceo.email}
                      </Typography>
                    </Box>
                  )}

                  {ceo.linkedin && (
                    <Box>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "hsl(var(--muted-foreground))",
                          fontFamily: "Poppins, sans-serif",
                          mb: 0.5,
                        }}
                      >
                        LinkedIn
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          color: "hsl(var(--primary))",
                          fontFamily: "Poppins, sans-serif",
                          fontWeight: 600,
                          wordBreak: "break-all",
                        }}
                      >
                        {ceo.linkedin}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </CardContainer>
            </motion.div>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

const MapSection = ({ contact }: { contact: TBIContactInfo | null }) => {
  const mapSrc =
    contact?.map_embed_url ||
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d125778.38984218655!2d77.9238856972656!3d9.886004200000006!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b00cfe9e0d71771%3A0xb00d568a6b1efdd6!2sTechnology%20Business%20Incubator%20(TCE-TBI)!5e0!3m2!1sen!2sin!4v1763308334089!5m2!1sen!2sin";

  const officeAddress =
    contact?.office_address ||
    "Thiagarajar Business Incubation Centre\nThiagarajar College of Engineering\nMadurai - 625015\nTamil Nadu, India";

  const contactPhone = contact?.contact_phone || "+91 452 2482240";
  const contactEmail = contact?.contact_email || "info@tbi.edu.in";
  const website = contact?.website || "https://www.tbi.edu.in";

  const quickTitle = contact?.quick_title || "Quick Contact";
  const quickSubtitle =
    contact?.quick_subtitle || "Reach out to us for immediate assistance";

  return (
    <Box
      sx={{
        py: 8,
        backgroundColor: (theme) =>
          theme.palette.mode === "dark" ? "#000000" : "hsl(var(--background))",
      }}
    >
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
              color: (theme) =>
                theme.palette.mode === "dark"
                  ? "#ffffff"
                  : "hsl(var(--foreground))",
              fontFamily: "Poppins, sans-serif",
              fontWeight: 600,
            }}
          >
            <Box component="span" sx={{ color: "hsl(var(--primary))" }}>
              Find
            </Box>{" "}
            Us Here
          </Typography>

          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              gap: 6,
            }}
          >
            {/* Map */}
            <Box sx={{ flex: 1 }}>
              <Box
                sx={{
                  width: "100%",
                  height: 400,
                  borderRadius: "var(--radius)",
                  overflow: "hidden",
                  position: "relative",
                  cursor: "pointer",
                  border: "1px solid hsl(var(--border))",
                }}
                onClick={() =>
                  window.open(
                    "https://maps.app.goo.gl/x1LvgqXU836r25od8",
                    "_blank"
                  )
                }
              >
                {/* Disabled-interaction map (pointer-events: none) */}
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d125778.38984218655!2d77.9238856972656!3d9.886004200000006!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b00cfe9e0d71771%3A0xb00d568a6b1efdd6!2sTechnology%20Business%20Incubator%20(TCE-TBI)!5e0!3m2!1sen!2sin!4v1763308334089!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{
                    border: 0,
                    pointerEvents: "none", // disables zoom & pan inside iframe
                  }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>

                {/* Click overlay */}
                <Box
                  sx={{
                    position: "absolute",
                    inset: 0,
                    zIndex: 10,
                  }}
                />
              </Box>
            </Box>

            {/* Quick Contact */}
            <Box sx={{ flex: 1 }}>
              <CardContainer>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    mb: 4,
                  }}
                >
                  <Box
                    sx={{
                      width: 60,
                      height: 60,
                      borderRadius: "50%",
                      backgroundColor: "hsl(var(--primary))",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Phone sx={{ color: "white", fontSize: 24 }} />
                  </Box>
                  <Box>
                    <Typography
                      variant="h6"
                      sx={{
                        color: (theme) =>
                          theme.palette.mode === "dark"
                            ? "#ffffff"
                            : "hsl(var(--foreground))",
                        fontFamily: "Poppins, sans-serif",
                        fontWeight: 600,
                        mb: 1,
                      }}
                    >
                      <Box
                        component="span"
                        sx={{ color: "hsl(var(--primary))" }}
                      >
                        {quickTitle.split(" ")[0] || "Quick"}
                      </Box>{" "}
                      {quickTitle.split(" ").slice(1).join(" ") || "Contact"}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: (theme) =>
                          theme.palette.mode === "dark"
                            ? "#cccccc"
                            : "hsl(var(--muted-foreground))",
                        fontFamily: "Poppins, sans-serif",
                      }}
                    >
                      {quickSubtitle}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                  <Box>
                    <Typography
                      variant="h6"
                      sx={{
                        color: "hsl(var(--primary))",
                        fontFamily: "Poppins, sans-serif",
                        fontWeight: 600,
                        mb: 1,
                      }}
                    >
                      Office Address
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        color: (theme) =>
                          theme.palette.mode === "dark"
                            ? "#ffffff"
                            : "hsl(var(--foreground))",
                        fontFamily: "Poppins, sans-serif",
                        lineHeight: 1.6,
                        whiteSpace: "pre-line",
                      }}
                    >
                      {officeAddress}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography
                      variant="h6"
                      sx={{
                        color: "hsl(var(--primary))",
                        fontFamily: "Poppins, sans-serif",
                        fontWeight: 600,
                        mb: 1,
                      }}
                    >
                      Contact Details
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        color: (theme) =>
                          theme.palette.mode === "dark"
                            ? "#ffffff"
                            : "hsl(var(--foreground))",
                        fontFamily: "Poppins, sans-serif",
                        lineHeight: 1.6,
                      }}
                    >
                      Phone: {contactPhone}
                      <br />
                      Email: {contactEmail}
                      <br />
                      Website: {website}
                    </Typography>
                  </Box>
                </Box>
              </CardContainer>
            </Box>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

export const Contact: React.FC = () => {
  const [ceo, setCeo] = useState<TBICEO | null>(null);
  const [contact, setContact] = useState<TBIContactInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchTBIContactData();
        setCeo(data.ceo);
        setContact(data.contact);
      } catch (err) {
        console.error("Failed to load contact data", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          pt: 16,
          minHeight: "100vh",
          backgroundColor: "hsl(var(--background))",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress color="error" />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        pt: 16,
        minHeight: "100vh",
        backgroundColor: "hsl(var(--background))",
      }}
    >
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
              Contact
            </Box>{" "}
            Us
          </Typography>
        </motion.div>
      </Container>

      <Container maxWidth="lg" sx={{ pb: 8 }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            gap: 6,
          }}
        >
          <Box>
            <ContactForm />
          </Box>
          <Box>
            <ContactInfo contact={contact} />
          </Box>
        </Box>
      </Container>

      <CEOInfo ceo={ceo} />
      <MapSection contact={contact} />
    </Box>
  );
};
