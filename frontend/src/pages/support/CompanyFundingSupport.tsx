import { useState, useEffect } from 'react';
import { Box, Container, Typography, Grid, Paper, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Business, CheckCircle, CorporateFare } from '@mui/icons-material';
import { DynamicForm } from '../../components/DynamicForm';

export const CompanyFundingSupport = () => {
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('user_token');
    if (!token) {
      navigate('/auth');
    }
  }, [navigate]);

  const handleSuccess = () => {
    setShowSuccessModal(true);
  };

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
              Company <Box component="span" sx={{ color: "hsl(var(--primary))" }}>Funding</Box> Request
            </Typography>
            <Typography variant="h6" sx={{ color: "hsl(var(--muted-foreground))", fontFamily: "Poppins, sans-serif", maxWidth: "800px", mx: "auto" }}>
              Dedicated funding portal for registered companies. Please provide your corporate details and funding requirements.
            </Typography>
          </Box>

          <Grid container spacing={4}>
            <Grid size={{ xs: 12, lg: 8 }}>
              <Paper sx={{ p: 4, borderRadius: '24px', border: '1px solid hsl(var(--border))', backgroundColor: "hsl(var(--card))", boxShadow: "0 10px 40px -10px rgba(0,0,0,0.1)" }}>
                <DynamicForm formType="company_funding_support" onSuccess={handleSuccess} />
              </Paper>
            </Grid>

            <Grid size={{ xs: 12, lg: 4 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Paper sx={{ p: 4, borderRadius: '24px', backgroundColor: 'hsl(var(--primary))', color: 'white' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <CorporateFare sx={{ mr: 2 }} />
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>Corporate Track</Typography>
                  </Box>
                  <Typography variant="body2" sx={{ opacity: 0.9, mb: 2 }}>
                    Incorporated startups can apply here for accelerated funding.
                  </Typography>
                  <Box component="ul" sx={{ pl: 2, m: 0 }}>
                    <li>Proof of Incorporation (CIN)</li>
                    <li>Company PAN Verification</li>
                    <li>Milestone-based funding</li>
                    <li>Corporate Compliance Check</li>
                  </Box>
                </Paper>

                <Paper sx={{ p: 4, borderRadius: '24px', border: '1px solid hsl(var(--border))', backgroundColor: "hsl(var(--card))" }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Business sx={{ color: 'hsl(var(--primary))', mr: 2 }} />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>Elite Schemes</Typography>
                  </Box>
                  <Grid container spacing={2}>
                    {['SISFS Commercial', 'NIDHI Seed Support', 'Venture Matching', 'Scale-up Grants'].map((scheme) => (
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

      <Dialog
        open={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: '24px', p: 2, textAlign: 'center' }
        }}
      >
        <DialogTitle sx={{ pt: 4, pb: 0 }}>
          <CheckCircle sx={{ fontSize: 72, color: 'success.main', mb: 2 }} />
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>Company Request Received</Typography>
        </DialogTitle>
        <DialogContent sx={{ px: 4 }}>
          <Typography variant="body1" sx={{ color: 'text.secondary', mb: 3, fontSize: '1.1rem' }}>
            We have received your corporate funding application.
          </Typography>
          <Box sx={{ p: 3, bgcolor: 'hsl(var(--primary) / 0.05)', borderRadius: '16px', border: '1px solid hsl(var(--primary) / 0.1)' }}>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              The TCETBI Board will review your milestones and financial status. An automated tracking ID has been sent to your registered company email.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 4, pt: 2 }}>
          <Button 
            onClick={() => setShowSuccessModal(false)} 
            variant="contained" 
            size="large"
            fullWidth
            sx={{ borderRadius: '12px', mx: 2, py: 1.5, fontSize: '1.1rem' }}
          >
            Done
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
