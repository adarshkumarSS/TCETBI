import { motion } from 'framer-motion';
import { Box, Typography, Container, Dialog, DialogContent, Avatar } from '@mui/material';
import { CardContainer } from '../components/ui/CardContainer';
import { useState, useEffect } from 'react';
import { ScrollingLogos } from '../components/ui/ScrollingLogos';


interface Startup {
  id: number;
  name: string;
  logo: string;
  ceo: {
    name: string;
    image: string;
    bio: string;
  };
  description: string;
  sector: string;
  founded: string;
  website: string;
}

const CurrentStartupsSection = ({ onStartupClick }: { onStartupClick: (startup: Startup) => void }) => {
  
  const currentStartups: Startup[] = [
    {
      id: 1,
      name: 'EcoTech Solutions',
      logo: '/api/placeholder/100/100',
      ceo: {
        name: 'Dr. Priya Sharma',
        image: '/api/placeholder/150/150',
        bio: 'Environmental Engineer with 10+ years experience in sustainable technology development.'
      },
      description: 'Revolutionary water purification technology using eco-friendly materials.',
      sector: 'Environmental Technology',
      founded: '2023',
      website: 'ecotech-solutions.com'
    },
    {
      id: 2,
      name: 'AgriConnect',
      logo: '/api/placeholder/100/100',
      ceo: {
        name: 'Rajesh Kumar',
        image: '/api/placeholder/150/150',
        bio: 'Agricultural scientist turned entrepreneur, passionate about farmer empowerment.'
      },
      description: 'IoT-based platform connecting farmers with modern agricultural techniques.',
      sector: 'AgriTech',
      founded: '2023',
      website: 'agriconnect.in'
    },
    {
      id: 3,
      name: 'HealthTech Innovations',
      logo: '/api/placeholder/100/100',
      ceo: {
        name: 'Dr. Anitha Raman',
        image: '/api/placeholder/150/150',
        bio: 'Medical doctor and tech innovator focused on accessible healthcare solutions.'
      },
      description: 'AI-powered diagnostic tools for rural healthcare centers.',
      sector: 'HealthTech',
      founded: '2022',
      website: 'healthtech-innovations.com'
    },
    {
      id: 4,
      name: 'EduTech Platform',
      logo: '/api/placeholder/100/100',
      ceo: {
        name: 'Suresh Babu',
        image: '/api/placeholder/150/150',
        bio: 'Former teacher and education technology enthusiast.'
      },
      description: 'Personalized learning platform for skill development.',
      sector: 'EdTech',
      founded: '2023',
      website: 'edutech-platform.com'
    },
    {
      id: 5,
      name: 'FinTech Solutions',
      logo: '/api/placeholder/100/100',
      ceo: {
        name: 'Meera Nair',
        image: '/api/placeholder/150/150',
        bio: 'Finance professional with expertise in digital payment systems.'
      },
      description: 'Digital banking solutions for micro-enterprises.',
      sector: 'FinTech',
      founded: '2022',
      website: 'fintech-solutions.in'
    },
    {
      id: 6,
      name: 'CleanEnergy Corp',
      logo: '/api/placeholder/100/100',
      ceo: {
        name: 'Vikram Singh',
        image: '/api/placeholder/150/150',
        bio: 'Renewable energy expert with 15+ years in solar technology.'
      },
      description: 'Solar energy solutions for rural communities.',
      sector: 'Clean Energy',
      founded: '2023',
      website: 'cleanenergy-corp.com'
    }
  ];

  return (
    <Box sx={{ py: 8, backgroundColor: 'hsl(var(--background))' }}>
      <Container maxWidth="lg">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Typography 
            variant="h3" 
            sx={{ 
              mb: 6,
              color: 'hsl(var(--foreground))',
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 600,
            }}
          >
            Current Startups
          </Typography>
          
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, 
            gap: 3 
          }}>
            {currentStartups.map((startup, index) => (
              <Box key={startup.id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <CardContainer 
                    className="cursor-pointer h-full"
                    onClick={() => onStartupClick(startup)}
                  >
                    <Box sx={{ textAlign: 'center' }}>
                      <motion.img
                        src={startup.logo}
                        alt={startup.name}
                        style={{
                          width: 80,
                          height: 80,
                          objectFit: 'cover',
                          borderRadius: '50%',
                          marginBottom: 16,
                          filter: 'grayscale(100%)',
                          transition: 'filter 0.3s ease'
                        }}
                        whileHover={{ 
                          scale: 1.1,
                          filter: 'grayscale(0%)'
                        }}
                        transition={{ duration: 0.3 }}
                      />
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          mb: 2,
                          color: 'hsl(var(--foreground))',
                          fontFamily: 'Poppins, sans-serif',
                          fontWeight: 600,
                        }}
                      >
                        {startup.name}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: 'hsl(var(--muted-foreground))',
                          fontFamily: 'Poppins, sans-serif',
                          mb: 2,
                        }}
                      >
                        {startup.sector}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: 'hsl(var(--muted-foreground))',
                          fontFamily: 'Poppins, sans-serif',
                          fontSize: '0.9rem',
                        }}
                      >
                        Founded: {startup.founded}
                      </Typography>
                    </Box>
                  </CardContainer>
                </motion.div>
              </Box>
            ))}
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

