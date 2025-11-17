import { CircularProgress, Box, Typography } from "@mui/material";

export const SubmitLoader = () => (
  <Box sx={{
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    background: "hsl(var(--background))"
  }}>
    <CircularProgress sx={{
      color: "hsl(var(--primary))"
    }} />
    <Typography sx={{
      mt: 2,
      fontFamily: "Poppins, sans-serif",
      color: "hsl(var(--foreground))"
    }}>Submitting your application...</Typography>
  </Box>
);
