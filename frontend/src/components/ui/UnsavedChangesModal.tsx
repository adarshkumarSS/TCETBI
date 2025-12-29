import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { AlertTriangle } from "lucide-react";

interface UnsavedChangesModalProps {
  open: boolean;
  onClose: () => void;
  onDiscard: () => void;
  onSave: () => void;
  changes?: string[];
}

export const UnsavedChangesModal: React.FC<UnsavedChangesModalProps> = ({
  open,
  onClose,
  onDiscard,
  onSave,
  changes = [],
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: "hsl(var(--card))",
          color: "hsl(var(--foreground))",
          border: "1px solid hsl(var(--border))",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          color: "hsl(var(--foreground))",
          fontWeight: 600,
        }}
      >
        <AlertTriangle size={24} color="hsl(var(--destructive))" />
        Unsaved Changes
      </DialogTitle>

      <DialogContent>
        <Typography sx={{ mb: 2, color: "hsl(var(--foreground))" }}>
          You have unsaved changes. Are you sure you want to leave without saving?
        </Typography>

        {changes.length > 0 && (
          <Box
            sx={{
              p: 2,
              backgroundColor: "hsl(var(--accent))",
              borderRadius: "8px",
              border: "1px solid hsl(var(--border))",
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{ mb: 1, fontWeight: 600, color: "hsl(var(--foreground))" }}
            >
              Changes detected:
            </Typography>
            <List dense sx={{ p: 0 }}>
              {changes.map((change, index) => (
                <ListItem key={index} sx={{ py: 0.5, px: 0 }}>
                  <ListItemText
                    primary={`• ${change}`}
                    sx={{
                      "& .MuiListItemText-primary": {
                        color: "hsl(var(--muted-foreground))",
                        fontSize: "0.875rem",
                      },
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            color: "hsl(var(--foreground))",
            borderColor: "hsl(var(--border))",
            "&:hover": {
              borderColor: "hsl(var(--primary))",
              backgroundColor: "hsl(var(--accent))",
            },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={onDiscard}
          variant="outlined"
          color="error"
          sx={{
            "&:hover": {
              backgroundColor: "rgba(211, 47, 47, 0.1)",
            },
          }}
        >
          Discard Changes
        </Button>
        <Button
          onClick={onSave}
          variant="contained"
          sx={{
            backgroundColor: "hsl(0 84.2% 60.2%)",
            color: "white",
            "&:hover": {
              backgroundColor: "hsl(0 84.2% 50.2%)",
            },
          }}
        >
          Save & Continue
        </Button>
      </DialogActions>
    </Dialog>
  );
};
