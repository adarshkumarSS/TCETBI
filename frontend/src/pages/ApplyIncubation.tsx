import { Box, Container, Typography, Paper } from '@mui/material';
import { motion } from 'framer-motion';
import { Building2 } from 'lucide-react';
import { ArrowBack } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { DynamicForm } from '../components/DynamicForm';

export const ApplyIncubation = () => {
  return (
    <Box sx={{ minHeight: "100vh", pt: 12, pb: 8, backgroundColor: "hsl(var(--background))" }}>
      <Container maxWidth="xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Back Button */}
          <Box sx={{ mb: 3 }}>
            <Link to="/" style={{ textDecoration: 'none' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'hsl(var(--muted-foreground))', '&:hover': { color: 'hsl(var(--primary))' } }}>
                <ArrowBack />
                <Typography variant="body2">Back to Home</Typography>
              </Box>
            </Link>
          </Box>

          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}
            >
              <Building2 size={60} color="hsl(var(--primary))" />
            </motion.div>
            <Typography variant="h2" sx={{ fontWeight: 700, mb: 2, color: "hsl(var(--foreground))", fontFamily: "Poppins, sans-serif" }}>
              Incubation <Box component="span" sx={{ color: "hsl(var(--destructive))" }}>Application</Box>
            </Typography>
            <Typography variant="h6" sx={{ color: "hsl(var(--muted-foreground))", fontFamily: "Poppins, sans-serif", maxWidth: "800px", mx: "auto" }}>
              Join our incubation program and accelerate your startup journey with expert guidance, resources, and funding opportunities.
            </Typography>
          </Box>

          {/* Application Form */}
          <Paper sx={{ 
            p: { xs: 3, md: 6 }, 
            borderRadius: '32px', 
            border: '1px solid hsl(var(--border))', 
            backgroundColor: "hsl(var(--card))", 
            boxShadow: "0 20px 60px -12px rgba(220, 20, 60, 0.15)",
            maxWidth: '1400px',
            mx: 'auto'
          }}>
            <DynamicForm formType="incubation_application" />
            
            {/* Declaration Section */}
            <Box sx={{ 
              mt: 4, 
              p: 3, 
              borderRadius: '16px', 
              bgcolor: 'hsl(var(--muted) / 0.3)',
              border: '1px solid hsl(var(--border))'
            }}>
              <Typography variant="body2" sx={{ color: 'hsl(var(--muted-foreground))', lineHeight: 1.8 }}>
                <strong>Declaration:</strong> I hereby declare that the information provided in this application is true and correct to the best of my knowledge. 
                I understand that any false information may result in the rejection of my application or termination of incubation services.
              </Typography>
            </Box>
          </Paper>

          {/* Additional Info */}
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: 'hsl(var(--muted-foreground))' }}>
              Need help? Contact us at{' '}
              <Box component="span" sx={{ color: 'hsl(var(--primary))', fontWeight: 600 }}>
                support@tcetbi.com
              </Box>
            </Typography>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};
