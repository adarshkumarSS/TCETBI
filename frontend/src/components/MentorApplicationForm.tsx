import { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Grid,
  Paper,
  IconButton,
  Divider,
  CircularProgress,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@mui/material';
import { Add, Delete, CloudUpload, Send, CheckCircle } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { supportService } from '../api/supportService';

import { uploadToCloudinary } from '../utils/uploadToCloudinary';
import { SquareResizeModal } from './SquareResizeModal';

export const MentorApplicationForm = () => {
  const [submitting, setSubmitting] = useState(false);
  const [logo, setLogo] = useState<File | string | null>(null);
  const [experiences, setExperiences] = useState([{ company: '', role: '', years: '' }]);
  
  const [cropModal, setCropModal] = useState({
    open: false,
    image: '',
  });
  
  const [formData, setFormData] = useState({
    salutation: 'Mr',
    name: '',
    email: '',
    designation: '',
    domain: '',
    years_of_experience: '',
    interested_in: 'both',
    bio: '',
    linkedin: '',
    expertise: ''
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addExperience = () => {
    setExperiences(prev => [...prev, { company: '', role: '', years: '' }]);
  };

  const removeExperience = (index: number) => {
    setExperiences(prev => prev.filter((_, i) => i !== index));
  };

  const handleExperienceChange = (index: number, field: string, value: string) => {
    const nextExp = [...experiences];
    (nextExp[index] as any)[field] = value;
    setExperiences(nextExp);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!logo) {
      toast.error('Please upload your profile photo');
      return;
    }

    setSubmitting(true);
    try {
      // 1. Upload to Cloudinary
      let finalLogo = logo;
      
      // If logo is a blob URL or data URL, convert it to File
      if (typeof logo === 'string' && (logo.startsWith('blob:') || logo.startsWith('data:'))) {
        const res = await fetch(logo);
        const blob = await res.blob();
        finalLogo = new File([blob], `mentor-${Date.now()}.jpg`, { type: blob.type });
      }

      const imageUrl = await uploadToCloudinary(finalLogo as File, 'TCETBI/Mentors');

      // 2. Prepare data
      const mentorData = {
        salutation: formData.salutation,
        name: formData.name,
        email: formData.email,
        designation: formData.designation || '',
        domain: formData.domain,
        years_of_experience: parseInt(String(formData.years_of_experience)) || 0,
        interested_in: formData.interested_in,
        bio: formData.bio,
        linkedin: formData.linkedin || '',
        expertise: formData.expertise || '',
        image: imageUrl,
        experience_details: experiences || [], 
        status: 'pending'
      };
      
      await supportService.createMentor(mentorData);
      toast.success('Application submitted successfully! Our team will review it and get back to you.');
      
      // Reset form
      setFormData({
        salutation: 'Mr',
        name: '',
        email: '',
        designation: '',
        domain: '',
        years_of_experience: '',
        interested_in: 'both',
        bio: '',
        linkedin: '',
        expertise: ''
      });
      setExperiences([{ company: '', role: '', years: '' }]);
      setLogo(null);
      
    } catch (error: any) {
      console.error("Submission Error:", error);
      if (error.response?.data) {
        // If it's an object of errors (e.g. Django DRF response), show the first one
        const errorData = error.response.data;
        if (typeof errorData === 'object' && !Array.isArray(errorData)) {
          const firstKey = Object.keys(errorData)[0];
          const firstError = errorData[firstKey];
          toast.error(`${firstKey}: ${Array.isArray(firstError) ? firstError[0] : firstError}`);
        } else {
           toast.error(error.response.data.error || 'Failed to submit application');
        }
      } else {
         toast.error('Failed to submit application. Please check your connection.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Paper sx={{ p: { xs: 3, md: 5 }, borderRadius: '32px', border: '1px solid hsl(var(--border))', backgroundColor: "hsl(var(--card))", boxShadow: "0 20px 50px -12px rgba(0,0,0,0.1)" }}>
      <Box component="form" onSubmit={handleSubmit}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 4, fontFamily: "Poppins, sans-serif" }}>
          Apply as <Box component="span" sx={{ color: "hsl(var(--primary))" }}>Mentor</Box>
        </Typography>

        <Grid container spacing={3}>
          {/* Basic Info */}
          <Grid size={{ xs: 12, sm: 3 }}>
            <FormControl fullWidth>
              <InputLabel>Salutation</InputLabel>
              <Select
                value={formData.salutation}
                label="Salutation"
                onChange={(e) => handleInputChange('salutation', e.target.value)}
              >
                <MenuItem value="Mr">Mr.</MenuItem>
                <MenuItem value="Mrs">Mrs.</MenuItem>
                <MenuItem value="Ms">Ms.</MenuItem>
                <MenuItem value="Dr">Dr.</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 9 }}>
            <TextField
              fullWidth
              label="Full Name"
              required
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              type="email"
              label="Email ID"
              required
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="LinkedIn Profile (URL or Username)"
              value={formData.linkedin}
              onChange={(e) => handleInputChange('linkedin', e.target.value)}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Current Designation"
              required
              value={formData.designation}
              onChange={(e) => handleInputChange('designation', e.target.value)}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Domain / Industry"
              required
              placeholder="e.g. FinTech, HealthTech, AI"
              value={formData.domain}
              onChange={(e) => handleInputChange('domain', e.target.value)}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              type="number"
              label="Total Years of Experience"
              required
              value={formData.years_of_experience}
              onChange={(e) => handleInputChange('years_of_experience', e.target.value)}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Expertise"
              placeholder="e.g. Growth Hacking, Fundraising"
              value={formData.expertise}
              onChange={(e) => handleInputChange('expertise', e.target.value)}
            />
          </Grid>

          {/* Interested In */}
          <Grid size={{ xs: 12 }}>
            <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>Interested In Mentoring:</Typography>
            <RadioGroup
              row
              value={formData.interested_in}
              onChange={(e) => handleInputChange('interested_in', e.target.value)}
            >
              <FormControlLabel value="student_startups" control={<Radio />} label="Student Startups" />
              <FormControlLabel value="current_startups" control={<Radio />} label="Current Startups" />
              <FormControlLabel value="both" control={<Radio />} label="Both" />
            </RadioGroup>
          </Grid>

          {/* Experience Details */}
          <Grid size={{ xs: 12 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>Detailed Experience</Typography>
              <Button startIcon={<Add />} onClick={addExperience} size="small" variant="outlined">
                Add Row
              </Button>
            </Box>
            <AnimatePresence>
              {experiences.map((exp, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <TextField
                        fullWidth
                        size="small"
                        label="Company / Organization"
                        value={exp.company}
                        onChange={(e) => handleExperienceChange(index, 'company', e.target.value)}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <TextField
                        fullWidth
                        size="small"
                        label="Role"
                        value={exp.role}
                        onChange={(e) => handleExperienceChange(index, 'role', e.target.value)}
                      />
                    </Grid>
                    <Grid size={{ xs: 9, sm: 3 }}>
                      <TextField
                        fullWidth
                        size="small"
                        label="Years"
                        value={exp.years}
                        onChange={(e) => handleExperienceChange(index, 'years', e.target.value)}
                      />
                    </Grid>
                    <Grid size={{ xs: 3, sm: 1 }}>
                      <IconButton 
                        color="error" 
                        onClick={() => removeExperience(index)}
                        disabled={experiences.length === 1}
                      >
                        <Delete />
                      </IconButton>
                    </Grid>
                  </Grid>
                </motion.div>
              ))}
            </AnimatePresence>
          </Grid>

          {/* Bio */}
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Short Bio"
              required
              placeholder="Tell us about yourself and why you want to mentor..."
              value={formData.bio}
              onChange={(e) => handleInputChange('bio', e.target.value)}
            />
          </Grid>

          {/* Photo Upload */}
          <Grid size={{ xs: 12 }}>
            <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>Profile Photo</Typography>
            <Box sx={{ 
              border: '2px dashed hsl(var(--border))', 
              borderRadius: '16px', 
              p: 3, 
              textAlign: 'center',
              cursor: 'pointer',
              overflow: 'hidden',
              minHeight: '160px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              '&:hover': { borderColor: 'hsl(var(--primary))', bgcolor: 'hsl(var(--primary) / 0.02)' }
            }} component="label">
              <input 
                type="file" 
                hidden 
                accept="image/*" 
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setCropModal({
                        open: true,
                        image: reader.result as string,
                      });
                    };
                    reader.readAsDataURL(file);
                  }
                }} 
              />
              {logo ? (
                <Box sx={{ position: 'relative', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ 
                    width: 120, 
                    height: 120, 
                    borderRadius: '16px', 
                    overflow: 'hidden',
                    border: '2px solid hsl(var(--border))',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}>
                    <img 
                      src={typeof logo === 'string' ? logo : URL.createObjectURL(logo)} 
                      alt="Profile" 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CheckCircle color="success" sx={{ fontSize: 16 }} />
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>Photo Selected (Click to change)</Typography>
                  </Box>
                </Box>
              ) : (
                <Box>
                  <CloudUpload sx={{ fontSize: 40, color: 'hsl(var(--muted-foreground))', mb: 1 }} />
                  <Typography variant="body2" color="textSecondary">Click to upload your profile photo</Typography>
                  <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mt: 0.5 }}>
                    PNG, JPG, JPEG (will be converted to square)
                  </Typography>
                </Box>
              )}
            </Box>
          </Grid>

          <SquareResizeModal
            open={cropModal.open}
            image={cropModal.image}
            removeBg={false} // Profile photos usually don't need BG removal by default
            onClose={() => setCropModal({ ...cropModal, open: false })}
            onSave={(cropped) => {
              setLogo(cropped);
              setCropModal({ ...cropModal, open: false });
            }}
          />

          <Grid size={{ xs: 12 }}>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={submitting}
              startIcon={submitting ? <CircularProgress size={20} /> : <Send />}
              sx={{ 
                py: 2, 
                borderRadius: '16px', 
                fontWeight: 700,
                textTransform: 'none',
                fontSize: '1.1rem'
              }}
            >
              {submitting ? 'Submitting Application...' : 'Submit Application'}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};
