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
} from "@mui/material";
import { Upload, Plus, Trash2 } from "lucide-react";
import { DarkButton } from "@/components/ui/DarkButton";
import { MessageModal } from "@/components/ui/MessageModal";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { ResizeModal } from "@/components/ResizeModal";
import {
  fetchPrograms,
  updateProgramsData,
  deleteProgram,
  Program,
} from "@/api/programService";
import { uploadToCloudinary } from "@/utils/uploadToCloudinary";

// ------- Types with local meta -------
type Status = "live" | "upcoming" | "ended";

interface ProgramWithMeta extends Program {
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

export const ProgramPage: React.FC = () => {
  const [programs, setPrograms] = useState<ProgramWithMeta[]>([]);
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

  const [messageOpen, setMessageOpen] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "info">(
    "info"
  );

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
    fetchPrograms()
      .then((res) =>
        setPrograms(
          res.map((p) => ({
            ...p,
            // Backend values can be auto-calculated unless user overrides
            userStatusOverride: false,
            userDurationOverride: false,
          }))
        )
      )
      .catch(() => console.error("Failed to load programs"))
      .finally(() => setLoading(false));
  }, []);

  // ------- Add Program -------

  const addProgram = () => {
    setSelectedFilter("all"); // always show new card
    setPrograms((prev) => [
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
        userStatusOverride: false,
        userDurationOverride: false,
      },
    ]);
  };

  // ------- Generic change helper (by index in main array) -------

  const handleChange = (
    index: number,
    field: keyof ProgramWithMeta,
    value: any
  ) => {
    setPrograms((prev) => {
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

    setPrograms((prev) => {
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

    setPrograms((prev) =>
      prev.map((p) =>
        p.id === deleteModal.id ? { ...p, markedForDeletion: true } : p
      )
    );
    setDeleteModal({ open: false, id: null });
  };

  // ------- Validation -------

  const validate = (p: ProgramWithMeta) =>
    p.title.trim() &&
    p.description.trim() &&
    p.status &&
    p.duration.trim() &&
    p.startDate &&
    p.endDate;

  // ------- Save all (update + upload + delete) -------

  const handleSave = async () => {
    const toKeep = programs.filter((p) => !p.markedForDeletion);
    const toDelete = programs.filter((p) => p.markedForDeletion);

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
          const uploaded = await uploadToCloudinary(file, "TCETBI/Programs");
          URL.revokeObjectURL(url);
          return uploaded;
        }
        return url;
      };

      const payloadPrograms: Program[] = await Promise.all(
        toKeep.map(async (p) => ({
          id: p.id && p.id !== -1 ? p.id : undefined,
          title: p.title,
          description: p.description,
          duration: p.duration,
          status: p.status,
          startDate: p.startDate,
          endDate: p.endDate,
          image: await uploadIfNeeded(p.image),
        }))
      );

      const res = await updateProgramsData(payloadPrograms);

      // Delete marked ones on backend
      for (const item of toDelete) {
        if (item.id && item.id !== -1) {
          await deleteProgram(item.id);
        }
      }

      // Refresh list from backend
      const refreshed = await fetchPrograms();
      setPrograms(
        refreshed.map((p) => ({
          ...p,
          userStatusOverride: false,
          userDurationOverride: false,
        }))
      );

      setMessageText(res.message || "Updated successfully!");
      setMessageType("success");
    } catch (err) {
      console.error(err);
      setMessageText("❌ Failed to update programs!");
      setMessageType("error");
    } finally {
      setSaving(false);
      setMessageOpen(true);
    }
  };

  // ------- Visible list (search + filter, but still keep original index) -------

  const visiblePrograms = programs
    .map((program, index) => ({ program, index }))
    .filter(({ program }) => !program.markedForDeletion)
    .filter(({ program }) => {
      const matchStatus =
        selectedFilter === "all" || program.status === selectedFilter;
      const q = searchQuery.toLowerCase();
      const matchSearch =
        program.title.toLowerCase().includes(q) ||
        program.description.toLowerCase().includes(q);
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
    <Box sx={{ mt: 4, px: 2 }}>
      <Typography
        variant="h5"
        sx={{
          fontFamily: "Poppins",
          fontWeight: 600,
          color: "hsl(var(--foreground))",
          mb: 3,
        }}
      >
        Programs
      </Typography>

      {/* Search */}
      <TextField
        fullWidth
        placeholder="Search programs..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{ ...textFieldStyles, mb: 3 }}
      />

      {/* Status filter buttons */}
      <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
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
      {visiblePrograms.map(({ program, index }) => (
        <Box
          key={program.id ?? index}
          sx={{
            p: 3,
            mb: 3,
            border: "1px solid hsl(var(--border))",
            borderRadius: "var(--radius)",
            position: "relative",
            maxWidth: 650,
            mx: "auto",
            backgroundColor: "hsl(var(--card))",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          }}
        >
          {/* Delete icon */}
          <IconButton
            onClick={() => openDeleteModal(program.id)}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              color: "hsl(0 84.2% 60.2%)",
            }}
          >
            <Trash2 size={20} />
          </IconButton>

          {/* Title */}
          <TextField
            fullWidth
            label="Title"
            value={program.title}
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
            value={program.description}
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
            {/* Duration (auto but editable) */}
            <TextField
              fullWidth
              label="Duration"
              value={program.duration}
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
              label="Status"
              value={program.status || "upcoming"}
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
              value={program.startDate}
              onChange={(e) => {
                const value = e.target.value;
                handleChange(index, "startDate", value);

                // auto duration if not overridden
                if (!programs[index].userDurationOverride) {
                  const autoDuration = computeDurationLabel(
                    value,
                    programs[index].endDate
                  );
                  handleChange(index, "duration", autoDuration);
                }

                // auto status if not overridden
                if (!programs[index].userStatusOverride) {
                  const autoStatus = computeStatusFromDates(
                    value,
                    programs[index].endDate
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
              value={program.endDate}
              onChange={(e) => {
                const value = e.target.value;
                handleChange(index, "endDate", value);

                if (!programs[index].userDurationOverride) {
                  const autoDuration = computeDurationLabel(
                    programs[index].startDate,
                    value
                  );
                  handleChange(index, "duration", autoDuration);
                }

                if (!programs[index].userStatusOverride) {
                  const autoStatus = computeStatusFromDates(
                    programs[index].startDate,
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
          {program.image && (
            <Box
              sx={{
                mb: 1.5,
                width: "100%",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <img
                src={program.image}
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
              startIcon={<Upload size={16} />}
              sx={uploadButtonStyles}
            >
              Upload Program Image
            </Button>
          </label>
        </Box>
      ))}

      {/* Add program */}
      <Button startIcon={<Plus />} onClick={addProgram} sx={uploadButtonStyles}>
        Add Program
      </Button>

      {/* Save changes */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4 }}>
        <DarkButton
          onClick={handleSave}
          disabled={saving}
          sx={{
            px: 4,
            py: 1.5,
            backgroundColor: "hsl(0 84.2% 60.2%)",
            color: "white",
            "&:hover": { backgroundColor: "hsl(0 84.2% 50.2%)" },
            "&.Mui-disabled": {
              backgroundColor: "hsl(0 84.2% 60.2% / 0.5)",
              color: "white",
            },
          }}
        >
          {saving ? "Saving..." : "Save Changes"}
        </DarkButton>
      </Box>

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
        title="Delete Program"
        message="Are you sure you want to delete this program?"
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

      {/* Message Modal */}
      <MessageModal
        open={messageOpen}
        message={messageText}
        type={messageType}
        onClose={() => setMessageOpen(false)}
      />
    </Box>
  );
};
