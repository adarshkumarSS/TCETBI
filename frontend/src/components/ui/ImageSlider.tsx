import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface SlideImage {
  id: number;
  src: string;
  title: string;
  description: string;
}

interface ImageSliderProps {
  images: SlideImage[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
}

export const ImageSlider: React.FC<ImageSliderProps> = ({ 
  images, 
  autoPlay = true, 
  autoPlayInterval = 3000 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-play functionality
  useEffect(() => {
    if (!autoPlay) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [autoPlay, autoPlayInterval, images.length]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const getVisibleImages = () => {
    const visible = [];
    for (let i = -2; i <= 2; i++) {
      const index = (currentIndex + i + images.length) % images.length;
      visible.push({ ...images[index], position: i });
    }
    return visible;
  };

  return (
    <div className="relative w-full h-96 overflow-hidden rounded-3xl bg-gradient-to-r from-hsl(var(--muted)) via-transparent to-hsl(var(--muted))">
      <div className="flex items-center justify-center h-full">
        <AnimatePresence mode="wait">
          {getVisibleImages().map((image, index) => (
            <motion.div
              key={`${image.id}-${image.position}-${currentIndex}`}
              className="absolute cursor-pointer"
              initial={{ 
                scale: image.position === 0 ? 1.2 : 0.7,
                opacity: image.position === 0 ? 1 : 0.4,
                x: image.position * 240,
                rotateY: image.position * 25,
                z: image.position === 0 ? 50 : 0
              }}
              animate={{
                scale: image.position === 0 ? 1.2 : 0.7,
                opacity: image.position === 0 ? 1 : 0.4,
                x: image.position * 240,
                rotateY: image.position * 25,
                z: image.position === 0 ? 50 : 0,
              }}
              exit={{
                scale: 0.5,
                opacity: 0,
                transition: { duration: 0.3 }
              }}
              transition={{ 
                duration: 0.8, 
                ease: [0.25, 0.46, 0.45, 0.94],
                type: "spring",
                stiffness: 100,
                damping: 15
              }}
              style={{
                width: image.position === 0 ? '320px' : '280px',
                height: image.position === 0 ? '320px' : '280px',
                transformStyle: 'preserve-3d',
              }}
              onClick={() => setCurrentIndex((currentIndex + image.position + images.length) % images.length)}
              whileHover={{
                scale: image.position === 0 ? 1.25 : 0.75,
                transition: { duration: 0.2 }
              }}
            >
              <div className="rounded-3xl overflow-hidden shadow-2xl h-full relative group">
                <motion.img
                  src={image.src}
                  alt={image.title}
                  className="w-full h-full object-cover"
                  style={{
                    filter: image.position === 0 ? 'brightness(1)' : 'brightness(0.7)',
                  }}
                />
                
                {/* Gradient overlay for active image */}
                {image.position === 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"
                  />
                )}
                
                {/* Content overlay for center image */}
                {image.position === 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="absolute bottom-0 left-0 right-0 p-6 text-white"
                  >
                    <motion.h3 
                      className="text-xl font-bold mb-2 font-poppins"
                      style={{ textShadow: '0 2px 10px rgba(0,0,0,0.7)' }}
                    >
                      {image.title}
                    </motion.h3>
                    <motion.p 
                      className="text-white/90 text-sm leading-relaxed font-poppins"
                      style={{ textShadow: '0 1px 5px rgba(0,0,0,0.7)' }}
                    >
                      {image.description}
                    </motion.p>
                  </motion.div>
                )}
                
                {/* Glow effect for center image */}
                {image.position === 0 && (
                  <div className="absolute inset-0 rounded-3xl ring-4 ring-primary/30 ring-offset-4 ring-offset-transparent" />
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Navigation buttons */}
      <motion.button
        onClick={prevSlide}
        className="absolute left-6 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-md rounded-full p-3 hover:bg-white/30 transition-all shadow-lg border border-white/30"
        whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.4)' }}
        whileTap={{ scale: 0.95 }}
      >
        <ChevronLeft className="w-6 h-6 text-white drop-shadow-lg" />
      </motion.button>

      <motion.button
        onClick={nextSlide}
        className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-md rounded-full p-3 hover:bg-white/30 transition-all shadow-lg border border-white/30"
        whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.4)' }}
        whileTap={{ scale: 0.95 }}
      >
        <ChevronRight className="w-6 h-6 text-white drop-shadow-lg" />
      </motion.button>

      {/* Dot indicators */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {images.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? 'bg-white shadow-lg scale-125' 
                : 'bg-white/50 hover:bg-white/70'
            }`}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          />
        ))}
      </div>
    </div>
  );
};