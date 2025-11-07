import { useState } from "react";
import { Box, Typography, TextField } from "@mui/material";
import { DarkButton } from "@/components/ui/DarkButton";

interface ContactInfo {
  address: string;
  email: string;
  phone: string;
  officeHours: string;
}

export const ContactPage: React.FC = () => {
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    address: "123 Innovation Street, Chennai",
    email: "contact@tcetbi.com",
    phone: "+91 1234567890",
    officeHours: "Mon-Fri: 9AM-6PM",
  });

  const textFieldStyles = {
    "& .MuiInputBase-input": { color: "hsl(var(--foreground))" },
    "& .MuiInputLabel-root": { color: "hsl(var(--muted-foreground))" },
    "& .MuiInputLabel-root.Mui-focused": { color: "hsl(0 84.2% 60.2%)" },
    "& .MuiOutlinedInput-root": {
      "& fieldset": { borderColor: "hsl(var(--border))" },
      "&:hover fieldset": { borderColor: "hsl(0 84.2% 60.2%)" },
      "&.Mui-focused fieldset": { borderColor: "hsl(0 84.2% 60.2%)" },
    },
  };

  const handleContactChange = (field: string, value: string) => {
    setContactInfo({ ...contactInfo, [field]: value });
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography
        variant="h5"
        sx={{
          fontFamily: "Poppins",
          fontWeight: 600,
          color: "hsl(var(--foreground))",
          mb: 3,
        }}
      >
        Contact Information
      </Typography>

      <Box
        sx={{
          p: 3,
          border: "1px solid hsl(var(--border))",
          borderRadius: "var(--radius)",
        }}
      >
        <TextField
          fullWidth
          label="Address"
          value={contactInfo.address}
          onChange={(e) => handleContactChange("address", e.target.value)}
          sx={{ ...textFieldStyles, mb: 2 }}
        />

        <TextField
          fullWidth
          label="Email"
          type="email"
          value={contactInfo.email}
          onChange={(e) => handleContactChange("email", e.target.value)}
          sx={{ ...textFieldStyles, mb: 2 }}
        />

        <TextField
          fullWidth
          label="Phone"
          value={contactInfo.phone}
          onChange={(e) => handleContactChange("phone", e.target.value)}
          sx={{ ...textFieldStyles, mb: 2 }}
        />

        <TextField
          fullWidth
          label="Office Hours"
          value={contactInfo.officeHours}
          onChange={(e) => handleContactChange("officeHours", e.target.value)}
          sx={textFieldStyles}
        />
      </Box>

      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4 }}>
        <DarkButton>Save Changes</DarkButton>
      </Box>
    </Box>
  );
};