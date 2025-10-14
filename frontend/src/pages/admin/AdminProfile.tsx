import { Box, Typography, Avatar } from "@mui/material";
import { Card, CardContent } from "@/components/ui/card";
import { OutlinedTextField } from "@/components/ui/OutlinedTextField";
import { DarkButton } from "@/components/ui/DarkButton";
import { User, Mail, Phone, MapPin } from "lucide-react";

export const AdminProfile = () => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "hsl(var(--background))",
        pt: 12,
        px: 4,
      }}
    >
      <Box
        sx={{
          maxWidth: "800px",
          mx: "auto",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontFamily: "Poppins, sans-serif",
            fontWeight: 700,
            color: "hsl(var(--foreground))",
            mb: 4,
          }}
        >
          Admin Profile
        </Typography>

        <Card>
          <CardContent className="p-4">
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                mb: 4,
              }}
            >
              <Avatar
                sx={{
                  width: 120,
                  height: 120,
                  mb: 2,
                  backgroundColor: "hsl(var(--primary))",
                  fontSize: "2.5rem",
                }}
              >
                A
              </Avatar>
              <DarkButton size="small">Change Photo</DarkButton>
            </Box>

            <Box sx={{ display: "grid", gap: 3 }}>
              <OutlinedTextField
                fullWidth
                label="Full Name"
                defaultValue="Admin User"
                InputProps={{
                  startAdornment: <User size={20} style={{ marginRight: 8, opacity: 0.5 }} />,
                }}
              />
              <OutlinedTextField
                fullWidth
                label="Email"
                type="email"
                defaultValue="admin@tce-tbi.edu"
                InputProps={{
                  startAdornment: <Mail size={20} style={{ marginRight: 8, opacity: 0.5 }} />,
                }}
              />
              <OutlinedTextField
                fullWidth
                label="Phone"
                defaultValue="+91 98765 43210"
                InputProps={{
                  startAdornment: <Phone size={20} style={{ marginRight: 8, opacity: 0.5 }} />,
                }}
              />
              <OutlinedTextField
                fullWidth
                label="Location"
                defaultValue="Madurai, Tamil Nadu"
                InputProps={{
                  startAdornment: <MapPin size={20} style={{ marginRight: 8, opacity: 0.5 }} />,
                }}
              />
            </Box>

            <Box sx={{ display: "flex", gap: 2, mt: 4, justifyContent: "flex-end" }}>
              <DarkButton variant="outlined">Cancel</DarkButton>
              <DarkButton>Save Changes</DarkButton>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};
