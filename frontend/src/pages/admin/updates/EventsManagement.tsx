import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  MenuItem,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
  Fab,
} from "@mui/material";
import { Upload, Plus, Trash2, Save } from "lucide-react";
import { DarkButton } from "@/components/ui/DarkButton";
import { toast } from "sonner";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { ResizeModal } from "@/components/ResizeModal";
import {
  fetchEvents,
  updateEventsData,
  deleteEvent,
  Event,
} from "@/api/eventService";
import { uploadToCloudinary } from "@/utils/uploadToCloudinary";

// ------- Types with local meta -------
type Status = "live" | "upcoming" | "ended";

interface EventWithMeta extends Event {
  userStatusOverride?: boolean; // true = don’t auto-change from dates
  userDurationOverride?: boolean; // true = don’t auto-change from dates
  markedForDeletion?: boolean; // true = delete on Save
}

// ------- Helpers -------

// Compute status from start/end dates
const computeStatusFromDates = (start?: string, end?: string): Status => {
  if (!start || !end) return "upcoming";

  const today = new Date();
  const s = new Date(start);
  const e = new Date(end);

  if (isNaN(s.getTime()) || isNaN(e.getTime())) return "upcoming";

  if (today < s) return "upcoming";
  if (today > e) return "ended";
  return "live";
};

// Compute duration like: "1 month 12 days"
const computeDurationLabel = (start?: string, end?: string): string => {
  if (!start || !end) return "";

  const s = new Date(start);
  const e = new Date(end);

  if (isNaN(s.getTime()) || isNaN(e.getTime()) || e < s) return "";

  const MS_PER_DAY = 1000 * 60 * 60 * 24;
  const totalDays = Math.floor((e.getTime() - s.getTime()) / MS_PER_DAY);

  const months = Math.floor(totalDays / 30);
  const days = totalDays % 30;

  const parts: string[] = [];
  if (months > 0) parts.push(`${months} month${months > 1 ? "s" : ""}`);
  if (days > 0) parts.push(`${days} day${days > 1 ? "s" : ""}`);

  return parts.join(" ") || "0 days";
};

