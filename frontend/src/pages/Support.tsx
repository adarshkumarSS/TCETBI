import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Tabs, Tab, TextField, Button, MenuItem, Grid, Paper, CircularProgress } from '@mui/material';
import { motion } from 'framer-motion';
import { supportService } from '../api/supportService';
import { uploadToCloudinary } from '../utils/uploadToCloudinary';
import { toast } from 'sonner';
import { CloudUpload } from '@mui/icons-material';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export const Support = () => {
  const [value, setValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [mentors, setMentors] = useState<any[]>([]);
  const [mentorSearch, setMentorSearch] = useState('');

  // Funding Form State
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

  // Mentoring Form State
  const [mentoringForm, setMentoringForm] = useState({
    name: '',
    email: '',
    phone: '',
    startup_name: '',
    domain: '',
    mentor: '', // ID
    description: '',
  });

  // Validation Form State
  const [validationForm, setValidationForm] = useState({
    name: '',
    email: '',
    phone: '',
    startup_name: '',
    idea_details: '',
    testing_requirements: '',
    target_market: '',
  });

  useEffect(() => {
    fetchMentors();
  }, []);

  const fetchMentors = async () => {
    try {
      const data = await supportService.getMentors();
      setMentors(data);
    } catch (error) {
      console.error("Failed to fetch mentors", error);
    }
  };

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

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
      toast.success("Funding request submitted successfully!");
      setFundingForm({ name: '', email: '', phone: '', startup_name: '', scheme: 'idea_hackathon', description: '', amount_requested: '', pitch_deck: '' });
      setPitchDeckFile(null);
      setPitchDeckFile(null);
    } catch (error) {
      toast.error("Failed to submit funding request");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleMentoringSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await supportService.submitMentoringRequest(mentoringForm);
      toast.success("Mentoring request submitted successfully!");
      toast.success("Mentoring request submitted successfully!");
      setMentoringForm({ name: '', email: '', phone: '', startup_name: '', domain: '', mentor: '', description: '' });
    } catch (error) {
      toast.error("Failed to submit mentoring request");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleValidationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await supportService.submitValidationRequest(validationForm);
      toast.success("Validation request submitted successfully!");
      toast.success("Validation request submitted successfully!");
      setValidationForm({ name: '', email: '', phone: '', startup_name: '', idea_details: '', testing_requirements: '', target_market: '' });
    } catch (error) {
      toast.error("Failed to submit validation request");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", pt: 12, pb: 8, backgroundColor: "hsl(var(--background))" }}>
      <Container maxWidth="lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography variant="h3" sx={{ fontWeight: 700, mb: 2, color: "hsl(var(--foreground))", fontFamily: "Poppins, sans-serif" }}>
            Support Services
          </Typography>
          <Typography variant="body1" sx={{ mb: 4, color: "hsl(var(--muted-foreground))", fontFamily: "Poppins, sans-serif" }}>
            Apply for funding, mentoring, or product validation support.
          </Typography>

          <Paper sx={{ width: '100%', mb: 2, borderRadius: '12px', overflow: 'hidden', border: '1px solid hsl(var(--border))', backgroundColor: "hsl(var(--card))" }}>
            <Tabs
              value={value}
              onChange={handleChange}
              indicatorColor="primary"
              textColor="primary"
              variant="fullWidth"
              sx={{ borderBottom: 1, borderColor: 'divider' }}
            >
              <Tab label="Funding Support" sx={{ fontFamily: "Poppins, sans-serif", fontWeight: 600 }} />
              <Tab label="Mentoring Support" sx={{ fontFamily: "Poppins, sans-serif", fontWeight: 600 }} />
              <Tab label="Idea/Product Validation" sx={{ fontFamily: "Poppins, sans-serif", fontWeight: 600 }} />
            </Tabs>

            <Box sx={{ p: 3 }}>
              {/* Funding Tab */}
              <CustomTabPanel value={value} index={0}>
                <form onSubmit={handleFundingSubmit}>
                  <Grid container spacing={3}>
                    <Grid size={{ xs: 12, md: 4 }}>
                      <TextField
                        fullWidth
                        label="Your Name"
                        value={fundingForm.name}
                        onChange={(e) => setFundingForm({ ...fundingForm, name: e.target.value })}
                        required
                        variant="outlined"
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                      <TextField
                        fullWidth
                        label="Email Address"
                        type="email"
                        value={fundingForm.email}
                        onChange={(e) => setFundingForm({ ...fundingForm, email: e.target.value })}
                        required
                        variant="outlined"
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                      <TextField
                        fullWidth
                        label="Phone Number"
                        value={fundingForm.phone}
                        onChange={(e) => setFundingForm({ ...fundingForm, phone: e.target.value })}
                        required
                        variant="outlined"
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <TextField
                        fullWidth
                        label="Startup Name"
                        value={fundingForm.startup_name}
                        onChange={(e) => setFundingForm({ ...fundingForm, startup_name: e.target.value })}
                        required
                        variant="outlined"
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <TextField
                        fullWidth
                        select
                        label="Scheme"
                        value={fundingForm.scheme}
                        onChange={(e) => setFundingForm({ ...fundingForm, scheme: e.target.value })}
                        required
                        variant="outlined"
                      >
                        <MenuItem value="idea_hackathon">Idea Hackathon</MenuItem>
                        <MenuItem value="nidhi_prayas">NIDHI PRAYAS</MenuItem>
                        <MenuItem value="nidhi_eir">NIDHI EIR</MenuItem>
                        <MenuItem value="sisfs">SISFS</MenuItem>
                        <MenuItem value="other">Other</MenuItem>
                      </TextField>
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        fullWidth
                        label="Amount Requested (if applicable)"
                        value={fundingForm.amount_requested}
                        onChange={(e) => setFundingForm({ ...fundingForm, amount_requested: e.target.value })}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        fullWidth
                        multiline
                        rows={4}
                        label="Description / Basic Details"
                        value={fundingForm.description}
                        onChange={(e) => setFundingForm({ ...fundingForm, description: e.target.value })}
                        required
                        variant="outlined"
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <Button
                        component="label"
                        variant="outlined"
                        startIcon={<CloudUpload />}
                        sx={{ width: '100%', height: '56px', borderStyle: 'dashed' }}
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
                              if (file.size > 2 * 1024 * 1024) {
                                toast.error('File size must be less than 2MB');
                                return;
                              }
                              setPitchDeckFile(file);
                            }
                          }}
                        />
                      </Button>
                      {pitchDeckFile && (
                        <Box sx={{ mt: 2, p: 2, border: '1px solid hsl(var(--border))', borderRadius: '8px', backgroundColor: 'hsl(var(--muted)/0.3)' }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                            <Typography variant="subtitle2" sx={{ fontFamily: 'Poppins, sans-serif' }}>Document Preview</Typography>
                            <Button 
                              size="small" 
                              color="error" 
                              onClick={() => setPitchDeckFile(null)}
                              sx={{ textTransform: 'none' }}
                            >
                              Remove
                            </Button>
                          </Box>
                          <iframe 
                            src={URL.createObjectURL(pitchDeckFile)} 
                            width="100%" 
                            height="400px" 
                            style={{ border: 'none', borderRadius: '4px', backgroundColor: 'white' }}
                            title="PDF Preview"
                          />
                        </Box>
                      )}
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        disabled={loading}
                        sx={{ bgcolor: "hsl(var(--primary))", color: "white", '&:hover': { bgcolor: "hsl(var(--primary) / 0.9)" } }}
                      >
                        {loading ? <CircularProgress size={24} color="inherit" /> : "Submit Funding Request"}
                      </Button>
                    </Grid>
                  </Grid>
                </form>
              </CustomTabPanel>

              {/* Mentoring Tab */}
              <CustomTabPanel value={value} index={1}>
                <form onSubmit={handleMentoringSubmit}>
                  <Grid container spacing={3}>
                    <Grid size={{ xs: 12, md: 4 }}>
                      <TextField
                        fullWidth
                        label="Your Name"
                        value={mentoringForm.name}
                        onChange={(e) => setMentoringForm({ ...mentoringForm, name: e.target.value })}
                        required
                        variant="outlined"
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                      <TextField
                        fullWidth
                        label="Email Address"
                        type="email"
                        value={mentoringForm.email}
                        onChange={(e) => setMentoringForm({ ...mentoringForm, email: e.target.value })}
                        required
                        variant="outlined"
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                      <TextField
                        fullWidth
                        label="Phone Number"
                        value={mentoringForm.phone}
                        onChange={(e) => setMentoringForm({ ...mentoringForm, phone: e.target.value })}
                        required
                        variant="outlined"
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <TextField
                        fullWidth
                        label="Startup Name"
                        value={mentoringForm.startup_name}
                        onChange={(e) => setMentoringForm({ ...mentoringForm, startup_name: e.target.value })}
                        required
                        variant="outlined"
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <TextField
                        fullWidth
                        label="Domain"
                        value={mentoringForm.domain}
                        onChange={(e) => setMentoringForm({ ...mentoringForm, domain: e.target.value })}
                        required
                        variant="outlined"
                        placeholder="e.g. AI/ML, IoT, Fintech"
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        fullWidth
                        label="Search Mentor"
                        placeholder="Filter by name or domain..."
                        value={mentorSearch}
                        onChange={(e) => setMentorSearch(e.target.value)}
                        variant="outlined"
                        sx={{ mb: 2 }}
                      />
                      <TextField
                        fullWidth
                        select
                        label="Specific Mentor (Optional)"
                        value={mentoringForm.mentor}
                        onChange={(e) => setMentoringForm({ ...mentoringForm, mentor: e.target.value })}
                        variant="outlined"
                      >
                        <MenuItem value="">Any / Not Specific</MenuItem>
                        {mentors
                          .filter(m => 
                            m.name.toLowerCase().includes(mentorSearch.toLowerCase()) || 
                            m.domain.toLowerCase().includes(mentorSearch.toLowerCase())
                          )
                          .map((mentor) => (
                          <MenuItem key={mentor.id} value={mentor.id}>
                            {mentor.name} - {mentor.domain}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        fullWidth
                        multiline
                        rows={4}
                        label="Request Details / Basic Details"
                        value={mentoringForm.description}
                        onChange={(e) => setMentoringForm({ ...mentoringForm, description: e.target.value })}
                        required
                        variant="outlined"
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        disabled={loading}
                        sx={{ bgcolor: "hsl(var(--primary))", color: "white", '&:hover': { bgcolor: "hsl(var(--primary) / 0.9)" } }}
                      >
                        {loading ? <CircularProgress size={24} color="inherit" /> : "Submit Mentoring Request"}
                      </Button>
                    </Grid>
                  </Grid>
                </form>
              </CustomTabPanel>

              {/* Validation Tab */}
              <CustomTabPanel value={value} index={2}>
                <form onSubmit={handleValidationSubmit}>
                  <Grid container spacing={3}>
                    <Grid size={{ xs: 12, md: 4 }}>
                      <TextField
                        fullWidth
                        label="Your Name"
                        value={validationForm.name}
                        onChange={(e) => setValidationForm({ ...validationForm, name: e.target.value })}
                        required
                        variant="outlined"
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                      <TextField
                        fullWidth
                        label="Email Address"
                        type="email"
                        value={validationForm.email}
                        onChange={(e) => setValidationForm({ ...validationForm, email: e.target.value })}
                        required
                        variant="outlined"
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                      <TextField
                        fullWidth
                        label="Phone Number"
                        value={validationForm.phone}
                        onChange={(e) => setValidationForm({ ...validationForm, phone: e.target.value })}
                        required
                        variant="outlined"
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <TextField
                        fullWidth
                        label="Startup Name"
                        value={validationForm.startup_name}
                        onChange={(e) => setValidationForm({ ...validationForm, startup_name: e.target.value })}
                        required
                        variant="outlined"
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <TextField
                        fullWidth
                        label="Target Market"
                        value={validationForm.target_market}
                        onChange={(e) => setValidationForm({ ...validationForm, target_market: e.target.value })}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        fullWidth
                        multiline
                        rows={4}
                        label="Idea / Product Details"
                        value={validationForm.idea_details}
                        onChange={(e) => setValidationForm({ ...validationForm, idea_details: e.target.value })}
                        required
                        variant="outlined"
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        fullWidth
                        multiline
                        rows={4}
                        label="Testing Requirements"
                        value={validationForm.testing_requirements}
                        onChange={(e) => setValidationForm({ ...validationForm, testing_requirements: e.target.value })}
                        required
                        variant="outlined"
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        disabled={loading}
                        sx={{ bgcolor: "hsl(var(--primary))", color: "white", '&:hover': { bgcolor: "hsl(var(--primary) / 0.9)" } }}
                      >
                        {loading ? <CircularProgress size={24} color="inherit" /> : "Submit Validation Request"}
                      </Button>
                    </Grid>
                  </Grid>
                </form>
              </CustomTabPanel>
            </Box>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
};
