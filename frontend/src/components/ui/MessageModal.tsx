import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle } from "lucide-react";
import { Box, Typography } from "@mui/material";

interface MessageModalProps {
  open: boolean;
  message: string;
  type?: "success" | "error" | "info";
  onClose: () => void;
  duration?: number; // auto close after x ms
}

export const MessageModal: React.FC<MessageModalProps> = ({
  open,
  message,
  type = "info",
  onClose,
  duration = 3000,
}) => {
  const [visible, setVisible] = useState(open);

  useEffect(() => {
    if (open) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        setTimeout(onClose, 400); // delay unmount after fade-out
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [open, duration, onClose]);

  const colors = {
    success: "hsl(142.1 70.6% 45.3%)", // ✅ green
    error: "hsl(0 84.2% 60.2%)", // ❌ red
    info: "hsl(217.2 91.2% 59.8%)", // 🔵 blue
  };

  const icons = {
    success: <CheckCircle size={28} color={colors.success} />,
    error: <XCircle size={28} color={colors.error} />,
    info: <CheckCircle size={28} color={colors.info} />,
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 2000,
          }}
        >
          <Box
            sx={{
              backgroundColor: "hsl(var(--card))",
              color: "hsl(var(--foreground))",
              border: `1px solid ${colors[type]}`,
              borderRadius: "16px",
              p: 3,
              display: "flex",
              alignItems: "center",
              gap: 2,
              boxShadow: "0px 8px 30px rgba(0,0,0,0.4)",
              backdropFilter: "blur(12px)",
              minWidth: "280px",
            }}
          >
            {icons[type]}
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
