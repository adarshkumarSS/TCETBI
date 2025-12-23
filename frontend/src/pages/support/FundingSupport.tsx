import React, { useState } from 'react';
import { Box, Container, Typography, TextField, Button, MenuItem, Grid, Paper, CircularProgress } from '@mui/material';
import { motion } from 'framer-motion';
import { supportService } from '../../api/supportService';
import { uploadToCloudinary } from '../../utils/uploadToCloudinary';
import { toast } from 'sonner';
import { CloudUpload, CurrencyRupee, Business, Description } from '@mui/icons-material';

export const FundingSupport = () => {
  const [loading, setLoading] = useState(false);
  const [fundingForm, setFundingForm] = useState({
    name: '',
    email: '',
    phone: '',
    startup_name: '',
    scheme: 'idea_hackathon',
    description: '',
    amount_requested: '',
    pitch_deck: '', // URL
  });
  const [pitchDeckFile, setPitchDeckFile] = useState<File | null>(null);

  const handleFundingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let deckUrl = fundingForm.pitch_deck;
      if (pitchDeckFile) {
        deckUrl = await uploadToCloudinary(pitchDeckFile, "TCETBI/PitchDecks", "raw");
      }

      await supportService.submitFundingRequest({
        ...fundingForm,
        pitch_deck: deckUrl
      });
      toast.success("Funding request submitted successfully!");
      setFundingForm({ name: '', email: '', phone: '', startup_name: '', scheme: 'idea_hackathon', description: '', amount_requested: '', pitch_deck: '' });
      setPitchDeckFile(null);
    } catch (error) {
      toast.error("Failed to submit funding request");
      console.error(error);
    } finally {
      setLoading(false);
    }
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
                <form onSubmit={handleFundingSubmit}>
                  <Grid container spacing={3}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <TextField
                        fullWidth
                        label="Full Name"
                        value={fundingForm.name}
                        onChange={(e) => setFundingForm({ ...fundingForm, name: e.target.value })}
                        required
                        variant="standard"
                        sx={{ '& .MuiInput-root': { py: 1 } }}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <TextField
                        fullWidth
                        label="Email Address"
                        type="email"
                        value={fundingForm.email}
                        onChange={(e) => setFundingForm({ ...fundingForm, email: e.target.value })}
                        required
                        variant="standard"
                        sx={{ '& .MuiInput-root': { py: 1 } }}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <TextField
                        fullWidth
                        label="Phone Number"
                        value={fundingForm.phone}
                        onChange={(e) => setFundingForm({ ...fundingForm, phone: e.target.value })}
                        required
                        variant="standard"
                        sx={{ '& .MuiInput-root': { py: 1 } }}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <TextField
                        fullWidth
                        label="Startup / Company Name"
                        value={fundingForm.startup_name}
                        onChange={(e) => setFundingForm({ ...fundingForm, startup_name: e.target.value })}
                        required
                        variant="standard"
                        sx={{ '& .MuiInput-root': { py: 1 } }}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <TextField
                        fullWidth
                        select
                        label="Funding Scheme"
                        value={fundingForm.scheme}
                        onChange={(e) => setFundingForm({ ...fundingForm, scheme: e.target.value })}
                        required
                        variant="standard"
                        sx={{ '& .MuiInput-root': { py: 1 } }}
                      >
                        <MenuItem value="idea_hackathon">Idea Hackathon</MenuItem>
                        <MenuItem value="nidhi_prayas">NIDHI PRAYAS</MenuItem>
                        <MenuItem value="nidhi_eir">NIDHI EIR</MenuItem>
                        <MenuItem value="sisfs">SISFS</MenuItem>
                        <MenuItem value="other">Other</MenuItem>
                      </TextField>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <TextField
                        fullWidth
                        label="Amount Required (in ₹)"
                        value={fundingForm.amount_requested}
                        onChange={(e) => setFundingForm({ ...fundingForm, amount_requested: e.target.value })}
                        variant="standard"
                        sx={{ '& .MuiInput-root': { py: 1 } }}
                        InputProps={{
                          startAdornment: <CurrencyRupee sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />,
                        }}
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        fullWidth
                        multiline
                        rows={4}
                        label="Startup Details & Funding Purpose"
                        value={fundingForm.description}
                        onChange={(e) => setFundingForm({ ...fundingForm, description: e.target.value })}
                        required
                        variant="standard"
                        placeholder="Tell us about your startup and why you need this funding..."
                        sx={{ '& .MuiInput-root': { py: 1 } }}
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <Box sx={{ mt: 2 }}>
                        <Button
                          component="label"
                          fullWidth
                          variant="outlined"
                          startIcon={<CloudUpload />}
                          sx={{ 
                            py: 3, 
                            borderStyle: 'dashed', 
                            borderRadius: '16px',
                            borderColor: 'hsl(var(--primary) / 0.5)',
                            '&:hover': { borderColor: 'hsl(var(--primary))', bgcolor: 'hsl(var(--primary) / 0.05)' }
                          }}
                        >
                          {pitchDeckFile ? pitchDeckFile.name : "Upload Pitch Deck (PDF)"}
                          <input
                            type="file"
                            hidden
                            accept=".pdf"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                if (file.type !== 'application/pdf') {
                                  toast.error('Only PDF files are allowed');
                                  return;
                                }
                                if (file.size > 5 * 1024 * 1024) {
                                  toast.error('File size must be less than 5MB');
                                  return;
                                }
                                setPitchDeckFile(file);
                              }
                            }}
                          />
                        </Button>
                      </Box>
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        disabled={loading}
                        sx={{ 
                          mt: 2,
                          py: 1.5,
                          px: 6,
                          borderRadius: '12px',
                          bgcolor: "hsl(var(--primary))", 
                          color: "white", 
                          fontSize: '1.1rem',
                          fontWeight: 600,
                          '&:hover': { bgcolor: "hsl(var(--primary) / 0.9)", transform: 'translateY(-2px)' },
                          transition: 'all 0.3s ease'
                        }}
                      >
                        {loading ? <CircularProgress size={24} color="inherit" /> : "Submit Application"}
                      </Button>
                    </Grid>
                  </Grid>
                </form>
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
