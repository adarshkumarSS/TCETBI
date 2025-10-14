import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface CardContainerProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
  style?: React.CSSProperties;
}

export const CardContainer: React.FC<CardContainerProps> = ({
  children,
  className = '',
  hover = true,
  onClick,
  style
}) => {
  return (
    <motion.div
      className={`glass-card mac-rounded p-6 ${hover ? 'glow-hover' : ''} ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      whileHover={hover ? { y: -4 } : {}}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default', ...style }}
    >
      {children}
    </motion.div>
  );
};
