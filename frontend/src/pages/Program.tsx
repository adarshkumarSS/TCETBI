import { motion } from 'framer-motion';
import { Box, Typography, Container, Tabs, Tab } from '@mui/material';
import { CardContainer } from '../components/ui/CardContainer';
import { OutlinedTextField } from '../components/ui/OutlinedTextField';
import { useState } from 'react';

interface Program {
  id: number;
  title: string;
  description: string;
  image: string;
  duration: string;
  category: 'live' | 'ended' | 'upcoming';
  startDate: string;
  endDate: string;
  participants: number;
  status: string;
}

const ProgramCard = ({ program }: { program: Program }) => {
  const getStatusColor = (category: string) => {
    switch (category) {
      case 'live': return 'hsl(var(--verdigris))';
      case 'ended': return 'hsl(var(--steel-teal))';
      case 'upcoming': return 'hsl(var(--beau-blue))';
      default: return 'hsl(var(--muted-foreground))';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      whileHover={{ y: -8 }}
    >
      <CardContainer className="h-full">
        <Box 
          sx={{ 
            position: 'relative',
            marginBottom: 3,
          }}
        >
          <motion.img
            src={program.image}
            alt={program.title}
            style={{
              width: '100%',
              height: 200,
              objectFit: 'cover',
              borderRadius: 'var(--radius)',
            }}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          />
          <Box
            sx={{
              position: 'absolute',
              top: 16,
              right: 16,
              backgroundColor: getStatusColor(program.category),
              color: 'white',
              padding: '4px 12px',
              borderRadius: '20px',
              fontSize: '0.75rem',
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 600,
              textTransform: 'uppercase',
            }}
          >
            {program.status}
          </Box>
        </Box>
        
        <Typography 
          variant="h6" 
          sx={{ 
            mb: 2,
            color: 'hsl(var(--foreground))',
            fontFamily: 'Poppins, sans-serif',
            fontWeight: 600,
          }}
        >
          {program.title}
        </Typography>
        
        <Typography 
          variant="body2" 
          sx={{ 
            mb: 3,
            color: 'hsl(var(--muted-foreground))',
            fontFamily: 'Poppins, sans-serif',
            lineHeight: 1.5,
          }}
        >
          {program.description}
        </Typography>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Box>
            <Typography 
              variant="body2" 
              sx={{ 
                color: 'hsl(var(--muted-foreground))',
                fontFamily: 'Poppins, sans-serif',
                fontSize: '0.8rem',
              }}
            >
              Duration
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: 'hsl(var(--primary))',
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 600,
              }}
            >
              {program.duration}
            </Typography>
          </Box>
          <Box>
            <Typography 
              variant="body2" 
              sx={{ 
                color: 'hsl(var(--muted-foreground))',
                fontFamily: 'Poppins, sans-serif',
                fontSize: '0.8rem',
              }}
            >
              Participants
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: 'hsl(var(--primary))',
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 600,
              }}
            >
              {program.participants}
            </Typography>
          </Box>
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box>
            <Typography 
              variant="body2" 
              sx={{ 
                color: 'hsl(var(--muted-foreground))',
                fontFamily: 'Poppins, sans-serif',
                fontSize: '0.8rem',
              }}
            >
              Start Date
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: 'hsl(var(--foreground))',
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 500,
              }}
            >
              {program.startDate}
            </Typography>
          </Box>
          <Box>
            <Typography 
              variant="body2" 
              sx={{ 
                color: 'hsl(var(--muted-foreground))',
                fontFamily: 'Poppins, sans-serif',
                fontSize: '0.8rem',
              }}
            >
              End Date
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: 'hsl(var(--foreground))',
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 500,
              }}
            >
              {program.endDate}
            </Typography>
          </Box>
        </Box>
      </CardContainer>
    </motion.div>
  );
};

