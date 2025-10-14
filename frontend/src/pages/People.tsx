import { motion } from 'framer-motion';
import { Box, Typography, Container, Avatar } from '@mui/material';
import { CardContainer } from '../components/ui/CardContainer';
import { useState } from 'react';

interface Person {
  id: number;
  name: string;
  position: string;
  image: string;
  bio: string;
  experience: string;
  email?: string;
  linkedin?: string;
}

const FounderSection = () => {
  const founder = {
    name: 'Dr. M. Chidambaram',
    position: 'Founder & Chairman',
    image: '/api/placeholder/300/400',
    bio: 'Visionary leader with 25+ years of experience in academia and entrepreneurship. Dr. Chidambaram has been instrumental in building the entrepreneurial ecosystem at Thiagarajar College and has mentored over 200 startups.',
    experience: '25+ years',
    email: 'chairman@tbi.edu.in'
  };

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
            align="center"
            sx={{ 
              mb: 8,
              color: 'hsl(var(--foreground))',
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 600,
            }}
          >
            Our Founder
          </Typography>
          
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 6, alignItems: 'center' }}>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <motion.img
                src={founder.image}
                alt={founder.name}
                style={{
                  width: 300,
                  height: 400,
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
                  {founder.name}
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
                  {founder.position}
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    mb: 3,
                    color: 'hsl(var(--foreground))',
                    fontFamily: 'Poppins, sans-serif',
                    lineHeight: 1.6,
                  }}
                >
                  {founder.bio}
                </Typography>
                <Box sx={{ display: 'flex', gap: 4, mt: 3 }}>
                  <Box>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: 'hsl(var(--muted-foreground))',
                        fontFamily: 'Poppins, sans-serif',
                        mb: 0.5,
                      }}
                    >
                      Experience
                    </Typography>
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        color: 'hsl(var(--primary))',
                        fontFamily: 'Poppins, sans-serif',
                        fontWeight: 600,
                      }}
                    >
                      {founder.experience}
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
                      Email
                    </Typography>
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        color: 'hsl(var(--primary))',
                        fontFamily: 'Poppins, sans-serif',
                      }}
                    >
                      {founder.email}
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

const CEOSection = () => {
  const ceo = {
    name: 'Mr. Vinoth Rajendran',
    position: 'Chief Executive Officer',
    image: '/asset/people/vinoth_rajendran.png',
    bio: 'Dynamic leader with expertise in startup ecosystems and innovation management. Dr. Vinoth leads TBI strategic initiatives and has been pivotal in the success of our incubation programs.',
    experience: '15+ years',
    email: 'ceo@tbi.edu.in'
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
            Leadership
          </Typography>
          
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <CardContainer className="text-center max-w-md">
                <motion.img
                  src={ceo.image}
                  alt={ceo.name}
                  style={{
                    width: 200,
                    height: 240,
                    objectFit: 'cover',
                    borderRadius: 'var(--radius)',
                    margin: '0 auto 24px',
                    display: 'block'
                  }}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                />
                <Typography 
                  variant="h5" 
                  sx={{ 
                    mb: 1,
                    color: 'hsl(var(--foreground))',
                    fontFamily: 'Poppins, sans-serif',
                    fontWeight: 600,
                  }}
                >
                  {ceo.name}
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
                  {ceo.position}
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    mb: 3,
                    color: 'hsl(var(--foreground))',
                    fontFamily: 'Poppins, sans-serif',
                    lineHeight: 1.6,
                  }}
                >
                  {ceo.bio}
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: 'hsl(var(--primary))',
                    fontFamily: 'Poppins, sans-serif',
                  }}
                >
                  {ceo.email}
                </Typography>
              </CardContainer>
            </motion.div>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

