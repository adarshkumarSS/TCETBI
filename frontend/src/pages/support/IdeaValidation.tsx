import React, { useState } from 'react';
import { Box, Container, Typography, TextField, Button, Grid, Paper, CircularProgress, Stack, Tooltip, IconButton } from '@mui/material';
import { motion } from 'framer-motion';
import { supportService } from '../../api/supportService';
import { uploadToCloudinary } from '../../utils/uploadToCloudinary';
import { toast } from 'sonner';
import { CloudUpload, Lightbulb, InfoOutlined, FilePresent, Close, CheckCircle } from '@mui/icons-material';

export const IdeaValidation = () => {
  const [loading, setLoading] = useState(false);
  const [validationForm, setValidationForm] = useState({
    name: '',
    email: '',
    phone: '',
    startup_name: '',
    idea_details: '',
    testing_requirements: '',
    target_market: '',
    pitch_deck: '', // Optional/Additional
  });
  const [pitchDeckFile, setPitchDeckFile] = useState<File | null>(null);

  const handleValidationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let deckUrl = '';
      if (pitchDeckFile) {
        deckUrl = await uploadToCloudinary(pitchDeckFile, "TCETBI/ValidationDecks", "raw");
      }

      await supportService.submitValidationRequest({
        ...validationForm,
        // pitch_deck: deckUrl // Assuming supportService supports this or we add it to details
        idea_details: `${validationForm.idea_details}\n\nPitch Deck: ${deckUrl}`
      });
      toast.success("Validation request submitted successfully!");
      setValidationForm({ name: '', email: '', phone: '', startup_name: '', idea_details: '', testing_requirements: '', target_market: '', pitch_deck: '' });
      setPitchDeckFile(null);
    } catch (error) {
      toast.error("Failed to submit validation request");
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
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
            >
              <Lightbulb sx={{ fontSize: 60, color: 'hsl(var(--primary))', mb: 2 }} />
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
                <form onSubmit={handleValidationSubmit}>
                  <Stack spacing={4}>
                    <Box>
                      <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                        Personal Details
                      </Typography>
                      <Grid container spacing={3}>
                        <Grid size={{ xs: 12, md: 6 }}>
                          <TextField
                            fullWidth
                            label="Your Name"
                            variant="filled"
                            value={validationForm.name}
                            onChange={(e) => setValidationForm({...validationForm, name: e.target.value})}
                            required
                            sx={{ '& .MuiFilledInput-root': { borderRadius: '12px', bgcolor: 'hsl(var(--muted)/0.3)' } }}
                          />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                          <TextField
                            fullWidth
                            label="Email Address"
                            variant="filled"
                            type="email"
                            value={validationForm.email}
                            onChange={(e) => setValidationForm({...validationForm, email: e.target.value})}
                            required
                            sx={{ '& .MuiFilledInput-root': { borderRadius: '12px', bgcolor: 'hsl(var(--muted)/0.3)' } }}
                          />
                        </Grid>
                      </Grid>
                    </Box>

                    <Box>
                      <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                        Product Concept
                        <Tooltip title="Provide clear title and domain of your idea">
                          <IconButton size="small"><InfoOutlined fontSize="small" /></IconButton>
                        </Tooltip>
                      </Typography>
                      <Stack spacing={3}>
                        <TextField
                          fullWidth
                          label="Idea Title / Startup Name"
                          variant="filled"
                          value={validationForm.startup_name}
                          onChange={(e) => setValidationForm({...validationForm, startup_name: e.target.value})}
                          required
                          sx={{ '& .MuiFilledInput-root': { borderRadius: '12px', bgcolor: 'hsl(var(--muted)/0.3)' } }}
                        />
                        <TextField
                          fullWidth
                          label="Domain (e.g. HealthTech, EdTech)"
                          variant="filled"
                          value={validationForm.target_market}
                          onChange={(e) => setValidationForm({...validationForm, target_market: e.target.value})}
                          required
                          sx={{ '& .MuiFilledInput-root': { borderRadius: '12px', bgcolor: 'hsl(var(--muted)/0.3)' } }}
                        />
                        <TextField
                          fullWidth
                          multiline
                          rows={4}
                          label="Detailed Idea Description"
                          variant="filled"
                          value={validationForm.idea_details}
                          onChange={(e) => setValidationForm({...validationForm, idea_details: e.target.value})}
                          required
                          placeholder="What problem are you solving? How does your product work?"
                          sx={{ '& .MuiFilledInput-root': { borderRadius: '12px', bgcolor: 'hsl(var(--muted)/0.3)' } }}
                        />
                        <TextField
                          fullWidth
                          multiline
                          rows={3}
                          label="Testing & Validation Requirements"
                          variant="filled"
                          value={validationForm.testing_requirements}
                          onChange={(e) => setValidationForm({...validationForm, testing_requirements: e.target.value})}
                          placeholder="What specific help do you need for validation?"
                          sx={{ '& .MuiFilledInput-root': { borderRadius: '12px', bgcolor: 'hsl(var(--muted)/0.3)' } }}
                        />
                      </Stack>
                    </Box>

                    <Box>
                      <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                        Pitch Presentation
                      </Typography>
                      <Box 
                        sx={{ 
                          p: 4, 
                          border: '2px dashed',
                          borderColor: pitchDeckFile ? 'hsl(var(--primary))' : 'hsl(var(--border))',
                          borderRadius: '24px',
                          textAlign: 'center',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          bgcolor: pitchDeckFile ? 'hsl(var(--primary) / 0.05)' : 'transparent',
                          '&:hover': { bgcolor: 'hsl(var(--muted)/0.2)', borderColor: 'hsl(var(--primary))' },
                          position: 'relative',
                          overflow: 'hidden'
                        }}
                        onClick={() => document.getElementById('pitch-deck-input')?.click()}
                      >
                        <input
                          id="pitch-deck-input"
                          type="file"
                          style={{ display: 'none' }}
                          accept=".pdf,.pptx"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              if (file.size > 10 * 1024 * 1024) {
                                toast.error("File size exceeds 10MB limit");
                                return;
                              }
                              setPitchDeckFile(file);
                            }
                          }}
                        />
                        {pitchDeckFile ? (
                          <Stack direction="row" spacing={2} alignItems="center" justifyContent="center">
                            <Box sx={{ position: 'relative' }}>
                              <FilePresent sx={{ fontSize: 40, color: 'hsl(var(--primary))' }} />
                              <CheckCircle sx={{ 
                                position: 'absolute', 
                                bottom: -4, 
                                right: -4, 
                                fontSize: 18, 
                                color: 'hsl(var(--primary))',
                                bgcolor: 'white',
                                borderRadius: '50%'
                              }} />
                            </Box>
                            <Box sx={{ textAlign: 'left', flex: 1, minWidth: 0 }}>
                              <Typography variant="subtitle1" noWrap sx={{ fontWeight: 600, textOverflow: 'ellipsis', overflow: 'hidden' }}>
                                {pitchDeckFile.name}
                              </Typography>
                              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                {(pitchDeckFile.size / 1024 / 1024).toFixed(2)} MB
                              </Typography>
                            </Box>
                            <IconButton 
                              size="small" 
                              onClick={(e) => {
                                e.stopPropagation();
                                setPitchDeckFile(null);
                                const input = document.getElementById('pitch-deck-input') as HTMLInputElement;
                                if (input) input.value = '';
                              }}
                              sx={{ 
                                bgcolor: 'hsl(var(--muted))',
                                '&:hover': { bgcolor: 'hsl(var(--destructive) / 0.1)', color: 'hsl(var(--destructive))' }
                              }}
                            >
                              <Close fontSize="small" />
                            </IconButton>
                          </Stack>
                        ) : (
                          <>
                            <CloudUpload sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>Upload Pitch Deck</Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>Drag & drop or click to browse</Typography>
                            <Typography variant="caption" sx={{ display: 'block', mt: 1, color: 'hsl(var(--muted-foreground))' }}>
                              Supports PDF and PPTX (Max 10MB)
                            </Typography>
                          </>
                        )}
                      </Box>
                    </Box>

                    <Button
                      fullWidth
                      type="submit"
                      variant="contained"
                      size="large"
                      disabled={loading}
                      sx={{ 
                        py: 2, 
                        borderRadius: '16px', 
                        bgcolor: 'hsl(var(--primary))',
                        fontSize: '1.2rem',
                        fontWeight: 700,
                        boxShadow: '0 10px 30px -10px hsl(var(--primary) / 0.5)',
                        '&:hover': { bgcolor: 'hsl(var(--primary) / 0.9)', transform: 'translateY(-2px)' }
                      }}
                    >
                      {loading ? <CircularProgress size={28} color="inherit" /> : "Request Validation"}
                    </Button>
                  </Stack>
                </form>
              </Paper>
            </Grid>
          </Grid>
        </motion.div>
      </Container>
    </Box>
  );
};