export const Program: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'live' | 'ended' | 'upcoming'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const programs: Program[] = [
    {
      id: 1,
      title: 'Startup Accelerator Program',
      description: 'Intensive 6-month program for early-stage startups with mentorship, funding, and market access.',
      image: '/api/placeholder/400/200',
      duration: '6 months',
      category: 'live',
      startDate: 'Jan 2024',
      endDate: 'Jun 2024',
      participants: 25,
      status: 'Live'
    },
    {
      id: 2,
      title: 'Innovation Bootcamp',
      description: 'Intensive 2-week bootcamp focusing on idea validation, business model design, and prototype development.',
      image: '/api/placeholder/400/200',
      duration: '2 weeks',
      category: 'upcoming',
      startDate: 'Apr 2024',
      endDate: 'Apr 2024',
      participants: 50,
      status: 'Registration Open'
    },
    {
      id: 3,
      title: 'Tech Entrepreneur Masterclass',
      description: 'Comprehensive program for technology entrepreneurs covering product development and scaling strategies.',
      image: '/api/placeholder/400/200',
      duration: '3 months',
      category: 'ended',
      startDate: 'Sep 2023',
      endDate: 'Nov 2023',
      participants: 35,
      status: 'Completed'
    },
    {
      id: 4,
      title: 'Women in Entrepreneurship',
      description: 'Dedicated program empowering women entrepreneurs with skills, network, and funding opportunities.',
      image: '/api/placeholder/400/200',
      duration: '4 months',
      category: 'live',
      startDate: 'Feb 2024',
      endDate: 'May 2024',
      participants: 30,
      status: 'Live'
    },
    {
      id: 5,
      title: 'Social Impact Incubator',
      description: 'Program focused on social enterprises and impact-driven startups creating positive change.',
      image: '/api/placeholder/400/200',
      duration: '5 months',
      category: 'upcoming',
      startDate: 'May 2024',
      endDate: 'Sep 2024',
      participants: 20,
      status: 'Applications Open'
    },
    {
      id: 6,
      title: 'AgriTech Innovation Lab',
      description: 'Specialized program for agricultural technology startups focusing on sustainable farming solutions.',
      image: '/api/placeholder/400/200',
      duration: '6 months',
      category: 'ended',
      startDate: 'Jul 2023',
      endDate: 'Dec 2023',
      participants: 15,
      status: 'Completed'
    },
    {
      id: 7,
      title: 'FinTech Accelerator',
      description: 'Dedicated program for financial technology startups with industry partnerships and regulatory guidance.',
      image: '/api/placeholder/400/200',
      duration: '4 months',
      category: 'upcoming',
      startDate: 'Jun 2024',
      endDate: 'Sep 2024',
      participants: 18,
      status: 'Coming Soon'
    },
    {
      id: 8,
      title: 'Healthcare Innovation Program',
      description: 'Program targeting healthcare startups with access to medical experts and industry networks.',
      image: '/api/placeholder/400/200',
      duration: '5 months',
      category: 'ended',
      startDate: 'Mar 2023',
      endDate: 'Jul 2023',
      participants: 22,
      status: 'Completed'
    },
    {
      id: 9,
      title: 'CleanTech Venture Studio',
      description: 'Intensive program for clean technology ventures focusing on environmental sustainability.',
      image: '/api/placeholder/400/200',
      duration: '6 months',
      category: 'live',
      startDate: 'Jan 2024',
      endDate: 'Jun 2024',
      participants: 12,
      status: 'Live'
    }
  ];

  const filteredPrograms = programs.filter(program => {
    const matchesCategory = selectedCategory === 'all' || program.category === selectedCategory;
    const matchesSearch = program.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         program.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryCount = (category: 'all' | 'live' | 'ended' | 'upcoming') => {
    if (category === 'all') return programs.length;
    return programs.filter(p => p.category === category).length;
  };

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
            <Box component="span" sx={{ color: 'hsl(var(--destructive))' }}>Our </Box>  Programs
          </Typography>
          
          {/* Search Bar */}
          <Box sx={{ mb: 6, display: 'flex', justifyContent: 'center' }}>
            <OutlinedTextField
              placeholder="Search programs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ maxWidth: 400, width: '100%' }}
            />
          </Box>
          
          {/* Category Tabs */}
          <Box sx={{ mb: 6 }}>
            <Tabs
              value={selectedCategory}
              onChange={(_, newValue) => setSelectedCategory(newValue)}
              centered
              sx={{
                '& .MuiTab-root': {
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: 500,
                  textTransform: 'none',
                  fontSize: '1rem',
                  color: 'hsl(var(--muted-foreground))',
                  '&.Mui-selected': {
                    color: 'hsl(var(--primary))',
                  }
                },
                '& .MuiTabs-indicator': {
                  backgroundColor: 'hsl(var(--primary))',
                }
              }}
            >
              <Tab 
                label={`All (${getCategoryCount('all')})`} 
                value="all" 
              />
              <Tab 
                label={`Live (${getCategoryCount('live')})`} 
                value="live" 
              />
              <Tab 
                label={`Upcoming (${getCategoryCount('upcoming')})`} 
                value="upcoming" 
              />
              <Tab 
                label={`Ended (${getCategoryCount('ended')})`} 
                value="ended" 
              />
            </Tabs>
          </Box>
          
          {/* Programs Grid */}
          {filteredPrograms.length > 0 ? (
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, 
              gap: 4 
            }}>
              {filteredPrograms.map((program, index) => (
                <Box key={program.id}>
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <ProgramCard program={program} />
                  </motion.div>
                </Box>
              ))}
            </Box>
          ) : (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  color: 'hsl(var(--muted-foreground))',
                  fontFamily: 'Poppins, sans-serif',
                }}
              >
                No programs found matching your criteria.
              </Typography>
            </Box>
          )}
        </motion.div>
      </Container>
    </Box>
  );
};