import { useState } from "react";
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
import { Upload, ArrowLeft, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { DarkButton } from "@/components/ui/DarkButton";
import { MessageModal } from "@/components/ui/MessageModal";
import { ResizeModal } from "@/components/ResizeModal";
import { updateEventsData, Event } from "@/api/eventService";
import { uploadToCloudinary } from "@/utils/uploadToCloudinary";

// Compute status from start/end dates
const computeStatusFromDates = (start?: string, end?: string): "live" | "upcoming" | "ended" => {
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

export const CreateEvent: React.FC = () => {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [eventData, setEventData] = useState<Event>({
    title: "",
    description: "",
    image: "",
    duration: "",
    status: "upcoming",
    startDate: "",
    endDate: "",
    link: "",
  });

  const [resizeModal, setResizeModal] = useState<{
    open: boolean;
    image: string;
  }>({ open: false, image: "" });

  const [messageOpen, setMessageOpen] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "info">(
    "info"
  );

  const [validationModal, setValidationModal] = useState(false);

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
    "& .MuiInputLabel-root": {
      color: "hsl(var(--muted-foreground))",
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: "hsl(0 84.2% 60.2%)",
    },
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
  } as const;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setResizeModal({
        open: true,
        image: reader.result as string,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleCropped = async (croppedFile: File) => {
    const url = URL.createObjectURL(croppedFile);
    setEventData(prev => ({ ...prev, image: url }));
    setResizeModal({ open: false, image: "" });
  };

  const validate = () => 
    eventData.title.trim() &&
    eventData.description.trim() &&
    eventData.startDate &&
    eventData.endDate &&
    eventData.image;

  const handleSave = async () => {
    if (!validate()) {
      setValidationModal(true);
      return;
    }

    try {
      setSaving(true);
      
      let finalImageUrl = eventData.image;
      if (finalImageUrl.startsWith("blob:") || finalImageUrl.startsWith("data:")) {
        const response = await fetch(finalImageUrl);
        const blob = await response.blob();
        const file = new File([blob], "event.jpg", { type: blob.type });
        finalImageUrl = await uploadToCloudinary(file, "TCETBI/Events");
      }

      const payload: Event[] = [{
        ...eventData,
        image: finalImageUrl
      }];

      await updateEventsData(payload);
      
      setMessageText("Event created successfully!");
      setMessageType("success");
      setMessageOpen(true);
      
      // Navigate back after short delay
      setTimeout(() => {
        navigate("/admin/update-content");
      }, 1500);

    } catch (err) {
      console.error(err);
      setMessageText("Failed to create event!");
      setMessageType("error");
      setMessageOpen(true);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "hsl(var(--background))", pt: 12, px: 4 }}>
      <Box sx={{ maxWidth: "800px", mx: "auto" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4 }}>
          <IconButton onClick={() => navigate(-1)} sx={{ color: "hsl(var(--foreground))" }}>
            <ArrowLeft size={24} />
          </IconButton>
          <Typography variant="h4" sx={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, color: "hsl(var(--foreground))" }}>
            Create New Event
          </Typography>
        </Box>

        <Box sx={{ backgroundColor: "hsl(var(--card))", p: 4, borderRadius: "var(--radius)", border: "1px solid hsl(var(--border))" }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <TextField
              fullWidth
              label="Event Title"
              value={eventData.title}
              onChange={(e) => setEventData(prev => ({ ...prev, title: e.target.value }))}
              sx={textFieldStyles}
            />

            <TextField
              fullWidth
              multiline
              rows={4}
              label="Description"
              value={eventData.description}
              onChange={(e) => setEventData(prev => ({ ...prev, description: e.target.value }))}
              sx={textFieldStyles}
            />

            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 3 }}>
              <TextField
                type="date"
                label="Start Date"
                InputLabelProps={{ shrink: true }}
                value={eventData.startDate}
                onChange={(e) => {
                  const val = e.target.value;
                  setEventData(prev => ({
                    ...prev,
                    startDate: val,
                    duration: computeDurationLabel(val, prev.endDate),
                    status: computeStatusFromDates(val, prev.endDate)
                  }));
                }}
                sx={textFieldStyles}
              />
              <TextField
                type="date"
                label="End Date"
                InputLabelProps={{ shrink: true }}
                value={eventData.endDate}
                onChange={(e) => {
                  const val = e.target.value;
                  setEventData(prev => ({
                    ...prev,
                    endDate: val,
                    duration: computeDurationLabel(prev.startDate, val),
                    status: computeStatusFromDates(prev.startDate, val)
                  }));
                }}
                sx={textFieldStyles}
              />
            </Box>

            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 3 }}>
              <TextField
                label="Duration"
                value={eventData.duration}
                onChange={(e) => setEventData(prev => ({ ...prev, duration: e.target.value }))}
                sx={textFieldStyles}
              />
              <TextField
                select
                label="Status"
                value={eventData.status}
                onChange={(e) => setEventData(prev => ({ ...prev, status: e.target.value as any }))}
                sx={textFieldStyles}
              >
                <MenuItem value="upcoming">Upcoming</MenuItem>
                <MenuItem value="live">Live</MenuItem>
                <MenuItem value="ended">Ended</MenuItem>
              </TextField>
            </Box>

            <TextField
              fullWidth
              label="Event Link (Optional)"
              value={eventData.link}
              onChange={(e) => setEventData(prev => ({ ...prev, link: e.target.value }))}
              placeholder="https://example.com/event-details"
              sx={textFieldStyles}
              helperText="Link for users to register or see more details"
            />

            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1, color: "hsl(var(--muted-foreground))" }}>
                Event Banner Image
              </Typography>
              {eventData.image ? (
                <Box sx={{ mb: 2, position: "relative" }}>
                   <img src={eventData.image} alt="Preview" style={{ width: "100%", height: 300, objectFit: "cover", borderRadius: "8px" }} />
                   <Button
                    variant="contained"
                    component="label"
                    startIcon={<Upload size={16} />}
                    sx={{ position: "absolute", bottom: 16, right: 16, backgroundColor: "hsl(0 84.2% 60.2%)", "&:hover": { backgroundColor: "hsl(0 84.2% 50.2%)" } }}
                   >
                    Change Image
                    <input type="file" hidden accept="image/*" onChange={handleImageUpload} />
                   </Button>
                </Box>
              ) : (
                <Box
                  sx={{
                    width: "100%",
                    height: 200,
                    border: "2px dashed hsl(var(--border))",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    "&:hover": { borderColor: "hsl(0 84.2% 60.2%)" }
                  }}
                  component="label"
                >
                  <input type="file" hidden accept="image/*" onChange={handleImageUpload} />
                  <Box sx={{ textAlign: "center" }}>
                    <Upload size={40} className="mx-auto mb-2 text-muted-foreground" />
                    <Typography color="textSecondary">Click to upload event image</Typography>
                  </Box>
                </Box>
              )}
            </Box>

            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
              <DarkButton
                onClick={handleSave}
                disabled={saving}
                sx={{
                  px: 6,
                  backgroundColor: "hsl(0 84.2% 60.2%)",
                  color: "white",
                  "&:hover": { backgroundColor: "hsl(0 84.2% 50.2%)" }
                }}
              >
                {saving ? (
                  <>
                    <Loader2 size={20} className="animate-spin mr-2" />
                    Creating...
                  </>
                ) : "Create Event"}
              </DarkButton>
            </Box>
          </Box>
        </Box>
      </Box>

      <ResizeModal
        open={resizeModal.open}
        image={resizeModal.image}
        onClose={() => setResizeModal({ open: false, image: "" })}
        onSave={handleCropped}
      />

      <Dialog open={validationModal} onClose={() => setValidationModal(false)}>
        <DialogTitle sx={{ color: "red" }}>Missing Information</DialogTitle>
        <DialogContent>
          <Typography>Please fill in all fields and upload an image before creating the event.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setValidationModal(false)}>OK</Button>
        </DialogActions>
      </Dialog>

      <MessageModal
        open={messageOpen}
        message={messageText}
        type={messageType}
        onClose={() => setMessageOpen(false)}
      />
    </Box>
  );
};
