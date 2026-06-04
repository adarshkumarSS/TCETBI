import { useState, useEffect } from 'react';
import { Box, Container, Typography, Grid, Paper, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { motion } from 'framer-motion';
import { Business, CheckCircle } from '@mui/icons-material';
import { DynamicForm } from '../../components/DynamicForm';
import { dynamicFormService } from '../../api/dynamicFormService';
import { DEFAULT_FORM_TEMPLATES } from '../../constants/formTemplates';

export const FundingSupport = () => {
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [schemes, setSchemes] = useState<string[]>(['NIDHI PRAYAS', 'NIDHI EIR', 'SISFS', 'Idea Hackathon']);

  useEffect(() => {
    const fetchSchemes = async () => {
      try {
        const data = await dynamicFormService.getFormStructure('funding_support');
        const schemeField = data?.fields?.find((f: any) => f.field_name === 'scheme');
        if (schemeField && Array.isArray(schemeField.options)) {
          const filtered = schemeField.options.filter((o: string) => o.toLowerCase() !== 'other');
          setSchemes(filtered);
        } else if (DEFAULT_FORM_TEMPLATES.funding_support) {
          const defaultField = DEFAULT_FORM_TEMPLATES.funding_support.fields.find(f => f.field_name === 'scheme');
          if (defaultField && defaultField.options) {
            setSchemes(defaultField.options.filter(o => o.toLowerCase() !== 'other'));
          }
        }
      } catch (error) {
        console.error("Failed to fetch schemes", error);
        const defaultField = DEFAULT_FORM_TEMPLATES.funding_support?.fields.find(f => f.field_name === 'scheme');
        if (defaultField && defaultField.options) {
          setSchemes(defaultField.options.filter(o => o.toLowerCase() !== 'other'));
        }
      }
    };
    fetchSchemes();
  }, []);

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
              Funding <Box component="span" sx={{ color: "hsl(var(--destructive))" }}>Support</Box>
            </Typography>
            <Typography variant="h6" sx={{ color: "hsl(var(--muted-foreground))", fontFamily: "Poppins, sans-serif", maxWidth: "800px", mx: "auto" }}>
              Get the financial backing your startup deserves. We provide various schemes to help you scale your idea.
            </Typography>
          </Box>
          <Grid container spacing={4}>
            <Grid size={{ xs: 12, lg: 8 }}>
              <Paper sx={{ p: 4, borderRadius: '24px', border: '1px solid hsl(var(--border))', backgroundColor: "hsl(var(--card))", boxShadow: "0 10px 40px -10px rgba(0,0,0,0.1)" }}>
                <DynamicForm formType="funding_support" onSuccess={handleSuccess} />
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
                    {schemes.map((scheme) => (
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
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>Request Confirmed</Typography>
        </DialogTitle>
        <DialogContent sx={{ px: 4 }}>
          <Typography variant="body1" sx={{ color: 'text.secondary', mb: 3, fontSize: '1.1rem' }}>
            Your funding support request has been successfully submitted.
          </Typography>
          <Box sx={{ p: 3, bgcolor: 'hsl(var(--primary) / 0.05)', borderRadius: '16px', border: '1px solid hsl(var(--primary) / 0.1)' }}>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              Further details will be shared with the respective mail and phone number entered.
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
