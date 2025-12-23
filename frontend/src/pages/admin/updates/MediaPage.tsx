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

import { Upload, Plus, Trash2, FolderPlus } from "lucide-react";

import { DarkButton } from "@/components/ui/DarkButton";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { MessageModal } from "@/components/ui/MessageModal";
import { ResizeModal } from "@/components/ResizeModal";
import { MenuItem } from "@mui/material";

import {
  fetchMedia,
  updateAlbum,
  deleteAlbum,
  MediaItem,
} from "@/api/mediaService";

import { uploadToCloudinary } from "@/utils/uploadToCloudinary";

// --------------------------------------------------
// Types
// --------------------------------------------------

interface AlbumGroup {
  album: string;
  category: string;
  title: string;
  items: MediaItem[];
}

// --------------------------------------------------
// Component
// --------------------------------------------------

export const MediaPage: React.FC = () => {
  const [albums, setAlbums] = useState<AlbumGroup[]>([]);
  const [loading, setLoading] = useState(true);

  const [activeAlbum, setActiveAlbum] = useState<AlbumGroup | null>(null);
  const [editItems, setEditItems] = useState<MediaItem[]>([]);

  const [resizeModal, setResizeModal] = useState({
    open: false,
    index: null as number | null,
    image: "",
  });

  const [deleteModal, setDeleteModal] = useState({
    open: false,
    album: null as string | null,
  });

  const [newAlbumModal, setNewAlbumModal] = useState(false);
  const [newAlbumName, setNewAlbumName] = useState("");
  const [newAlbumCategory, setNewAlbumCategory] = useState("events");
  const [newAlbumFiles, setNewAlbumFiles] = useState<FileList | null>(null);

  const [message, setMessage] = useState({
    open: false,
    text: "",
    type: "info" as "success" | "error" | "info",
  });

  // --------------------------------------------------
  // Theme TextField Styles
  // --------------------------------------------------

  const textFieldStyles = {
    "& .MuiInputBase-input": { color: "hsl(var(--foreground))" },
    "& .MuiInputLabel-root": { color: "hsl(var(--muted-foreground))" },
    "& .MuiOutlinedInput-root": {
      "& fieldset": { borderColor: "hsl(var(--border))" },
      "&:hover fieldset": { borderColor: "hsl(0 84.2% 60.2%)" },
      "&.Mui-focused fieldset": { borderColor: "hsl(0 84.2% 60.2%)" },
    },
  };

  const uploadButtonStyles = {
    backgroundColor: "hsl(0 84.2% 60.2%)",
    color: "white",
    "&:hover": { backgroundColor: "hsl(0 84.2% 50.2%)" },
  };

  // --------------------------------------------------
  // Load Media
  // --------------------------------------------------

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchMedia();

        const grouped = new Map<string, AlbumGroup>();

        data.forEach((item) => {
          if (!grouped.has(item.album)) {
            grouped.set(item.album, {
              album: item.album,
              category: item.category,
              title: item.album
                .split("-")
                .map((w) => w[0].toUpperCase() + w.slice(1))
                .join(" "),
              items: [],
            });
          }
          grouped.get(item.album)!.items.push(item);
        });

        setAlbums(Array.from(grouped.values()));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // --------------------------------------------------
  // Open Album
  // --------------------------------------------------

  const openAlbumEditor = (album: AlbumGroup) => {
    setActiveAlbum(album);
    setEditItems(album.items);
  };

  // --------------------------------------------------
  // Delete Album
  // --------------------------------------------------

  const handleDeleteConfirm = async () => {
    if (!deleteModal.album) return;

    try {
      await deleteAlbum(deleteModal.album);

      setAlbums((prev) => prev.filter((a) => a.album !== deleteModal.album));

      setMessage({ open: true, text: "Album deleted", type: "success" });
    } catch (err) {
      setMessage({ open: true, text: "Failed to delete album", type: "error" });
    }

    setDeleteModal({ open: false, album: null });

    if (activeAlbum?.album === deleteModal.album) {
      setActiveAlbum(null);
      setEditItems([]);
    }
  };

  // --------------------------------------------------
  // Local Image Upload
  // --------------------------------------------------

  const uploadLocalImage = (
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

  const handleCropped = (file: File) => {
    if (resizeModal.index === null) return;

    const url = URL.createObjectURL(file);

    setEditItems((prev) => {
      const copy = [...prev];
      copy[resizeModal.index!].image = url;
      return copy;
    });

    setResizeModal({ open: false, index: null, image: "" });
    URL.revokeObjectURL(url);

  };

  // --------------------------------------------------
  // Add New Items (multiple)
  // --------------------------------------------------

  const addNewItem = (files: FileList | null) => {
    if (!files) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditItems((prev) => [
          ...prev,
          {
            id: undefined,
            album: activeAlbum!.album,
            category: activeAlbum!.category as any,
            title: "",
            description: "",
            image: reader.result as string,
          },
        ]);
      };
      reader.readAsDataURL(file);
    });
  };

  // --------------------------------------------------
  // Save Album
  // --------------------------------------------------

  const handleSave = async () => {
    try {
      const uploadIfNeeded = async (img: string) => {
        if (img.startsWith("data:") || img.startsWith("blob:")) {
          const blob = await fetch(img).then((r) => r.blob());
          const file = new File([blob], "media.jpg", { type: blob.type });

          return await uploadToCloudinary(
            file,
            `TCETBI/Media/${activeAlbum!.album}`
          );
        }
        return img;
      };

      const final = [];
      for (const item of editItems) {
        final.push({
          ...item,
          image: await uploadIfNeeded(item.image),
        });
      }

      await updateAlbum(activeAlbum!.album, final);

      setMessage({ open: true, text: "Album updated!", type: "success" });

      setAlbums((prev) =>
        prev.map((a) =>
          a.album === activeAlbum!.album ? { ...a, items: final } : a
        )
      );
    } catch (err) {
      console.error(err);
      setMessage({ open: true, text: "Failed to update album", type: "error" });
    }
  };

  // --------------------------------------------------
  // Create New Album
  // --------------------------------------------------

  const handleCreateAlbum = async () => {
    if (!newAlbumName.trim() || !newAlbumFiles || newAlbumFiles.length === 0) {
      setMessage({
        open: true,
        text: "Album name & at least one image required",
        type: "error",
      });
      return;
    }

    // Convert album name → safe slug
    const slug = newAlbumName
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "") // remove invalid characters
      .trim()
      .replace(/\s+/g, "-"); // spaces → hyphens

    try {
      const items: MediaItem[] = [];

      for (const file of Array.from(newAlbumFiles)) {
        const uploaded = await uploadToCloudinary(file, `TCETBI/Media/${slug}`);

        items.push({
          id: undefined,
          album: slug,
          category: newAlbumCategory as any,
          title: "",
          description: "",
          image: uploaded,
        });
      }

      // 🔥 Correct API call
      await updateAlbum(slug, items);

      setAlbums((prev) => [
        ...prev,
        {
          album: slug,
          category: newAlbumCategory,
          title: newAlbumName,
          items,
        },
      ]);

      setMessage({
        open: true,
        text: "New album created!",
        type: "success",
      });

      // Reset fields
      setNewAlbumModal(false);
      setNewAlbumName("");
      setNewAlbumFiles(null);
    } catch (err) {
      console.error(err);
      setMessage({
        open: true,
        text: "Failed to create album",
        type: "error",
      });
    }
  };

  // --------------------------------------------------
  // RENDER START
  // --------------------------------------------------

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress color="error" />
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 4, px: 2 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography
          variant="h5"
          sx={{
            fontFamily: "Poppins",
            fontWeight: 600,
            color: "hsl(var(--foreground))",
          }}
        >
          Media Albums
        </Typography>

        <Button
          startIcon={<FolderPlus />}
          sx={uploadButtonStyles}
          onClick={() => setNewAlbumModal(true)}
        >
          New Album
        </Button>
      </Box>

      {/* Album Cards */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr" },
          gap: 3,
          mb: 5,
        }}
      >
        {albums.map((album) => (
          <Box
            key={album.album}
            sx={{
              p: 2,
              border: "1px solid hsl(var(--border))",
              borderRadius: "var(--radius)",
              backgroundColor: "hsl(var(--card))",
              position: "relative",
              cursor: "pointer",
              transition: "0.25s",
              "&:hover": {
                transform: "scale(1.02)",
                boxShadow: "0 6px 20px rgba(0,0,0,0.20)",
              },
            }}
            onClick={() => openAlbumEditor(album)}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                color: "hsl(var(--foreground))",
                mb: 1,
              }}
            >
              {album.title}
            </Typography>

            <Typography
              sx={{ fontSize: "0.9rem", color: "hsl(var(--muted-foreground))" }}
            >
              {album.items.length} Images
            </Typography>

            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                setDeleteModal({ open: true, album: album.album });
              }}
              sx={{
                position: "absolute",
                top: 6,
                right: 6,
                color: "hsl(0 84.2% 60.2%)",
              }}
            >
              <Trash2 size={18} />
            </IconButton>
          </Box>
        ))}
      </Box>

      {/* EDITOR PANEL */}
      {activeAlbum && (
        <>
          <Box
            sx={{
              maxWidth: 900,
              mx: "auto",
              mt: 2,
              p: 3,
              backgroundColor: "hsl(var(--card))",
              borderRadius: "var(--radius)",
              border: "1px solid hsl(var(--border))",
              boxShadow: "0 4px 20px rgba(0,0,0,0.18)",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                mb: 3,
                fontFamily: "Poppins",
                fontWeight: 600,
                color: "white",
                textAlign: "center",
              }}
            >
              Editing Album: {activeAlbum.title}
            </Typography>

            {/* 🔥 TWO CARDS PER ROW */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                gap: 3,
              }}
            >
              {editItems.map((item, index) => (
                <Box
                  key={index}
                  sx={{
                    p: 2,
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)",
                    backgroundColor: "hsl(var(--background))",
                    position: "relative",
                  }}
                >
                  {/* 🔥 DELETE BUTTON FLOATING ON TOP */}
                  <IconButton
                    onClick={() =>
                      setEditItems((prev) => prev.filter((_, i) => i !== index))
                    }
                    sx={{
                      position: "absolute",
                      top: -10,
                      right: -10,
                      backgroundColor: "hsl(0 84.2% 60.2%)",
                      color: "white",
                      "&:hover": {
                        backgroundColor: "hsl(0 84.2% 50.2%)",
                      },
                      boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
                      width: 32,
                      height: 32,
                    }}
                  >
                    <Trash2 size={18} />
                  </IconButton>

                  {/* Title */}
                  <TextField
                    fullWidth
                    label="Title"
                    value={item.title || ""}
                    onChange={(e) =>
                      setEditItems((prev) =>
                        prev.map((p, i) =>
                          i === index ? { ...p, title: e.target.value } : p
                        )
                      )
                    }
                    sx={{ ...textFieldStyles, mb: 1.5 }}
                  />

                  {/* Description */}
                  <TextField
                    fullWidth
                    multiline
                    rows={2}
                    label="Description"
                    value={item.description || ""}
                    onChange={(e) =>
                      setEditItems((prev) =>
                        prev.map((p, i) =>
                          i === index
                            ? { ...p, description: e.target.value }
                            : p
                        )
                      )
                    }
                    sx={{ ...textFieldStyles, mb: 1.5 }}
                  />

                  {/* Image */}
                  <img
                    src={item.image}
                    alt=""
                    style={{
                      width: "100%",
                      height: 160,
                      objectFit: "cover",
                      borderRadius: 10,
                      border: "1px solid hsl(var(--border))",
                      marginBottom: 14,
                    }}
                  />

                  {/* Replace Image */}
                  <input
                    type="file"
                    accept="image/*"
                    id={`file-${index}`}
                    style={{ display: "none" }}
                    onChange={(e) => uploadLocalImage(e, index)}
                  />
                  <label htmlFor={`file-${index}`}>
                    <Button
                      fullWidth
                      variant="outlined"
                      component="span"
                      startIcon={<Upload />}
                      sx={uploadButtonStyles}
                    >
                      Replace Image
                    </Button>
                  </label>
                </Box>
              ))}
            </Box>

            {/* ADD MULTIPLE IMAGES */}
            <Box sx={{ textAlign: "center", mt: 3 }}>
              <input
                accept="image/*"
                multiple
                id="add-multi-images"
                type="file"
                style={{ display: "none" }}
                onChange={(e) => addNewItem(e.target.files)}
              />
              <label htmlFor="add-multi-images">
                <Button
                  startIcon={<Plus />}
                  component="span"
                  sx={uploadButtonStyles}
                >
                  Add Images
                </Button>
              </label>
            </Box>

            {/* SAVE */}
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
              <DarkButton sx={{ px: 5 }} onClick={handleSave}>
                Save Changes
              </DarkButton>
            </Box>
          </Box>
        </>
      )}

      {/* -------------------------- */}
      {/* New Album Modal */}
      {/* -------------------------- */}

      <Dialog
        open={newAlbumModal}
        onClose={() => setNewAlbumModal(false)}
        PaperProps={{
          sx: {
            width: "500px",
            backgroundColor: "hsl(var(--card))",
            borderRadius: "20px",
            border: "1px solid hsl(var(--border))",
          },
        }}
      >
        <DialogTitle
          sx={{
            fontFamily: "Poppins",
            fontWeight: 600,
            color: "hsl(var(--foreground))",
            pb: 1,
          }}
        >
          Create New Album
        </DialogTitle>

        <DialogContent sx={{ pt: 1 }}>
          {/* Album Name */}
          <TextField
            fullWidth
            label="Album Name"
            sx={{ ...textFieldStyles, my: 2 }}
            value={newAlbumName}
            onChange={(e) => setNewAlbumName(e.target.value)}
            InputLabelProps={{
              style: { color: "hsl(var(--muted-foreground))" },
            }}
          />

          {/* Category */}
          <TextField
            select
            fullWidth
            label="Category"
            sx={{ ...textFieldStyles, mb: 2 }}
            value={newAlbumCategory}
            onChange={(e) => setNewAlbumCategory(e.target.value)}
            InputLabelProps={{
              style: { color: "hsl(var(--muted-foreground))" },
            }}
          >
            <MenuItem value="events">Activities</MenuItem>
            <MenuItem value="facilities">Facilities</MenuItem>
            <MenuItem value="startups">Startups</MenuItem>
            <MenuItem value="events_alt">Events</MenuItem>
          </TextField>

          {/* File Selector */}
          <input
            type="file"
            accept="image/*"
            multiple
            id="new-album-files"
            style={{ display: "none" }}
            onChange={(e) => setNewAlbumFiles(e.target.files)}
          />

          <label htmlFor="new-album-files">
            <Button
              variant="outlined"
              fullWidth
              component="span"
              startIcon={<Upload />}
              sx={{
                borderColor: "hsl(0 84.2% 60.2%)",
                color: "hsl(0 84.2% 60.2%)",
                "&:hover": {
                  backgroundColor: "hsl(0 84.2% 60.2%)",
                  color: "white",
                  borderColor: "hsl(0 84.2% 60.2%)",
                },
              }}
            >
              Select Images
            </Button>
          </label>

          {/* Image Previews */}
          {newAlbumFiles && newAlbumFiles.length > 0 && (
            <Box
              sx={{
                mt: 3,
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)", // 2 images per row 🔥
                gap: 2,
              }}
            >
              {Array.from(newAlbumFiles).map((file, idx) => {
                const url = URL.createObjectURL(file);

                return (
                  <Box
                    key={idx}
                    sx={{
                      position: "relative",
                      borderRadius: 2,
                      overflow: "hidden",
                      border: "1px solid hsl(var(--border))",
                    }}
                  >
                    <img
                      src={url}
                      style={{
                        width: "100%",
                        height: 120,
                        objectFit: "cover",
                      }}
                    />

                    {/* Delete Button */}
                    <IconButton
                      size="small"
                      sx={{
                        position: "absolute",
                        top: 6,
                        right: 6,
                        background: "rgba(0,0,0,0.6)",
                        color: "white",
                        width: 26,
                        height: 26,
                        "&:hover": {
                          background: "rgba(255,0,0,0.7)",
                        },
                        zIndex: 10,
                      }}
                      onClick={() => {
                        const updated = Array.from(newAlbumFiles).filter(
                          (_, i) => i !== idx
                        );

                        const dt = new DataTransfer();
                        updated.forEach((f) => dt.items.add(f));

                        setNewAlbumFiles(dt.files);
                      }}
                    >
                      <Trash2 size={16} />
                    </IconButton>
                  </Box>
                );
              })}
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ pr: 3, pb: 2 }}>
          <Button
            sx={{ color: "white" }}
            onClick={() => setNewAlbumModal(false)}
          >
            Cancel
          </Button>

          <DarkButton
            onClick={handleCreateAlbum}
            disabled={
              !newAlbumName || !newAlbumFiles || newAlbumFiles.length === 0
            }
            sx={{
              backgroundColor: "hsl(0 84.2% 60.2%)",
              "&:hover": { backgroundColor: "hsl(0 84.2% 50.2%)" },
            }}
          >
            Create Album
          </DarkButton>
        </DialogActions>
      </Dialog>

      {/* Modals */}
      <ResizeModal
        open={resizeModal.open}
        image={resizeModal.image}
        onClose={() => setResizeModal({ open: false, index: null, image: "" })}
        onSave={handleCropped}
      />

      <ConfirmModal
        open={deleteModal.open}
        title="Delete Album"
        message="Are you sure you want to delete this album?"
        onCancel={() => setDeleteModal({ open: false, album: null })}
        onConfirm={handleDeleteConfirm}
      />

      <MessageModal
        open={message.open}
        message={message.text}
        type={message.type}
        onClose={() => setMessage({ ...message, open: false })}
      />
    </Box>
  );
};
