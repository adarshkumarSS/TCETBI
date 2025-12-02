import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Box
} from '@mui/material';
import { LogOut } from 'lucide-react';

interface LogoutModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const LogoutModal: React.FC<LogoutModalProps> = ({ open, onClose, onConfirm }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          backgroundColor: "hsl(var(--card))",
          color: "hsl(var(--foreground))",
          border: "1px solid hsl(var(--border))",
          borderRadius: "var(--radius)",
          maxWidth: "400px",
          p: 1
        }
      }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 2, fontFamily: "Poppins, sans-serif" }}>
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            backgroundColor: "hsl(var(--destructive) / 0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "hsl(var(--destructive))"
          }}
        >
          <LogOut size={20} />
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Confirm Logout
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Typography sx={{ fontFamily: "Poppins, sans-serif", color: "hsl(var(--muted-foreground))" }}>
          Are you sure you want to log out? You will need to sign in again to access your account.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ p: 2, pt: 0 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            color: "hsl(var(--foreground))",
            borderColor: "hsl(var(--border))",
            fontFamily: "Poppins, sans-serif",
            textTransform: "none",
            "&:hover": {
              backgroundColor: "hsl(var(--muted))",
              borderColor: "hsl(var(--border))"
            }
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          sx={{
            backgroundColor: "hsl(var(--destructive))",
            color: "hsl(var(--destructive-foreground))",
            fontFamily: "Poppins, sans-serif",
            textTransform: "none",
            "&:hover": {
              backgroundColor: "hsl(var(--destructive) / 0.9)"
            }
          }}
          autoFocus
        >
          Logout
        </Button>
      </DialogActions>
    </Dialog>
  );
};
