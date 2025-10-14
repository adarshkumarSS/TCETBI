import { motion } from 'framer-motion';

interface Logo {
  id: number;
  name: string;
  src: string;
}

interface ScrollingLogosProps {
  logos: Logo[];
  direction?: 'left' | 'right';
  speed?: number;
}

export const ScrollingLogos: React.FC<ScrollingLogosProps> = ({ 
  logos, 
  direction = 'right', 
  speed = 20 
}) => {
  // Create multiple copies for seamless looping
  const repeatedLogos = [...logos, ...logos, ...logos, ...logos];
  const animationDirection = direction === 'right' ? -1 : 1;

  return (
    <div className="overflow-hidden py-6 bg-gradient-to-r from-transparent via-hsl(var(--muted)/0.3) to-transparent">
      <motion.div
        className="flex gap-12 items-center"
        animate={{
          x: animationDirection * 100 * logos.length,
        }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: 'loop',
            duration: speed,
            ease: 'linear',
          },
        }}
        style={{ 
          width: `${repeatedLogos.length * 200}px`,
          willChange: 'transform'
        }}
      >
        {repeatedLogos.map((logo, index) => (
          <motion.div
            key={`${logo.id}-${index}`}
            className="flex-shrink-0 w-40 h-20 flex items-center justify-center bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg"
            whileHover={{ 
              scale: 1.1,
              backgroundColor: 'rgba(255,255,255,0.2)',
              transition: { duration: 0.2 }
            }}
            style={{
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            }}
          >
            <img
              src={logo.src}
              alt={logo.name}
              className="max-w-full max-h-full object-contain filter brightness-0 invert hover:brightness-100 hover:invert-0 transition-all duration-500"
              style={{
                filter: 'brightness(0) invert(1)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.filter = 'brightness(1) invert(0)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.filter = 'brightness(0) invert(1)';
              }}
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};