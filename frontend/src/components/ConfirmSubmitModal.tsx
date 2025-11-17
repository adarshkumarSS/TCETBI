import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from "@mui/material";

export const ConfirmSubmitModal = ({ open, onClose, onConfirm }) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle sx={{
      fontFamily: "Poppins, sans-serif",
      color: "hsl(var(--primary))"
    }}>Submit Application?</DialogTitle>
    <DialogContent sx={{
      color: "hsl(var(--foreground))"
    }}>
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
