import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import {
  Bell,
  Mail,
  FileText,
  FolderOpen,
  AlertCircle,
  Trash2,
  CheckCircle,
  ArrowLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AnimatedScroll, AnimatedItem } from "../../components/AdminNavigation";

import {
  fetchNotifications,
  markNotificationRead,
  deleteNotification,
  Notification,
} from "@/api/notificationservice";

// ====== Type Theme Styles ======
const typeStyles = {
  contact: { color: "#16a34a", icon: <Mail size={20} /> },
  application: { color: "#2563eb", icon: <FolderOpen size={20} /> },
  blog: { color: "#eab308", icon: <FileText size={20} /> },
  program: { color: "#dc2626", icon: <AlertCircle size={20} /> },
  general: { color: "#6b7280", icon: <Bell size={20} /> },
};

export const NotificationsPage: React.FC = () => {
  const [items, setItems] = useState<Notification[]>([]);
  const [selected, setSelected] = useState<Notification | null>(null);
  const navigate = useNavigate();
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const contactModal = selected && (
    <Dialog
      open={true}
      onClose={() => setSelected(null)}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          backgroundColor: "hsl(var(--card))",
          color: "hsl(var(--foreground))",
          borderRadius: "16px",
          boxShadow: "0 8px 30px rgba(0,0,0,0.3)",
        },
      }}
    >
      <DialogTitle
        sx={{
          fontWeight: 700,
          fontFamily: "Poppins",
          color: "hsl(var(--foreground))",
          fontSize: "1.3rem",
        }}
      >
        Contact Message
      </DialogTitle>

      <DialogContent
        dividers
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          fontSize: "15px",
        }}
      >
        <Box>
          <Typography
            component="div"
            sx={{ color: "hsl(var(--destructive))", fontWeight: 600 }}
          >
            Name:
          </Typography>
          <Typography component="div">
            {selected.meta?.name ?? "N/A"}
          </Typography>
        </Box>

        <Box>
          <Typography
            component="div"
            sx={{ color: "hsl(var(--destructive))", fontWeight: 600 }}
          >
            Email:
          </Typography>
          <Typography component="div">
            {selected.meta?.email ?? "N/A"}
          </Typography>
        </Box>

        <Box>
          <Typography
            component="div"
            sx={{ color: "hsl(var(--destructive))", fontWeight: 600 }}
          >
            Phone:
          </Typography>
          <Typography component="div">
            {selected.meta?.phone ?? "N/A"}
          </Typography>
        </Box>

        <Box>
          <Typography
            component="div"
            sx={{ color: "hsl(var(--destructive))", fontWeight: 600 }}
          >
            Subject:
          </Typography>
          <Typography component="div">
            {selected.meta?.subject ?? "N/A"}
          </Typography>
        </Box>

        <Box>
          <Typography
            component="div"
            sx={{ color: "hsl(var(--destructive))", fontWeight: 600 }}
          >
            Message:
          </Typography>
          <Typography component="div">
            {selected.meta?.message ?? "No message provided"}
          </Typography>
        </Box>

        <Typography component="div" sx={{ mt: 2, fontSize: 13, opacity: 0.6 }}>
          Sent at: {new Date(selected.created_at).toLocaleString()}
        </Typography>
      </DialogContent>

      <DialogActions>
        <Button
          onClick={() => setSelected(null)}
          sx={{
            color: "white",
            backgroundColor: "hsl(var(--destructive))",
            "&:hover": { backgroundColor: "hsl(var(--destructive) / 0.8)" },
            borderRadius: "10px",
            px: 3,
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const bulkMarkRead = async () => {
    for (const id of selectedIds) {
      await markNotificationRead(id);
    }
    load();
    setSelectedIds([]);
  };

  const bulkDelete = async () => {
    for (const id of selectedIds) {
      await deleteNotification(id);
    }
    load();
    setSelectedIds([]);
  };

  const load = async () => {
    const data = await fetchNotifications();
    setItems(data);
  };

  useEffect(() => {
    document.body.style.backgroundColor = "hsl(var(--background))";
  }, []);

  useEffect(() => {
    load();
  }, []);

  const unreadCount = items.filter((n) => !n.is_read).length;

  return (
    <Box sx={{ mt: 12, px: 3 }}>
      {/* ==== HEADER + SELECT ALL ==== */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
        <IconButton
          onClick={() => navigate(-1)}
          sx={{
            color: "hsl(var(--foreground))",
            backgroundColor: "hsl(var(--muted))",
            borderRadius: "12px",
            p: 1.2,
            "&:hover": { backgroundColor: "hsl(var(--muted) / 0.8)" },
          }}
        >
          <ArrowLeft size={20} />
        </IconButton>

        <Typography
          variant="h5"
          sx={{
            fontWeight: 600,
            color: "hsl(var(--foreground))",
            fontFamily: "Poppins, sans-serif",
          }}
        >
          Notifications
        </Typography>

        <Box sx={{ flex: 1 }} />

        {/* Select all */}
        <input
          type="checkbox"
          checked={items.length > 0 && selectedIds.length === items.length}
          onChange={(e) =>
            setSelectedIds(e.target.checked ? items.map((i) => i.id) : [])
          }
          style={{ transform: "scale(1.3)" }}
        />
      </Box>

      {/* ==== BULK ACTIONS ==== */}
      {selectedIds.length > 0 && (
        <Box
          sx={{
            display: "flex",
            gap: 2,
            mb: 3,
            p: 1.5,
            borderRadius: "12px",
            backgroundColor: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
          }}
        >
          <Button
            onClick={bulkMarkRead}
            sx={{
              backgroundColor: "#dc2626",
              color: "white",
              "&:hover": { backgroundColor: "#b91c1c" },
              px: 2,
              py: 1,
              borderRadius: "10px",
            }}
          >
            Mark as Read
          </Button>

          <Button
            onClick={bulkDelete}
            sx={{
              backgroundColor: "#dc2626",
              color: "white",
              "&:hover": { backgroundColor: "#b91c1c" },
              px: 2,
              py: 1,
              borderRadius: "10px",
            }}
          >
            Delete
          </Button>
        </Box>
      )}

      {/* ==== NOTIFICATION LIST ==== */}
      <AnimatedScroll>
        {items.map((n, index) => {
          const style = typeStyles[n.type] || typeStyles.general;
          const isSelected = selectedIds.includes(n.id);

          return (
            <AnimatedItem
              key={n.id}
              index={index}
              onClick={() => n.type === "contact" && setSelected(n)}
            >
              <Paper
                sx={{
                  p: 2,
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  borderLeft: `4px solid ${style.color}`,
                  backgroundColor: n.is_read
                    ? "hsl(var(--muted))"
                    : "hsl(var(--card))",
                  cursor: "pointer",
                  transition: "0.2s",
                  "&:hover": {
                    backgroundColor: "hsl(var(--card) / 0.85)",
                  },
                }}
              >
                {/* Checkbox */}
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={(e) => {
                    e.stopPropagation();
                    toggleSelect(n.id);
                  }}
                  style={{ transform: "scale(1.3)" }}
                />

                {/* Icon */}
                <Box sx={{ color: style.color }}>{style.icon}</Box>

                {/* Text */}
                <Box sx={{ flex: 1 }}>
                  <Typography
                    sx={{
                      fontWeight: n.is_read ? 500 : 700,
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      color: "hsl(var(--foreground))",
                    }}
                  >
                    {!n.is_read && (
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          backgroundColor: style.color,
                        }}
                      />
                    )}
                    {n.title}
                  </Typography>

                  <Typography sx={{ fontSize: 14, opacity: 0.7 }}>
                    {n.message}
                  </Typography>

                  <Typography sx={{ fontSize: 12, opacity: 0.6, mt: 0.5 }}>
                    {new Date(n.created_at).toLocaleString()}
                  </Typography>
                </Box>

                {!n.is_read && (
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      markNotificationRead(n.id).then(load);
                    }}
                    sx={{
                      color: "#16a34a",
                      "&:hover": { background: "#16a34a22" },
                    }}
                  >
                    <CheckCircle size={20} />
                  </IconButton>
                )}

                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteNotification(n.id).then(load);
                  }}
                  sx={{
                    color: "#dc2626",
                    "&:hover": { background: "#dc262620" },
                  }}
                >
                  <Trash2 size={20} />
                </IconButton>
              </Paper>
            </AnimatedItem>
          );
        })}
      </AnimatedScroll>

      {/* ==== CONTACT MESSAGE MODAL ==== */}
      {contactModal}
    </Box>
  );
};
