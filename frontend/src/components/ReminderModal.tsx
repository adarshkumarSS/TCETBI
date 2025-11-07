import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Box, Typography } from "@mui/material";
import { Info } from "lucide-react";

interface ReminderModalProps {
  active: boolean; // Controls visibility externally
  message?: string;
  duration?: number; // Auto disappear after (ms)
}

export const ReminderModal: React.FC<ReminderModalProps> = ({
  active,
  message = "💾 Remember to save any changes you make!",
  duration = 4000,
}) => {
  const [visible, setVisible] = useState(active);

  useEffect(() => {
    if (active) {
      setVisible(true);
      const timer = setTimeout(() => setVisible(false), duration);
      return () => clearTimeout(timer);
    }
  }, [active, duration]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          style={{
            position: "fixed",
            top: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 2000,
          }}
        >
          <Box
            sx={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "12px",
              p: 2,
              px: 3,
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              boxShadow: "0 6px 20px rgba(0,0,0,0.25)",
            }}
          >
            <Info color="hsl(var(--primary))" size={24} />
            <Typography
              variant="body1"
              sx={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 500,
                color: "hsl(var(--foreground))",
              }}
            >
              {message}
            </Typography>
          </Box>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
