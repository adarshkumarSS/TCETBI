import { Box, Container, Typography, Grid, Paper } from '@mui/material';
import { motion } from 'framer-motion';
import { Business } from '@mui/icons-material';
import { DynamicForm } from '../../components/DynamicForm';

export const FundingSupport = () => {
  return (
    <Box sx={{ minHeight: "100vh", pt: 16, pb: 8, backgroundColor: "hsl(var(--background))" }}>
      <Container maxWidth="lg">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography variant="h2" sx={{ fontWeight: 700, mb: 2, color: "hsl(var(--foreground))", fontFamily: "Poppins, sans-serif" }}>
              Funding <Box component="span" sx={{ color: "hsl(var(--destructive))" }}>Support</Box>
            </Typography>
            <Typography variant="h6" sx={{ color: "hsl(var(--muted-foreground))", fontFamily: "Poppins, sans-serif", maxWidth: "800px", mx: "auto" }}>
              Get the financial backing your startup deserves. We provide various schemes to help you scale your idea.
            </Typography>
          </Box>

          <Grid container spacing={4}>
            <Grid size={{ xs: 12, lg: 8 }}>
              <Paper sx={{ p: 4, borderRadius: '24px', border: '1px solid hsl(var(--border))', backgroundColor: "hsl(var(--card))", boxShadow: "0 10px 40px -10px rgba(0,0,0,0.1)" }}>
                <DynamicForm formType="funding_support" />
              </Paper>
            </Grid>

            <Grid size={{ xs: 12, lg: 4 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Paper sx={{ p: 4, borderRadius: '24px', backgroundColor: 'hsl(var(--primary))', color: 'white' }}>
                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>Funding Guidelines</Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9, mb: 2 }}>
                    Ensure your pitch deck contains the following:
                  </Typography>
                  <Box component="ul" sx={{ pl: 2, m: 0 }}>
                    <li>Problem Statement</li>
                    <li>Solution & Value Proposition</li>
                    <li>Market Opportunity</li>
                    <li>Business Model</li>
                    <li>Financial Projections</li>
                  </Box>
                </Paper>

                <Paper sx={{ p: 4, borderRadius: '24px', border: '1px solid hsl(var(--border))', backgroundColor: "hsl(var(--card))" }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Business sx={{ color: 'hsl(var(--primary))', mr: 2 }} />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>Available Schemes</Typography>
                  </Box>
                  <Grid container spacing={2}>
                    {['NIDHI PRAYAS', 'NIDHI EIR', 'SISFS', 'Idea Hackathon'].map((scheme) => (
                      <Grid size={{ xs: 12 }} key={scheme}>
                        <Box sx={{ p: 2, borderRadius: '12px', bgcolor: 'hsl(var(--muted)/0.3)', border: '1px solid hsl(var(--border))' }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{scheme}</Typography>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </Paper>
              </Box>
            </Grid>
          </Grid>
        </motion.div>
      </Container>
    </Box>
  );
};
