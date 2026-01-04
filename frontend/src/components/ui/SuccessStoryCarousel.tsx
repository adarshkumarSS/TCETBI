import { motion } from 'framer-motion';
import { Box, Typography, IconButton } from '@mui/material';
import { CardContainer } from './CardContainer';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';

interface SuccessStory {
  id?: number;
  title: string;
  description: string;
  image: string;
  sector: string;
  impact: string;
}

interface SuccessStoryCarouselProps {
  stories: SuccessStory[];
}

export const SuccessStoryCarousel: React.FC<SuccessStoryCarouselProps> = ({ stories }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const nextSlide = useCallback(() => {
    if (!stories || stories.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % stories.length);
  }, [stories]);

  const prevSlide = useCallback(() => {
    if (!stories || stories.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + stories.length) % stories.length);
  }, [stories]);

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  useEffect(() => {
    if (!isHovered && stories && stories.length > 0) {
      const interval = setInterval(() => {
        nextSlide();
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isHovered, nextSlide, stories]);

  if (!stories || stories.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 8, color: 'text.secondary' }}>
        <Typography variant="h6" sx={{ fontFamily: 'Poppins, sans-serif' }}>
          No success stories added yet.
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{ position: 'relative', maxWidth: '100%', mx: 'auto' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Main Carousel */}
      <Box sx={{ overflow: 'hidden', borderRadius: 'var(--radius)' }}>
        <motion.div
          style={{
            display: 'flex',
            transform: `translateX(-${currentIndex * 100}%)`,
          }}
          animate={{
            transform: `translateX(-${currentIndex * 100}%)`,
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          {stories.map((story, index) => (
            <Box
              key={story.id || index}
              sx={{
                minWidth: '100%',
                px: 2,
              }}
            >
              <CardContainer>
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
                  <Box sx={{ flex: 1 }}>
                    <motion.img
                      src={story.image}
                      alt={story.title}
                      style={{
                        width: '100%',
                        height: 300,
                        objectFit: 'cover',
                        borderRadius: 'var(--radius)',
                      }}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5 }}
                    />
                  </Box>
                  <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <Typography
                      variant="h4"
                      sx={{
                        mb: 2,
                        color: 'hsl(var(--foreground))',
                        fontFamily: 'Poppins, sans-serif',
                        fontWeight: 600,
                      }}
                    >
                      {story.title}
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{
                        mb: 2,
                        color: 'hsl(var(--foreground))',
                        fontFamily: 'Poppins, sans-serif',
                        fontWeight: 500,
                      }}
                    >
                      {story.sector}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        mb: 3,
                        color: 'hsl(var(--muted-foreground))',
                        fontFamily: 'Poppins, sans-serif',
                        lineHeight: 1.6,
                      }}
                    >
                      {story.description}
                    </Typography>
                    <Box
                      sx={{
                        px: 3,
                        py: 2,
                        backgroundColor: 'hsl(var(--secondary))',
                        color: 'hsl(var(--secondary-foreground))',
                        borderRadius: 'var(--radius)',
                        display: 'inline-block',
                        alignSelf: 'flex-start',
                        border: '1px solid hsl(var(--border))',
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          fontFamily: 'Poppins, sans-serif',
                          fontWeight: 600,
                          color: 'inherit',
                        }}
                      >
                        Impact: {story.impact}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </CardContainer>
            </Box>
          ))}
        </motion.div>
      </Box>

      {/* Navigation Arrows - Always White */}
      <Box
        sx={{
          position: 'absolute',
          left: 16,
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 10,
        }}
      >
        <IconButton
          onClick={prevSlide}
          sx={{
            backgroundColor: 'white',
            color: 'black',
            borderRadius: '50%',
            width: 48,
            height: 48,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 2,
            backdropFilter: 'blur(8px)',
            opacity: 0.9,
            '&:hover': {
              backgroundColor: 'white',
              opacity: 1,
            },
          }}
          component={motion.button}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ChevronLeft className="w-6 h-6" />
        </IconButton>
      </Box>

      <Box
        sx={{
          position: 'absolute',
          right: 16,
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 10,
        }}
      >
        <IconButton
          onClick={nextSlide}
          sx={{
            backgroundColor: 'white',
            color: 'black',
            borderRadius: '50%',
            width: 48,
            height: 48,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 2,
            backdropFilter: 'blur(8px)',
            opacity: 0.9,
            '&:hover': {
              backgroundColor: 'white',
              opacity: 1,
            },
          }}
          component={motion.button}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ChevronRight className="w-6 h-6" />
        </IconButton>
      </Box>

      {/* Dots Indicator */}
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mt: 4 }}>
        {stories.map((_, index) => (
          <IconButton
            key={index}
            onClick={() => goToSlide(index)}
            sx={{
              width: 12,
              height: 12,
              minWidth: 12,
              borderRadius: '50%',
              backgroundColor: index === currentIndex ? 'white' : 'rgba(255, 255, 255, 0.3)',
              p: 0,
              '&:hover': {
                backgroundColor: index === currentIndex ? 'white' : 'rgba(255, 255, 255, 0.5)',
              },
            }}
            component={motion.button}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          />
        ))}
      </Box>
    </Box>
  );
};