const BoardMembersSection = () => {
  const [hoveredMember, setHoveredMember] = useState<number | null>(null);
  
  const boardMembers: Person[] = [
    {
      id: 1,
      name: 'Dr. Rajesh Kumar',
      position: 'Board Member',
      image: '/api/placeholder/200/200',
      bio: 'Former industry executive with 20+ years in technology and innovation.',
      experience: '20+ years',
      email: 'rajesh@tbi.edu.in'
    },
    {
      id: 2,
      name: 'Ms. Lakshmi Iyer',
      position: 'Board Member',
      image: '/api/placeholder/200/200',
      bio: 'Venture capitalist and startup ecosystem expert.',
      experience: '18+ years',
      email: 'lakshmi@tbi.edu.in'
    },
    {
      id: 3,
      name: 'Dr. Arun Krishnan',
      position: 'Board Member',
      image: '/api/placeholder/200/200',
      bio: 'Academic leader and researcher in entrepreneurship.',
      experience: '22+ years',
      email: 'arun@tbi.edu.in'
    },
    {
      id: 4,
      name: 'Ms. Meera Nair',
      position: 'Board Member',
      image: '/api/placeholder/200/200',
      bio: 'Corporate strategy expert and business development specialist.',
      experience: '16+ years',
      email: 'meera@tbi.edu.in'
    },
    {
      id: 5,
      name: 'Dr. Suresh Babu',
      position: 'Board Member',
      image: '/api/placeholder/200/200',
      bio: 'Innovation management and technology transfer expert.',
      experience: '19+ years',
      email: 'suresh@tbi.edu.in'
    },
    {
      id: 6,
      name: 'Ms. Kavitha Reddy',
      position: 'Board Member',
      image: '/api/placeholder/200/200',
      bio: 'Social entrepreneur and impact investing specialist.',
      experience: '14+ years',
      email: 'kavitha@tbi.edu.in'
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
            align="center"
            sx={{ 
              mb: 8,
              color: 'hsl(var(--foreground))',
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 600,
            }}
          >
            Board Members
          </Typography>
          
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, 
            gap: 4 
          }}>
            {boardMembers.map((member, index) => (
              <Box key={member.id}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  onMouseEnter={() => setHoveredMember(member.id)}
                  onMouseLeave={() => setHoveredMember(null)}
                >
                  <CardContainer className="text-center h-full relative overflow-hidden">
                    <motion.img
                      src={member.image}
                      alt={member.name}
                      style={{
                        width: 120,
                        height: 120,
                        objectFit: 'cover',
                        borderRadius: '50%',
                        margin: '0 auto 16px',
                        display: 'block'
                      }}
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.3 }}
                    />
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        mb: 1,
                        color: 'hsl(var(--foreground))',
                        fontFamily: 'Poppins, sans-serif',
                        fontWeight: 600,
                      }}
                    >
                      {member.name}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        mb: 2,
                        color: 'hsl(var(--primary))',
                        fontFamily: 'Poppins, sans-serif',
                        fontWeight: 500,
                      }}
                    >
                      {member.position}
                    </Typography>
                    
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ 
                        opacity: hoveredMember === member.id ? 1 : 0,
                        height: hoveredMember === member.id ? 'auto' : 0
                      }}
                      transition={{ duration: 0.3 }}
                      style={{ overflow: 'hidden' }}
                    >
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: 'hsl(var(--muted-foreground))',
                          fontFamily: 'Poppins, sans-serif',
                          lineHeight: 1.4,
                          mb: 2,
                        }}
                      >
                        {member.bio}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: 'hsl(var(--primary))',
                          fontFamily: 'Poppins, sans-serif',
                          fontSize: '0.8rem',
                        }}
                      >
                        Experience: {member.experience}
                      </Typography>
                    </motion.div>
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

export const People: React.FC = () => {
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
            <Box component="span" sx={{ color: 'hsl(var(--destructive))' }}>Our </Box>  People
          </Typography>
        </motion.div>
      </Container>
      
      <FounderSection />
      <CEOSection />
      <BoardMembersSection />
    </Box>
  );
};