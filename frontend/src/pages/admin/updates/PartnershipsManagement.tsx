import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
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
  fetchPartnerships,
  updatePartnershipsData,
  deletePartnership,
  Partnership,
} from "@/api/partnershipService";
import { uploadToCloudinary } from "@/utils/uploadToCloudinary";

interface PartnershipWithMeta extends Partnership {
  markedForDeletion?: boolean;
}

export const PartnershipsManagement: React.FC = () => {
  const [partnerships, setPartnerships] = useState<PartnershipWithMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
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
  };

  const uploadButtonStyles = {
    backgroundColor: "hsl(0 84.2% 60.2%)",
    color: "white",
    "&:hover": { backgroundColor: "hsl(0 84.2% 50.2%)" },
  };

  useEffect(() => {
    fetchPartnerships()
      .then((res) => setPartnerships(res))
      .catch(() => console.error("Failed to load partnerships"))
      .finally(() => setLoading(false));
  }, []);

  const addPartnership = () => {
    setPartnerships((prev) => [
      ...prev,
      {
        id: -1,
        name: "",
        description: "",
        logo: "",
        website: "",
      },
    ]);
  };

  const handleChange = (
    index: number,
    field: keyof PartnershipWithMeta,
    value: any
  ) => {
    setPartnerships((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

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
    handleChange(resizeModal.index, "logo", url);
    setResizeModal({ open: false, index: null, image: "" });
  };

  const openDeleteModal = (id: number | undefined) =>
    setDeleteModal({ open: true, id: id ?? null });

  const handleDeleteConfirm = () => {
    if (deleteModal.id == null) return;
    setPartnerships((prev) =>
      prev.map((p) =>
        p.id === deleteModal.id ? { ...p, markedForDeletion: true } : p
      )
    );
    setDeleteModal({ open: false, id: null });
  };

  const validate = (p: PartnershipWithMeta) =>
    p.name.trim() && p.description.trim() && p.logo;

  const handleSave = async () => {
    const toKeep = partnerships.filter((p) => !p.markedForDeletion);
    const toDelete = partnerships.filter((p) => p.markedForDeletion);

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
          const file = new File([blob], "logo.png", { type: blob.type });
          const uploaded = await uploadToCloudinary(file, "TCETBI/Partnerships");
          URL.revokeObjectURL(url);
          return uploaded;
        }
        return url;
      };

      const payloadPartnerships: Partnership[] = await Promise.all(
        toKeep.map(async (p) => ({
          id: p.id && p.id !== -1 ? p.id : undefined,
          name: p.name,
          description: p.description,
          logo: await uploadIfNeeded(p.logo),
          website: p.website,
        }))
      );

      const res = await updatePartnershipsData(payloadPartnerships);

      for (const item of toDelete) {
        if (item.id && item.id !== -1) {
          await deletePartnership(item.id);
        }
      }

      const refreshed = await fetchPartnerships();
      setPartnerships(refreshed);

      setMessageText(res.message || "Partnerships updated successfully!");
      setMessageType("success");
    } catch (err) {
      console.error(err);
      setMessageText("❌ Failed to update partnerships!");
      setMessageType("error");
    } finally {
      setSaving(false);
      setMessageOpen(true);
    }
  };

  const visiblePartnerships = partnerships
    .map((p, index) => ({ p, index }))
    .filter(({ p }) => !p.markedForDeletion)
    .filter(({ p }) => {
      const q = searchQuery.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    });

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
        Partnerships Management
      </Typography>

      <TextField
        fullWidth
        placeholder="Search partnerships..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{ ...textFieldStyles, mb: 3 }}
      />

      {visiblePartnerships.map(({ p, index }) => (
        <Box
          key={p.id ?? index}
          sx={{
            p: 3,
            mb: 3,
            border: "1px solid hsl(var(--border))",
            borderRadius: "var(--radius)",
            position: "relative",
            maxWidth: 800,
            mx: "auto",
            backgroundColor: "hsl(var(--card))",
          }}
        >
          <IconButton
            onClick={() => openDeleteModal(p.id)}
            sx={{
              position: "absolute",
              top: 10,
              right: 10,
              color: "hsl(0 84.2% 60.2%)",
            }}
          >
            <Trash2 size={20} />
          </IconButton>

          <TextField
            fullWidth
            label="Company Name"
            value={p.name}
            onChange={(e) => handleChange(index, "name", e.target.value)}
            sx={{ ...textFieldStyles, mb: 2 }}
          />

          <TextField
            fullWidth
            label="Website URL"
            value={p.website || ""}
            onChange={(e) => handleChange(index, "website", e.target.value)}
            sx={{ ...textFieldStyles, mb: 2 }}
          />

          <TextField
            fullWidth
            multiline
            minRows={3}
            label="Description"
            value={p.description}
            onChange={(e) => handleChange(index, "description", e.target.value)}
            sx={{ ...textFieldStyles, mb: 2 }}
          />

          <Box sx={{ display: "flex", alignItems: "center", gap: 3, mt: 1 }}>
            {p.logo && (
              <Box
                sx={{
                  width: 120,
                  height: 120,
                  border: "1px solid hsl(var(--border))",
                  borderRadius: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  p: 1,
                  backgroundColor: "white",
                }}
              >
                <img
                  src={p.logo}
                  alt="preview"
                  style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
                />
              </Box>
            )}

            <Box>
              <input
                accept="image/*"
                id={`logo-${index}`}
                type="file"
                style={{ display: "none" }}
                onChange={(e) => handleImageUpload(e, index)}
              />
              <label htmlFor={`logo-${index}`}>
                <Button
                  component="span"
                  variant="outlined"
                  startIcon={<Upload size={16} />}
                  sx={uploadButtonStyles}
                >
                  {p.logo ? "Change Logo" : "Upload Logo"}
                </Button>
              </label>
            </Box>
          </Box>
        </Box>
      ))}

      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4, mb: 8 }}>
        <Button
          startIcon={<Plus />}
          onClick={addPartnership}
          sx={uploadButtonStyles}
        >
          Add Partnership
        </Button>

        <DarkButton
          onClick={handleSave}
          disabled={saving}
          sx={{
            px: 4,
            backgroundColor: "hsl(0 84.2% 60.2%)",
            "&:hover": { backgroundColor: "hsl(0 84.2% 50.2%)" },
          }}
        >
          {saving ? "Saving..." : "Save All Changes"}
        </DarkButton>
      </Box>

      <ResizeModal
        open={resizeModal.open}
        image={resizeModal.image}
        onClose={() => setResizeModal({ open: false, index: null, image: "" })}
        onSave={handleCropped}
      />

      <ConfirmModal
        open={deleteModal.open}
        title="Delete Partnership"
        message="Are you sure you want to delete this partnership?"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteModal({ open: false, id: null })}
      />

      <Dialog open={validationModal} onClose={() => setValidationModal(false)}>
        <DialogTitle sx={{ color: "red" }}>Missing Fields</DialogTitle>
        <DialogContent>
          <Typography>
            Please fill Name, Description, and provide a Logo for all partnerships.
          </Typography>
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
