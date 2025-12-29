import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
} from "@mui/material";
import { Save } from "lucide-react";
import { DarkButton } from "@/components/ui/DarkButton";
import { toast } from "sonner";
import {
  fetchTBIContactData,
  updateTBIContactData,
  TBIContactInfo,
} from "@/api/contactService";

interface ContactWithMeta extends TBIContactInfo {}

export const ContactPage: React.FC = () => {
  const [contact, setContact] = useState<ContactWithMeta | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [validationModal, setValidationModal] = useState(false);

  // ------- Styles (same as BlogPage) -------

  const textFieldStyles = {
    "& .MuiInputBase-root": {
      color: "hsl(var(--foreground))",
      minHeight: "48px",
    },
    "& .MuiInputBase-input": {
      color: "hsl(var(--foreground))",
      padding: "12px 14px",
      caretColor: "hsl(var(--foreground))",
      "&::placeholder": {
        color: "hsl(var(--muted-foreground)) !important",
      },
      "& *": {
        color: "hsl(var(--foreground)) !important",
      },
    },
    "& textarea": {
      "& *": {
        color: "hsl(var(--foreground)) !important",
      },
    },
    "& .MuiInputLabel-root": {
      color: "hsl(var(--muted-foreground))",
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: "hsl(0 84.2% 60.2%)",
    },
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "hsl(var(--border)) !important",
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "hsl(0 84.2% 60.2%) !important",
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "hsl(0 84.2% 60.2%) !important",
    },
  } as const;

  const uploadButtonStyles = {
    backgroundColor: "hsl(0 84.2% 60.2%)",
    color: "white",
    "&:hover": { backgroundColor: "hsl(0 84.2% 50.2%)" },
  } as const;

  const compactFieldSpacing = { mb: 1.5 };

  // ------- Fetch on mount -------

  useEffect(() => {
    fetchTBIContactData()
      .then((res) => {
        setContact(
          res.contact || {
            address:
              "Thiagarajar Business Incubation Centre\nThiagarajar College of Engineering\nMadurai - 625015, Tamil Nadu, India",
            phone: "+91 452 2482240",
            email: "info@tbi.edu.in",
            working_hours:
              "Monday - Friday: 9:00 AM - 6:00 PM\nSaturday: 9:00 AM - 1:00 PM",
            quick_title: "Quick Contact",
            quick_subtitle: "Reach out to us for immediate assistance",
            office_address:
              "Thiagarajar Business Incubation Centre\nThiagarajar College of Engineering\nMadurai - 625015\nTamil Nadu, India",
            contact_phone: "+91 452 2482240",
            contact_email: "info@tbi.edu.in",
            website: "https://www.tbi.edu.in",
            map_embed_url:
              "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d125778.38984218655!2d77.9238856972656!3d9.886004200000006!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b00cfe9e0d71771%3A0xb00d568a6b1efdd6!2sTechnology%20Business%20Incubator%20(TCE-TBI)!5e0!3m2!1sen!2sin!4v1763308334089!5m2!1sen!2sin",
          }
        );
      })
      .catch((err) => {
        console.error("Failed to load TBI contact data", err);
      })
      .finally(() => setLoading(false));
  }, []);

  // ------- CEO Image Upload + Crop -------



  // ------- Validation -------

  const validate = (contact: ContactWithMeta | null) => {
    if (!contact) return false;

    return (

      contact.address.trim() &&
      contact.phone.trim() &&
      contact.email.trim() &&
      contact.working_hours.trim() &&
      contact.quick_title.trim() &&
      contact.quick_subtitle.trim() &&
      contact.office_address.trim() &&
      contact.contact_phone.trim() &&
      contact.contact_email.trim() &&
      contact.map_embed_url.trim()
    );
  };

  // ------- Save (upload CEO image if needed + PUT to backend) -------

  const handleSave = async () => {
    if (!validate(contact)) {
      setValidationModal(true);
      return;
    }

    try {
      setSaving(true);

      const cleanMapEmbed = (contact?.map_embed_url || "")
        .replace(/[\u200B-\u200D\uFEFF]/g, "")
        .trim();

      const payloadContact: TBIContactInfo | null = contact
        ? {
            ...contact,
            map_embed_url: cleanMapEmbed,
            website: contact.website || null,
          }
        : null;

      const res = await updateTBIContactData({
        contact: payloadContact,
      });

      toast.success("✅ Contact info updated successfully!");
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to update TBI contact data!");
    } finally {
      setSaving(false);
    }
  };

  // ------- Render -------

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress color="error" />
      </Box>
    );
  }

  return (
    <Box sx={{ pb: 10 }}>
      {/* Sticky Header */}
      <Paper
        elevation={4}
        sx={{
          position: "sticky",
          top: 64,
          zIndex: 100,
          p: 2.5,
          mb: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "hsl(var(--card))",
          borderBottom: "2px solid hsl(var(--primary))",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 600, color: "hsl(var(--foreground))" }}>
          Contact Information
        </Typography>
        <DarkButton 
          onClick={handleSave} 
          disabled={saving} 
          startIcon={<Save size={18} />}
          sx={{
            px: 3,
            py: 1.2,
            fontSize: "0.95rem",
            boxShadow: 3,
            "&:hover": {
              boxShadow: 5,
            },
          }}
        >
          {saving ? "Saving..." : "Save Changes"}
        </DarkButton>
      </Paper>

      <Box sx={{ px: 2 }}>

      {/* CEO CARD */}


      {/* CONTACT CARD */}
      {contact && (
        <Box
          sx={{
            p: 2,
            mb: 2,
            border: "1px solid hsl(var(--border))",
            borderRadius: "12px",
            maxWidth: 900,
            mx: "auto",
            backgroundColor: "hsl(var(--card))",
            boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              mb: 2,
              fontFamily: "Poppins",
              fontWeight: 600,
              color: "hsl(var(--foreground))",
            }}
          >
            Contact Information
          </Typography>

          {/* Address + Working Hours */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 2,
              mb: 2,
            }}
          >
            <TextField
              fullWidth
              multiline
              minRows={3}
              label="Address"
              value={contact.address}
              onChange={(e) =>
                setContact((prev) =>
                  prev ? { ...prev, address: e.target.value } : prev
                )
              }
              sx={{
                ...textFieldStyles,
                "& .MuiOutlinedInput-root": {
                  padding: "0 !important",
                  alignItems: "stretch !important",
                },
                "& textarea": {
                  padding: "12px 14px !important",
                  lineHeight: "1.5 !important",
                  resize: "vertical",
                },
              }}
            />
            <TextField
              fullWidth
              multiline
              minRows={3}
              label="Working Hours"
              value={contact.working_hours}
              onChange={(e) =>
                setContact((prev) =>
                  prev ? { ...prev, working_hours: e.target.value } : prev
                )
              }
              sx={{
                ...textFieldStyles,
                "& .MuiOutlinedInput-root": {
                  padding: "0 !important",
                  alignItems: "stretch !important",
                },
                "& textarea": {
                  padding: "12px 14px !important",
                  lineHeight: "1.5 !important",
                  resize: "vertical",
                },
              }}
            />
          </Box>

          {/* Phone + Email */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 2,
              mb: 2,
            }}
          >
            <TextField
              fullWidth
              size="small"
              label="Phone"
              value={contact.phone}
              onChange={(e) =>
                setContact((prev) =>
                  prev ? { ...prev, phone: e.target.value } : prev
                )
              }
              sx={textFieldStyles}
            />
            <TextField
              fullWidth
              size="small"
              label="Email"
              value={contact.email}
              onChange={(e) =>
                setContact((prev) =>
                  prev ? { ...prev, email: e.target.value.trim() } : prev
                )
              }
              sx={textFieldStyles}
            />
          </Box>

          {/* Quick Contact Section */}
          <Typography
            variant="subtitle1"
            sx={{
              mt: 3,
              mb: 1,
              fontFamily: "Poppins",
              fontWeight: 600,
              color: "hsl(var(--foreground))",
            }}
          >
            Quick Contact Section
          </Typography>

          <TextField
            fullWidth
            size="small"
            label="Quick Title"
            value={contact.quick_title}
            onChange={(e) =>
              setContact((prev) =>
                prev ? { ...prev, quick_title: e.target.value } : prev
              )
            }
            sx={{ ...textFieldStyles, ...compactFieldSpacing }}
          />

          <TextField
            fullWidth
            size="small"
            label="Quick Subtitle"
            value={contact.quick_subtitle}
            onChange={(e) =>
              setContact((prev) =>
                prev ? { ...prev, quick_subtitle: e.target.value } : prev
              )
            }
            sx={{ ...textFieldStyles, ...compactFieldSpacing }}
          />

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 2,
              mb: 2,
            }}
          >
            <TextField
              fullWidth
              multiline
              minRows={3}
              label="Office Address"
              value={contact.office_address}
              onChange={(e) =>
                setContact((prev) =>
                  prev ? { ...prev, office_address: e.target.value } : prev
                )
              }
              sx={{
                ...textFieldStyles,
                "& .MuiOutlinedInput-root": {
                  padding: "0 !important",
                  alignItems: "stretch !important",
                },
                "& textarea": {
                  padding: "12px 14px !important",
                  lineHeight: "1.5 !important",
                  resize: "vertical",
                },
              }}
            />
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <TextField
                fullWidth
                size="small"
                label="Contact Phone"
                value={contact.contact_phone}
                onChange={(e) =>
                  setContact((prev) =>
                    prev ? { ...prev, contact_phone: e.target.value } : prev
                  )
                }
                sx={textFieldStyles}
              />
              <TextField
                fullWidth
                size="small"
                label="Contact Email"
                value={contact.contact_email}
                onChange={(e) =>
                  setContact((prev) =>
                    prev ? { ...prev, contact_email: e.target.value.trim() } : prev
                  )
                }
                sx={textFieldStyles}
              />
              <TextField
                fullWidth
                size="small"
                label="Website"
                value={contact.website || ""}
                onChange={(e) =>
                  setContact((prev) =>
                    prev ? { ...prev, website: e.target.value.trim() } : prev
                  )
                }
                sx={textFieldStyles}
              />
            </Box>
          </Box>

          {/* Map Embed URL */}
          <Typography
            variant="subtitle1"
            sx={{
              mt: 3,
              mb: 1,
              fontFamily: "Poppins",
              fontWeight: 600,
              color: "hsl(var(--foreground))",
            }}
          >
            Google Maps Embed URL
          </Typography>
          <TextField
            fullWidth
            multiline
            minRows={2}
            label="Map Embed URL"
            value={contact.map_embed_url}
            onChange={(e) => {
              const clean = e.target.value
                .replace(/[\u200B-\u200D\uFEFF]/g, "")
                .trim();
              setContact((prev) =>
                prev ? { ...prev, map_embed_url: clean } : prev
              );
            }}
            sx={{
              ...textFieldStyles,
              "& .MuiOutlinedInput-root": {
                padding: "0 !important",
                alignItems: "stretch !important",
              },
              "& textarea": {
                padding: "12px 14px !important",
                lineHeight: "1.5 !important",
                resize: "vertical",
              },
            }}
          />
        </Box>
      )}
      </Box>



      {/* Validation Modal */}
      <Dialog open={validationModal} onClose={() => setValidationModal(false)}>
        <DialogTitle sx={{ fontWeight: 600, color: "red" }}>
          Missing Fields
        </DialogTitle>
        <DialogContent>
          <Typography>
            Please fill all required fields in the Contact section before
            saving. Website is optional.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setValidationModal(false)}
            sx={{
              color: "white",
              backgroundColor: "red",
              "&:hover": { backgroundColor: "darkred" },
            }}
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>


    </Box>
  );
};
