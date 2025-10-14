import { motion } from 'framer-motion';
import { Box, Typography, Container } from '@mui/material';
import { CardContainer } from '../components/ui/CardContainer';
import { Calendar, User, ArrowRight } from 'lucide-react';

interface BlogPost {
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

const BlogCard = ({ blog }: { blog: BlogPost }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <CardContainer className="h-full cursor-pointer group">
        <div className="overflow-hidden rounded-lg mb-4">
          <motion.img
            src={blog.image}
            alt={blog.title}
            className="w-full h-48 object-cover transition-transform duration-300"
            whileHover={{ scale: 1.05 }}
          />
        </div>
        
        <div className="flex items-center gap-4 mb-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>{blog.date}</span>
          </div>
          <div className="flex items-center gap-1">
            <User className="w-4 h-4" />
            <span>{blog.author}</span>
          </div>
          <span>{blog.readTime} min read</span>
        </div>
        
        <span className="inline-block bg-primary/10 text-primary px-2 py-1 rounded text-xs mb-3">
          {blog.category}
        </span>
        
        <Typography 
          variant="h6" 
          sx={{ 
            mb: 2,
            color: 'hsl(var(--foreground))',
            fontFamily: 'Poppins, sans-serif',
            fontWeight: 600,
            lineHeight: 1.3,
          }}
        >
          {blog.title}
        </Typography>
        
        <Typography 
          variant="body2" 
          sx={{ 
            mb: 4,
            color: 'hsl(var(--muted-foreground))',
            fontFamily: 'Poppins, sans-serif',
            lineHeight: 1.5,
          }}
        >
          {blog.excerpt}
        </Typography>
        
        <div className="flex items-center text-primary hover:text-primary/80 transition-colors group-hover:translate-x-1 transform duration-200">
          <span className="text-sm font-medium">Read More</span>
          <ArrowRight className="w-4 h-4 ml-1" />
        </div>
      </CardContainer>
    </motion.div>
  );
};

export const Blogs: React.FC = () => {
  const blogPosts: BlogPost[] = [
    {
      id: 1,
      title: "The Future of Startup Incubation: Trends to Watch in 2024",
      excerpt: "Explore the latest trends shaping the startup ecosystem and how incubators are adapting to support emerging technologies and business models.",
      content: "",
      author: "Dr. Sarah Johnson",
      date: "March 15, 2024",
      category: "Innovation",
      image: "/api/placeholder/400/240",
      readTime: 5
    },
    {
      id: 2,
      title: "Success Story: How TechFlow Revolutionized Agricultural Technology",
      excerpt: "Learn about TechFlow's journey from a small startup idea to a leading AgTech company, and the role our incubation program played in their success.",
      content: "",
      author: "Mark Thompson",
      date: "March 12, 2024",
      category: "Success Stories",
      image: "/api/placeholder/400/240",
      readTime: 7
    },
    {
      id: 3,
      title: "Building a Sustainable Startup: Environmental Considerations",
      excerpt: "Discover how modern startups are integrating sustainability into their core business models and creating positive environmental impact.",
      content: "",
      author: "Dr. Emily Chen",
      date: "March 10, 2024",
      category: "Sustainability",
      image: "/api/placeholder/400/240",
      readTime: 6
    },
    {
      id: 4,
      title: "Funding Strategies for Early-Stage Startups",
      excerpt: "A comprehensive guide to various funding options available for startups, from bootstrapping to venture capital and everything in between.",
      content: "",
      author: "Robert Kim",
      date: "March 8, 2024",
      category: "Funding",
      image: "/api/placeholder/400/240",
      readTime: 8
    },
    {
      id: 5,
      title: "The Role of AI in Modern Business Innovation",
      excerpt: "Examining how artificial intelligence is transforming business operations and creating new opportunities for startup ventures.",
      content: "",
      author: "Dr. Michael Rodriguez",
      date: "March 5, 2024",
      category: "Technology",
      image: "/api/placeholder/400/240",
      readTime: 6
    },
    {
      id: 6,
      title: "Networking in the Digital Age: Building Meaningful Connections",
      excerpt: "Tips and strategies for entrepreneurs to build valuable professional networks in an increasingly digital world.",
      content: "",
      author: "Lisa Anderson",
      date: "March 3, 2024",
      category: "Networking",
      image: "/api/placeholder/400/240",
      readTime: 4
    },
    {
      id: 7,
      title: "Women in Entrepreneurship: Breaking Barriers and Creating Change",
      excerpt: "Celebrating female entrepreneurs and examining the unique challenges and opportunities they face in today's business landscape.",
      content: "",
      author: "Dr. Priya Sharma",
      date: "March 1, 2024",
      category: "Diversity",
      image: "/api/placeholder/400/240",
      readTime: 5
    },
    {
      id: 8,
      title: "From Prototype to Product: The Development Journey",
      excerpt: "A detailed look at the product development process and how our facilities support startups in bringing their ideas to life.",
      content: "",
      author: "James Wilson",
      date: "February 28, 2024",
      category: "Product Development",
      image: "/api/placeholder/400/240",
      readTime: 7
    },
    {
      id: 9,
      title: "Global Markets: Expanding Your Startup Internationally",
      excerpt: "Strategies and considerations for startups looking to expand their operations beyond domestic markets.",
      content: "",
      author: "Ana Martinez",
      date: "February 26, 2024",
      category: "Global Business",
      image: "/api/placeholder/400/240",
      readTime: 6
    }
  ];

  return (
    <Box sx={{ pt: 16, pb: 8, minHeight: '100vh', backgroundColor: 'hsl(var(--background))' }}>
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
              color: 'hsl(var(--foreground))',
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 600,
            }}
          >
          <Box component="span" sx={{ color: 'hsl(var(--destructive))' }}>Insights</Box> & Stories
             
          </Typography>
          <Typography 
            variant="h6" 
            align="center" 
            sx={{ 
              mb: 8,
              color: 'hsl(var(--muted-foreground))',
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 400,
              maxWidth: '600px',
              mx: 'auto',
            }}
          >
            Stay updated with the latest trends, success stories, and insights from the startup ecosystem
          </Typography>
        </motion.div>
        
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }, 
          gap: 4 
        }}>
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