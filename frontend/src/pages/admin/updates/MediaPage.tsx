import { useState } from "react";
import { Box, Typography, TextField, Button, IconButton } from "@mui/material";
import { Upload, Plus, Trash2 } from "lucide-react";
import { DarkButton } from "@/components/ui/DarkButton";

interface MediaItem {
  id: number;
  src: string;
  alt: string;
  category: string;
  title: string;
  description: string;
  album: string;
}


export const MediaPage: React.FC= () => {
  const [mediaImages, setMediaImages] = useState<MediaItem[]>([
    { id: 1, src: "", alt: "", category: "", title: "", description: "", album: "" },
  ]);

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

  const uploadButtonStyles = {
    backgroundColor: "hsl(0 84.2% 60.2%)",
    color: "white",
    "&:hover": {
      backgroundColor: "hsl(0 84.2% 50.2%)",
    },
  };

  const handleMediaChange = (id: number, field: string, value: string) => {
    const updated = mediaImages.map((m) =>
      m.id === id ? { ...m, [field]: value } : m
    );
    setMediaImages(updated);
  };

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    id: number
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const updated = mediaImages.map((m) =>
          m.id === id ? { ...m, src: reader.result as string } : m
        );
        setMediaImages(updated);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography
        variant="h5"
        sx={{
          fontFamily: "Poppins",
          fontWeight: 600,
          color: "hsl(var(--foreground))",
          mb: 3,
        }}
      >
        Media Gallery
      </Typography>

      {mediaImages.map((media) => (
        <Box
          key={media.id}
          sx={{
            p: 3,
            mb: 3,
            border: "1px solid hsl(var(--border))",
            borderRadius: "var(--radius)",
            position: "relative",
          }}
        >
          <IconButton
            onClick={() =>
              setMediaImages(mediaImages.filter((m) => m.id !== media.id))
            }
            sx={{ position: "absolute", top: 8, right: 8, color: "hsl(0 84.2% 60.2%)" }}
          >
            <Trash2 size={20} />
          </IconButton>

          <TextField
            fullWidth
            label="Title"
            value={media.title}
            onChange={(e) => handleMediaChange(media.id, "title", e.target.value)}
            sx={{ ...textFieldStyles, mb: 2 }}
          />

          <TextField
            fullWidth
            label="Alt Text"
            value={media.alt}
            onChange={(e) => handleMediaChange(media.id, "alt", e.target.value)}
            sx={{ ...textFieldStyles, mb: 2 }}
          />

          <TextField
            fullWidth
            label="Category"
            value={media.category}
            onChange={(e) => handleMediaChange(media.id, "category", e.target.value)}
            placeholder="e.g., events, workshops, meetings"
            sx={{ ...textFieldStyles, mb: 2 }}
          />

          <TextField
            fullWidth
            label="Album"
            value={media.album}
            onChange={(e) => handleMediaChange(media.id, "album", e.target.value)}
            placeholder="Album name"
            sx={{ ...textFieldStyles, mb: 2 }}
          />

          <TextField
            fullWidth
            multiline
            rows={2}
            label="Description"
            value={media.description}
            onChange={(e) => handleMediaChange(media.id, "description", e.target.value)}
            sx={{ ...textFieldStyles, mb: 2 }}
          />

          {media.src && (
            <img
              src={media.src}
              alt={media.alt || media.title}
              style={{
                width: "100%",
                maxHeight: "200px",
                objectFit: "cover",
                borderRadius: "8px",
                marginBottom: "12px",
              }}
            />
          )}

          <input
            accept="image/*"
            style={{ display: "none" }}
            id={`media-image-${media.id}`}
            type="file"
            onChange={(e) => handleImageUpload(e, media.id)}
          />
          <label htmlFor={`media-image-${media.id}`}>
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
        </Box>
      ))}

      <Button
        startIcon={<Plus />}
        onClick={() => {
          const newId = Math.max(...mediaImages.map((m) => m.id), 0) + 1;
          setMediaImages([
            ...mediaImages,
            {
              id: newId,
              src: "",
              alt: "",
              category: "",
              title: "",
              description: "",
              album: "",
            },
          ]);
        }}
        sx={uploadButtonStyles}
      >
        Add Media Item
      </Button>

      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4 }}>
        <DarkButton >Save Changes</DarkButton>
      </Box>
    </Box>
  );
};