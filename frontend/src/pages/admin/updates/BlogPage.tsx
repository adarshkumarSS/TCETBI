import { useState } from "react";
import { Box, Typography, TextField, Button, IconButton } from "@mui/material";
import { Upload, Plus, Trash2 } from "lucide-react";
import { DarkButton } from "@/components/ui/DarkButton";

interface Blog {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  category: string;
  image: string;
  readTime: number;
}

export const BlogPage: React.FC=() => {
  const [blogs, setBlogs] = useState<Blog[]>([
    {
      id: 1,
      title: "The Future of Startup Incubation: Trends to Watch in 2024",
      excerpt:
        "Explore the latest trends shaping the startup ecosystem and how incubators are adapting to support emerging technologies and business models.",
      content: "",
      author: "Dr. Sarah Johnson",
      date: "March 15, 2024",
      category: "Innovation",
      image: "/api/placeholder/400/240",
      readTime: 5,
    },
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

  const handleBlogChange = (id: number, field: string, value: any) => {
    const updated = blogs.map((b) =>
      b.id === id ? { ...b, [field]: value } : b
    );
    setBlogs(updated);
  };

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    id: number
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const updated = blogs.map((b) =>
          b.id === id ? { ...b, image: reader.result as string } : b
        );
        setBlogs(updated);
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
        Blog Posts
      </Typography>

      {blogs.map((blog) => (
        <Box
          key={blog.id}
          sx={{
            p: 3,
            mb: 3,
            border: "1px solid hsl(var(--border))",
            borderRadius: "var(--radius)",
            position: "relative",
          }}
        >
          {blogs.length > 1 && (
            <IconButton
              onClick={() => setBlogs(blogs.filter((b) => b.id !== blog.id))}
              sx={{ position: "absolute", top: 8, right: 8, color: "hsl(0 84.2% 60.2%)" }}
            >
              <Trash2 size={20} />
            </IconButton>
          )}

          <TextField
            fullWidth
            label="Title"
            value={blog.title}
            onChange={(e) => handleBlogChange(blog.id, "title", e.target.value)}
            sx={{ ...textFieldStyles, mb: 2 }}
          />

          <TextField
            fullWidth
            multiline
            rows={2}
            label="Excerpt"
            value={blog.excerpt}
            onChange={(e) => handleBlogChange(blog.id, "excerpt", e.target.value)}
            sx={{ ...textFieldStyles, mb: 2 }}
          />

          <TextField
            fullWidth
            multiline
            rows={4}
            label="Content"
            value={blog.content}
            onChange={(e) => handleBlogChange(blog.id, "content", e.target.value)}
            sx={{ ...textFieldStyles, mb: 2 }}
          />

          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, mb: 2 }}>
            <TextField
              fullWidth
              label="Author"
              value={blog.author}
              onChange={(e) => handleBlogChange(blog.id, "author", e.target.value)}
              sx={textFieldStyles}
            />
            <TextField
              fullWidth
              label="Date"
              value={blog.date}
              onChange={(e) => handleBlogChange(blog.id, "date", e.target.value)}
              sx={textFieldStyles}
            />
          </Box>

          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, mb: 2 }}>
            <TextField
              fullWidth
              label="Category"
              value={blog.category}
              onChange={(e) => handleBlogChange(blog.id, "category", e.target.value)}
              sx={textFieldStyles}
            />
            <TextField
              fullWidth
              label="Read Time (minutes)"
              type="number"
              value={blog.readTime}
              onChange={(e) =>
                handleBlogChange(blog.id, "readTime", Number(e.target.value))
              }
              sx={textFieldStyles}
            />
          </Box>

          <TextField
            fullWidth
            label="Image URL"
            value={blog.image}
            onChange={(e) => handleBlogChange(blog.id, "image", e.target.value)}
            sx={{ ...textFieldStyles, mb: 2 }}
          />

          {blog.image && (
            <img
              src={blog.image}
              alt={blog.title}
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
            id={`blog-image-${blog.id}`}
            type="file"
            onChange={(e) => handleImageUpload(e, blog.id)}
          />
          <label htmlFor={`blog-image-${blog.id}`}>
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
          const newId = Math.max(...blogs.map((b) => b.id), 0) + 1;
          setBlogs([
            ...blogs,
            {
              id: newId,
              title: "",
              excerpt: "",
              content: "",
              author: "",
              date: "",
              category: "",
              image: "",
              readTime: 5,
            },
          ]);
        }}
        sx={uploadButtonStyles}
      >
        Add Blog Post
      </Button>

      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4 }}>
        <DarkButton>Save Changes</DarkButton>
      </Box>
    </Box>
  );
};