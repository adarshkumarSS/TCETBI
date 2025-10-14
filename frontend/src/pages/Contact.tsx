import { motion } from 'framer-motion';
import { Box, Typography, Container } from '@mui/material';
import { CardContainer } from '../components/ui/CardContainer';
import { OutlinedTextField } from '../components/ui/OutlinedTextField';
import { DarkButton } from '../components/ui/DarkButton';
import { useState } from 'react';
import { Phone } from '@mui/icons-material';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <CardContainer>
        <Typography 
          variant="h5" 
          sx={{ 
            mb: 4,
            color: 'hsl(var(--foreground))',
            fontFamily: 'Poppins, sans-serif',
            fontWeight: 600,
          }}
        >
          Get in Touch
        </Typography>
        
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
              <OutlinedTextField
                label="Full Name"
                value={formData.name}
                onChange={handleChange('name')}
                required
                fullWidth
              />
              <OutlinedTextField
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={handleChange('email')}
                required
                fullWidth
              />
            </Box>
            
            <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
              <OutlinedTextField
                label="Phone Number"
                value={formData.phone}
                onChange={handleChange('phone')}
                fullWidth
              />
              <OutlinedTextField
                label="Subject"
                value={formData.subject}
                onChange={handleChange('subject')}
                required
                fullWidth
              />
            </Box>
            
            <OutlinedTextField
              label="Message"
              multiline
              rows={4}
              value={formData.message}
              onChange={handleChange('message')}
              required
              fullWidth
            />
            
            <Box sx={{ mt: 2 }}>
              <DarkButton type="submit" size="large" fullWidth>
                Send Message
              </DarkButton>
            </Box>
          </Box>
        </form>
      </CardContainer>
    </motion.div>
  );
};

const ContactInfo = () => {
  const contactDetails = [
    {
      label: 'Address',
      value: 'Thiagarajar Business Incubation Centre\nThiagarajar College of Engineering\nMadurai - 625015, Tamil Nadu, India'
    },
    {
      label: 'Phone',
      value: '+91 452 2482240'
    },
    {
      label: 'Email',
      value: 'info@tbi.edu.in'
    },
    {
      label: 'Working Hours',
      value: 'Monday - Friday: 9:00 AM - 6:00 PM\nSaturday: 9:00 AM - 1:00 PM'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <CardContainer>
        <Typography 
          variant="h5" 
          sx={{ 
            mb: 4,
            color: 'hsl(var(--foreground))',
            fontFamily: 'Poppins, sans-serif',
            fontWeight: 600,
          }}
        >
          Contact Information
        </Typography>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {contactDetails.map((detail, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Typography 
                variant="h6" 
                sx={{ 
                  mb: 1,
                  color: 'hsl(var(--primary))',
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: 600,
                }}
              >
                {detail.label}
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  color: 'hsl(var(--foreground))',
                  fontFamily: 'Poppins, sans-serif',
                  lineHeight: 1.6,
                  whiteSpace: 'pre-line',
                }}
              >
                {detail.value}
              </Typography>
            </motion.div>
          ))}
        </Box>
      </CardContainer>
    </motion.div>
  );
};

const CEOInfo = () => {
  const ceoInfo = {
    name: 'Dr. Priya Raman',
    position: 'Chief Executive Officer',
    image: '/api/placeholder/250/300',
    email: 'ceo@tbi.edu.in',
    phone: '+91 452 2482241',
    bio: 'Dr. Priya Raman brings over 15 years of experience in startup ecosystems and innovation management. She leads TBI strategic initiatives and has been pivotal in the success of our incubation programs.'
  };

  return (
    <Box sx={{ py: 8, backgroundColor: 'hsl(var(--muted))' }}>
      <Container maxWidth="lg">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Typography 
            variant="h3" 
            align="center"
            sx={{ 
              mb: 8,
              color: 'hsl(var(--foreground))',
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 600,
            }}
          >
            Leadership Contact
          </Typography>
          
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 6, alignItems: 'center' }}>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <motion.img
                src={ceoInfo.image}
                alt={ceoInfo.name}
                style={{
                  width: 300,
                  height: 360,
                  objectFit: 'cover',
                  borderRadius: 'var(--radius)',
                  boxShadow: 'var(--shadow-elegant)'
                }}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              style={{ flex: 1 }}
            >
              <CardContainer>
                <Typography 
                  variant="h4" 
                  sx={{ 
                    mb: 2,
                    color: 'hsl(var(--foreground))',
                    fontFamily: 'Poppins, sans-serif',
                    fontWeight: 600,
                  }}
                >
                  {ceoInfo.name}
                </Typography>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    mb: 3,
                    color: 'hsl(var(--primary))',
                    fontFamily: 'Poppins, sans-serif',
                    fontWeight: 500,
                  }}
                >
                  {ceoInfo.position}
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    mb: 4,
                    color: 'hsl(var(--foreground))',
                    fontFamily: 'Poppins, sans-serif',
                    lineHeight: 1.6,
                  }}
                >
                  {ceoInfo.bio}
                </Typography>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: 'hsl(var(--muted-foreground))',
                        fontFamily: 'Poppins, sans-serif',
                        mb: 0.5,
                      }}
                    >
                      Email
                    </Typography>
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        color: 'hsl(var(--primary))',
                        fontFamily: 'Poppins, sans-serif',
                        fontWeight: 600,
                      }}
                    >
                      {ceoInfo.email}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: 'hsl(var(--muted-foreground))',
                        fontFamily: 'Poppins, sans-serif',
                        mb: 0.5,
                      }}
                    >
                      Direct Phone
                    </Typography>
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        color: 'hsl(var(--primary))',
                        fontFamily: 'Poppins, sans-serif',
                        fontWeight: 600,
                      }}
                    >
                      {ceoInfo.phone}
                    </Typography>
                  </Box>
                </Box>
              </CardContainer>
            </motion.div>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

