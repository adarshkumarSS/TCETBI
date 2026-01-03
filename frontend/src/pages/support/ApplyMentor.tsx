import { Box, Container, Typography, Grid } from '@mui/material';
import { motion } from 'framer-motion';
import { CheckCircle } from '@mui/icons-material';
import { MentorApplicationForm } from '../../components/MentorApplicationForm';

export const ApplyMentor = () => {
  return (
    <Box sx={{ minHeight: "100vh", pt: 16, pb: 8, backgroundColor: "hsl(var(--background))" }}>
      <Container maxWidth="xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography variant="h2" sx={{ fontWeight: 700, mb: 2, color: "hsl(var(--foreground))", fontFamily: "Poppins, sans-serif" }}>
              Join Our <Box component="span" sx={{ color: "hsl(var(--destructive))" }}>Mentor Network</Box>
            </Typography>
            <Typography variant="h6" sx={{ color: "hsl(var(--muted-foreground))", fontFamily: "Poppins, sans-serif", maxWidth: "800px", mx: "auto" }}>
              Help shape the future of innovation by sharing your expertise with the next generation of entrepreneurs.
            </Typography>
          </Box>

          <Grid container spacing={6} alignItems="flex-start">
            <Grid size={{ xs: 12, lg: 5 }}>
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <Typography variant="h4" sx={{ fontWeight: 800, mb: 3, fontFamily: "Poppins, sans-serif" }}>
                  Why <Box component="span" sx={{ color: "hsl(var(--primary))" }}>Mentor</Box> with us?
                </Typography>
                <Typography variant="body1" sx={{ color: "hsl(var(--muted-foreground))", mb: 4, lineHeight: 1.8, fontSize: '1.1rem' }}>
                  Our incubator is home to some of the most promising tech startups. As a mentor, you'll play a crucial role in their success while expanding your own professional horizons.
                </Typography>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  {[
                    { title: "Network Growth", desc: "Connect with other industry leaders and seasoned entrepreneurs in our exclusive network." },
                    { title: "Early Innovation", desc: "Get early access and insights into disruptive technologies and promising startup ventures." },
                    { title: "Systemic Impact", desc: "Directly influence the growth and sustainability of the startup ecosystem in the region." },
                    { title: "Investment Opportunities", desc: "Identify high-potential startups for potential angel investment or strategic partnership." }
                  ].map((benefit, i) => (
                    <Box key={i} sx={{ display: 'flex', gap: 2 }}>
                      <CheckCircle sx={{ color: 'hsl(var(--primary))', mt: 0.5 }} />
                      <Box>
                        <Typography sx={{ fontWeight: 700, fontSize: '1.1rem' }}>{benefit.title}</Typography>
                        <Typography variant="body2" sx={{ color: 'hsl(var(--muted-foreground))' }}>{benefit.desc}</Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </motion.div>
            </Grid>

            <Grid size={{ xs: 12, lg: 7 }}>
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <MentorApplicationForm />
              </motion.div>
            </Grid>
          </Grid>
        </motion.div>
      </Container>
    </Box>
  );
};

export default ApplyMentor;