const GraduatedStartupsSection = ({ onStartupClick }: { onStartupClick: (startup: Startup) => void }) => {
  
  const graduatedStartups: Startup[] = [
    {
      id: 7,
      name: 'TechVentures Ltd',
      logo: '/api/placeholder/100/100',
      ceo: {
        name: 'Arun Krishnan',
        image: '/api/placeholder/150/150',
        bio: 'Serial entrepreneur with successful exits in the technology sector.'
      },
      description: 'B2B software solutions for enterprise automation.',
      sector: 'Enterprise Software',
      founded: '2019',
      website: 'techventures.com'
    },
    {
      id: 8,
      name: 'GreenTech Systems',
      logo: '/api/placeholder/100/100',
      ceo: {
        name: 'Lakshmi Iyer',
        image: '/api/placeholder/150/150',
        bio: 'Environmental engineer turned successful CEO of sustainable tech company.'
      },
      description: 'Waste management solutions using advanced technology.',
      sector: 'Environmental Technology',
      founded: '2018',
      website: 'greentech-systems.com'
    },
    {
      id: 9,
      name: 'MobiHealth',
      logo: '/api/placeholder/100/100',
      ceo: {
        name: 'Dr. Ravi Patel',
        image: '/api/placeholder/150/150',
        bio: 'Healthcare innovator with multiple patents in medical devices.'
      },
      description: 'Mobile health monitoring devices for remote patient care.',
      sector: 'HealthTech',
      founded: '2017',
      website: 'mobihealth.in'
    },
    {
      id: 10,
      name: 'SmartFarm Solutions',
      logo: '/api/placeholder/100/100',
      ceo: {
        name: 'Kavitha Reddy',
        image: '/api/placeholder/150/150',
        bio: 'Agricultural technology pioneer with focus on precision farming.'
      },
      description: 'Precision agriculture solutions using IoT and AI.',
      sector: 'AgriTech',
      founded: '2016',
      website: 'smartfarm-solutions.com'
    }
  ];

  const logoData = graduatedStartups.map(startup => ({
    id: startup.id,
    name: startup.name,
    src: startup.logo
  }));

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
            sx={{ 
              mb: 6,
              color: 'hsl(var(--foreground))',
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 600,
            }}
          >
            Graduated Startups
          </Typography>
          
          <Box sx={{ mb: 6 }}>
            <ScrollingLogos logos={logoData} direction="right" />
          </Box>
          
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, 
            gap: 3 
          }}>
            {graduatedStartups.map((startup, index) => (
              <Box key={startup.id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <CardContainer 
                    className="cursor-pointer h-full"
                    onClick={() => onStartupClick(startup)}
                  >
                    <Box sx={{ textAlign: 'center' }}>
                      <motion.img
                        src={startup.logo}
                        alt={startup.name}
                        style={{
                          width: 60,
                          height: 60,
                          objectFit: 'cover',
                          borderRadius: '50%',
                          marginBottom: 12,
                          filter: 'grayscale(100%)',
                          transition: 'filter 0.3s ease'
                        }}
                        whileHover={{ 
                          scale: 1.1,
                          filter: 'grayscale(0%)'
                        }}
                        transition={{ duration: 0.3 }}
                      />
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          mb: 1,
                          color: 'hsl(var(--foreground))',
                          fontFamily: 'Poppins, sans-serif',
                          fontWeight: 600,
                          fontSize: '1rem',
                        }}
                      >
                        {startup.name}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: 'hsl(var(--muted-foreground))',
                          fontFamily: 'Poppins, sans-serif',
                          fontSize: '0.8rem',
                        }}
                      >
                        {startup.sector}
                      </Typography>
                    </Box>
                  </CardContainer>
                </motion.div>
              </Box>
            ))}
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

