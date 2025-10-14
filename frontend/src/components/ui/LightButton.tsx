import { motion } from 'framer-motion';
import { Button, ButtonProps } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledLightButton = styled(Button)(({ theme }) => ({
  backgroundColor: 'hsl(var(--secondary))',
  color: 'hsl(var(--secondary-foreground))',
  borderRadius: 'var(--radius)',
  fontFamily: 'Poppins, sans-serif',
  fontWeight: 500,
  textTransform: 'none',
  padding: '12px 24px',
  boxShadow: 'var(--shadow-soft)',
  '&:hover': {
    backgroundColor: 'hsl(var(--beau-blue))',
    boxShadow: 'var(--shadow-glow)',
    transform: 'translateY(-2px)',
  },
  '&:active': {
    transform: 'translateY(0px)',
  },
}));

interface LightButtonProps extends ButtonProps {
  children: React.ReactNode;
}

export const LightButton: React.FC<LightButtonProps> = ({ children, ...props }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    >
      <StyledLightButton {...props}>
        {children}
      </StyledLightButton>
    </motion.div>
  );
};