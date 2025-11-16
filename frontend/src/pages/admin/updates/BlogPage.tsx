// src/pages/BlogPage.tsx
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
  fetchBlogs,
  updateBlogsData,
  deleteBlog,
  Blog,
} from "@/api/blogService";
import { uploadToCloudinary } from "@/utils/uploadToCloudinary";

interface BlogWithMeta extends Blog {
  markedForDeletion?: boolean;
}

export const BlogPage: React.FC = () => {
  const [blogs, setBlogs] = useState<BlogWithMeta[]>([]);
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
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "hsl(var(--border)) !important",
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "hsl(0 84.2% 60.2%) !important",
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "hsl(0 84.2% 60.2%) !important",
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
    fetchBlogs()
      .then((res) => setBlogs(res))
      .catch(() => console.error("Failed to load blogs"))
      .finally(() => setLoading(false));
  }, []);

  // ------- Add Blog -------

  const addBlog = () => {
    setBlogs((prev) => [
      ...prev,
      {
        id: -1,
        title: "",
        excerpt: "",
        author: "",
        category: "",
        image: "",
        readTime: 5,
        link: "",
      },
    ]);
  };

  // ------- Generic change helper -------

  const handleChange = (
    index: number,
    field: keyof BlogWithMeta,
    value: any
  ) => {
    setBlogs((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  // ------- Image upload + crop (optional image) -------

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

    setBlogs((prev) => {
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

    setBlogs((prev) =>
      prev.map((b) =>
        b.id === deleteModal.id ? { ...b, markedForDeletion: true } : b
      )
    );
    setDeleteModal({ open: false, id: null });
  };

  // ------- Validation (image NOT required) -------

  const validate = (b: BlogWithMeta) =>
    b.title.trim() &&
    b.excerpt.trim() &&
    b.author.trim() &&
    b.category.trim() &&
    b.link.trim() &&
    b.readTime > 0;

  // ------- Save all (update + upload + delete) -------

  const handleSave = async () => {
    const toKeep = blogs.filter((b) => !b.markedForDeletion);
    const toDelete = blogs.filter((b) => b.markedForDeletion);

    if (toKeep.some((b) => !validate(b))) {
      setValidationModal(true);
      return;
    }

    try {
      setSaving(true);

      const uploadIfNeeded = async (url: string) => {
        // No image → return empty
        if (!url || url.trim() === "") return "";

        // If it's a Cloudinary URL → keep it
        if (url.startsWith("http")) return url;

        // If it's a blob but browser invalidated it → skip upload
        try {
          const response = await fetch(url);
          const blob = await response.blob();
          const file = new File([blob], "image.jpg", { type: blob.type });
          const uploaded = await uploadToCloudinary(file, "TCETBI/Blogs");
          URL.revokeObjectURL(url);
          return uploaded;
        } catch (err) {
          console.warn("⚠️ Skipping invalid blob URL:", url, err);
          return ""; // <-- prevent crash
        }
      };

      const payloadBlogs: Blog[] = await Promise.all(
        toKeep.map(async (b) => ({
          id: b.id && b.id !== -1 ? b.id : undefined,
          title: b.title.trim(),
          excerpt: b.excerpt.trim(),
          author: b.author.trim(),
          category: b.category.trim(),
          link: b.link.trim(),
          readTime: b.readTime,
          image: b.image ? await uploadIfNeeded(b.image) : "",
        }))
      );

      const res = await updateBlogsData(payloadBlogs);

      // Delete marked ones on backend
      for (const item of toDelete) {
        if (item.id && item.id !== -1) {
          await deleteBlog(item.id);
        }
      }

      // Refresh from backend
      const refreshed = await fetchBlogs();
      setBlogs(refreshed);

      setMessageText(res.message || "Blogs updated successfully!");
      setMessageType("success");
    } catch (err) {
      console.error(err);
      setMessageText("❌ Failed to update blogs!");
      setMessageType("error");
    } finally {
      setSaving(false);
      setMessageOpen(true);
    }
  };

  // ------- Visible list (search only, no category filter – always list all) -------

  const visibleBlogs = blogs
    .map((blog, index) => ({ blog, index }))
    .filter(({ blog }) => !blog.markedForDeletion)
    .filter(({ blog }) => {
      const q = searchQuery.toLowerCase();
      if (!q) return true;
      return (
        blog.title.toLowerCase().includes(q) ||
        blog.excerpt.toLowerCase().includes(q) ||
        blog.author.toLowerCase().includes(q) ||
        blog.category.toLowerCase().includes(q)
      );
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
        Blogs
      </Typography>

      {/* Search */}
      <TextField
        fullWidth
        placeholder="Search blogs by title, author, category..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{ ...textFieldStyles, mb: 3 }}
      />

      {/* Cards */}
      {visibleBlogs.map(({ blog, index }) => (
        <Box
          key={blog.id ?? index}
          sx={{
            p: 3,
            mb: 3,
            border: "1px solid hsl(var(--border))",
            borderRadius: "var(--radius)",
            position: "relative",
            maxWidth: 750,
            mx: "auto",
            backgroundColor: "hsl(var(--card))",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          }}
        >
          {/* Delete icon */}
          <IconButton
            onClick={() => openDeleteModal(blog.id)}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              color: "hsl(0 84.2% 60.2%)",
              zIndex: 50, // 👈 bring to front
              backgroundColor: "hsl(var(--card))", // 👈 optional: better contrast
              boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
              "&:hover": {
                backgroundColor: "hsl(0 84.2% 60.2% / 0.15)", // 👌 subtle hover
              },
            }}
          >
            <Trash2 size={20} />
          </IconButton>

          {/* Title */}
          <TextField
            fullWidth
            label="Title"
            value={blog.title}
            onChange={(e) => handleChange(index, "title", e.target.value)}
            sx={{ ...textFieldStyles, ...compactFieldSpacing }}
          />

          {/* Author + Category */}
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
              label="Author"
              value={blog.author}
              onChange={(e) => handleChange(index, "author", e.target.value)}
              sx={textFieldStyles}
            />
            <TextField
              fullWidth
              label="Category (Label)"
              value={blog.category}
              onChange={(e) => handleChange(index, "category", e.target.value)}
              sx={textFieldStyles}
            />
          </Box>

          {/* Excerpt */}
          <TextField
            fullWidth
            multiline
            minRows={2}
            maxRows={5}
            label="Short Excerpt (for cards / preview)"
            value={blog.excerpt}
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

              handleChange(index, "excerpt", newValue);
            }}
            onChange={(e) => handleChange(index, "excerpt", e.target.value)}
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

          {/* Read Time + Link */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr 2fr",
              gap: 2,
              mb: 1.5,
            }}
          >
            <TextField
              fullWidth
              type="number"
              label="Read Time (minutes)"
              inputProps={{ min: 1 }}
              value={blog.readTime}
              onChange={(e) =>
                handleChange(
                  index,
                  "readTime",
                  Math.max(1, Number(e.target.value) || 1)
                )
              }
              sx={textFieldStyles}
            />
            <TextField
              fullWidth
              label="Blog Link (internal or external URL)"
              value={blog.link}
             onChange={(e) => {
  const clean = e.target.value
    .replace(/[\u200B-\u200D\uFEFF]/g, "") // zero-width chars
    .replace(/\n/g, "")                    // newlines
    .trim();
  handleChange(index, "link", clean);
}}

              sx={textFieldStyles}
            />
          </Box>

          {/* Image Preview (optional) */}
          {blog.image && (
            <Box
              sx={{
                mb: 1.5,
                width: "100%",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <img
                src={blog.image}
                alt="preview"
                style={{
                  width: "100%",
                  height: 220,
                  objectFit: "cover",
                  borderRadius: "8px",
                }}
              />
            </Box>
          )}

          {/* Upload button (optional image) */}
          <input
            accept="image/*"
            id={`blog-img-${index}`}
            type="file"
            style={{ display: "none" }}
            onChange={(e) => handleImageUpload(e, index)}
          />
          <label htmlFor={`blog-img-${index}`}>
            <Button
              component="span"
              variant="outlined"
              fullWidth
              startIcon={<Upload size={16} />}
              sx={uploadButtonStyles}
            >
              {blog.image
                ? "Change Blog Image"
                : "Upload Blog Image (optional)"}
            </Button>
          </label>
        </Box>
      ))}

      {/* Add blog */}
      <Button startIcon={<Plus />} onClick={addBlog} sx={uploadButtonStyles}>
        Add Blog
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
        title="Delete Blog"
        message="Are you sure you want to delete this blog?"
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
            Please fill all required fields (Title, Excerpt, Content, Author,
            Category, Read Time, Link) before saving. Image is optional.
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
