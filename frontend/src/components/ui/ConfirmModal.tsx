import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from "@mui/material";

interface ConfirmModalProps {
  open: boolean;
  title?: string;
  message?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  open,
  title = "Confirm Deletion",
  message = "Are you sure you want to delete this item? This action cannot be undone.",
  onConfirm,
  onCancel,
}) => {
  return (
    open && (
    <Dialog
      open={open}
      onClose={onCancel}
      PaperProps={{
        sx: {
          borderRadius: "var(--radius)",
          backgroundColor: "hsl(var(--card))",
          color: "hsl(var(--foreground))",
          p: 1,
          minWidth: 320,
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: 600, pb: 0 }}>
        {title}
      </DialogTitle>

      <DialogContent>
        <Typography sx={{ color: "hsl(var(--muted-foreground))" }}>
          {message}
        </Typography>
      </DialogContent>

      <DialogActions sx={{ justifyContent: "flex-end", gap: 1, pr: 2, pb: 2 }}>
        <Button
          variant="outlined"
          onClick={onCancel}
          sx={{
            color: "hsl(var(--foreground))",
            borderColor: "hsl(var(--border))",
            "&:hover": { borderColor: "hsl(0 84.2% 60.2%)" },
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={onConfirm}
          sx={{
            backgroundColor: "hsl(0 84.2% 60.2%)",
            color: "white",
            "&:hover": { backgroundColor: "hsl(0 84.2% 50.2%)" },
          }}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
    )
  );
};
