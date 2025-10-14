import { motion } from 'framer-motion';
import { Box, Typography } from '@mui/material';
import { CardContainer } from './CardContainer';
import { useState } from 'react';

interface SuccessStory {
  id: number;
  title: string;
  description: string;
  image: string;
  sector: string;
  impact: string;
}

interface SuccessStoryAnimatedProps {
  stories: SuccessStory[];
}

export const SuccessStoryAnimated: React.FC<SuccessStoryAnimatedProps> = ({ stories }) => {
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  return (
    <Box sx={{ 
      display: 'grid', 
      gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }, 
      gap: 4 
    }}>
      {stories.map((story, index) => (
        <motion.div
          key={story.id}
          initial={{ opacity: 0, y: 50, rotateY: 15 }}
          whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
          transition={{ 
            duration: 0.8, 
            delay: index * 0.2,
            type: "spring",
            stiffness: 100
          }}
          viewport={{ once: true }}
          onMouseEnter={() => setHoveredId(story.id)}
          onMouseLeave={() => setHoveredId(null)}
          style={{ transformStyle: 'preserve-3d' }}
        >
          <motion.div
            whileHover={{ 
              scale: 1.05,
              rotateX: 5,
              rotateY: 5,
              z: 50
            }}
            transition={{ duration: 0.3 }}
            style={{ 
              transformStyle: 'preserve-3d',
              perspective: '1000px'
            }}
          >
            <CardContainer className="overflow-hidden h-full">
              <Box sx={{ position: 'relative' }}>
                <motion.div
                  style={{
                    overflow: 'hidden',
                    borderRadius: 'var(--radius)',
                    height: 250,
                    position: 'relative'
                  }}
                  animate={{
                    scale: hoveredId === story.id ? 1.1 : 1,
                  }}
                  transition={{ duration: 0.4 }}
                >
                  <motion.img
                    src={story.image}
                    alt={story.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      borderRadius: 'var(--radius)',
                    }}
                    animate={{
                      filter: hoveredId === story.id ? 'brightness(1.1) contrast(1.1)' : 'brightness(1) contrast(1)',
                    }}
                    transition={{ duration: 0.3 }}
                  />
                  
                  {/* Animated overlay */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"
                    style={{ borderRadius: 'var(--radius)' }}
                    initial={{ opacity: 0 }}
                    animate={{ 
                      opacity: hoveredId === story.id ? 1 : 0.7,
                    }}
                    transition={{ duration: 0.3 }}
                  />
                  
                  {/* Floating impact badge */}
                  <motion.div
                    className="absolute top-4 right-4"
                    initial={{ opacity: 0, scale: 0.8, rotateZ: -10 }}
                    animate={{ 
                      opacity: 1, 
                      scale: hoveredId === story.id ? 1.1 : 1,
                      rotateZ: hoveredId === story.id ? 0 : -10
                    }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                  >
                    <Box
                      sx={{
                        px: 2,
                        py: 1,
                        backgroundColor: 'hsl(var(--primary))',
                        color: 'hsl(var(--primary-foreground))',
                        borderRadius: '20px',
                        fontSize: '0.75rem',
                        fontFamily: 'Poppins, sans-serif',
                        fontWeight: 600,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                        backdropFilter: 'blur(10px)',
                      }}
                    >
                      {story.impact}
                    </Box>
                  </motion.div>
                </motion.div>
                
                {/* Content section */}
                <Box sx={{ p: 3 }}>
                  <motion.div
                    animate={{
                      y: hoveredId === story.id ? -5 : 0,
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        mb: 1,
                        color: 'hsl(var(--foreground))',
                        fontFamily: 'Poppins, sans-serif',
                        fontWeight: 600,
                      }}
                    >
                      {story.title}
                    </Typography>
                    
                    <motion.div
                      animate={{
                        color: hoveredId === story.id ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))',
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          mb: 2,
                          fontFamily: 'Poppins, sans-serif',
                          fontWeight: 500,
                        }}
                      >
                        {story.sector}
                      </Typography>
                    </motion.div>
                    
                    <motion.div
                      initial={{ opacity: 0.8 }}
                      animate={{
                        opacity: hoveredId === story.id ? 1 : 0.8,
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          color: 'hsl(var(--muted-foreground))',
                          fontFamily: 'Poppins, sans-serif',
                          lineHeight: 1.5,
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {story.description}
                      </Typography>
                    </motion.div>
                  </motion.div>
                </Box>
                
                {/* Animated bottom border */}
                <motion.div
                  className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-primary via-accent to-primary"
                  initial={{ width: '0%' }}
                  animate={{
                    width: hoveredId === story.id ? '100%' : '30%',
                  }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                />
              </Box>
            </CardContainer>
          </motion.div>
        </motion.div>
      ))}
    </Box>
  );
};