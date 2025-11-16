import { motion } from "framer-motion";
import { Box, Typography, Container } from "@mui/material";
import { CardContainer } from "../components/ui/CardContainer";
import { Calendar, User, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchBlogs } from "@/api/blogService";
import type { Blog } from "@/api/blogService";

const BlogCard = ({ blog }: { blog: Blog }) => {
  const isExternal = blog.link?.startsWith("http");

  const Wrapper: any = isExternal ? "a" : Link;
  const wrapperProps = isExternal
    ? { href: blog.link, target: "_blank", rel: "noopener noreferrer" }
    : { to: blog.link || `/blogs/${blog.id}` };

  return (
    <Wrapper {...wrapperProps} style={{ textDecoration: "none" }}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <CardContainer className="h-full cursor-pointer group">

          {/* IMAGE */}
          <div className="overflow-hidden rounded-lg mb-4">
            <motion.img
              src={blog.image}
              alt={blog.title}
              className="w-full h-48 object-cover transition-transform duration-300"
              whileHover={{ scale: 1.05 }}
            />
          </div>

          {/* META SECTION — Enhanced */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              mb: 3,
              color: "hsl(var(--muted-foreground))",
              fontSize: "0.875rem",
              flexWrap: "wrap",
            }}
          >

            {/* AUTHOR */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
              <User className="w-5 h-5 opacity-80" />
              <span>{blog.author}</span>
            </Box>

            {/* Dot separator */}
            <Box
              sx={{
                width: 5,
                height: 5,
                borderRadius: "50%",
                backgroundColor: "hsl(var(--muted-foreground))",
                opacity: 0.6,
              }}
            />

            {/* READ TIME */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
              <span>{blog.readTime} min read</span>
            </Box>
          </Box>

          {/* CATEGORY BADGE */}
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              px: 1.8,
              py: 0.6,
              borderRadius: "999px",
              fontSize: "0.75rem",
              fontWeight: 600,
              backgroundColor: "hsl(var(--destructive))",
              color: "white",
              letterSpacing: 0.3,
              mb: 2,
              textTransform: "capitalize",
              boxShadow: "0 2px 6px rgba(0,0,0,0.25)",
            }}
          >
            {blog.category}
          </Box>

          {/* TITLE */}
          <Typography
            variant="h6"
            sx={{
              mb: 2,
              color: "hsl(var(--foreground))",
              fontFamily: "Poppins, sans-serif",
              fontWeight: 600,
              lineHeight: 1.3,
            }}
          >
            {blog.title}
          </Typography>

          {/* EXCERPT */}
          <Typography
            variant="body2"
            sx={{
              mb: 4,
              color: "hsl(var(--muted-foreground))",
              fontFamily: "Poppins, sans-serif",
              lineHeight: 1.5,
            }}
          >
            {blog.excerpt}
          </Typography>

          {/* READ MORE */}
          <div className="flex items-center text-primary hover:text-primary/80 transition-colors group-hover:translate-x-1 transform duration-200">
            <span className="text-sm font-medium">Read More</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </div>
        </CardContainer>
      </motion.div>
    </Wrapper>
  );
};

export const Blogs: React.FC = () => {
  const [blogPosts, setBlogPosts] = useState<Blog[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchBlogs();
        setBlogPosts(data);
      } catch (err) {
        console.error("Failed to load blogs", err);
      }
    })();
  }, []);

  return (
    <Box sx={{ pt: 16, pb: 8, minHeight: "100vh", backgroundColor: "hsl(var(--background))" }}>
      <Container maxWidth="lg">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Typography
            variant="h2"
            align="center"
            sx={{
              mb: 3,
              color: "hsl(var(--foreground))",
              fontFamily: "Poppins, sans-serif",
              fontWeight: 600,
            }}
          >
            <Box component="span" sx={{ color: "hsl(var(--destructive))" }}>
              Insights
            </Box>{" "}
            & Stories
          </Typography>

          <Typography
            variant="h6"
            align="center"
            sx={{
              mb: 8,
              color: "hsl(var(--muted-foreground))",
              fontFamily: "Poppins, sans-serif",
              fontWeight: 400,
              maxWidth: "600px",
              mx: "auto",
            }}
          >
            Stay updated with the latest trends, success stories, and insights from the startup ecosystem
          </Typography>
        </motion.div>

        {/* GRID */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" },
            gap: 4,
          }}
        >
          {blogPosts.map((blog, index) => (
            <motion.div
              key={blog.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <BlogCard blog={blog} />
            </motion.div>
          ))}
        </Box>
      </Container>
    </Box>
  );
};
