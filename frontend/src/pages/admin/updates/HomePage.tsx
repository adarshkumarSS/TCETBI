import { useEffect, useState } from "react";
import { Box, Typography, TextField, Button, Paper, Fab } from "@mui/material";
import { Upload, Plus, Trash2, Save } from "lucide-react";
import { DarkButton } from "@/components/ui/DarkButton";
import { fetchHomeData, updateHomeData, HomeData } from "@/api/homeService";
import { uploadToCloudinary } from "@/utils/uploadToCloudinary";
import { ResizeModal } from "@/components/ResizeModal";
import { toast } from "sonner";
import { AddContentModal } from "@/components/AddContentModal";
import { removeImageBackground } from "@/utils/removeBackground";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { deleteSuccessStory } from "@/api/homeService";

interface HomePageProps {
  setIsDirty?: (isDirty: boolean) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ setIsDirty }) => {
  const [data, setData] = useState<HomeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadContext, setUploadContext] = useState<{
    type: string;
    index: number;
  } | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [resizeModalOpen, setResizeModalOpen] = useState(false);
  const [addModal, setAddModal] = useState<{
    open: boolean;
    type: "achievement" | "logo" | "successStory" | null;
  }>({
    open: false,
    type: null,
  });

  // ✅ Fetch home data on mount
  useEffect(() => {
    fetchHomeData()
      .then((res) => setData(res))
      .catch(() => console.error("Failed to load home data"))
      .finally(() => setLoading(false));
  }, []);

  // ✅ Update handlers
  const handleVisionMissionChange = (
    field: "vision" | "mission",
    value: string
  ) => {
    if (!data) return;
    setData({
      ...data,
      vision_mission: { ...data.vision_mission, [field]: value },
    });
    setIsDirty?.(true);
  };

  const handleAchievementChange = (
    index: number,
    field: string,
    value: any
  ) => {
    if (!data) return;
    const updated = [...data.achievements];
    updated[index] = { ...updated[index], [field]: value };
    setData({ ...data, achievements: updated });
    setIsDirty?.(true);
  };

  const handleLogoChange = (
    type: "govt_logos" | "state_logos",
    index: number,
    field: string,
    value: any
  ) => {
    if (!data) return;
    const updated = [...data[type]];
    updated[index] = { ...updated[index], [field]: value };
    setData({ ...data, [type]: updated });
    setIsDirty?.(true);
  };

  const handleSuccessStoryChange = (
    index: number,
    field: string,
    value: any
  ) => {
    if (!data) return;
    const updated = [...data.success_stories];
    updated[index] = { ...updated[index], [field]: value };
    setData({ ...data, success_stories: updated });
    setIsDirty?.(true);
  };

  // 🔹 Modal-based delete confirmation
  const [deleteConfirm, setDeleteConfirm] = useState<{
    open: boolean;
    type: string;
    index: number | null;
  }>({
    open: false,
    type: "",
    index: null,
  });

  const handleDeleteClick = (type: string, index: number) => {
    setDeleteConfirm({ open: true, type, index });
  };

  const handleConfirmDelete = async () => {
    if (!data || deleteConfirm.index === null) return;

    const { type, index } = deleteConfirm;

    try {
      if (type === "successStory") {
        const story = data.success_stories[index];
        if (story.id) {
          await deleteSuccessStory(story.id); // ✅ Call backend delete
        }

        setData((prev) => ({
          ...prev!,
          success_stories: prev!.success_stories.filter((_, i) => i !== index),
        }));

        toast.success("✅ Success story deleted successfully!");
      } else {
        // Existing local-only delete logic for other types
        const updated = { ...data };
        if (type === "achievement") {
          updated.achievements = data.achievements.filter(
            (_, i) => i !== index
          );
        } else if (type === "govt") {
          updated.govt_logos = data.govt_logos.filter((_, i) => i !== index);
        } else if (type === "state") {
          updated.state_logos = data.state_logos.filter((_, i) => i !== index);
        }
        setData(updated);
        setIsDirty?.(true);
      }
    } catch (error) {
      console.error("❌ Error deleting success story:", error);
      toast.error("❌ Failed to delete success story!");
    } finally {
      setDeleteConfirm({ open: false, type: "", index: null });
    }
  };

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: string,
    index: number
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedImage(reader.result as string);
      setCurrentFile(file);
      setUploadContext({ type, index });
      setResizeModalOpen(true);
    };
    reader.readAsDataURL(file);
  };

  // ✅ Cropping + background removal
  const handleCroppedImageSave = async (croppedFile: File, removeBg: boolean) => {
    if (!data || !uploadContext) return;

    let imageURL = URL.createObjectURL(croppedFile);

    // ✅ Remove background if requested
    if (removeBg) {
      try {
        const bgRemoved = await removeImageBackground(croppedFile);
        if (bgRemoved) imageURL = bgRemoved;
      } catch {
        console.warn("Background removal failed, using original image.");
      }
    }

    if (uploadContext.type === "govtIndia") {
      const updated = [...data.govt_logos];
      updated[uploadContext.index].src = imageURL;
      setData({ ...data, govt_logos: updated });
      setIsDirty?.(true);
    } else if (uploadContext.type === "govtTN") {
      const updated = [...data.state_logos];
      updated[uploadContext.index].src = imageURL;
      setData({ ...data, state_logos: updated });
      setIsDirty?.(true);
    } else if (uploadContext.type === "successStory") {
      const updated = [...data.success_stories];
      updated[uploadContext.index].image = imageURL;
      setData({ ...data, success_stories: updated });
      setIsDirty?.(true);
    }

    setResizeModalOpen(false);
  };

  // ✅ Add new entry
  const handleAddNew = (newData: any) => {
    if (!data || !addModal.type) return;
    if (addModal.type === "achievement") {
      setData({ ...data, achievements: [...data.achievements, newData] });
    } else if (addModal.type === "logo") {
      if (newData.category === "govt") {
        setData({ ...data, govt_logos: [...data.govt_logos, newData] });
      } else {
        setData({ ...data, state_logos: [...data.state_logos, newData] });
      }
    } else if (addModal.type === "successStory") {
      setData({ ...data, success_stories: [...data.success_stories, newData] });
    }
    setIsDirty?.(true);
  };

  // ✅ Save data to backend
  const handleSave = async () => {
    if (!data) return;
    try {
      setUploading(true);
      const uploadImageIfLocal = async (
        urlOrFile: string | File
      ): Promise<string> => {
        if (typeof urlOrFile === "string" && urlOrFile.startsWith("blob:")) {
          const response = await fetch(urlOrFile);
          const blob = await response.blob();
          const file = new File([blob], "image.jpg", { type: blob.type });
          return await uploadToCloudinary(file);
        }
        return urlOrFile as string;
      };

      const updatedData = { ...data };
      updatedData.govt_logos = await Promise.all(
        data.govt_logos.map(async (logo) => ({
          ...logo,
          src: logo.src ? await uploadImageIfLocal(logo.src) : logo.src,
          category: "govt",
        }))
      );

      updatedData.state_logos = await Promise.all(
        data.state_logos.map(async (logo) => ({
          ...logo,
          src: logo.src ? await uploadImageIfLocal(logo.src) : logo.src,
          category: "state",
        }))
      );

      updatedData.success_stories = await Promise.all(
        data.success_stories.map(async (story) => ({
          ...story,
          image: story.image
            ? await uploadImageIfLocal(story.image)
            : story.image,
        }))
      );

      await updateHomeData(updatedData);
      toast.success("✅ Data updated successfully!");
      setIsDirty?.(false);
    } catch (error: any) {
      console.error("Error updating data:", error);
      toast.error("❌ Failed to update home page data!");
    } finally {
      setUploading(false);
    }
  };

  const textFieldStyles = {
    "& .MuiInputBase-root": {
      backgroundColor: "hsl(var(--card)) !important",
      color: "hsl(var(--foreground)) !important",
      transition: "background-color 0.3s ease",
    },
    "& .MuiInputBase-input": {
      color: "hsl(var(--foreground)) !important",
      caretColor: "hsl(var(--foreground))",
      "&::selection": {
        backgroundColor: "hsl(0 84.2% 60.2% / 0.3)",
        color: "hsl(var(--foreground))",
      },
    },
    "& input, & textarea": {
      backgroundColor: "transparent !important",
      color: "hsl(var(--foreground)) !important",
    },
    "& .MuiInputLabel-root": {
      color: "hsl(var(--muted-foreground)) !important",
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: "hsl(0 84.2% 60.2%) !important",
    },
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "hsl(var(--border))",
      },
      "&:hover fieldset": {
        borderColor: "hsl(0 84.2% 60.2%)",
      },
      "&.Mui-focused fieldset": {
        borderColor: "hsl(0 84.2% 60.2%)",
      },
    },
  };

  const uploadButtonStyles = {
    backgroundColor: "hsl(0 84.2% 60.2%)",
    color: "white",
    borderColor: "hsl(0 84.2% 60.2%)",
    "&:hover": {
      backgroundColor: "hsl(0 84.2% 50.2%)",
      borderColor: "hsl(0 84.2% 50.2%)",
    },
  };

  if (loading) return <p>Loading home page data...</p>;
  if (!data) return <p>Failed to load data.</p>;

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
          Home Page Management
        </Typography>
        <DarkButton 
          onClick={handleSave} 
          disabled={uploading} 
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
          {uploading ? "Saving..." : "Save Changes"}
        </DarkButton>
      </Paper>

      <Box sx={{ mt: 2 }}>
        {/* Vision & Mission */}
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            color: "hsl(var(--primary))",
            mb: 2,
          }}
        >
          Vision & Mission
        </Typography>

        <TextField
          fullWidth
          multiline
          rows={3}
          label="Vision"
          value={data.vision_mission.vision}
          onChange={(e) => handleVisionMissionChange("vision", e.target.value)}
          sx={{ ...textFieldStyles, mb: 2 }}
          size="small"
        />
        <TextField
          fullWidth
          multiline
          rows={3}
          label="Mission"
          value={data.vision_mission.mission}
          onChange={(e) => handleVisionMissionChange("mission", e.target.value)}
          sx={{ ...textFieldStyles, mb: 3 }}
          size="small"
        />

        {/* Achievements Section */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontFamily: "Poppins",
              fontWeight: 600,
              color: "hsl(var(--foreground))",
            }}
          >
            Our Achievements
          </Typography>
          <Button
            startIcon={<Plus size={18} />}
            onClick={() => setAddModal({ open: true, type: "achievement" })}
            sx={{
              backgroundColor: "hsl(0 84.2% 60.2%)",
              color: "white",
              fontWeight: 600,
              "&:hover": {
                backgroundColor: "hsl(0 84.2% 50.2%)",
              },
            }}
          >
            Add
          </Button>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            gap: 3,
            mb: 4,
          }}
        >
          {data.achievements.map((achievement, index) => (
            <Box
              key={index}
              sx={{
                p: 2,
                border: "1px solid hsl(var(--border))",
                borderRadius: "var(--radius)",
              }}
            >
              <TextField
                fullWidth
                type="number"
                label="Number"
                value={achievement.number}
                onChange={(e) =>
                  handleAchievementChange(
                    index,
                    "number",
                    parseInt(e.target.value)
                  )
                }
                sx={{ ...textFieldStyles, mb: 2 }}
              />
              <TextField
                fullWidth
                label="Suffix"
                value={achievement.suffix}
                onChange={(e) =>
                  handleAchievementChange(index, "suffix", e.target.value)
                }
                sx={{ ...textFieldStyles, mb: 2 }}
              />
              <TextField
                fullWidth
                label="Label"
                value={achievement.label}
                onChange={(e) =>
                  handleAchievementChange(index, "label", e.target.value)
                }
                sx={textFieldStyles}
              />
              <Button
                color="error"
                startIcon={<Trash2 />}
                onClick={() => handleDeleteClick("achievement", index)}
                sx={{ mt: 1 }}
              >
                Delete
              </Button>
            </Box>
          ))}
        </Box>

        {/* Logos Section */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontFamily: "Poppins",
              fontWeight: 600,
              color: "hsl(var(--foreground))",
            }}
          >
            Partners - Government of India
          </Typography>
          <Button
            startIcon={<Plus size={18} />}
            onClick={() => setAddModal({ open: true, type: "logo" })}
            sx={{
              backgroundColor: "hsl(0 84.2% 60.2%)",
              color: "white",
              fontWeight: 600,
              "&:hover": { backgroundColor: "hsl(0 84.2% 50.2%)" },
            }}
          >
            Add
          </Button>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr 1fr" },
            gap: 3,
            mb: 4,
          }}
        >
          {data.govt_logos.map((logo, index) => (
            <Box
              key={index}
              sx={{
                p: 2,
                border: "1px solid hsl(var(--border))",
                borderRadius: "var(--radius)",
              }}
            >
              <img
                src={logo.src}
                alt={logo.name}
                style={{
                  width: "100%",
                  height: "120px",
                  objectFit: "contain",
                  marginBottom: "12px",
                }}
              />
              <TextField
                fullWidth
                label="Name"
                value={logo.name}
                onChange={(e) =>
                  handleLogoChange("govt_logos", index, "name", e.target.value)
                }
                sx={{ ...textFieldStyles, mb: 2 }}
              />
              <input
                accept="image/*"
                style={{ display: "none" }}
                id={`govt-india-upload-${index}`}
                type="file"
                onChange={(e) => handleImageUpload(e, "govtIndia", index)}
              />
              <label htmlFor={`govt-india-upload-${index}`}>
                <Button
                  variant="outlined"
                  component="span"
                  fullWidth
                  startIcon={<Upload size={16} />}
                  sx={uploadButtonStyles}
                >
                  Upload Image
                </Button>
              </label>
              <Button
                color="error"
                startIcon={<Trash2 />}
                onClick={() => handleDeleteClick("govt", index)}
                sx={{ mt: 1 }}
              >
                Delete
              </Button>
            </Box>
          ))}
        </Box>

        {/* Tamil Nadu Logos */}
        <Typography
          variant="h5"
          sx={{
            fontFamily: "Poppins",
            fontWeight: 600,
            color: "hsl(var(--foreground))",
            mb: 3,
          }}
        >
          Partners - Government of Tamil Nadu
        </Typography>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr 1fr" },
            gap: 3,
            mb: 4,
          }}
        >
          {data.state_logos.map((logo, index) => (
            <Box
              key={index}
              sx={{
                p: 2,
                border: "1px solid hsl(var(--border))",
                borderRadius: "var(--radius)",
              }}
            >
              <img
                src={logo.src}
                alt={logo.name}
                style={{
                  width: "100%",
                  height: "120px",
                  objectFit: "contain",
                  marginBottom: "12px",
                }}
              />
              <TextField
                fullWidth
                label="Name"
                value={logo.name}
                onChange={(e) =>
                  handleLogoChange("state_logos", index, "name", e.target.value)
                }
                sx={{ ...textFieldStyles, mb: 2 }}
              />
              <input
                accept="image/*"
                style={{ display: "none" }}
                id={`govt-tn-upload-${index}`}
                type="file"
                onChange={(e) => handleImageUpload(e, "govtTN", index)}
              />
              <label htmlFor={`govt-tn-upload-${index}`}>
                <Button
                  variant="outlined"
                  component="span"
                  fullWidth
                  startIcon={<Upload size={16} />}
                  sx={uploadButtonStyles}
                >
                  Upload Image
                </Button>
              </label>
              <Button
                color="error"
                startIcon={<Trash2 />}
                onClick={() => handleDeleteClick("state", index)}
                sx={{ mt: 1 }}
              >
                Delete
              </Button>
            </Box>
          ))}
        </Box>

        {/* Success Stories */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontFamily: "Poppins",
              fontWeight: 600,
              color: "hsl(var(--foreground))",
            }}
          >
            Success Stories
          </Typography>
          <Button
            startIcon={<Plus size={18} />}
            onClick={() => setAddModal({ open: true, type: "successStory" })}
            sx={{
              backgroundColor: "hsl(0 84.2% 60.2%)",
              color: "white",
              fontWeight: 600,
              "&:hover": {
                backgroundColor: "hsl(0 84.2% 50.2%)",
              },
            }}
          >
            Add
          </Button>
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 3, mb: 4 }}>
          {data.success_stories.map((story, index) => (
            <Box
              key={index}
              sx={{
                p: 3,
                border: "1px solid hsl(var(--border))",
                borderRadius: "var(--radius)",
              }}
            >
              <img
                src={story.image}
                alt={story.title}
                style={{
                  width: "100%",
                  height: "200px",
                  objectFit: "cover",
                  borderRadius: "8px",
                  marginBottom: "16px",
                }}
              />
              <TextField
                fullWidth
                label="Title"
                value={story.title}
                onChange={(e) =>
                  handleSuccessStoryChange(index, "title", e.target.value)
                }
                sx={{ ...textFieldStyles, mb: 2 }}
              />
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Description"
                value={story.description}
                onChange={(e) =>
                  handleSuccessStoryChange(index, "description", e.target.value)
                }
                sx={{ ...textFieldStyles, mb: 2 }}
              />
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 2,
                  mb: 2,
                }}
              >
                <TextField
                  fullWidth
                  label="Sector"
                  value={story.sector}
                  onChange={(e) =>
                    handleSuccessStoryChange(index, "sector", e.target.value)
                  }
                  sx={textFieldStyles}
                />
                <TextField
                  fullWidth
                  label="Impact"
                  value={story.impact}
                  onChange={(e) =>
                    handleSuccessStoryChange(index, "impact", e.target.value)
                  }
                  sx={textFieldStyles}
                />
              </Box>
              <input
                accept="image/*"
                style={{ display: "none" }}
                id={`success-story-upload-${index}`}
                type="file"
                onChange={(e) => handleImageUpload(e, "successStory", index)}
              />
              <label htmlFor={`success-story-upload-${index}`}>
                <Button
                  variant="outlined"
                  component="span"
                  fullWidth
                  startIcon={<Upload size={16} />}
                  sx={uploadButtonStyles}
                >
                  Upload Image
                </Button>
              </label>
              <Button
                color="error"
                startIcon={<Trash2 />}
                onClick={() => handleDeleteClick("successStory", index)}
                sx={{ mt: 1 }}
              >
                Delete
              </Button>
            </Box>
          ))}
        </Box>

        {/* Save Button */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4 }}>
          <DarkButton
            onClick={handleSave}
            disabled={uploading}
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
            {uploading ? "Saving..." : "Save Changes"}
          </DarkButton>
        </Box>
      </Box>

      {/* Modals */}
      <ResizeModal
        open={resizeModalOpen}
        image={selectedImage || ""}
        onClose={() => setResizeModalOpen(false)}
        onSave={handleCroppedImageSave}
      />
      <AddContentModal
        open={addModal.open}
        type={addModal.type}
        onClose={() => setAddModal({ open: false, type: null })}
        onSave={handleAddNew}
      />
      <ConfirmModal
        open={deleteConfirm.open}
        onCancel={() =>
          setDeleteConfirm({ open: false, type: "", index: null })
        }
        onConfirm={handleConfirmDelete}
      />
    </Box>
  );
};
