import { useState, useEffect } from 'react';
import { Box, Container, Typography, Grid, Paper, Avatar, Chip, TextField, Divider } from '@mui/material';
import { motion } from 'framer-motion';
import { supportService } from '../../api/supportService';
import { Assignment, PersonSearch, RocketLaunch, Search } from '@mui/icons-material';
import { InputAdornment } from '@mui/material';
import { DynamicForm } from '../../components/DynamicForm';

export const MentoringSupport = () => {
  const [mentors, setMentors] = useState<any[]>([]);
  const [mentorSearch, setMentorSearch] = useState('');

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

  const filteredMentors = mentors.filter(m => 
    m.name.toLowerCase().includes(mentorSearch.toLowerCase()) || 
    m.domain?.toLowerCase().includes(mentorSearch.toLowerCase()) ||
    (m.specialization && m.specialization.toLowerCase().includes(mentorSearch.toLowerCase())) ||
    (m.expertise && m.expertise.toLowerCase().includes(mentorSearch.toLowerCase()))
  );

  const getImagePath = (image: string) => {
    if (!image) return '/placeholder.svg';
    if (image.startsWith('http') || image.startsWith('data:') || image.startsWith('blob:')) return image;
    return `/asset/people/${image}`;
  };

  const getLabels = (mentor: any) => {
    const labels = new Set<string>();
    if (mentor.domain) mentor.domain.split(',').forEach((l: string) => labels.add(l.trim()));
    if (mentor.expertise) mentor.expertise.split(',').forEach((l: string) => labels.add(l.trim()));
    if (mentor.domain_labels) {
      if (Array.isArray(mentor.domain_labels)) {
        mentor.domain_labels.forEach((l: string) => labels.add(l.trim()));
      } else if (typeof mentor.domain_labels === 'string') {
        mentor.domain_labels.split(',').forEach((l: string) => labels.add(l.trim()));
      }
    }
    return Array.from(labels).filter(l => l !== '');
  };

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
              Mentoring <Box component="span" sx={{ color: "hsl(var(--destructive))" }}>Support</Box>
            </Typography>
            <Typography variant="h6" sx={{ color: "hsl(var(--muted-foreground))", fontFamily: "Poppins, sans-serif", maxWidth: "800px", mx: "auto" }}>
              Connect with industry experts and seasoned entrepreneurs to accelerate your growth.
            </Typography>
          </Box>

          <Grid container spacing={6}>
            {/* Left Side - Application Form */}
            <Grid size={{ xs: 12, lg: 5 }}>
              <Box sx={{ position: 'sticky', top: 100 }}>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 4, color: "hsl(var(--foreground))", fontFamily: "Poppins, sans-serif" }}>
                  How to <Box component="span" sx={{ color: "hsl(var(--primary))" }}>Apply</Box>
                </Typography>

                <Box sx={{ mb: 6 }}>
                  {[
                    { icon: <Assignment />, title: "Fill the Form", desc: "Provide your startup details and the specific areas where you need guidance." },
                    { icon: <PersonSearch />, title: "Request a Mentor", desc: "Either choose a specific mentor from our list or let us match you with the best fit." },
                    { icon: <RocketLaunch />, title: "Start Scaling", desc: "Once approved, we will facilitate an initial meeting to set goals and expectations." }
                  ].map((step, index) => (
                    <Box key={index} sx={{ display: 'flex', gap: 3, mb: 4 }}>
                      <Avatar sx={{ bgcolor: 'hsl(var(--primary) / 0.1)', color: 'hsl(var(--primary))', width: 56, height: 56 }}>
                        {step.icon}
                      </Avatar>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>{step.title}</Typography>
                        <Typography variant="body2" sx={{ color: 'hsl(var(--muted-foreground))' }}>{step.desc}</Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>

                <Paper sx={{ p: 4, borderRadius: '24px', border: '1px solid hsl(var(--border))', backgroundColor: "hsl(var(--card))" }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>Quick Application</Typography>
                  <DynamicForm formType="mentoring_support" />
                </Paper>
              </Box>
            </Grid>

            {/* Right Side - Mentors List */}
            <Grid size={{ xs: 12, lg: 7 }}>
              <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                <Typography variant="h4" sx={{ fontWeight: 700, fontFamily: "Poppins, sans-serif" }}>
                  Our <Box component="span" sx={{ color: "hsl(var(--primary))" }}>Mentors</Box>
                </Typography>
                <TextField
                  placeholder="Search mentors..."
                  size="small"
                  value={mentorSearch}
                  onChange={(e) => setMentorSearch(e.target.value)}
                  sx={{ 
                    width: { xs: '100%', sm: '350px' },
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      bgcolor: 'hsl(var(--card))',
                      '& fieldset': { borderColor: 'hsl(var(--border))' },
                      '&:hover fieldset': { borderColor: 'hsl(var(--primary))' },
                    }
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search sx={{ color: 'hsl(var(--muted-foreground))' }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>

              <Grid container spacing={3}>
                {filteredMentors.map((mentor, index) => (
                  <Grid size={{ xs: 12, md: 6 }} key={mentor.id || index}>
                    <motion.div
                      whileHover={{ y: -5 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                    >
                      <Paper sx={{ 
                        p: 3, 
                        borderRadius: '24px', 
                        border: '1px solid hsl(var(--border))', 
                        backgroundColor: "hsl(var(--card))",
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2
                      }}>
                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                          <Avatar 
                            src={getImagePath(mentor.image || mentor.profile_pic)} 
                            alt={mentor.name}
                            sx={{ width: 80, height: 80, borderRadius: '16px' }}
                          />
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="h6" sx={{ fontWeight: 700 }}>{mentor.name}</Typography>
                            <Typography variant="body2" sx={{ color: 'hsl(var(--primary))', fontWeight: 500, mb: 1 }}>
                              {mentor.specialization || mentor.domain?.split(',')[0] || mentor.expertise?.split(',')[0]}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                              {getLabels(mentor).map((label: string, i: number) => (
                                <Chip 
                                  key={i} 
                                  label={label} 
                                  size="small" 
                                  sx={{ fontSize: '10px', height: '20px', bgcolor: 'hsl(var(--muted))' }} 
                                />
                              ))}
                            </Box>
                          </Box>
                        </Box>
                        
                        <Divider sx={{ my: 1, opacity: 0.5 }} />
                        

                      </Paper>
                    </motion.div>
                  </Grid>
                ))}
                {filteredMentors.length === 0 && (
                  <Grid size={{ xs: 12 }}>
                    <Box sx={{ py: 8, textAlign: 'center', bgcolor: 'hsl(var(--muted)/0.3)', borderRadius: '24px' }}>
                      <Typography variant="h6" sx={{ color: 'hsl(var(--muted-foreground))' }}>No mentors found matching your search.</Typography>
                    </Box>
                  </Grid>
                )}
              </Grid>
            </Grid>
          </Grid>

        </motion.div>
      </Container>
    </Box>
  );
};
