import { motion } from 'framer-motion';
import { Box, Typography, IconButton } from '@mui/material';
import { CardContainer } from './CardContainer';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

interface SuccessStory {
  id: number;
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

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % stories.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + stories.length) % stories.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <Box sx={{ position: 'relative', maxWidth: '100%', mx: 'auto' }}>
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
              key={story.id}
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
                        color: 'white',
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
                        color: 'white',
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
                        color: 'white',
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
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                        color: 'white',
                        borderRadius: 'var(--radius)',
                        display: 'inline-block',
                        alignSelf: 'flex-start',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          fontFamily: 'Poppins, sans-serif',
                          fontWeight: 600,
                          color: 'white',
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
      <IconButton
        onClick={prevSlide}
        sx={{
          position: 'absolute',
          left: 16,
          top: '50%',
          transform: 'translateY(-50%)',
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
          zIndex: 10,
        }}
        component={motion.button}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <ChevronLeft className="w-6 h-6" />
      </IconButton>

      <IconButton
        onClick={nextSlide}
        sx={{
          position: 'absolute',
          right: 16,
          top: '50%',
          transform: 'translateY(-50%)',
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
          zIndex: 10,
        }}
        component={motion.button}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <ChevronRight className="w-6 h-6" />
      </IconButton>

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