const StartupModal = ({ startup, open, onClose }: { startup: Startup | null, open: boolean, onClose: () => void }) => {
  if (!startup) return null;

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 'var(--radius)',
          backgroundColor: 'hsl(var(--card))',
        }
      }}
    >
      <DialogContent sx={{ p: 4 }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
            <Box sx={{ textAlign: 'center' }}>
              <img
                src={startup.logo}
                alt={startup.name}
                style={{
                  width: 120,
                  height: 120,
                  objectFit: 'cover',
                  borderRadius: '50%',
                  marginBottom: 16
                }}
              />
              <Typography 
                variant="h4" 
                sx={{ 
                  mb: 2,
                  color: 'hsl(var(--foreground))',
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: 600,
                }}
              >
                {startup.name}
              </Typography>
              <Typography 
                variant="h6" 
                sx={{ 
                  color: 'hsl(var(--primary))',
                  fontFamily: 'Poppins, sans-serif',
                  mb: 1,
                }}
              >
                {startup.sector}
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: 'hsl(var(--muted-foreground))',
                  fontFamily: 'Poppins, sans-serif',
                }}
              >
                Founded: {startup.founded}
              </Typography>
            </Box>
            
            <Box sx={{ flex: 1 }}>
              <Typography 
                variant="body1" 
                sx={{ 
                  mb: 4,
                  color: 'hsl(var(--foreground))',
                  fontFamily: 'Poppins, sans-serif',
                  lineHeight: 1.6,
                }}
              >
                {startup.description}
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <Avatar 
                  src={startup.ceo.image} 
                  alt={startup.ceo.name}
                  sx={{ width: 80, height: 80 }}
                />
                <Box>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      color: 'hsl(var(--foreground))',
                      fontFamily: 'Poppins, sans-serif',
                      fontWeight: 600,
                      mb: 1,
                    }}
                  >
                    {startup.ceo.name}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: 'hsl(var(--muted-foreground))',
                      fontFamily: 'Poppins, sans-serif',
                      mb: 2,
                    }}
                  >
                    CEO & Founder
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: 'hsl(var(--foreground))',
                      fontFamily: 'Poppins, sans-serif',
                      lineHeight: 1.5,
                    }}
                  >
                    {startup.ceo.bio}
                  </Typography>
                </Box>
              </Box>
              
              <Box sx={{ mt: 3 }}>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: 'hsl(var(--primary))',
                    fontFamily: 'Poppins, sans-serif',
                  }}
                >
                  Website: {startup.website}
                </Typography>
              </Box>
            </Box>
          </Box>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};


export const Portfolio: React.FC = () => {
  const [selectedStartup, setSelectedStartup] = useState<Startup | null>(null);

  return (
    <Box sx={{ pt: 16, pb: 8, minHeight: '100vh', backgroundColor: 'hsl(var(--background))' }}>
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
            <Box component="span" sx={{ color: 'hsl(var(--destructive))' }}>Our </Box>  Portfolio
          </Typography>
        </motion.div>
      </Container>
      
      <CurrentStartupsSection onStartupClick={setSelectedStartup} />
      <GraduatedStartupsSection onStartupClick={setSelectedStartup} />
      
      <StartupModal 
        startup={selectedStartup}
        open={!!selectedStartup}
        onClose={() => setSelectedStartup(null)}
      />
    </Box>
  );
};