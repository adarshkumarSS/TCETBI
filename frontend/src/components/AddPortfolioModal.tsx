import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Box,
  Typography,
  Divider,
  IconButton,
} from "@mui/material";
import { Upload, ImagePlus, Plus, Trash } from "lucide-react";
import { useState, useEffect } from "react";
import { ResizeModal } from "@/components/ResizeModal";
import { removeImageBackground } from "@/utils/removeBackground";
import { uploadToCloudinary } from "@/utils/uploadToCloudinary";
import { SquareResizeModal } from "@/components/SquareResizeModal";

interface AddPortfolioModalProps {
  open: boolean;
  type?: "startup" | null;
  onClose: () => void;
  onSave: (data: any) => void;
  initialData?: any;
}

export const AddPortfolioModal: React.FC<AddPortfolioModalProps> = ({
  open,
  onClose,
  onSave,
  initialData,
}) => {
  const [formData, setFormData] = useState<any>({
    category: "current",
    products: [],
    ceos: [],
  });
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [resizeOpen, setResizeOpen] = useState(false);
  const [uploadType, setUploadType] = useState<"logo" | "ceo">("logo");
  const [ceoIndex, setCeoIndex] = useState<number | null>(null);
  const [validationOpen, setValidationOpen] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        products: initialData.products || [],
        ceos: initialData.ceos || [],
      });
      setLogoPreview(initialData.logo || null);
    } else {
      setFormData({ category: "current", products: [], ceos: [] });
      setLogoPreview(null);
    }
  }, [initialData, open]);

  const handleChange = (field: string, value: any) =>
    setFormData({ ...formData, [field]: value });

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "logo" | "ceo",
    index?: number
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadType(type);
    if (type === "ceo" && typeof index === "number") setCeoIndex(index);

    const reader = new FileReader();
    reader.onloadend = () => {
      if (type === "logo") setLogoPreview(reader.result as string);
      else updateCeoImage(index!, reader.result as string);
    };
    reader.readAsDataURL(file);
    setResizeOpen(true);
  };

  const handleCroppedSave = async (cropped: File, removeBg: boolean) => {
    setResizeOpen(false);
    let imgURL = URL.createObjectURL(cropped);

    // ✨ Remove background if requested
    if (removeBg) {
      try {
        const bgRemoved = await removeImageBackground(cropped);
        if (bgRemoved) imgURL = bgRemoved;
      } catch {
        console.warn(
          "⚠️ Background removal failed, using original cropped image"
        );
      }
    }

    const localURL = imgURL;

    if (uploadType === "logo") setLogoPreview(localURL);
    else if (ceoIndex !== null && typeof ceoIndex === "number") updateCeoImage(ceoIndex, localURL);
  };

  const updateCeoImage = (index: number, url: string) => {
    const updated = [...formData.ceos];
    updated[index] = { ...updated[index], image: url };
    setFormData({ ...formData, ceos: updated });
  };

  // ✅ CEO Handlers
  const addCeo = () =>
    setFormData({
      ...formData,
      ceos: [...formData.ceos, { name: "", bio: "", image: "" }],
    });

  const removeCeo = (index: number) => {
    const updated = formData.ceos.filter((_: any, i: number) => i !== index);
    setFormData({ ...formData, ceos: updated });
  };

  const handleCeoChange = (index: number, field: string, value: string) => {
    const updated = [...formData.ceos];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, ceos: updated });
  };

  // ✅ Product Handlers
  const addProduct = () =>
    setFormData({
      ...formData,
      products: [...formData.products, { title: "", desc: "" }],
    });

  const removeProduct = (index: number) => {
    const updated = formData.products.filter(
      (_: any, i: number) => i !== index
    );
    setFormData({ ...formData, products: updated });
  };

  const handleProductChange = (index: number, field: string, value: string) => {
    const updated = [...formData.products];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, products: updated });
  };

  const handleSave = () => {
    if (!formData.name?.trim() || !formData.sector?.trim() || !logoPreview) {
      setValidationOpen(true); // ⬅️ open modal instead of alert
      return;
    }

    const newStartup = {
      ...formData,
      logo: logoPreview || "",
    };
    onSave(newStartup);
    onClose();
  };

  const textFieldStyles = {
    "& .MuiInputBase-input": { color: "hsl(var(--foreground))" },
    "& .MuiInputLabel-root": { color: "hsl(var(--muted-foreground))" },
    "& .MuiInputLabel-root.Mui-focused": { color: "hsl(0 84.2% 60.2%)" },
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
        maxWidth="md"
        PaperProps={{
          sx: {
            backgroundColor: "hsl(var(--card))",
            color: "hsl(var(--foreground))",
            borderRadius: "20px",
            border: "1px solid hsl(var(--border))",
          },
        }}
      >
        {/* Header */}
        <DialogTitle
          sx={{
            fontFamily: "Poppins",
            fontWeight: 600,
            fontSize: "1.25rem",
            color: "white",
            backgroundColor: "hsl(0 84.2% 60.2%)",
            py: 2,
            px: 3,
          }}
        >
          {initialData ? "✏️ Edit Startup" : "➕ Add New Startup"}
        </DialogTitle>

        {/* Content */}
        <DialogContent dividers sx={{ p: 3 }}>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
            {/* LEFT SIDE - Startup Info */}
            <Box sx={{ flex: "1 1 55%", minWidth: "300px" }}>
              <Typography variant="subtitle1" fontWeight={600} mb={1}>
                Startup Details
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <TextField
                fullWidth
                select
                label="Category"
                sx={{ mb: 2, ...textFieldStyles }}
                value={formData.category}
                onChange={(e) => handleChange("category", e.target.value)}
              >
                <MenuItem value="current">Current Startup</MenuItem>
                <MenuItem value="graduated">Graduated Startup</MenuItem>
              </TextField>

              <TextField
                fullWidth
                label="Startup Name"
                sx={{ mb: 2, ...textFieldStyles }}
                value={formData.name || ""}
                onChange={(e) => handleChange("name", e.target.value)}
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
              <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                <TextField
                  fullWidth
                  label="Founded"
                  sx={{ ...textFieldStyles }}
                  value={formData.founded || ""}
                  onChange={(e) => handleChange("founded", e.target.value)}
                />
                <TextField
                  fullWidth
                  label="Location"
                  sx={{ ...textFieldStyles }}
                  value={formData.location || ""}
                  onChange={(e) => handleChange("location", e.target.value)}
                />
              </Box>
              <TextField
                fullWidth
                label="Website"
                sx={{ mb: 2, ...textFieldStyles }}
                value={formData.website || ""}
                onChange={(e) => handleChange("website", e.target.value)}
              />

              {/* Social Links */}
              <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
                Social Links
              </Typography>
              {["linkedin", "twitter", "facebook"].map((field) => (
                <TextField
                  key={field}
                  fullWidth
                  sx={{ mb: 1, ...textFieldStyles }}
                  label={field.charAt(0).toUpperCase() + field.slice(1)}
                  value={formData[field] || ""}
                  onChange={(e) => handleChange(field, e.target.value)}
                />
              ))}

              {/* Owner Information */}
              <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
                Owner Information
              </Typography>
              <TextField
                fullWidth
                label="Owner Name"
                sx={{ mb: 1, ...textFieldStyles }}
                value={formData.owner_name || ""}
                onChange={(e) => handleChange("owner_name", e.target.value)}
              />
              <TextField
                fullWidth
                multiline
                rows={2}
                label="Owner Description"
                sx={{ mb: 1, ...textFieldStyles }}
                value={formData.owner_description || ""}
                onChange={(e) => handleChange("owner_description", e.target.value)}
              />
              <TextField
                fullWidth
                label="Owner Company Name"
                sx={{ mb: 1, ...textFieldStyles }}
                value={formData.owner_company_name || ""}
                onChange={(e) => handleChange("owner_company_name", e.target.value)}
              />
              <TextField
                fullWidth
                label="Owner LinkedIn URL"
                sx={{ mb: 1, ...textFieldStyles }}
                value={formData.owner_linkedin || ""}
                onChange={(e) => handleChange("owner_linkedin", e.target.value)}
              />

              {/* Logo Upload */}
              <Box sx={{ textAlign: "center", mt: 2 }}>
                {logoPreview && (
                  <img
                    src={logoPreview}
                    alt="Logo Preview"
                    style={{
                      width: 100,
                      height: 100,
                      objectFit: "contain",
                      borderRadius: "8px",
                      marginBottom: "12px",
                    }}
                  />
                )}
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<Upload size={18} />}
                  fullWidth
                  sx={{
                    borderColor: "hsl(0 84.2% 60.2%)",
                    color: "hsl(0 84.2% 60.2%)",
                  }}
                >
                  {logoPreview ? "Change Logo" : "Upload Logo"}
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(e) => handleFileChange(e, "logo")}
                  />
                </Button>
              </Box>
            </Box>

            {/* RIGHT SIDE - CEOs + Products */}
            <Box sx={{ flex: "1 1 40%", minWidth: "280px" }}>
              {/* CEOs */}
              <Typography variant="subtitle1" fontWeight={600} mb={1}>
                CEO Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
              {formData.ceos.map((ceo: any, index: number) => (
                <Box
                  key={index}
                  sx={{
                    mb: 3,
                    border: "1px solid hsl(var(--border))",
                    p: 2,
                    borderRadius: 2,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 1,
                    }}
                  >
                    <Typography variant="body2" fontWeight={600}>
                      CEO {index + 1}
                    </Typography>
                    <IconButton size="small" onClick={() => removeCeo(index)}>
                      <Trash size={16} color="red" />
                    </IconButton>
                  </Box>

                  <TextField
                    fullWidth
                    label="Name"
                    sx={{ mb: 1, ...textFieldStyles }}
                    value={ceo.name || ""}
                    onChange={(e) =>
                      handleCeoChange(index, "name", e.target.value)
                    }
                  />
                  <TextField
                    fullWidth
                    multiline
                    rows={2}
                    label="Bio"
                    sx={{ mb: 1, ...textFieldStyles }}
                    value={ceo.bio || ""}
                    onChange={(e) =>
                      handleCeoChange(index, "bio", e.target.value)
                    }
                  />

                  <Box sx={{ textAlign: "center" }}>
                    {ceo.image && (
                      <img
                        src={ceo.image}
                        alt="CEO"
                        style={{
                          width: 100,
                          height: 100,
                          objectFit: "cover",
                          borderRadius: "50%",
                          marginBottom: 8,
                        }}
                      />
                    )}
                    <Button
                      variant="outlined"
                      component="label"
                      startIcon={<ImagePlus size={18} />}
                      fullWidth
                      sx={{
                        borderColor: "hsl(0 84.2% 60.2%)",
                        color: "hsl(0 84.2% 60.2%)",
                      }}
                    >
                      {ceo.image ? "Change Image" : "Upload Image"}
                      <input
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={(e) => handleFileChange(e, "ceo", index)}
                      />
                    </Button>
                  </Box>
                </Box>
              ))}
              <Button
                startIcon={<Plus size={16} />}
                onClick={addCeo}
                fullWidth
                sx={{ color: "hsl(0 84.2% 60.2%)" }}
              >
                Add CEO
              </Button>

              {/* Products */}
              <Typography variant="subtitle1" fontWeight={600} mt={4} mb={1}>
                Products & Services
              </Typography>
              <Divider sx={{ mb: 2 }} />
              {formData.products.map((p: any, index: number) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <TextField
                    fullWidth
                    label="Title"
                    sx={{ mb: 1, ...textFieldStyles }}
                    value={p.title || ""}
                    onChange={(e) =>
                      handleProductChange(index, "title", e.target.value)
                    }
                  />
                  <TextField
                    fullWidth
                    label="Description"
                    sx={{ mb: 1, ...textFieldStyles }}
                    multiline
                    rows={2}
                    value={p.desc || ""}
                    onChange={(e) =>
                      handleProductChange(index, "desc", e.target.value)
                    }
                  />
                  <Button
                    startIcon={<Trash size={16} />}
                    onClick={() => removeProduct(index)}
                    sx={{ color: "red", mb: 1 }}
                  >
                    Remove Product
                  </Button>
                </Box>
              ))}
              <Button
                startIcon={<Plus size={16} />}
                onClick={addProduct}
                fullWidth
                sx={{ color: "hsl(0 84.2% 60.2%)" }}
              >
                Add Product
              </Button>
            </Box>
          </Box>
        </DialogContent>

        {/* Footer */}
        <DialogActions
          sx={{ px: 3, py: 2, backgroundColor: "hsl(var(--background))" }}
        >
          <Button
            onClick={onClose}
            sx={{ color: "hsl(var(--muted-foreground))" }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            sx={{
              backgroundColor: "hsl(0 84.2% 60.2%)",
              fontWeight: 600,
              px: 3,
              "&:hover": { backgroundColor: "hsl(0 84.2% 50.2%)" },
            }}
          >
            {initialData ? "Save Changes" : "Add Startup"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Cropping Modal */}

      {/* ⚠️ Validation Modal */}
      <Dialog
        open={validationOpen}
        onClose={() => setValidationOpen(false)}
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
            color: "hsl(0 84.2% 60.2%)",
          }}
        >
          Missing Information
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ mt: 1 }}>
            ⚠️ Please fill out <b>Name</b>, <b>Sector</b>, and upload a{" "}
            <b>Logo</b> before saving your startup.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setValidationOpen(false)}
            sx={{
              color: "white",
              backgroundColor: "hsl(0 84.2% 60.2%)",
              "&:hover": { backgroundColor: "hsl(0 84.2% 50.2%)" },
            }}
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* 🟦 Combined Resize Modal (Used for both Logo & CEO) */}
      <ResizeModal
        open={resizeOpen}
        image={
            uploadType === "logo" 
                ? logoPreview || "" 
                : (ceoIndex !== null ? formData.ceos[ceoIndex]?.image || "" : "")
        }
        onClose={() => setResizeOpen(false)}
        onSave={handleCroppedSave}
      />
    </>
  );
};
