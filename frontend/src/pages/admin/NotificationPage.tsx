// src/pages/admin/NotificationPage.tsx
import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Paper,
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
  Loader2,
  HelpingHand,
  UserCog,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import {
  fetchNotifications,
  markNotificationRead,
  deleteNotification,
  Notification,
} from "@/api/notificationservice";

// If you exported these from your AnimatedList file:
import { AnimatedScroll, AnimatedItem } from "../../components/AdminNavigation";
// ^ adjust import path if needed

// ====== Type Theme Styles ======
const typeStyles = {
  contact: { color: "#16a34a", icon: <Mail size={20} /> },
  application: { color: "#2563eb", icon: <FolderOpen size={20} /> },
  blog: { color: "#eab308", icon: <FileText size={20} /> },
  event: { color: "#dc2626", icon: <AlertCircle size={20} /> },
  user_registration: { color: "#f59e0b", icon: <Bell size={20} /> },
  support: { color: "#0ea5e9", icon: <HelpingHand size={20} /> }, // Light blue
  mentor: { color: "#d946ef", icon: <UserCog size={20} /> }, // Fuchsia
  general: { color: "#8b5cf6", icon: <Bell size={20} /> },
};

export const NotificationsPage: React.FC = () => {
  const [items, setItems] = useState<Notification[]>([]);
  const [selected, setSelected] = useState<Notification | null>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const navigate = useNavigate();
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      navigate('/auth');
    } else {
      setIsAuthenticated(true);
    }
    setIsAuthLoading(false);
  }, [navigate]);

  useEffect(() => {
    document.body.style.backgroundColor = "hsl(var(--background))";
  }, []);

  const load = async () => {
    try {
      const data = await fetchNotifications();
      setItems(data);
      // If nothing selected, pick first contact or first item
      if (!selected && data.length > 0) {
        setSelected(data[0]);
      }
    } catch (error) {
      console.log('Error loading notifications:', error);
      setItems([]);
      // If we get a 401, the interceptor will redirect to login
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (isAuthLoading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor: "hsl(var(--background))",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Loader2 size={32} className="animate-spin" />
          <Typography variant="body1">Checking authentication...</Typography>
        </Box>
      </Box>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const bulkMarkRead = async () => {
    for (const id of selectedIds) {
      await markNotificationRead(id);
    }
    await load();
    setSelectedIds([]);
  };

  const bulkDelete = async () => {
    for (const id of selectedIds) {
      await deleteNotification(id);
    }
    await load();
    setSelectedIds([]);
    setSelected(null);
  };

  const unreadCount = items.filter((n) => !n.is_read).length;

  return (
    <Box sx={{ mt: 12, px: 3 }}>
      <Box
        sx={{
          maxWidth: 1120,
          mx: "auto",
        }}
      >
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

          {unreadCount > 0 && (
            <Box
              sx={{
                ml: 1,
                px: 1.6,
                py: 0.4,
                borderRadius: "999px",
                backgroundColor: "hsl(var(--destructive))",
              }}
            >
              <Typography
                sx={{
                  color: "white",
                  fontSize: "13px",
                  fontWeight: 600,
                }}
              >
                {unreadCount}
              </Typography>
            </Box>
          )}

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
                backgroundColor: "#16a34a",
                color: "white",
                "&:hover": { backgroundColor: "#15803d" },
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

        {/* ==== MAIN SPLIT LAYOUT (Gmail-style) ==== */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "minmax(0, 2.3fr) minmax(0, 3fr)" },
            gap: 3,
            alignItems: "flex-start",
          }}
        >
          {/* ========= LEFT: LIST ========= */}
          <Box
            sx={{
              borderRadius: "16px",
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              overflow: "auto",
              scrollbarWidth: "thin",
              scrollbarColor: "hsl(var(--muted)) transparent",
            }}
            className="
              [&::-webkit-scrollbar]:w-[8px]
              [&::-webkit-scrollbar-track]:bg-transparent
              [&::-webkit-scrollbar-thumb]:bg-[hsl(var(--muted))]
              [&::-webkit-scrollbar-thumb]:rounded-[4px]
            "
          >
            <Box
              sx={{
                width: "100%",
                height: "70vh",
                padding: "12px",
              }}
            >
              {items.map((n, index) => {
                const style = typeStyles[n.type] || typeStyles.general;
                const isSelected = selectedIds.includes(n.id);
                const isActive = selected?.id === n.id;

                return (
                  <AnimatedItem
                    key={n.id}
                    index={index}
                    delay={0.03 * index}
                    onClick={() => setSelected(n)}
                  >
                    <Paper
                      elevation={0}
                      sx={{
                        p: 1.5,
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        borderLeft: `4px solid ${style.color}`,
                        borderRadius: 0,
                        backgroundColor: isActive
                          ? "hsl(var(--muted))"
                          : n.is_read
                          ? "hsl(var(--background))"
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
                        style={{ transform: "scale(1.2)" }}
                      />

                      {/* Icon */}
                      <Box sx={{ color: style.color }}>{style.icon}</Box>

                      {/* Text */}
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography
                          component="div"
                          sx={{
                            fontWeight: n.is_read ? 500 : 700,
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            color: "hsl(var(--foreground))",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
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

                        <Typography
                          component="div"
                          sx={{
                            fontSize: 13,
                            opacity: 0.7,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {n.message}
                        </Typography>
                      </Box>

                      {/* Time */}
                      <Typography
                        component="div"
                        sx={{
                          fontSize: 11,
                          opacity: 0.6,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {new Date(n.created_at).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </Typography>

                      {/* Single Mark Read */}
                      {!n.is_read && (
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            markNotificationRead(n.id).then(load);
                          }}
                          sx={{
                            color: "#16a34a",
                            "&:hover": { background: "#16a34a22" },
                          }}
                        >
                          <CheckCircle size={18} />
                        </IconButton>
                      )}

                      {/* Single Delete */}
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotification(n.id).then(load);
                        }}
                        sx={{
                          color: "#dc2626",
                          "&:hover": { background: "#dc262620" },
                        }}
                      >
                        <Trash2 size={18} />
                      </IconButton>
                    </Paper>
                  </AnimatedItem>
                );
              })}
            </Box>
          </Box>

          {/* ========= RIGHT: DETAILS PANEL ========= */}
          <Box
            sx={{
              borderRadius: "16px",
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              p: 3,
              height: "70vh",
              overflowY: "auto",
              scrollbarWidth: "thin",
              scrollbarColor: "hsl(var(--muted)) transparent",
            }}
            className="
              [&::-webkit-scrollbar]:w-[8px]
              [&::-webkit-scrollbar-track]:bg-transparent
              [&::-webkit-scrollbar-thumb]:bg-[hsl(var(--muted))]
              [&::-webkit-scrollbar-thumb]:rounded-[4px]
            "
          >
            {selected ? (
              <>
                {/* Header: title & type chip */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    mb: 2,
                  }}
                >
                  <Typography
                    component="div"
                    sx={{
                      fontSize: 20,
                      fontWeight: 600,
                      fontFamily: "Poppins, sans-serif",
                      color: "hsl(var(--foreground))",
                    }}
                  >
                    {selected.title}
                  </Typography>

                  <Box
                    sx={{
                      ml: "auto",
                      px: 1.5,
                      py: 0.3,
                      borderRadius: "999px",
                      border: "1px solid hsl(var(--border))",
                      display: "flex",
                      alignItems: "center",
                      gap: 0.6,
                      fontSize: 12,
                      color: "hsl(var(--muted-foreground))",
                    }}
                  >
                    {typeStyles[selected.type]?.icon}
                    <span style={{ textTransform: "capitalize" }}>
                      {selected.type}
                    </span>
                  </Box>
                </Box>

                <Typography
                  component="div"
                  sx={{
                    fontSize: 12,
                    opacity: 0.7,
                    mb: 2,
                  }}
                >
                  Sent at:{" "}
                  {new Date(selected.created_at).toLocaleString()}
                </Typography>

                {/* Contact-style layout only for contact */}
                {selected.type === "contact" && selected.meta ? (
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <Box>
                      <Typography
                        component="div"
                        sx={{
                          color: "hsl(var(--destructive))",
                          fontWeight: 600,
                        }}
                      >
                        Name:
                      </Typography>
                      <Typography component="div">
                        {selected.meta.name ?? "N/A"}
                      </Typography>
                    </Box>

                    <Box>
                      <Typography
                        component="div"
                        sx={{
                          color: "hsl(var(--destructive))",
                          fontWeight: 600,
                        }}
                      >
                        Email:
                      </Typography>
                      <Typography component="div">
                        {selected.meta.email ?? "N/A"}
                      </Typography>
                    </Box>

                    <Box>
                      <Typography
                        component="div"
                        sx={{
                          color: "hsl(var(--destructive))",
                          fontWeight: 600,
                        }}
                      >
                        Phone:
                      </Typography>
                      <Typography component="div">
                        {selected.meta.phone ?? "N/A"}
                      </Typography>
                    </Box>

                    <Box sx={{ mt: 1 }}>
                      <Typography
                        component="div"
                        sx={{
                          color: "hsl(var(--destructive))",
                          fontWeight: 600,
                        }}
                      >
                        Subject:
                      </Typography>
                      <Typography component="div">
                        {selected.meta.subject ?? "N/A"}
                      </Typography>
                    </Box>

                    <Box sx={{ mt: 1 }}>
                      <Typography
                        component="div"
                        sx={{
                          color: "hsl(var(--destructive))",
                          fontWeight: 600,
                        }}
                      >
                        Message:
                      </Typography>
                      <Typography component="div">
                        {selected.meta.message ?? "No message provided"}
                      </Typography>
                    </Box>
                  </Box>
                ) : (
                  // Generic detail view
                  <Typography
                    component="div"
                    sx={{
                      mt: 1,
                      fontSize: 15,
                      lineHeight: 1.6,
                      color: "hsl(var(--foreground))",
                    }}
                  >
                    {selected.message}
                  </Typography>
                )}

                {/* View Application button for application notifications */}
                {selected.type === "application" && selected.meta && (
                  <Box sx={{ mt: 3 }}>
                    <Button
                      onClick={() => navigate("/admin/applications")}
                      sx={{
                        backgroundColor: "#2563eb",
                        color: "white",
                        "&:hover": { backgroundColor: "#1d4ed8" },
                        px: 3,
                        py: 1.5,
                        borderRadius: "10px",
                        fontWeight: 600,
                      }}
                    >
                      View Application
                    </Button>
                  </Box>
                )}

                {/* View Support Requests */}
                {selected.type === "support" && (
                  <Box sx={{ mt: 3 }}>
                    <Button
                      onClick={() => navigate("/admin/support-requests")}
                      sx={{
                        backgroundColor: "#0ea5e9",
                        color: "white",
                        "&:hover": { backgroundColor: "#0284c7" },
                        px: 3,
                        py: 1.5,
                        borderRadius: "10px",
                        fontWeight: 600,
                      }}
                    >
                      View Support Requests
                    </Button>
                  </Box>
                )}

                {/* View Mentor Applications */}
                {selected.type === "mentor" && (
                  <Box sx={{ mt: 3 }}>
                    <Button
                      onClick={() => navigate("/admin/mentors")}
                      sx={{
                        backgroundColor: "#d946ef",
                        color: "white",
                        "&:hover": { backgroundColor: "#c026d3" },
                        px: 3,
                        py: 1.5,
                        borderRadius: "10px",
                        fontWeight: 600,
                      }}
                    >
                      View Mentor Applications
                    </Button>
                  </Box>
                )}
              </>
            ) : (
              // Empty state
              <Box
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                  gap: 1,
                }}
              >
                <Bell size={32} style={{ opacity: 0.5 }} />
                <Typography
                  component="div"
                  sx={{
                    fontWeight: 600,
                    color: "hsl(var(--foreground))",
                  }}
                >
                  No notification selected
                </Typography>
                <Typography
                  component="div"
                  sx={{
                    fontSize: 14,
                    opacity: 0.7,
                  }}
                >
                  Click on a notification from the left to view full details.
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
