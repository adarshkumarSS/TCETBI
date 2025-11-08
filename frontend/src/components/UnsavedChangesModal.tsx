import { motion, AnimatePresence } from "framer-motion";
import { Box, Typography, Button } from "@mui/material";

interface UnsavedChangesModalProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const UnsavedChangesModal: React.FC<UnsavedChangesModalProps> = ({
  open,
  onConfirm,
  onCancel,
}) => {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
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
              border: "1px solid hsl(var(--border))",
              borderRadius: "16px",
              p: 4,
              width: 360,
              textAlign: "center",
              boxShadow: "0 8px 30px rgba(0,0,0,0.4)",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 600,
                mb: 2,
              }}
            >
              Unsaved Changes
            </Typography>
            <Typography
              variant="body2"
              sx={{ mb: 3, color: "hsl(var(--muted-foreground))" }}
            >
              You have unsaved changes. Do you want to save before leaving?
            </Typography>

            <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
              <Button
                variant="outlined"
                color="inherit"
                fullWidth
                onClick={onCancel}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="error"
                fullWidth
                onClick={onConfirm}
              >
                Save & Leave
              </Button>
            </Box>
          </Box>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
