import { motion } from 'framer-motion';
import { Box, Typography, Container, Dialog, DialogContent } from '@mui/material';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { CardContainer } from '../components/ui/CardContainer';
import { useState, useMemo } from 'react';
import TargetCursor from '../components/ui/TargetCursor';

interface MediaItem {
  id: number;
  src: string;
  alt: string;
  category: 'events' | 'facilities' | 'startups' | 'programs';
  title: string;
  description: string;
  album?: string;
}

interface Album {
  id: string;
  title: string;
  coverImage: string;
  items: MediaItem[];
  category: 'events' | 'facilities' | 'startups' | 'programs';
}

const MediaGallery = () => {
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Your actual media items data
const mediaItems: MediaItem[] = [
    // Startup Showcase Album (8 photos)
    {
      id: 1,
      src: '/api/placeholder/400/500',
      alt: 'Startup Showcase Main Stage',
      category: 'events',
      title: 'Main Stage Presentations',
      description: 'Startups presenting on the main stage to investors and industry leaders.',
      album: 'startup-showcase'
    },
    {
      id: 2,
      src: '/api/placeholder/400/450',
      alt: 'Networking Session',
      category: 'events',
      title: 'Networking Session',
      description: 'Participants networking during the showcase event.',
      album: 'startup-showcase'
    },
    {
      id: 3,
      src: '/api/placeholder/400/600',
      alt: 'Award Ceremony',
      category: 'events',
      title: 'Award Ceremony',
      description: 'Celebrating the best startups of the year.',
      album: 'startup-showcase'
    },
    {
      id: 4,
      src: '/api/placeholder/400/550',
      alt: 'Panel Discussion',
      category: 'events',
      title: 'Expert Panel',
      description: 'Industry experts discussing startup trends.',
      album: 'startup-showcase'
    },
    {
      id: 5,
      src: '/api/placeholder/400/500',
      alt: 'Demo Area',
      category: 'events',
      title: 'Product Demos',
      description: 'Startups demonstrating their products to visitors.',
      album: 'startup-showcase'
    },
    {
      id: 6,
      src: '/api/placeholder/400/450',
      alt: 'Investor Meetings',
      category: 'events',
      title: 'Investor Meetings',
      description: 'One-on-one meetings with potential investors.',
      album: 'startup-showcase'
    },
    {
      id: 7,
      src: '/api/placeholder/400/600',
      alt: 'Closing Ceremony',
      category: 'events',
      title: 'Closing Ceremony',
      description: 'Final remarks and future announcements.',
      album: 'startup-showcase'
    },
    {
      id: 8,
      src: '/api/placeholder/400/550',
      alt: 'Team Celebrations',
      category: 'events',
      title: 'Team Celebrations',
      description: 'Startup teams celebrating their achievements.',
      album: 'startup-showcase'
    },

    // Innovation Lab Album (10 photos)
    {
      id: 9,
      src: '/api/placeholder/400/300',
      alt: 'Innovation Lab Entrance',
      category: 'facilities',
      title: 'Lab Entrance',
      description: 'Modern entrance to our innovation laboratory.',
      album: 'innovation-lab'
    },
    {
      id: 10,
      src: '/api/placeholder/400/350',
      alt: 'Research Area',
      category: 'facilities',
      title: 'Research Zone',
      description: 'Dedicated area for research and development.',
      album: 'innovation-lab'
    },
    {
      id: 11,
      src: '/api/placeholder/400/400',
      alt: 'Collaboration Space',
      category: 'facilities',
      title: 'Collaboration Space',
      description: 'Open space for team collaboration and brainstorming.',
      album: 'innovation-lab'
    },
    {
      id: 12,
      src: '/api/placeholder/400/300',
      alt: 'Equipment Room',
      category: 'facilities',
      title: 'Advanced Equipment',
      description: 'State-of-the-art research equipment available.',
      album: 'innovation-lab'
    },
    {
      id: 13,
      src: '/api/placeholder/400/450',
      alt: 'Testing Area',
      category: 'facilities',
      title: 'Testing Facility',
      description: 'Dedicated space for product testing and validation.',
      album: 'innovation-lab'
    },
    {
      id: 14,
      src: '/api/placeholder/400/350',
      alt: 'Meeting Rooms',
      category: 'facilities',
      title: 'Meeting Rooms',
      description: 'Private meeting rooms for team discussions.',
      album: 'innovation-lab'
    },
    {
      id: 15,
      src: '/api/placeholder/400/400',
      alt: 'Breakout Area',
      category: 'facilities',
      title: 'Breakout Space',
      description: 'Relaxed area for informal meetings and breaks.',
      album: 'innovation-lab'
    },
    {
      id: 16,
      src: '/api/placeholder/400/300',
      alt: 'Lab Equipment',
      category: 'facilities',
      title: 'Specialized Equipment',
      description: 'Advanced tools for research and development.',
      album: 'innovation-lab'
    },
    {
      id: 17,
      src: '/api/placeholder/400/450',
      alt: 'Team Workspace',
      category: 'facilities',
      title: 'Team Workspace',
      description: 'Dedicated workstations for lab teams.',
      album: 'innovation-lab'
    },
    {
      id: 18,
      src: '/api/placeholder/400/350',
      alt: 'Lab Overview',
      category: 'facilities',
      title: 'Full Lab View',
      description: 'Complete overview of the innovation laboratory.',
      album: 'innovation-lab'
    },

    // EcoTech Solutions Album (12 photos)
    {
      id: 19,
      src: '/api/placeholder/400/600',
      alt: 'EcoTech Team Photo',
      category: 'startups',
      title: 'Team Photo',
      description: 'The complete EcoTech Solutions team.',
      album: 'ecotech-solutions'
    },
    {
      id: 20,
      src: '/api/placeholder/400/550',
      alt: 'Product Development',
      category: 'startups',
      title: 'Product Development',
      description: 'Developing sustainable water purification technology.',
      album: 'ecotech-solutions'
    },
    {
      id: 21,
      src: '/api/placeholder/400/500',
      alt: 'Field Testing',
      category: 'startups',
      title: 'Field Testing',
      description: 'Testing the technology in real-world conditions.',
      album: 'ecotech-solutions'
    },
    {
      id: 22,
      src: '/api/placeholder/400/600',
      alt: 'Manufacturing Process',
      category: 'startups',
      title: 'Manufacturing',
      description: 'Production of water purification units.',
      album: 'ecotech-solutions'
    },
    {
      id: 23,
      src: '/api/placeholder/400/550',
      alt: 'Quality Control',
      category: 'startups',
      title: 'Quality Control',
      description: 'Ensuring high standards in every product.',
      album: 'ecotech-solutions'
    },
    {
      id: 24,
      src: '/api/placeholder/400/500',
      alt: 'Team Meeting',
      category: 'startups',
      title: 'Team Strategy',
      description: 'Planning the next phase of development.',
      album: 'ecotech-solutions'
    },
    {
      id: 25,
      src: '/api/placeholder/400/600',
      alt: 'Client Demonstration',
      category: 'startups',
      title: 'Client Demo',
      description: 'Demonstrating the technology to potential clients.',
      album: 'ecotech-solutions'
    },
    {
      id: 26,
      src: '/api/placeholder/400/550',
      alt: 'Research Session',
      category: 'startups',
      title: 'Research & Development',
      description: 'Continuous improvement of the technology.',
      album: 'ecotech-solutions'
    },
    {
      id: 27,
      src: '/api/placeholder/400/500',
      alt: 'Office Space',
      category: 'startups',
      title: 'Office Environment',
      description: 'EcoTech Solutions workspace.',
      album: 'ecotech-solutions'
    },
    {
      id: 28,
      src: '/api/placeholder/400/600',
      alt: 'Team Collaboration',
      category: 'startups',
      title: 'Team Collaboration',
      description: 'Working together on new features.',
      album: 'ecotech-solutions'
    },
    {
      id: 29,
      src: '/api/placeholder/400/550',
      alt: 'Product Launch',
      category: 'startups',
      title: 'Product Launch',
      description: 'Launching the latest version.',
      album: 'ecotech-solutions'
    },
    {
      id: 30,
      src: '/api/placeholder/400/500',
      alt: 'Success Celebration',
      category: 'startups',
      title: 'Success Celebration',
      description: 'Celebrating milestones and achievements.',
      album: 'ecotech-solutions'
    },

    // Accelerator Program Album (8 photos)
    {
      id: 31,
      src: '/api/placeholder/400/400',
      alt: 'Program Orientation',
      category: 'programs',
      title: 'Program Orientation',
      description: 'Welcome session for new accelerator participants.',
      album: 'accelerator-program'
    },
    {
      id: 32,
      src: '/api/placeholder/400/450',
      alt: 'Workshop Session',
      category: 'programs',
      title: 'Workshop',
      description: 'Interactive workshop on business development.',
      album: 'accelerator-program'
    },
    {
      id: 33,
      src: '/api/placeholder/400/400',
      alt: 'Mentor Sessions',
      category: 'programs',
      title: 'Mentor Meetings',
      description: 'One-on-one sessions with experienced mentors.',
      album: 'accelerator-program'
    },
    {
      id: 34,
      src: '/api/placeholder/400/450',
      alt: 'Progress Review',
      category: 'programs',
      title: 'Progress Review',
      description: 'Regular check-ins and progress assessments.',
      album: 'accelerator-program'
    },
    {
      id: 35,
      src: '/api/placeholder/400/400',
      alt: 'Networking Event',
      category: 'programs',
      title: 'Networking Event',
      description: 'Connecting with industry professionals.',
      album: 'accelerator-program'
    },
    {
      id: 36,
      src: '/api/placeholder/400/450',
      alt: 'Demo Day Prep',
      category: 'programs',
      title: 'Demo Day Preparation',
      description: 'Preparing for the final presentation day.',
      album: 'accelerator-program'
    },
    {
      id: 37,
      src: '/api/placeholder/400/400',
      alt: 'Graduation Ceremony',
      category: 'programs',
      title: 'Graduation',
      description: 'Celebrating program completion.',
      album: 'accelerator-program'
    },
    {
      id: 38,
      src: '/api/placeholder/400/450',
      alt: 'Alumni Network',
      category: 'programs',
      title: 'Alumni Network',
      description: 'Joining the accelerator alumni community.',
      album: 'accelerator-program'
    },

    // NEW ALBUMS

    // Mentorship Sessions Album (6 photos)
    {
      id: 39,
      src: '/api/placeholder/400/550',
      alt: 'One-on-One Mentoring',
      category: 'programs',
      title: 'Individual Mentoring',
      description: 'Personalized guidance sessions.',
      album: 'mentorship-sessions'
    },
    {
      id: 40,
      src: '/api/placeholder/400/500',
      alt: 'Group Mentoring',
      category: 'programs',
      title: 'Group Sessions',
      description: 'Mentoring in small groups.',
      album: 'mentorship-sessions'
    },
    {
      id: 41,
      src: '/api/placeholder/400/550',
      alt: 'Expert Advice',
      category: 'programs',
      title: 'Expert Guidance',
      description: 'Learning from industry experts.',
      album: 'mentorship-sessions'
    },
    {
      id: 42,
      src: '/api/placeholder/400/500',
      alt: 'Career Guidance',
      category: 'programs',
      title: 'Career Development',
      description: 'Career planning and advice.',
      album: 'mentorship-sessions'
    },
    {
      id: 43,
      src: '/api/placeholder/400/550',
      alt: 'Skill Building',
      category: 'programs',
      title: 'Skill Development',
      description: 'Building essential entrepreneurial skills.',
      album: 'mentorship-sessions'
    },
    {
      id: 44,
      src: '/api/placeholder/400/500',
      alt: 'Networking',
      category: 'programs',
      title: 'Professional Networking',
      description: 'Connecting with mentors and peers.',
      album: 'mentorship-sessions'
    },

    // Co-working Space Album (9 photos)
    {
      id: 45,
      src: '/api/placeholder/400/350',
      alt: 'Main Workspace',
      category: 'facilities',
      title: 'Main Workspace',
      description: 'Open co-working area.',
      album: 'coworking-space'
    },
    {
      id: 46,
      src: '/api/placeholder/400/300',
      alt: 'Private Offices',
      category: 'facilities',
      title: 'Private Offices',
      description: 'Dedicated private workspaces.',
      album: 'coworking-space'
    },
    {
      id: 47,
      src: '/api/placeholder/400/350',
      alt: 'Meeting Rooms',
      category: 'facilities',
      title: 'Meeting Rooms',
      description: 'Professional meeting spaces.',
      album: 'coworking-space'
    },
    {
      id: 48,
      src: '/api/placeholder/400/300',
      alt: 'Break Area',
      category: 'facilities',
      title: 'Break Area',
      description: 'Comfortable relaxation space.',
      album: 'coworking-space'
    },
    {
      id: 49,
      src: '/api/placeholder/400/350',
      alt: 'Event Space',
      category: 'facilities',
      title: 'Event Space',
      description: 'Area for community events.',
      album: 'coworking-space'
    },
    {
      id: 50,
      src: '/api/placeholder/400/300',
      alt: 'Kitchen Facility',
      category: 'facilities',
      title: 'Kitchen',
      description: 'Fully equipped kitchen area.',
      album: 'coworking-space'
    },
    {
      id: 51,
      src: '/api/placeholder/400/350',
      alt: 'Phone Booths',
      category: 'facilities',
      title: 'Phone Booths',
      description: 'Private calling spaces.',
      album: 'coworking-space'
    },
    {
      id: 52,
      src: '/api/placeholder/400/300',
      alt: 'Reception Area',
      category: 'facilities',
      title: 'Reception',
      description: 'Welcome and reception space.',
      album: 'coworking-space'
    },
    {
      id: 53,
      src: '/api/placeholder/400/350',
      alt: 'Collaboration Zones',
      category: 'facilities',
      title: 'Collaboration Zones',
      description: 'Areas for team collaboration.',
      album: 'coworking-space'
    },

    // AgriConnect Album (7 photos)
    {
      id: 54,
      src: '/api/placeholder/400/500',
      alt: 'AgriConnect Team',
      category: 'startups',
      title: 'Team Photo',
      description: 'The AgriConnect development team.',
      album: 'agriconnect'
    },
    {
      id: 55,
      src: '/api/placeholder/400/450',
      alt: 'Technology Demo',
      category: 'startups',
      title: 'Technology Demo',
      description: 'Demonstrating the IoT platform.',
      album: 'agriconnect'
    },
    {
      id: 56,
      src: '/api/placeholder/400/500',
      alt: 'Field Implementation',
      category: 'startups',
      title: 'Field Implementation',
      description: 'Implementing technology on farms.',
      album: 'agriconnect'
    },
    {
      id: 57,
      src: '/api/placeholder/400/450',
      alt: 'Data Analytics',
      category: 'startups',
      title: 'Data Analytics',
      description: 'Analyzing agricultural data.',
      album: 'agriconnect'
    },
    {
      id: 58,
      src: '/api/placeholder/400/500',
      alt: 'User Training',
      category: 'startups',
      title: 'User Training',
      description: 'Training farmers on the platform.',
      album: 'agriconnect'
    },
    {
      id: 59,
      src: '/api/placeholder/400/450',
      alt: 'Product Development',
      category: 'startups',
      title: 'Product Development',
      description: 'Developing new features.',
      album: 'agriconnect'
    },
    {
      id: 60,
      src: '/api/placeholder/400/500',
      alt: 'Success Stories',
      category: 'startups',
      title: 'Success Stories',
      description: 'Celebrating farmer success stories.',
      album: 'agriconnect'
    },

    // Innovation Bootcamp Album (8 photos)
    {
      id: 61,
      src: '/api/placeholder/400/450',
      alt: 'Bootcamp Opening',
      category: 'events',
      title: 'Bootcamp Opening',
      description: 'Kicking off the innovation bootcamp.',
      album: 'innovation-bootcamp'
    },
    {
      id: 62,
      src: '/api/placeholder/400/500',
      alt: 'Idea Generation',
      category: 'events',
      title: 'Idea Generation',
      description: 'Participants brainstorming ideas.',
      album: 'innovation-bootcamp'
    },
    {
      id: 63,
      src: '/api/placeholder/400/450',
      alt: 'Prototyping Session',
      category: 'events',
      title: 'Prototyping',
      description: 'Creating initial prototypes.',
      album: 'innovation-bootcamp'
    },
    {
      id: 64,
      src: '/api/placeholder/400/500',
      alt: 'Team Presentations',
      category: 'events',
      title: 'Team Presentations',
      description: 'Teams presenting their solutions.',
      album: 'innovation-bootcamp'
    },
    {
      id: 65,
      src: '/api/placeholder/400/450',
      alt: 'Expert Feedback',
      category: 'events',
      title: 'Expert Feedback',
      description: 'Receiving feedback from mentors.',
      album: 'innovation-bootcamp'
    },
    {
      id: 66,
      src: '/api/placeholder/400/500',
      alt: 'Networking Break',
      category: 'events',
      title: 'Networking',
      description: 'Networking with other participants.',
      album: 'innovation-bootcamp'
    },
    {
      id: 67,
      src: '/api/placeholder/400/450',
      alt: 'Final Pitches',
      category: 'events',
      title: 'Final Pitches',
      description: 'Final presentations to judges.',
      album: 'innovation-bootcamp'
    },
    {
      id: 68,
      src: '/api/placeholder/400/500',
      alt: 'Award Ceremony',
      category: 'events',
      title: 'Awards',
      description: 'Celebrating the winning teams.',
      album: 'innovation-bootcamp'
    },

    // Prototyping Lab Album (10 photos)
    {
      id: 69,
      src: '/api/placeholder/400/300',
      alt: '3D Printing Area',
      category: 'facilities',
      title: '3D Printing',
      description: 'Advanced 3D printing facilities.',
      album: 'prototyping-lab'
    },
    {
      id: 70,
      src: '/api/placeholder/400/350',
      alt: 'Electronics Lab',
      category: 'facilities',
      title: 'Electronics Lab',
      description: 'Electronics prototyping area.',
      album: 'prototyping-lab'
    },
    {
      id: 71,
      src: '/api/placeholder/400/300',
      alt: 'Woodworking Shop',
      category: 'facilities',
      title: 'Woodworking',
      description: 'Traditional fabrication tools.',
      album: 'prototyping-lab'
    },
    {
      id: 72,
      src: '/api/placeholder/400/350',
      alt: 'Metal Workshop',
      category: 'facilities',
      title: 'Metal Workshop',
      description: 'Metal fabrication equipment.',
      album: 'prototyping-lab'
    },
    {
      id: 73,
      src: '/api/placeholder/400/300',
      alt: 'Design Computers',
      category: 'facilities',
      title: 'Design Station',
      description: 'CAD and design workstations.',
      album: 'prototyping-lab'
    },
    {
      id: 74,
      src: '/api/placeholder/400/350',
      alt: 'Testing Equipment',
      category: 'facilities',
      title: 'Testing Equipment',
      description: 'Quality testing and validation tools.',
      album: 'prototyping-lab'
    },
    {
      id: 75,
      src: '/api/placeholder/400/300',
      alt: 'Material Storage',
      category: 'facilities',
      title: 'Material Storage',
      description: 'Various prototyping materials.',
      album: 'prototyping-lab'
    },
    {
      id: 76,
      src: '/api/placeholder/400/350',
      alt: 'Safety Equipment',
      category: 'facilities',
      title: 'Safety First',
      description: 'Safety equipment and protocols.',
      album: 'prototyping-lab'
    },
    {
      id: 77,
      src: '/api/placeholder/400/300',
      alt: 'Team Projects',
      category: 'facilities',
      title: 'Team Projects',
      description: 'Ongoing team prototyping projects.',
      album: 'prototyping-lab'
    },
    {
      id: 78,
      src: '/api/placeholder/400/350',
      alt: 'Finished Prototypes',
      category: 'facilities',
      title: 'Completed Projects',
      description: 'Successfully completed prototypes.',
      album: 'prototyping-lab'
    },

    // HealthTech Innovations Album (11 photos)
    {
      id: 79,
      src: '/api/placeholder/400/400',
      alt: 'AI Diagnostics',
      category: 'startups',
      title: 'AI Diagnostics',
      description: 'AI-powered diagnostic tools demonstration.',
      album: 'healthtech-innovations'
    },
    {
      id: 80,
      src: '/api/placeholder/400/450',
      alt: 'Rural Healthcare',
      category: 'startups',
      title: 'Rural Implementation',
      description: 'Deploying technology in rural areas.',
      album: 'healthtech-innovations'
    },
    {
      id: 81,
      src: '/api/placeholder/400/400',
      alt: 'Medical Testing',
      category: 'startups',
      title: 'Medical Testing',
      description: 'Conducting medical tests and trials.',
      album: 'healthtech-innovations'
    },
    {
      id: 82,
      src: '/api/placeholder/400/450',
      alt: 'Team Research',
      category: 'startups',
      title: 'Research Team',
      description: 'HealthTech research and development team.',
      album: 'healthtech-innovations'
    },
    {
      id: 83,
      src: '/api/placeholder/400/400',
      alt: 'Product Design',
      category: 'startups',
      title: 'Product Design',
      description: 'Designing healthcare solutions.',
      album: 'healthtech-innovations'
    },
    {
      id: 84,
      src: '/api/placeholder/400/450',
      alt: 'Clinical Trials',
      category: 'startups',
      title: 'Clinical Trials',
      description: 'Testing with medical professionals.',
      album: 'healthtech-innovations'
    },
    {
      id: 85,
      src: '/api/placeholder/400/400',
      alt: 'Technology Integration',
      category: 'startups',
      title: 'Technology Integration',
      description: 'Integrating with healthcare systems.',
      album: 'healthtech-innovations'
    },
    {
      id: 86,
      src: '/api/placeholder/400/450',
      alt: 'User Training',
      category: 'startups',
      title: 'Medical Staff Training',
      description: 'Training healthcare professionals.',
      album: 'healthtech-innovations'
    },
    {
      id: 87,
      src: '/api/placeholder/400/400',
      alt: 'Data Analysis',
      category: 'startups',
      title: 'Health Data Analysis',
      description: 'Analyzing patient data and outcomes.',
      album: 'healthtech-innovations'
    },
    {
      id: 88,
      src: '/api/placeholder/400/450',
      alt: 'Mobile Solutions',
      category: 'startups',
      title: 'Mobile Health',
      description: 'Mobile healthcare applications.',
      album: 'healthtech-innovations'
    },
    {
      id: 89,
      src: '/api/placeholder/400/400',
      alt: 'Success Metrics',
      category: 'startups',
      title: 'Success Metrics',
      description: 'Tracking healthcare improvements.',
      album: 'healthtech-innovations'
    },

    // Investor Pitch Day Album (9 photos)
    {
      id: 90,
      src: '/api/placeholder/400/550',
      alt: 'Pitch Preparation',
      category: 'events',
      title: 'Pitch Preparation',
      description: 'Startups preparing their presentations.',
      album: 'investor-pitch-day'
    },
    {
      id: 91,
      src: '/api/placeholder/400/500',
      alt: 'Investor Arrival',
      category: 'events',
      title: 'Investor Arrival',
      description: 'Investors arriving for the event.',
      album: 'investor-pitch-day'
    },
    {
      id: 92,
      src: '/api/placeholder/400/550',
      alt: 'Opening Remarks',
      category: 'events',
      title: 'Opening Remarks',
      description: 'Event opening and welcome speech.',
      album: 'investor-pitch-day'
    },
    {
      id: 93,
      src: '/api/placeholder/400/500',
      alt: 'Startup Pitches',
      category: 'events',
      title: 'Startup Pitches',
      description: 'Founders presenting to investors.',
      album: 'investor-pitch-day'
    },
    {
      id: 94,
      src: '/api/placeholder/400/550',
      alt: 'Q&A Session',
      category: 'events',
      title: 'Q&A Session',
      description: 'Investors asking questions.',
      album: 'investor-pitch-day'
    },
    {
      id: 95,
      src: '/api/placeholder/400/500',
      alt: 'Networking Break',
      category: 'events',
      title: 'Networking',
      description: 'Networking between founders and investors.',
      album: 'investor-pitch-day'
    },
    {
      id: 96,
      src: '/api/placeholder/400/550',
      alt: 'Deal Discussions',
      category: 'events',
      title: 'Deal Discussions',
      description: 'Discussing potential investments.',
      album: 'investor-pitch-day'
    },
    {
      id: 97,
      src: '/api/placeholder/400/500',
      alt: 'Closing Ceremony',
      category: 'events',
      title: 'Closing',
      description: 'Event conclusion and next steps.',
      album: 'investor-pitch-day'
    },
    {
      id: 98,
      src: '/api/placeholder/400/550',
      alt: 'Success Stories',
      category: 'events',
      title: 'Success Stories',
      description: 'Celebrating funded startups.',
      album: 'investor-pitch-day'
    },

    // Women Entrepreneurship Album (8 photos)
    {
      id: 99,
      src: '/api/placeholder/400/500',
      alt: 'Program Launch',
      category: 'programs',
      title: 'Program Launch',
      description: 'Launching the women entrepreneurship program.',
      album: 'women-entrepreneurship'
    },
    {
      id: 100,
      src: '/api/placeholder/400/450',
      alt: 'Workshop Sessions',
      category: 'programs',
      title: 'Workshops',
      description: 'Skill-building workshops for women entrepreneurs.',
      album: 'women-entrepreneurship'
    },
    {
      id: 101,
      src: '/api/placeholder/400/500',
      alt: 'Mentor Matching',
      category: 'programs',
      title: 'Mentor Matching',
      description: 'Connecting with experienced mentors.',
      album: 'women-entrepreneurship'
    },
    {
      id: 102,
      src: '/api/placeholder/400/450',
      alt: 'Networking Events',
      category: 'programs',
      title: 'Networking',
      description: 'Building professional networks.',
      album: 'women-entrepreneurship'
    },
    {
      id: 103,
      src: '/api/placeholder/400/500',
      alt: 'Pitch Training',
      category: 'programs',
      title: 'Pitch Training',
      description: 'Training for investor presentations.',
      album: 'women-entrepreneurship'
    },
    {
      id: 104,
      src: '/api/placeholder/400/450',
      alt: 'Funding Opportunities',
      category: 'programs',
      title: 'Funding Access',
      description: 'Access to capital and resources.',
      album: 'women-entrepreneurship'
    },
    {
      id: 105,
      src: '/api/placeholder/400/500',
      alt: 'Success Celebration',
      category: 'programs',
      title: 'Success Stories',
      description: 'Celebrating program achievements.',
      album: 'women-entrepreneurship'
    },
    {
      id: 106,
      src: '/api/placeholder/400/450',
      alt: 'Alumni Network',
      category: 'programs',
      title: 'Alumni Community',
      description: 'Growing network of women entrepreneurs.',
      album: 'women-entrepreneurship'
    }
  ];

  // Group media items into albums
  const albums: Album[] = useMemo(() => {
    const albumMap = new Map();
    
    mediaItems.forEach(item => {
      if (!item.album) return;
      
      if (!albumMap.has(item.album)) {
        albumMap.set(item.album, {
          id: item.album,
          title: item.album.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
          ).join(' '),
          coverImage: item.src, // Use first image as cover
          items: [],
          category: item.category
        });
      }
      
      albumMap.get(item.album).items.push(item);
    });
    
    return Array.from(albumMap.values());
  }, [mediaItems]);

  const categories = [
    { key: 'all', label: 'All Galleries', count: albums.length },
    { key: 'events', label: 'Events', count: albums.filter(album => album.category === 'events').length },
    { key: 'facilities', label: 'Facilities', count: albums.filter(album => album.category === 'facilities').length },
    { key: 'startups', label: 'Startups', count: albums.filter(album => album.category === 'startups').length },
    { key: 'programs', label: 'Programs', count: albums.filter(album => album.category === 'programs').length }
  ];

  const [activeCategory, setActiveCategory] = useState('all');

  const filteredAlbums = activeCategory === 'all' 
    ? albums 
    : albums.filter(album => album.category === activeCategory);

  const openAlbumModal = (album: Album) => {
    setSelectedAlbum(album);
    setCurrentImageIndex(0);
  };

  const closeAlbumModal = () => {
    setSelectedAlbum(null);
  };

  const navigateImage = (direction: 'prev' | 'next') => {
    if (!selectedAlbum) return;
    
    if (direction === 'prev') {
      const newIndex = currentImageIndex > 0 ? currentImageIndex - 1 : selectedAlbum.items.length - 1;
      setCurrentImageIndex(newIndex);
    } else {
      const newIndex = currentImageIndex < selectedAlbum.items.length - 1 ? currentImageIndex + 1 : 0;
      setCurrentImageIndex(newIndex);
    }
  };

  const selectImageFromList = (index: number) => {
    setCurrentImageIndex(index);
  };

  return (
    <Box sx={{ py: 8 }}>
      <Container maxWidth="xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          {/* Category Filter */}
          <Box sx={{ mb: 6, display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 2 }}>
            {categories.map((category) => (
              <motion.button
                key={category.key}
                onClick={() => setActiveCategory(category.key)}
                style={{
                  padding: '12px 24px',
                  borderRadius: '12px',
                  border: 'none',
                  backgroundColor: activeCategory === category.key 
                    ? 'hsl(var(--primary))' 
                    : 'hsl(var(--secondary))',
                  color: activeCategory === category.key 
                    ? 'hsl(var(--primary-foreground))' 
                    : 'hsl(var(--secondary-foreground))',
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  fontSize: '0.95rem'
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {category.label} ({category.count})
              </motion.button>
            ))}
          </Box>

          {/* Perfectly Aligned Grid - All Same Size */}
          <Box 
            sx={{ 
              display: 'grid',
              gridTemplateColumns: { 
                xs: '1fr', 
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
                lg: 'repeat(4, 1fr)',
                xl: 'repeat(5, 1fr)'
              },
              gap: { xs: 3, sm: 3, md: 3.5, lg: 4 },
              justifyItems: 'center',
              alignItems: 'start',
            }}
          >
            {filteredAlbums.map((album, index) => (
              <motion.div
                key={`${activeCategory}-${album.id}`}
                className="cursor-target"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.6, 
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 100,
                  damping: 15
                }}
                style={{ 
                  cursor: 'pointer',
                  width: '100%',
                  height: '320px' // Fixed height for all boxes
                }}
                onClick={() => openAlbumModal(album)}
              >
                <CardContainer 
                  hover={true} 
                  className="overflow-hidden group p-0 h-full"
                  onClick={() => openAlbumModal(album)}
                >
                  <motion.div
                    style={{ 
                      height: '100%',
                      width: '100%',
                      overflow: 'hidden',
                      borderRadius: 'var(--radius)',
                      position: 'relative'
                    }}
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                  >
                    <img
                      src={album.coverImage}
                      alt={album.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        borderRadius: 'var(--radius)',
                        transition: 'filter 0.3s ease'
                      }}
                      className="group-hover:brightness-110 group-hover:contrast-110"
                    />
                    
                    {/* Album title - disappears on hover */}
                    <Box 
                      sx={{ 
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                        p: 2,
                        borderBottomLeftRadius: 'var(--radius)',
                        borderBottomRightRadius: 'var(--radius)',
                        transition: 'opacity 0.3s ease',
                        opacity: 1
                      }}
                      className="group-hover:opacity-0"
                    >
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          color: 'white',
                          fontFamily: 'Poppins, sans-serif',
                          fontWeight: 600,
                          fontSize: '1rem',
                          textAlign: 'center',
                          textShadow: '0 2px 4px rgba(0,0,0,0.5)'
                        }}
                      >
                        {album.title}
                      </Typography>
                    </Box>

                    {/* Album overlay - appears on hover */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center p-4"
                      style={{ borderRadius: 'var(--radius)' }}
                    >
                      <div className="text-white text-center">
                        <h4 className="font-semibold text-xl mb-3">{album.title}</h4>
                        <p className="text-sm text-white/80 mb-4">
                          {album.items.length} photo{album.items.length > 1 ? 's' : ''}
                        </p>
                        <div className="flex justify-center space-x-2">
                          {album.items.slice(0, 4).map((item, idx) => (
                            <div
                              key={idx}
                              className="w-8 h-8 rounded overflow-hidden border-2 border-white"
                              style={{
                                transform: `rotate(${idx * 4 - 6}deg)`,
                                zIndex: 4 - idx
                              }}
                            >
                              <img
                                src={item.src}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ))}
                          {album.items.length > 4 && (
                            <div className="w-8 h-8 rounded bg-white/30 flex items-center justify-center text-xs font-bold border-2 border-white backdrop-blur-sm">
                              +{album.items.length - 4}
                            </div>
                          )}
                        </div>
                        <p className="text-white/70 text-xs mt-4">Click to view album</p>
                      </div>
                    </motion.div>

                    {/* Album badge - stays visible */}
                    <Box 
                      sx={{ 
                        position: 'absolute',
                        top: 12,
                        right: 12,
                        px: 2,
                        py: 0.5,
                        backgroundColor: 'hsl(var(--primary))',
                        color: 'hsl(var(--primary-foreground))',
                        borderRadius: '16px',
                        fontSize: '0.7rem',
                        fontFamily: 'Poppins, sans-serif',
                        textTransform: 'capitalize',
                        fontWeight: 600,
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        zIndex: 10
                      }}
                    >
                      {album.category}
                    </Box>
                  </motion.div>
                </CardContainer>
              </motion.div>
            ))}
          </Box>
        </motion.div>
      </Container>

      {/* Album Modal */}
      <Dialog 
        open={!!selectedAlbum} 
        onClose={closeAlbumModal}
        maxWidth="xl"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '24px',
            backgroundColor: 'hsl(var(--card))',
            overflow: 'hidden',
            maxHeight: '90vh',
            width: '95vw',
            height: '85vh'
          }
        }}
      >
        <DialogContent sx={{ p: 0, position: 'relative', height: '100%' }}>
          {selectedAlbum && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, type: "spring", stiffness: 100 }}
              className="h-full flex"
            >
              {/* Left Side - Image List */}
              <Box 
                sx={{ 
                  width: '300px',
                  height: '100%',
                  backgroundColor: 'hsl(var(--muted))',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRight: '1px solid hsl(var(--border))'
                }}
              >
                <Box sx={{ p: 3, borderBottom: '1px solid hsl(var(--border))' }}>
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      color: 'hsl(var(--foreground))',
                      fontFamily: 'Poppins, sans-serif',
                      fontWeight: 600,
                      mb: 1
                    }}
                  >
                    {selectedAlbum.title}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: 'hsl(var(--muted-foreground))',
                      fontFamily: 'Poppins, sans-serif',
                    }}
                  >
                    {selectedAlbum.items.length} photo{selectedAlbum.items.length > 1 ? 's' : ''}
                  </Typography>
                </Box>
                
                <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
                  <Box sx={{ display: 'grid', gap: 1.5 }}>
                    {selectedAlbum.items.map((item, index) => (
                      <motion.div
                        key={item.id}
                        className="cursor-pointer"
                        onClick={() => selectImageFromList(index)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        style={{
                          borderRadius: '8px',
                          overflow: 'hidden',
                          border: currentImageIndex === index ? '2px solid hsl(var(--primary))' : '1px solid hsl(var(--border))',
                          backgroundColor: 'hsl(var(--card))',
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', p: 1.5 }}>
                          <img
                            src={item.src}
                            alt={item.alt}
                            style={{
                              width: '50px',
                              height: '50px',
                              objectFit: 'cover',
                              borderRadius: '6px',
                              marginRight: '12px'
                            }}
                          />
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                fontWeight: 500,
                                color: 'hsl(var(--foreground))',
                                fontFamily: 'Poppins, sans-serif',
                                fontSize: '0.8rem',
                                lineHeight: 1.2,
                                mb: 0.5,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                              }}
                            >
                              {item.title}
                            </Typography>
                            <Typography 
                              variant="caption" 
                              sx={{ 
                                color: 'hsl(var(--muted-foreground))',
                                fontFamily: 'Poppins, sans-serif',
                                lineHeight: 1.2,
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                                fontSize: '0.7rem'
                              }}
                            >
                              {item.description}
                            </Typography>
                          </Box>
                        </Box>
                      </motion.div>
                    ))}
                  </Box>
                </Box>
              </Box>

              {/* Right Side - Main Image View */}
              <Box sx={{ flex: 1, position: 'relative', height: '100%', backgroundColor: 'hsl(var(--muted))' }}>
                <motion.div
                  key={currentImageIndex}
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '20px'
                  }}
                >
                  <img
                    src={selectedAlbum.items[currentImageIndex].src}
                    alt={selectedAlbum.items[currentImageIndex].alt}
                    style={{
                      maxWidth: '100%',
                      maxHeight: '100%',
                      objectFit: 'contain',
                      borderRadius: '12px',
                      boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
                    }}
                  />
                </motion.div>
                
                {/* Close button */}
                <motion.button
                  onClick={closeAlbumModal}
                  className="absolute top-4 right-4 bg-black/50 backdrop-blur-md text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-black/70 transition-all"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  ✕
                </motion.button>
                
                {/* Navigation Arrows */}
                {selectedAlbum.items.length > 1 && (
                  <>
                    <motion.button
                      onClick={() => navigateImage('prev')}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 backdrop-blur-md text-white rounded-full w-12 h-12 flex items-center justify-center hover:bg-black/70 transition-all shadow-lg"
                      whileHover={{ scale: 1.1, x: -2 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </motion.button>
                    
                    <motion.button
                      onClick={() => navigateImage('next')}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 backdrop-blur-md text-white rounded-full w-12 h-12 flex items-center justify-center hover:bg-black/70 transition-all shadow-lg"
                      whileHover={{ scale: 1.1, x: 2 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <ChevronRight className="w-6 h-6" />
                    </motion.button>
                  </>
                )}
                
                {/* Image counter */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm">
                  {currentImageIndex + 1} / {selectedAlbum.items.length}
                </div>

                {/* Image Info */}
                <motion.div 
                  className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-md text-white p-4 rounded-2xl max-w-md"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      color: 'white',
                      fontFamily: 'Poppins, sans-serif',
                      fontWeight: 600,
                      mb: 1
                    }}
                  >
                    {selectedAlbum.items[currentImageIndex].title}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: 'rgba(255,255,255,0.8)',
                      fontFamily: 'Poppins, sans-serif',
                    }}
                  >
                    {selectedAlbum.items[currentImageIndex].description}
                  </Typography>
                </motion.div>
              </Box>
            </motion.div>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export const Media: React.FC = () => {
  return (
    <Box sx={{ pt: 16, pb: 8, minHeight: '100vh', backgroundColor: 'hsl(var(--background))' }}>
      
      <TargetCursor 
        spinDuration={2}
        hideDefaultCursor={true}
      />

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
            
            <Box component="span" sx={{ color: 'hsl(var(--destructive))' }}>Media </Box>  Gallery
          </Typography>
        </motion.div>
      </Container>
      
      <MediaGallery />
    </Box>
  );
};