export const EventsManagement: React.FC = () => {
  const [events, setEvents] = useState<EventWithMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<"all" | Status>("all");

  const [resizeModal, setResizeModal] = useState<{
    open: boolean;
    index: number | null;
    image: string;
  }>({ open: false, index: null, image: "" });

  const [deleteModal, setDeleteModal] = useState<{
    open: boolean;
    id: number | null;
  }>({ open: false, id: null });

  const [validationModal, setValidationModal] = useState(false);

  // ------- Styles -------

  const textFieldStyles = {
    "& .MuiInputBase-root": {
      color: "hsl(var(--foreground))",
      minHeight: "48px",
    },
    "& .MuiInputBase-input": {
      color: "hsl(var(--foreground))",
      padding: "12px 14px",
      caretColor: "hsl(var(--foreground))",
      "&::placeholder": {
        color: "hsl(var(--muted-foreground)) !important",
      },
      "& *": {
        color: "hsl(var(--foreground)) !important",
      },
    },
    "& textarea": {
      "& *": {
        color: "hsl(var(--foreground)) !important",
      },
    },
    "& .MuiInputLabel-root": {
      color: "hsl(var(--muted-foreground))",
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: "hsl(0 84.2% 60.2%)",
    },

    /* 🔥 FIX: Chrome blue outline on paste/autofill */
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "hsl(var(--border)) !important",
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "hsl(0 84.2% 60.2%) !important",
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "hsl(0 84.2% 60.2%) !important",
    },

    "& input::-webkit-calendar-picker-indicator": {
      filter: "invert(1)",
    },
    "& .MuiSvgIcon-root": {
      color: "white",
      fontSize: "1.3rem",
    },
  } as const;

  const uploadButtonStyles = {
    backgroundColor: "hsl(0 84.2% 60.2%)",
    color: "white",
    "&:hover": { backgroundColor: "hsl(0 84.2% 50.2%)" },
  } as const;

  const compactFieldSpacing = { mb: 1.5 };

  // ------- Fetch on mount -------

  useEffect(() => {
    fetchEvents()
      .then((res) => {
        const sorted = [...res].sort((a, b) => {
          const statusOrder: Record<string, number> = {
            live: 0,
            upcoming: 1,
            ended: 2,
          };
          return (
            (statusOrder[a.status.toLowerCase()] ?? 3) -
            (statusOrder[b.status.toLowerCase()] ?? 3)
          );
        });
        setEvents(
          sorted.map((p) => ({
            ...p,
            userStatusOverride: false,
            userDurationOverride: false,
          }))
        );
      })
      .catch(() => console.error("Failed to load events"))
      .finally(() => setLoading(false));
  }, []);

  // ------- Add Event -------

  const addEvent = () => {
    setSelectedFilter("all"); // always show new card
    setEvents((prev) => [
      ...prev,
      {
        id: -1,
        title: "",
        description: "",
        image: "",
        duration: "",
        status: "upcoming",
        startDate: "",
        endDate: "",
        link: "",
        userStatusOverride: false,
        userDurationOverride: false,
      },
    ]);
  };

  // ------- Generic change helper (by index in main array) -------

  const handleChange = (
    index: number,
    field: keyof EventWithMeta,
    value: any
  ) => {
    setEvents((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  // ------- Image upload + crop -------

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setResizeModal({
        open: true,
        index,
        image: reader.result as string,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleCropped = async (croppedFile: File) => {
    if (resizeModal.index === null) return;

    const url = URL.createObjectURL(croppedFile);

    setEvents((prev) => {
      const copy = [...prev];
      copy[resizeModal.index!].image = url;
      return copy;
    });

    setResizeModal({ open: false, index: null, image: "" });
  };

  // ------- Delete flow (mark then delete on Save) -------

  const openDeleteModal = (id: number | undefined) =>
    setDeleteModal({ open: true, id: id ?? null });

  const handleDeleteConfirm = () => {
    if (deleteModal.id == null) {
      setDeleteModal({ open: false, id: null });
      return;
    }

    setEvents((prev) =>
      prev.map((p) =>
        p.id === deleteModal.id ? { ...p, markedForDeletion: true } : p
      )
    );
    setDeleteModal({ open: false, id: null });
  };

  // ------- Validation -------

  const validate = (p: EventWithMeta) =>
    p.title.trim() &&
    p.description.trim() &&
    p.status &&
    p.duration.trim() &&
    p.startDate &&
    p.endDate;

  // ------- Save all (update + upload + delete) -------

  const handleSave = async () => {
    const toKeep = events.filter((p) => !p.markedForDeletion);
    const toDelete = events.filter((p) => p.markedForDeletion);

    if (toKeep.some((p) => !validate(p))) {
      setValidationModal(true);
      return;
    }

    try {
      setSaving(true);

      const uploadIfNeeded = async (url: string) => {
        if (url.startsWith("blob:") || url.startsWith("data:")) {
          const response = await fetch(url);
          const blob = await response.blob();
          const file = new File([blob], "image.jpg", { type: blob.type });
          const uploaded = await uploadToCloudinary(file, "TCETBI/Events");
          URL.revokeObjectURL(url);
          return uploaded;
        }
        return url;
      };

      const payloadEvents: Event[] = await Promise.all(
        toKeep.map(async (p) => ({
          id: p.id && p.id !== -1 ? p.id : undefined,
          title: p.title,
          description: p.description,
          duration: p.duration,
          status: p.status,
          startDate: p.startDate,
          endDate: p.endDate,
          image: await uploadIfNeeded(p.image),
          link: p.link,
        }))
      );

      const res = await updateEventsData(payloadEvents);

      // Delete marked ones on backend
      for (const item of toDelete) {
        if (item.id && item.id !== -1) {
          await deleteEvent(item.id);
        }
      }

      // Refresh list from backend
      const refreshed = await fetchEvents();
      setEvents(
        refreshed.map((p) => ({
          ...p,
          userStatusOverride: false,
          userDurationOverride: false,
        }))
      );

      toast.success("✅ Events updated successfully!");
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to update events!");
    } finally {
      setSaving(false);
    }
  };

  // ------- Visible list (search + filter, but still keep original index) -------

  const visibleEvents = events
    .map((event, index) => ({ event, index }))
    .filter(({ event }) => !event.markedForDeletion)
    .filter(({ event }) => {
      const matchStatus =
        selectedFilter === "all" || event.status === selectedFilter;
      const q = searchQuery.toLowerCase();
      const matchSearch =
        event.title.toLowerCase().includes(q) ||
        event.description.toLowerCase().includes(q);
      return matchStatus && matchSearch;
    });

  // ------- Render -------

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress color="error" />
      </Box>
    );
  }

  return (
    <Box sx={{ pb: 10 }}>
      {/* Sticky Header */}
      <Paper
        elevation={4}
        sx={{
          position: "sticky",
          top: 64,
          zIndex: 100,
          p: 2.5,
          mb: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "hsl(var(--card))",
          borderBottom: "2px solid hsl(var(--primary))",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 600, color: "hsl(var(--foreground))" }}>
          Events Management
        </Typography>
        <DarkButton 
          onClick={handleSave} 
          disabled={saving} 
          startIcon={<Save size={18} />}
          sx={{
            px: 3,
            py: 1.2,
            fontSize: "0.95rem",
            boxShadow: 3,
            "&:hover": {
              boxShadow: 5,
            },
          }}
        >
          {saving ? "Saving..." : "Save Changes"}
        </DarkButton>
      </Paper>

      <Box sx={{ px: 2 }}>
        {/* Search */}
        <TextField
          fullWidth
          size="small"
          placeholder="Search events..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ ...textFieldStyles, mb: 2 }}
        />

        {/* Status filter buttons */}
        <Box sx={{ display: "flex", gap: 2, mb: 2, flexWrap: "wrap" }}>
        {["all", "live", "upcoming", "ended"].map((type) => (
          <Button
            key={type}
            variant={selectedFilter === type ? "contained" : "outlined"}
            onClick={() => setSelectedFilter(type as "all" | Status)}
            sx={{
              textTransform: "none",
              fontWeight: 600,
              borderRadius: 2,
              ...(selectedFilter !== type && {
                color: "hsl(0 84.2% 60.2%)",
                borderColor: "hsl(0 84.2% 60.2%)",
                "&:hover": {
                  color: "hsl(0 84.2% 50.2%)",
                  borderColor: "hsl(0 84.2% 50.2%)",
                },
              }),
              ...(selectedFilter === type && {
                backgroundColor: "hsl(0 84.2% 60.2%)",
                color: "white",
                borderColor: "hsl(0 84.2% 60.2%)",
                "&:hover": {
                  backgroundColor: "hsl(0 84.2% 50.2%)",
                },
              }),
            }}
          >
            {type.toUpperCase()}
          </Button>
        ))}
        </Box>

        {/* Cards */}
        {visibleEvents.map(({ event, index }) => (
          <Box
            key={event.id ?? index}
            sx={{
              p: 2,
              mb: 2,
              border: "1px solid hsl(var(--border))",
              borderRadius: "12px",
              position: "relative",
              maxWidth: 650,
              mx: "auto",
              backgroundColor: "hsl(var(--card))",
              boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
          }}
        >
          {/* Delete icon */}
          <IconButton
            onClick={() => openDeleteModal(event.id)}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              color: "hsl(0 84.2% 60.2%)",
            }}
          >
            <Trash2 size={20} />
          </IconButton>

            <TextField
              fullWidth
              size="small"
              label="Title"
              value={event.title}
              onChange={(e) => handleChange(index, "title", e.target.value)}
              sx={{ ...textFieldStyles, ...compactFieldSpacing }}
            />

          {/* Description */}
          <TextField
            fullWidth
            multiline
            minRows={3}
            maxRows={10}
            label="Description"
            value={event.description}
            onPaste={(e) => {
              e.preventDefault();
              const text = e.clipboardData.getData("text/plain");

              const target = e.target as HTMLTextAreaElement;
              const start = target.selectionStart || 0;
              const end = target.selectionEnd || 0;

              const newValue =
                target.value.substring(0, start) +
                text +
                target.value.substring(end);

              handleChange(index, "description", newValue);
            }}
            onChange={(e) => handleChange(index, "description", e.target.value)}
            sx={{
              ...textFieldStyles,
              mb: 2,
              "& .MuiOutlinedInput-root": {
                padding: "0 !important",
                alignItems: "stretch !important",
              },
              "& textarea": {
                padding: "12px 14px !important",
                lineHeight: "1.5 !important",
                resize: "vertical",
              },
            }}
          />

          {/* Duration + Status */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 2,
              mb: 1.5,
            }}
          >
              <TextField
                fullWidth
                size="small"
                label="Duration"
                value={event.duration}
                onChange={(e) => {
                  handleChange(index, "duration", e.target.value);
                  handleChange(index, "userDurationOverride", true);
                }}
                sx={textFieldStyles}
              />

              {/* Status (auto but editable) */}
              <TextField
                select
                fullWidth
                size="small"
                label="Status"
                value={event.status || "upcoming"}
                onChange={(e) => {
                  const newStatus = e.target.value as Status;
                  handleChange(index, "status", newStatus);
                  handleChange(index, "userStatusOverride", true);
                }}
                sx={textFieldStyles}
              >
              <MenuItem value="live">Live</MenuItem>
              <MenuItem value="upcoming">Upcoming</MenuItem>
              <MenuItem value="ended">Ended</MenuItem>
              </TextField>
            </Box>

            <TextField
              fullWidth
              size="small"
              label="Event Link (Optional)"
              value={event.link || ""}
              onChange={(e) => handleChange(index, "link", e.target.value)}
              sx={{ ...textFieldStyles, ...compactFieldSpacing }}
              placeholder="https://example.com/event-details"
            />

          {/* Dates */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 2,
              mb: 1.5,
            }}
          >
            <TextField
              fullWidth
              type="date"
              label="Start Date"
              InputLabelProps={{
                shrink: true,
                style: { color: "hsl(var(--muted-foreground))" },
              }}
              value={event.startDate}
              onChange={(e) => {
                const value = e.target.value;
                handleChange(index, "startDate", value);

                // auto duration if not overridden
                if (!events[index].userDurationOverride) {
                  const autoDuration = computeDurationLabel(
                    value,
                    events[index].endDate
                  );
                  handleChange(index, "duration", autoDuration);
                }

                // auto status if not overridden
                if (!events[index].userStatusOverride) {
                  const autoStatus = computeStatusFromDates(
                    value,
                    events[index].endDate
                  );
                  handleChange(index, "status", autoStatus);
                }
              }}
              sx={{
                ...textFieldStyles,
                "& .MuiOutlinedInput-root": {
                  padding: "0 14px !important",
                  minHeight: "48px",
                  alignItems: "center !important",
                },
              }}
            />

            <TextField
              fullWidth
              type="date"
              label="End Date"
              InputLabelProps={{
                shrink: true,
                style: { color: "hsl(var(--muted-foreground))" },
              }}
              value={event.endDate}
              onChange={(e) => {
                const value = e.target.value;
                handleChange(index, "endDate", value);

                if (!events[index].userDurationOverride) {
                  const autoDuration = computeDurationLabel(
                    events[index].startDate,
                    value
                  );
                  handleChange(index, "duration", autoDuration);
                }

                if (!events[index].userStatusOverride) {
                  const autoStatus = computeStatusFromDates(
                    events[index].startDate,
                    value
                  );
                  handleChange(index, "status", autoStatus);
                }
              }}
              sx={{
                ...textFieldStyles,
                "& .MuiOutlinedInput-root": {
                  padding: "0 14px !important",
                  minHeight: "48px",
                  alignItems: "center !important",
                },
              }}
            />
          </Box>

          {/* Image Preview */}
          {event.image && (
            <Box
              sx={{
                mb: 1.5,
                width: "100%",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <img
                src={event.image}
                alt="preview"
                style={{
                  width: "100%",
                  height: 200,
                  objectFit: "cover",
                  borderRadius: "8px",
                }}
              />
            </Box>
          )}

          {/* Upload button */}
          <input
            accept="image/*"
            id={`img-${index}`}
            type="file"
            style={{ display: "none" }}
            onChange={(e) => handleImageUpload(e, index)}
          />
          <label htmlFor={`img-${index}`}>
              <Button
                component="span"
                variant="outlined"
                fullWidth
                size="small"
                startIcon={<Upload size={14} />}
                sx={uploadButtonStyles}
              >
                Upload Image
              </Button>
            </label>
          </Box>
        ))}
      </Box>

      {/* Floating Add Button */}
      <Fab
        color="primary"
        sx={{
          position: "fixed",
          bottom: 24,
          right: 24,
          backgroundColor: "hsl(0 84.2% 60.2%)",
          "&:hover": { backgroundColor: "hsl(0 84.2% 50.2%)" },
        }}
        onClick={addEvent}
      >
        <Plus />
      </Fab>

      {/* Resize Modal */}
      <ResizeModal
        open={resizeModal.open}
        image={resizeModal.image}
        onClose={() => setResizeModal({ open: false, index: null, image: "" })}
        onSave={handleCropped}
      />

      {/* Delete Modal */}
      <ConfirmModal
        open={deleteModal.open}
        title="Delete Event"
        message="Are you sure you want to delete this event?"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteModal({ open: false, id: null })}
      />

      {/* Validation Modal */}
      <Dialog open={validationModal} onClose={() => setValidationModal(false)}>
        <DialogTitle sx={{ fontWeight: 600, color: "red" }}>
          Missing Fields
        </DialogTitle>
        <DialogContent>
          <Typography>
            Please fill all required fields (Title, Description, Dates,
            Duration, Status) before saving.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setValidationModal(false)}
            sx={{
              color: "white",
              backgroundColor: "red",
              "&:hover": { backgroundColor: "darkred" },
            }}
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>


    </Box>
  );
};
