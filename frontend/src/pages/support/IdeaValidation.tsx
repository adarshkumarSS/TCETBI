import { Box, Container, Typography, Grid, Paper } from '@mui/material';
import { motion } from 'framer-motion';
import { Lightbulb } from 'lucide-react';
import { DynamicForm } from '../../components/DynamicForm';

export const IdeaValidation = () => {
  return (
    <Box sx={{ minHeight: "100vh", pt: 16, pb: 8, backgroundColor: "hsl(var(--background))" }}>
      <Container maxWidth="lg">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              style={{ display: 'flex', justifyContent: 'center' }}
            >
              <Lightbulb size={60} color="hsl(var(--primary))" style={{ marginBottom: '16px' }} />
            </motion.div>
            <Typography variant="h2" sx={{ fontWeight: 700, mb: 2, color: "hsl(var(--foreground))", fontFamily: "Poppins, sans-serif" }}>
              Idea <Box component="span" sx={{ color: "hsl(var(--destructive))" }}>Validation</Box>
            </Typography>
            <Typography variant="h6" sx={{ color: "hsl(var(--muted-foreground))", fontFamily: "Poppins, sans-serif", maxWidth: "800px", mx: "auto" }}>
              Validate your MVP, test your assumptions, and refine your product strategy with our expert team.
            </Typography>
          </Box>

          <Grid container spacing={4} justifyContent="center">
            <Grid size={{ xs: 12, md: 10, lg: 8 }}>
              <Paper sx={{ p: { xs: 3, md: 6 }, borderRadius: '32px', border: '1px solid hsl(var(--border))', backgroundColor: "hsl(var(--card))", boxShadow: "0 20px 50px -12px rgba(0,0,0,0.1)" }}>
                <DynamicForm formType="idea_validation" />
              </Paper>
            </Grid>
          </Grid>
        </motion.div>
      </Container>
    </Box>
  );
};