const MapSection = () => {
  return (
    <Box 
      sx={{ 
        py: 8,
        backgroundColor: (theme) => theme.palette.mode === 'dark' ? '#000000' : 'hsl(var(--background))',
      }}
    >
      <Container maxWidth="lg">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Typography 
            variant="h3" 
            align="center"
            sx={{ 
              mb: 8,
              color: (theme) => theme.palette.mode === 'dark' ? '#ffffff' : 'hsl(var(--foreground))',
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 600,
            }}
          >
            <Box component="span" sx={{ color: 'hsl(var(--primary))' }}>Find</Box> Us Here
          </Typography>
          
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 6 }}>
            <Box sx={{ flex: 1 }}>
              <Box
                sx={{
                  width: '100%',
                  height: 400,
                  backgroundColor: (theme) => theme.palette.mode === 'dark' ? '#1a1a1a' : 'hsl(var(--card))',
                  borderRadius: 'var(--radius)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: (theme) => theme.palette.mode === 'dark' ? '1px solid #333' : '1px solid hsl(var(--border))',
                }}
              >
                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: (theme) => theme.palette.mode === 'dark' ? '#999' : 'hsl(var(--muted-foreground))',
                    fontFamily: 'Poppins, sans-serif',
                  }}
                >
                  Google Maps Integration
                </Typography>
              </Box>
            </Box>
            
            <Box sx={{ flex: 1 }}>
              <CardContainer>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 4, mb: 4 }}>
                  <Box 
                    sx={{
                      width: 60,
                      height: 60,
                      borderRadius: '50%',
                      backgroundColor: 'hsl(var(--primary))',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Typography 
                      variant="h6"
                      sx={{ 
                        color: 'hsl(var(--primary-foreground))',
                        fontFamily: 'Poppins, sans-serif',
                        fontWeight: 600,
                      }}
                    >
                      <Phone sx={{ color: 'white', fontSize: 24 }} />
                    </Typography>
                  </Box>
                  <Box>
                    <Typography 
                      variant="h6"
                      sx={{
                        color: (theme) => theme.palette.mode === 'dark' ? '#ffffff' : 'hsl(var(--foreground))',
                        fontFamily: 'Poppins, sans-serif',
                        fontWeight: 600,
                        mb: 1,
                      }}
                    >
                      <Box component="span" sx={{ color: 'hsl(var(--primary))' }}>Quick</Box> Contact
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: (theme) => theme.palette.mode === 'dark' ? '#cccccc' : 'hsl(var(--muted-foreground))',
                        fontFamily: 'Poppins, sans-serif',
                      }}
                    >
                      Reach out to us for immediate assistance
                    </Typography>
                  </Box>
                </Box>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <Box>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        color: 'hsl(var(--primary))',
                        fontFamily: 'Poppins, sans-serif',
                        fontWeight: 600,
                        mb: 1,
                      }}
                    >
                      Office Address
                    </Typography>
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        color: (theme) => theme.palette.mode === 'dark' ? '#ffffff' : 'hsl(var(--foreground))',
                        fontFamily: 'Poppins, sans-serif',
                        lineHeight: 1.6,
                      }}
                    >
                      Thiagarajar Business Incubation Centre<br />
                      Thiagarajar College of Engineering<br />
                      Madurai - 625015<br />
                      Tamil Nadu, India
                    </Typography>
                  </Box>
                  
                  <Box>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        color: 'hsl(var(--primary))',
                        fontFamily: 'Poppins, sans-serif',
                        fontWeight: 600,
                        mb: 1,
                      }}
                    >
                      Contact Details
                    </Typography>
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        color: (theme) => theme.palette.mode === 'dark' ? '#ffffff' : 'hsl(var(--foreground))',
                        fontFamily: 'Poppins, sans-serif',
                        lineHeight: 1.6,
                      }}
                    >
                      Phone: +91 452 2482240<br />
                      Email: info@tbi.edu.in<br />
                      Website: www.tbi.edu.in
                    </Typography>
                  </Box>
                </Box>
              </CardContainer>
            </Box>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};
export const Contact: React.FC = () => {
  return (
    <Box sx={{ pt: 16, minHeight: '100vh', backgroundColor: 'hsl(var(--background))' }}>
      <Container maxWidth="lg">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Typography 
            variant="h2" 
            align="center" 
            sx={{ 
              mb: 8,
              color: 'hsl(var(--foreground))',
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 600,
            }}
          >
            <Box component="span" sx={{ color: 'hsl(var(--destructive))' }}>Contact</Box> Us
          </Typography>
        </motion.div>
      </Container>
      
      <Container maxWidth="lg" sx={{ pb: 8 }}>
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, 
          gap: 6 
        }}>
          <Box>
            <ContactForm />
          </Box>
          <Box>
            <ContactInfo />
          </Box>
        </Box>
      </Container>
      
      <CEOInfo />
      <MapSection />
    </Box>
  );
};