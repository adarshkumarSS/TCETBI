import React from "react";
import { Backdrop, CircularProgress, Typography, Box } from "@mui/material";
import { motion } from "framer-motion";

const PageLoader: React.FC = () => {
  return (
    <Backdrop
      sx={{
        color: "#fff",
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: "rgba(0, 0, 0, 0.9)", // Deep sleek black background
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
      open={true}
    >
      <Box position="relative" display="inline-flex">
        <CircularProgress
          size={80} // Larger size for impact
          thickness={2} // Thinner stroke for elegance
          sx={{
            color: "hsl(var(--primary))", // Use theme primary color
            "& .MuiCircularProgress-circle": {
              strokeLinecap: "round",
            },
          }}
        />
        {/* Optional: Central logo or icon could go here */}
        <Box
          sx={{
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            position: "absolute",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Inner pulse effect or logo if needed */}
        </Box>
      </Box>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.8,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontFamily: "Poppins, sans-serif",
            fontWeight: 500,
            letterSpacing: "0.05em",
            color: "hsl(var(--foreground))",
            mt: 2,
          }}
        >
          Loading...
        </Typography>
      </motion.div>
    </Backdrop>
  );
};

export default PageLoader;
