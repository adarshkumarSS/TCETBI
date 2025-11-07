import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Box,
} from "@mui/material";
import { Upload, ImagePlus } from "lucide-react";
import { useState } from "react";
import { ResizeModal } from "@/components/ResizeModal";
import { removeImageBackground } from "@/utils/removeBackground";

interface AddContentModalProps {
  open: boolean;
  type: "achievement" | "logo" | "successStory" | null;
  onClose: () => void;
  onSave: (data: any) => void;
}

export const AddContentModal: React.FC<AddContentModalProps> = ({
  open,
  type,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<any>({});
  const [preview, setPreview] = useState<string | null>(null);
  const [resizeOpen, setResizeOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
    setResizeOpen(true);
  };

  const handleCroppedSave = async (cropped: File) => {
    setResizeOpen(false);
    let imgURL = URL.createObjectURL(cropped);

    // ✅ Only remove background for logos
    if (type === "logo") {
      try {
        const bgRemoved = await removeImageBackground(cropped);
        if (bgRemoved) imgURL = bgRemoved;
      } catch (e) {
        console.warn("Background removal failed, using cropped version");
      }
    }

    setPreview(imgURL);
  };

  const handleChange = (field: string, value: string) =>
    setFormData({ ...formData, [field]: value });

  const handleSave = () => {
    const newEntry = {
      ...formData,
      src: preview || "",
      image: preview || "",
    };
    onSave(newEntry);
    onClose();
    setFormData({});
    setPreview(null);
  };

  const textFieldStyles = {
    "& .MuiInputBase-input": {
      color: "hsl(var(--foreground))",
    },
    "& .MuiInputLabel-root": {
      color: "hsl(var(--muted-foreground))",
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: "hsl(0 84.2% 60.2%)",
    },
    "& .MuiOutlinedInput-root": {
      "& fieldset": { borderColor: "hsl(var(--border))" },
      "&:hover fieldset": { borderColor: "hsl(0 84.2% 60.2%)" },
      "&.Mui-focused fieldset": { borderColor: "hsl(0 84.2% 60.2%)" },
    },
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            backgroundColor: "hsl(var(--card))",
            color: "hsl(var(--foreground))",
            borderRadius: "16px",
            border: "1px solid hsl(var(--border))",
          },
        }}
      >
        <DialogTitle
          sx={{
            fontFamily: "Poppins",
            fontWeight: 600,
            color: "white",
            backgroundColor: "hsl(0 84.2% 60.2%)",
            mb: 1,
          }}
        >
          Add New{" "}
          {type === "logo"
            ? "Logo"
            : type === "achievement"
            ? "Achievement"
            : "Success Story"}
        </DialogTitle>

        <DialogContent dividers>
          {/* LOGO FORM */}
          {type === "logo" && (
            <>
              <TextField
                fullWidth
                select
                label="Category"
                sx={{ mb: 2, ...textFieldStyles }}
                value={formData.category || ""}
                onChange={(e) => handleChange("category", e.target.value)}
              >
                <MenuItem value="govt">Government of India</MenuItem>
                <MenuItem value="state">Government of Tamil Nadu</MenuItem>
              </TextField>

              <TextField
                fullWidth
                label="Logo Name"
                sx={{ mb: 2, ...textFieldStyles }}
                value={formData.name || ""}
                onChange={(e) => handleChange("name", e.target.value)}
              />

              {preview && (
                <Box sx={{ textAlign: "center", mb: 2 }}>
                  <img
                    src={preview}
                    alt="Preview"
                    style={{
                      width: 140,
                      height: 140,
                      objectFit: "contain",
                      borderRadius: "10px",
                    }}
                  />
                </Box>
              )}

              <Button
                variant="outlined"
                component="label"
                startIcon={<Upload size={18} />}
                fullWidth
                sx={{
                  borderColor: "hsl(0 84.2% 60.2%)",
                  color: "hsl(0 84.2% 60.2%)",
                  "&:hover": { backgroundColor: "hsl(0 84.2% 60.2% / 0.1)" },
                }}
              >
                Upload Logo
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleFileChange}
                />
              </Button>
            </>
          )}

          {/* ACHIEVEMENT FORM */}
          {type === "achievement" && (
            <>
              <TextField
                fullWidth
                label="Number"
                type="number"
                sx={{ mb: 2, ...textFieldStyles }}
                value={formData.number || ""}
                onChange={(e) => handleChange("number", e.target.value)}
              />
              <TextField
                fullWidth
                label="Suffix"
                sx={{ mb: 2, ...textFieldStyles }}
                value={formData.suffix || ""}
                onChange={(e) => handleChange("suffix", e.target.value)}
              />
              <TextField
                fullWidth
                label="Label"
                sx={textFieldStyles}
                value={formData.label || ""}
                onChange={(e) => handleChange("label", e.target.value)}
              />
            </>
          )}

          {/* SUCCESS STORY FORM */}
          {type === "successStory" && (
            <>
              <TextField
                fullWidth
                label="Title"
                sx={{ mb: 2, ...textFieldStyles }}
                value={formData.title || ""}
                onChange={(e) => handleChange("title", e.target.value)}
              />
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Description"
                sx={{ mb: 2, ...textFieldStyles }}
                value={formData.description || ""}
                onChange={(e) => handleChange("description", e.target.value)}
              />
              <TextField
                fullWidth
                label="Sector"
                sx={{ mb: 2, ...textFieldStyles }}
                value={formData.sector || ""}
                onChange={(e) => handleChange("sector", e.target.value)}
              />
              <TextField
                fullWidth
                label="Impact"
                sx={{ mb: 2, ...textFieldStyles }}
                value={formData.impact || ""}
                onChange={(e) => handleChange("impact", e.target.value)}
              />

              {preview && (
                <Box sx={{ textAlign: "center", mb: 2 }}>
                  <img
                    src={preview}
                    alt="Preview"
                    style={{
                      width: "100%",
                      height: 200,
                      borderRadius: "8px",
                      objectFit: "cover",
                    }}
                  />
                </Box>
              )}

              <Button
                variant="outlined"
                component="label"
                startIcon={<ImagePlus size={18} />}
                fullWidth
                sx={{
                  borderColor: "hsl(0 84.2% 60.2%)",
                  color: "hsl(0 84.2% 60.2%)",
                  "&:hover": { backgroundColor: "hsl(0 84.2% 60.2% / 0.1)" },
                }}
              >
                Upload Story Image
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleFileChange}
                />
              </Button>
            </>
          )}
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={onClose}
            sx={{
              color: "hsl(var(--foreground))",
              "&:hover": { backgroundColor: "hsl(var(--muted))" },
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            sx={{
              backgroundColor: "hsl(0 84.2% 60.2%)",
              "&:hover": { backgroundColor: "hsl(0 84.2% 50.2%)" },
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Cropping Modal */}
      <ResizeModal
        open={resizeOpen}
        image={preview || ""}
        onClose={() => setResizeOpen(false)}
        onSave={handleCroppedSave}
      />
    </>
  );
};
