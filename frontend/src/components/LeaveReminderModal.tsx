import { motion, AnimatePresence } from "framer-motion";
import { Box, Typography, Button } from "@mui/material";
import { AlertTriangle } from "lucide-react";

interface LeaveReminderModalProps {
  open: boolean;
  onStay: () => void;
  onLeave: () => void;
}

export const LeaveReminderModal: React.FC<LeaveReminderModalProps> = ({
  open,
  onStay,
  onLeave,
}) => {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(0,0,0,0.45)",
            zIndex: 2500,
          }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{
              background: "hsl(var(--card))",
              borderRadius: "16px",
              padding: "2rem 2.5rem",
              maxWidth: "400px",
              width: "90%",
              boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
              textAlign: "center",
            }}
          >
            <AlertTriangle
              size={42}
              color="hsl(var(--primary))"
              style={{ marginBottom: "1rem" }}
            />
            <Typography
              variant="h6"
              sx={{
                fontFamily: "Poppins, sans-serif",
                color: "hsl(var(--foreground))",
                mb: 2,
              }}
            >
              You might have unsaved changes!
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontFamily: "Poppins, sans-serif",
                color: "hsl(var(--muted-foreground))",
                mb: 3,
              }}
            >
              Do you want to stay and save before leaving?
            </Typography>

            <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
              <Button
                onClick={onStay}
                variant="contained"
                sx={{
                  backgroundColor: "hsl(var(--primary))",
                  color: "white",
                  "&:hover": { backgroundColor: "hsl(var(--primary) / 0.8)" },
                }}
              >
                Stay
              </Button>
              <Button
                onClick={onLeave}
                variant="outlined"
                sx={{
                  borderColor: "hsl(var(--border))",
                  color: "hsl(var(--foreground))",
                  "&:hover": {
                    backgroundColor: "hsl(var(--muted))",
                  },
                }}
              >
                Leave
              </Button>
            </Box>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};