import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface LoaderProps {
  targetNumber: number;
  duration?: number;
  suffix?: string;
}

export const Loader: React.FC<LoaderProps> = ({ 
  targetNumber, 
  duration = 2000, 
  suffix = '' 
}) => {
  const [currentNumber, setCurrentNumber] = useState(0);

  useEffect(() => {
    const increment = targetNumber / (duration / 50);
    const timer = setInterval(() => {
      setCurrentNumber((prev) => {
        const next = prev + increment;
        if (next >= targetNumber) {
          clearInterval(timer);
          return targetNumber;
        }
        return next;
      });
    }, 50);

    return () => clearInterval(timer);
  }, [targetNumber, duration]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="text-4xl font-bold text-primary font-poppins"
    >
      {Math.floor(currentNumber)}{suffix}
    </motion.div>
  );
};