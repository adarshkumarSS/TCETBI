import { Box, Typography, Chip, IconButton } from "@mui/material";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DarkButton } from "@/components/ui/DarkButton";
import { ExternalLink, Heart, MessageCircle, ArrowLeft, Image, FileText, AtSign, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface LinkedinPosts {
  id: string;
  title: string;
  content: string;
  postedDate: string;
  likes: number;
  comments: number;
  url: string;
}

const mockPosts: LinkedinPosts[] = [
  {
    id: "1",
    title: "Exciting New Startups Join TCE-TBI",
    content: "We're thrilled to welcome three innovative startups to our incubation program...",
    postedDate: "2025-09-28",
    likes: 145,
    comments: 23,
    url: "https://linkedin.com/post/1",
  },
  {
    id: "2",
    title: "Innovation Workshop Success",
    content: "Our recent workshop on AI and Machine Learning saw record attendance...",
    postedDate: "2025-09-20",
    likes: 98,
    comments: 15,
    url: "https://linkedin.com/post/2",
  },
];

export const LinkedinPosts = () => {
  const navigate = useNavigate();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [postContent, setPostContent] = useState("");
  const [postTitle, setPostTitle] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [mentionText, setMentionText] = useState("");

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
  };

  const handleCreatePost = () => {
    // Handle post creation logic here
    console.log({
      title: postTitle,
      content: postContent,
      image: selectedImage,
      file: selectedFile,
      mentions: mentionText
    });
    
    // Reset form
    setPostTitle("");
    setPostContent("");
    setSelectedImage(null);
    setSelectedFile(null);
    setImagePreview(null);
    setMentionText("");
    setIsCreateDialogOpen(false);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "hsl(var(--background))",
        pt: 12,
        px: 4,
      }}
    >
      <Box
        sx={{
          maxWidth: "1200px",
          mx: "auto",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <IconButton
              onClick={() => navigate("/admin")}
              sx={{
                color: "hsl(var(--foreground))",
                "&:hover": { backgroundColor: "hsl(var(--muted))" },
              }}
            >
              <ArrowLeft size={24} />
            </IconButton>
            <Typography
              variant="h4"
              sx={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 700,
                color: "hsl(var(--foreground))",
              }}
            >
              LinkedIn Posts
            </Typography>
          </Box>
          <DarkButton onClick={() => setIsCreateDialogOpen(true)}>Create New Post</DarkButton>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
            gap: 3,
          }}
        >
          {mockPosts.map((post) => (
            <Card key={post.id}>
              <CardHeader>
                <CardTitle>{post.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  {post.content}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: "hsl(var(--muted-foreground))", display: "block", mb: 2 }}
                >
                  Posted: {post.postedDate}
                </Typography>
                <Box sx={{ display: "flex", gap: 3, mb: 2 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <Heart size={16} />
                    <Typography variant="body2">{post.likes}</Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <MessageCircle size={16} />
                    <Typography variant="body2">{post.comments}</Typography>
                  </Box>
                </Box>
                <DarkButton
                  size="small"
                  startIcon={<ExternalLink size={16} />}
                  onClick={() => window.open(post.url, "_blank")}
                >
                  View on LinkedIn
                </DarkButton>
              </CardContent>
            </Card>
          ))}
        </Box>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create LinkedIn Post</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4 mt-4">
              <div>
                <Label htmlFor="post-title">Post Title</Label>
                <Input
                  id="post-title"
                  placeholder="Enter a catchy title..."
                  value={postTitle}
                  onChange={(e) => setPostTitle(e.target.value)}
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label htmlFor="post-content">Post Content</Label>
                <Textarea
                  id="post-content"
                  placeholder="What do you want to share?"
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  className="mt-1.5 min-h-[150px]"
                />
              </div>

              <div>
                <Label htmlFor="mentions">Mention People (separate with commas)</Label>
                <div className="flex items-center gap-2 mt-1.5">
                  <AtSign size={20} className="text-muted-foreground" />
                  <Input
                    id="mentions"
                    placeholder="e.g., @JohnDoe, @JaneSmith"
                    value={mentionText}
                    onChange={(e) => setMentionText(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="image-upload">Upload Image</Label>
                  <div className="mt-1.5">
                    <Input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="cursor-pointer"
                    />
                  </div>
                  {imagePreview && (
                    <div className="relative mt-3">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-40 object-cover rounded-md border"
                      />
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={handleRemoveImage}
                      >
                        <X size={16} />
                      </Button>
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="file-upload">Upload Document</Label>
                  <div className="mt-1.5">
                    <Input
                      id="file-upload"
                      type="file"
                      accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx"
                      onChange={handleFileUpload}
                      className="cursor-pointer"
                    />
                  </div>
                  {selectedFile && (
                    <div className="mt-3 p-3 border rounded-md flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText size={20} className="text-muted-foreground" />
                        <span className="text-sm truncate">{selectedFile.name}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleRemoveFile}
                      >
                        <X size={16} />
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsCreateDialogOpen(false)}
                >
                  Cancel
                </Button>
                <DarkButton
                  onClick={handleCreatePost}
                  disabled={!postTitle || !postContent}
                >
                  Publish Post
                </DarkButton>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </Box>
    </Box>
  );
};
