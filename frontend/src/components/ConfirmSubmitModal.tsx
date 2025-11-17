import React from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from "@mui/material";

export const ConfirmSubmitModal = ({ open, onClose, onConfirm }) => {
  // Temporarily remove aria-hidden from root when dialog is open
  React.useEffect(() => {
    const rootElement = document.getElementById('root');
    if (rootElement && open) {
      rootElement.removeAttribute('aria-hidden');
    }
    return () => {
      // Cleanup: restore aria-hidden when dialog closes
      if (rootElement && !open) {
        // Don't set it back as this might cause other issues
      }
    };
  }, [open]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="submit-dialog-title"
      aria-describedby="submit-dialog-description"
    >
      <DialogTitle
        id="submit-dialog-title"
        sx={{
          fontFamily: "Poppins, sans-serif",
          color: "hsl(var(--primary))"
        }}
      >
        Submit Application?
      </DialogTitle>
      <DialogContent
        id="submit-dialog-description"
        sx={{
          color: "hsl(var(--foreground))"
        }}
      >
        Are you sure you want to submit this application?
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} sx={{
          color: "hsl(var(--muted-foreground))"
        }}>Cancel</Button>
        <Button onClick={onConfirm} sx={{
          color: "hsl(var(--primary))"
        }} color="primary">Submit</Button>
      </DialogActions>
    </Dialog>
  );
};
