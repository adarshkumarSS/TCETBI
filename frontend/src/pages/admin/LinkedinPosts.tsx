import { Box, Typography, Chip } from "@mui/material";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DarkButton } from "@/components/ui/DarkButton";
import { ExternalLink, Heart, MessageCircle } from "lucide-react";

interface LinkedinPost {
  id: string;
  title: string;
  content: string;
  postedDate: string;
  likes: number;
  comments: number;
  url: string;
}

const mockPosts: LinkedinPost[] = [
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
          <DarkButton>Create New Post</DarkButton>
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
      </Box>
    </Box>
  );
};
