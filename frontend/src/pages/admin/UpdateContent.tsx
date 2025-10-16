import { useState } from "react";
import { Box, Typography, IconButton, TextField, Button } from "@mui/material";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Upload, X, Plus, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { DarkButton } from "@/components/ui/DarkButton";

const pages = [
  "Home",
  "Portfolio",
  "People",
  "Facilities",
  "Program",
  "Media",
  "Blogs",
  "Contact",
];

export const UpdateContent = () => {
  const [selectedPage, setSelectedPage] = useState<string>("Home");
  const navigate = useNavigate();

  // Home page content states
  const [vision, setVision] = useState("To create a thriving ecosystem that nurtures innovative startups and bridges the gap between academic research and practical business solutions, fostering sustainable growth and social impact.");
  const [mission, setMission] = useState("To provide comprehensive support, mentorship, and resources to budding entrepreneurs, enabling them to transform innovative ideas into successful ventures that contribute to economic growth and societal well-being.");
  
  const [achievements, setAchievements] = useState([
    { number: 150, suffix: "+", label: "Startups Incubated" },
    { number: 500, suffix: "+", label: "Jobs Created" },
    { number: 50, suffix: "+", label: "Success Stories" },
    { number: 25, suffix: "+", label: "Awards Won" },
  ]);

  const [govtIndiaLogos, setGovtIndiaLogos] = useState([
    { name: "Ministry of MSME", src: "/asset/ministry_msme.png" },
    { name: "Startup India", src: "/asset/startup_india.png" },
    { name: "NSTEDB", src: "/asset/nstedb.png" },
  ]);

  const [govtTNLogos, setGovtTNLogos] = useState([
    { name: "Tamil Nadu Govt", src: "/asset/govt_india.png" },
    { name: "TIDCO", src: "/asset/tidco.png" },
    { name: "TNSCST", src: "/asset/tnscst.png" },
  ]);

  const [successStories, setSuccessStories] = useState([
    {
      title: "Revolutionary Water Purification",
      description: "EcoTech Solutions developed an innovative water purification system that has provided clean water access to over 50,000 rural households across Tamil Nadu.",
      image: "/asset/SuccessStoryimages/water.jpg",
      sector: "Environmental Technology",
      impact: "50,000+ households served",
    },
    {
      title: "Smart Agriculture Platform",
      description: "AgriConnect created an IoT-based platform that has helped 10,000+ farmers increase their crop yields by 40% through data-driven farming techniques.",
      image: "/asset/SuccessStoryimages/agriculture.jpg",
      sector: "AgriTech",
      impact: "40% yield increase for farmers",
    },
    {
      title: "Rural Healthcare Innovation",
      description: "HealthTech Innovations launched AI-powered diagnostic tools that have improved healthcare access in 200+ rural health centers.",
      image: "/asset/SuccessStoryimages/healthcare.png",
      sector: "HealthTech",
      impact: "200+ health centers equipped",
    },
    {
      title: "Digital Financial Inclusion",
      description: "FinTech Solutions created a digital banking platform that has brought banking services to 25,000+ unbanked individuals in rural areas.",
      image: "/asset/SuccessStoryimages/fintech.jpg",
      sector: "FinTech",
      impact: "25,000+ people financially included",
    },
    {
      title: "Educational Technology Revolution",
      description: "EduTech Platform developed personalized learning solutions that have improved learning outcomes for 15,000+ students across Tamil Nadu.",
      image: "/asset/SuccessStoryimages/education.jpg",
      sector: "EdTech",
      impact: "15,000+ students impacted",
    },
  ]);

  // Portfolio states
  const [currentStartups, setCurrentStartups] = useState([
    { name: "Startup 1", description: "Description 1", image: "", category: "Tech" },
    { name: "Startup 2", description: "Description 2", image: "", category: "HealthTech" },
  ]);
  const [graduatedStartups, setGraduatedStartups] = useState([
    { name: "Graduated 1", description: "Description 1", image: "", category: "FinTech" },
    { name: "Graduated 2", description: "Description 2", image: "", category: "EdTech" },
  ]);

  // People states
  const [founder, setFounder] = useState({ name: "Dr. John Doe", role: "Founder", bio: "Visionary leader with 20 years of experience", image: "" });
  const [ceo, setCeo] = useState({ name: "Jane Smith", role: "CEO", bio: "Strategic thinker driving innovation", image: "" });
  const [boardMembers, setBoardMembers] = useState([
    { name: "Member 1", role: "Board Member", bio: "Expert in technology", image: "" },
    { name: "Member 2", role: "Board Member", bio: "Finance specialist", image: "" },
  ]);

  // Facilities states
  const [facilityVideos, setFacilityVideos] = useState([
    { link: "https://example.com/video1", description: "State-of-the-art facilities", details: "Our facilities include modern labs and workspaces" },
  ]);
  
  const [sharedInfra, setSharedInfra] = useState([
    {
      id: 1,
      name: 'Co-working Spaces',
      description: 'Flexible workspaces with modern amenities for startups at different stages.',
      image: '/api/placeholder/300/200',
      features: ['24/7 Access', 'High-Speed Internet', 'Meeting Rooms', 'Coffee Station']
    },
    {
      id: 2,
      name: 'Innovation Labs',
      description: 'Fully equipped laboratories for research, development, and testing.',
      image: '/api/placeholder/300/200',
      features: ['Latest Equipment', 'Testing Facilities', 'Research Support', 'Safety Protocols']
    },
    {
      id: 3,
      name: 'Fabrication Workshop',
      description: 'Complete fabrication facility with 3D printing and prototyping tools.',
      image: '/api/placeholder/300/200',
      features: ['3D Printing', 'CNC Machines', 'Electronics Lab', 'Material Testing']
    }
  ]);

  const [tcetbiInfra, setTcetbiInfra] = useState([
    {
      id: 4,
      name: 'Auditorium',
      description: 'State-of-the-art auditorium for events, presentations, and workshops.',
      image: '/api/placeholder/300/200',
      features: ['200 Seating', 'AV Equipment', 'Stage Lighting', 'Recording Setup']
    },
    {
      id: 5,
      name: 'Conference Halls',
      description: 'Professional conference facilities for meetings and networking events.',
      image: '/api/placeholder/300/200',
      features: ['Video Conferencing', 'Presentation Setup', 'Comfortable Seating', 'Catering Services']
    },
    {
      id: 6,
      name: 'Library & Resource Center',
      description: 'Comprehensive library with business resources and quiet study areas.',
      image: '/api/placeholder/300/200',
      features: ['Business Books', 'Digital Resources', 'Study Areas', 'Research Support']
    }
  ]);

  // Program states
  const [programs, setPrograms] = useState([
    { 
      title: "Startup Accelerator Program", 
      description: "Intensive 6-month program for early-stage startups with mentorship, funding, and market access.", 
      image: "/api/placeholder/400/200",
      duration: "6 months", 
      category: "live",
      startDate: "Jan 2024",
      endDate: "Jun 2024",
      participants: "25",
      status: "Live"
    },
  ]);

  // Media states
  const [mediaImages, setMediaImages] = useState([
    { id: 1, src: "", alt: "", category: "", title: "", description: "", album: "" },
  ]);

  // Blog states
  const [blogs, setBlogs] = useState([
    {
      id: 1,
      title: "The Future of Startup Incubation: Trends to Watch in 2024",
      excerpt: "Explore the latest trends shaping the startup ecosystem and how incubators are adapting to support emerging technologies and business models.",
      content: "",
      author: "Dr. Sarah Johnson",
      date: "March 15, 2024",
      category: "Innovation",
      image: "/api/placeholder/400/240",
      readTime: 5
    },
  ]);

  // Contact states
  const [contactInfo, setContactInfo] = useState({
    address: "123 Innovation Street, Chennai",
    email: "contact@tcetbi.com",
    phone: "+91 1234567890",
    officeHours: "Mon-Fri: 9AM-6PM",
  });

  const handleLogout = () => {
    navigate("/auth");
  };

  const handleBack = () => {
    navigate("/admin");
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: string, index?: number) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result as string;
        
        if (type === "govtIndia" && index !== undefined) {
          const newLogos = [...govtIndiaLogos];
          newLogos[index].src = imageUrl;
          setGovtIndiaLogos(newLogos);
        } else if (type === "govtTN" && index !== undefined) {
          const newLogos = [...govtTNLogos];
          newLogos[index].src = imageUrl;
          setGovtTNLogos(newLogos);
        } else if (type === "successStory" && index !== undefined) {
          const newStories = [...successStories];
          newStories[index].image = imageUrl;
          setSuccessStories(newStories);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAchievementChange = (index: number, field: string, value: any) => {
    const newAchievements = [...achievements];
    newAchievements[index] = { ...newAchievements[index], [field]: value };
    setAchievements(newAchievements);
  };

  const handleSuccessStoryChange = (index: number, field: string, value: any) => {
    const newStories = [...successStories];
    newStories[index] = { ...newStories[index], [field]: value };
    setSuccessStories(newStories);
  };

  const handleSave = () => {
    console.log("Saving content for", selectedPage);
    // TODO: Implement actual save functionality
    alert(`${selectedPage} content saved successfully!`);
  };

  const textFieldStyles = {
    '& .MuiInputBase-input': { color: 'hsl(var(--foreground))' },
    '& .MuiInputLabel-root': { color: 'hsl(var(--muted-foreground))' },
    '& .MuiInputLabel-root.Mui-focused': { color: 'hsl(0 84.2% 60.2%)' },
    '& .MuiOutlinedInput-root': {
      '& fieldset': { borderColor: 'hsl(var(--border))' },
      '&:hover fieldset': { borderColor: 'hsl(0 84.2% 60.2%)' },
      '&.Mui-focused fieldset': { borderColor: 'hsl(0 84.2% 60.2%)' },
    },
  };

  const uploadButtonStyles = {
    backgroundColor: 'hsl(0 84.2% 60.2%)',
    color: 'white',
    borderColor: 'hsl(0 84.2% 60.2%)',
    '&:hover': {
      backgroundColor: 'hsl(0 84.2% 50.2%)',
      borderColor: 'hsl(0 84.2% 50.2%)',
    },
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "hsl(var(--background))",
        pt: 12,
        px: 4,
      }}
    >
      <Box
        sx={{
          maxWidth: "1200px",
          mx: "auto",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <IconButton
              onClick={handleBack}
              sx={{
                color: "hsl(var(--foreground))",
                "&:hover": { backgroundColor: "hsl(var(--muted))" },
              }}
            >
              <ArrowLeft size={24} />
            </IconButton>
            <Typography
              variant="h4"
              sx={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 700,
                color: "hsl(var(--foreground))",
              }}
            >
              Update Page Content
            </Typography>
          </Box>

        </Box>

        <Box
          sx={{
            backgroundColor: "hsl(var(--card))",
            borderRadius: "var(--radius)",
            p: 4,
            border: "1px solid hsl(var(--border))",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 600,
              color: "hsl(var(--foreground))",
              mb: 3,
            }}
          >
            Select Page to Edit
          </Typography>

          <Select value={selectedPage} onValueChange={setSelectedPage}>
            <SelectTrigger className="w-full max-w-xs text-foreground">
              <SelectValue placeholder="Select a page" />
            </SelectTrigger>
            <SelectContent>
              {pages.map((page) => (
                <SelectItem key={page} value={page}>
                  {page}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {selectedPage === "Home" && (
            <Box sx={{ mt: 4 }}>
              {/* Vision & Mission */}
              <Typography variant="h5" sx={{ fontFamily: "Poppins", fontWeight: 600, color: "hsl(var(--foreground))", mb: 3 }}>
                Vision & Mission
              </Typography>
              
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Vision"
                value={vision}
                onChange={(e) => setVision(e.target.value)}
                sx={{
                  mb: 3,
                  '& .MuiInputBase-input': {
                    color: 'hsl(var(--foreground))',
                  },
                  '& .MuiInputLabel-root': {
                    color: 'hsl(var(--muted-foreground))',
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: 'hsl(0 84.2% 60.2%)',
                  },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'hsl(var(--border))',
                    },
                    '&:hover fieldset': {
                      borderColor: 'hsl(0 84.2% 60.2%)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'hsl(0 84.2% 60.2%)',
                    },
                  },
                }}
              />
              
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Mission"
                value={mission}
                onChange={(e) => setMission(e.target.value)}
                sx={{
                  mb: 4,
                  '& .MuiInputBase-input': {
                    color: 'hsl(var(--foreground))',
                  },
                  '& .MuiInputLabel-root': {
                    color: 'hsl(var(--muted-foreground))',
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: 'hsl(0 84.2% 60.2%)',
                  },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'hsl(var(--border))',
                    },
                    '&:hover fieldset': {
                      borderColor: 'hsl(0 84.2% 60.2%)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'hsl(0 84.2% 60.2%)',
                    },
                  },
                }}
              />

              {/* Achievements */}
              <Typography variant="h5" sx={{ fontFamily: "Poppins", fontWeight: 600, color: "hsl(var(--foreground))", mb: 3 }}>
                Our Achievements
              </Typography>
              
              <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 3, mb: 4 }}>
                {achievements.map((achievement, index) => (
                  <Box key={index} sx={{ p: 2, border: "1px solid hsl(var(--border))", borderRadius: "var(--radius)" }}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Number"
                      value={achievement.number}
                      onChange={(e) => handleAchievementChange(index, "number", parseInt(e.target.value))}
                      sx={{
                        mb: 2,
                        '& .MuiInputBase-input': { color: 'hsl(var(--foreground))' },
                        '& .MuiInputLabel-root': { color: 'hsl(var(--muted-foreground))' },
                        '& .MuiInputLabel-root.Mui-focused': { color: 'hsl(0 84.2% 60.2%)' },
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': { borderColor: 'hsl(var(--border))' },
                          '&:hover fieldset': { borderColor: 'hsl(0 84.2% 60.2%)' },
                          '&.Mui-focused fieldset': { borderColor: 'hsl(0 84.2% 60.2%)' },
                        },
                      }}
                    />
                    <TextField
                      fullWidth
                      label="Suffix"
                      value={achievement.suffix}
                      onChange={(e) => handleAchievementChange(index, "suffix", e.target.value)}
                      sx={{
                        mb: 2,
                        '& .MuiInputBase-input': { color: 'hsl(var(--foreground))' },
                        '& .MuiInputLabel-root': { color: 'hsl(var(--muted-foreground))' },
                        '& .MuiInputLabel-root.Mui-focused': { color: 'hsl(0 84.2% 60.2%)' },
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': { borderColor: 'hsl(var(--border))' },
                          '&:hover fieldset': { borderColor: 'hsl(0 84.2% 60.2%)' },
                          '&.Mui-focused fieldset': { borderColor: 'hsl(0 84.2% 60.2%)' },
                        },
                      }}
                    />
                    <TextField
                      fullWidth
                      label="Label"
                      value={achievement.label}
                      onChange={(e) => handleAchievementChange(index, "label", e.target.value)}
                      sx={{
                        '& .MuiInputBase-input': { color: 'hsl(var(--foreground))' },
                        '& .MuiInputLabel-root': { color: 'hsl(var(--muted-foreground))' },
                        '& .MuiInputLabel-root.Mui-focused': { color: 'hsl(0 84.2% 60.2%)' },
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': { borderColor: 'hsl(var(--border))' },
                          '&:hover fieldset': { borderColor: 'hsl(0 84.2% 60.2%)' },
                          '&.Mui-focused fieldset': { borderColor: 'hsl(0 84.2% 60.2%)' },
                        },
                      }}
                    />
                  </Box>
                ))}
              </Box>

              {/* Partners - Government of India */}
              <Typography variant="h5" sx={{ fontFamily: "Poppins", fontWeight: 600, color: "hsl(var(--foreground))", mb: 3 }}>
                Partners - Government of India
              </Typography>
              
              <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr 1fr" }, gap: 3, mb: 4 }}>
                {govtIndiaLogos.map((logo, index) => (
                  <Box key={index} sx={{ p: 2, border: "1px solid hsl(var(--border))", borderRadius: "var(--radius)" }}>
                    <img src={logo.src} alt={logo.name} style={{ width: "100%", height: "120px", objectFit: "contain", marginBottom: "12px" }} />
                    <TextField
                      fullWidth
                      label="Name"
                      value={logo.name}
                      onChange={(e) => {
                        const newLogos = [...govtIndiaLogos];
                        newLogos[index].name = e.target.value;
                        setGovtIndiaLogos(newLogos);
                      }}
                      sx={{
                        mb: 2,
                        '& .MuiInputBase-input': { color: 'hsl(var(--foreground))' },
                        '& .MuiInputLabel-root': { color: 'hsl(var(--muted-foreground))' },
                        '& .MuiInputLabel-root.Mui-focused': { color: 'hsl(0 84.2% 60.2%)' },
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': { borderColor: 'hsl(var(--border))' },
                          '&:hover fieldset': { borderColor: 'hsl(0 84.2% 60.2%)' },
                          '&.Mui-focused fieldset': { borderColor: 'hsl(0 84.2% 60.2%)' },
                        },
                      }}
                    />
                    <input
                      accept="image/*"
                      style={{ display: "none" }}
                      id={`govt-india-upload-${index}`}
                      type="file"
                      onChange={(e) => handleImageUpload(e, "govtIndia", index)}
                    />
                    <label htmlFor={`govt-india-upload-${index}`}>
                      <Button
                        variant="outlined"
                        component="span"
                        fullWidth
                        startIcon={<Upload size={16} />}
                        sx={{
                          backgroundColor: 'hsl(0 84.2% 60.2%)',
                          color: 'white',
                          borderColor: 'hsl(0 84.2% 60.2%)',
                          '&:hover': {
                            backgroundColor: 'hsl(0 84.2% 50.2%)',
                            borderColor: 'hsl(0 84.2% 50.2%)',
                          },
                        }}
                      >
                        Upload Image
                      </Button>
                    </label>
                  </Box>
                ))}
              </Box>

              {/* Partners - Government of Tamil Nadu */}
              <Typography variant="h5" sx={{ fontFamily: "Poppins", fontWeight: 600, color: "hsl(var(--foreground))", mb: 3 }}>
                Partners - Government of Tamil Nadu
              </Typography>
              
              <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr 1fr" }, gap: 3, mb: 4 }}>
                {govtTNLogos.map((logo, index) => (
                  <Box key={index} sx={{ p: 2, border: "1px solid hsl(var(--border))", borderRadius: "var(--radius)" }}>
                    <img src={logo.src} alt={logo.name} style={{ width: "100%", height: "120px", objectFit: "contain", marginBottom: "12px" }} />
                    <TextField
                      fullWidth
                      label="Name"
                      value={logo.name}
                      onChange={(e) => {
                        const newLogos = [...govtTNLogos];
                        newLogos[index].name = e.target.value;
                        setGovtTNLogos(newLogos);
                      }}
                      sx={{
                        mb: 2,
                        '& .MuiInputBase-input': { color: 'hsl(var(--foreground))' },
                        '& .MuiInputLabel-root': { color: 'hsl(var(--muted-foreground))' },
                        '& .MuiInputLabel-root.Mui-focused': { color: 'hsl(0 84.2% 60.2%)' },
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': { borderColor: 'hsl(var(--border))' },
                          '&:hover fieldset': { borderColor: 'hsl(0 84.2% 60.2%)' },
                          '&.Mui-focused fieldset': { borderColor: 'hsl(0 84.2% 60.2%)' },
                        },
                      }}
                    />
                    <input
                      accept="image/*"
                      style={{ display: "none" }}
                      id={`govt-tn-upload-${index}`}
                      type="file"
                      onChange={(e) => handleImageUpload(e, "govtTN", index)}
                    />
                    <label htmlFor={`govt-tn-upload-${index}`}>
                      <Button
                        variant="outlined"
                        component="span"
                        fullWidth
                        startIcon={<Upload size={16} />}
                        sx={{
                          backgroundColor: 'hsl(0 84.2% 60.2%)',
                          color: 'white',
                          borderColor: 'hsl(0 84.2% 60.2%)',
                          '&:hover': {
                            backgroundColor: 'hsl(0 84.2% 50.2%)',
                            borderColor: 'hsl(0 84.2% 50.2%)',
                          },
                        }}
                      >
                        Upload Image
                      </Button>
                    </label>
                  </Box>
                ))}
              </Box>

              {/* Success Stories */}
              <Typography variant="h5" sx={{ fontFamily: "Poppins", fontWeight: 600, color: "hsl(var(--foreground))", mb: 3 }}>
                Success Stories
              </Typography>
              
              <Box sx={{ display: "flex", flexDirection: "column", gap: 3, mb: 4 }}>
                {successStories.map((story, index) => (
                  <Box key={index} sx={{ p: 3, border: "1px solid hsl(var(--border))", borderRadius: "var(--radius)" }}>
                    <img src={story.image} alt={story.title} style={{ width: "100%", height: "200px", objectFit: "cover", borderRadius: "8px", marginBottom: "16px" }} />
                    
                    <TextField
                      fullWidth
                      label="Title"
                      value={story.title}
                      onChange={(e) => handleSuccessStoryChange(index, "title", e.target.value)}
                      sx={{
                        mb: 2,
                        '& .MuiInputBase-input': { color: 'hsl(var(--foreground))' },
                        '& .MuiInputLabel-root': { color: 'hsl(var(--muted-foreground))' },
                        '& .MuiInputLabel-root.Mui-focused': { color: 'hsl(0 84.2% 60.2%)' },
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': { borderColor: 'hsl(var(--border))' },
                          '&:hover fieldset': { borderColor: 'hsl(0 84.2% 60.2%)' },
                          '&.Mui-focused fieldset': { borderColor: 'hsl(0 84.2% 60.2%)' },
                        },
                      }}
                    />
                    
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      label="Description"
                      value={story.description}
                      onChange={(e) => handleSuccessStoryChange(index, "description", e.target.value)}
                      sx={{
                        mb: 2,
                        '& .MuiInputBase-input': { color: 'hsl(var(--foreground))' },
                        '& .MuiInputLabel-root': { color: 'hsl(var(--muted-foreground))' },
                        '& .MuiInputLabel-root.Mui-focused': { color: 'hsl(0 84.2% 60.2%)' },
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': { borderColor: 'hsl(var(--border))' },
                          '&:hover fieldset': { borderColor: 'hsl(0 84.2% 60.2%)' },
                          '&.Mui-focused fieldset': { borderColor: 'hsl(0 84.2% 60.2%)' },
                        },
                      }}
                    />
                    
                    <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, mb: 2 }}>
                      <TextField
                        fullWidth
                        label="Sector"
                        value={story.sector}
                        onChange={(e) => handleSuccessStoryChange(index, "sector", e.target.value)}
                        sx={{
                          '& .MuiInputBase-input': { color: 'hsl(var(--foreground))' },
                          '& .MuiInputLabel-root': { color: 'hsl(var(--muted-foreground))' },
                          '& .MuiInputLabel-root.Mui-focused': { color: 'hsl(0 84.2% 60.2%)' },
                          '& .MuiOutlinedInput-root': {
                            '& fieldset': { borderColor: 'hsl(var(--border))' },
                            '&:hover fieldset': { borderColor: 'hsl(0 84.2% 60.2%)' },
                            '&.Mui-focused fieldset': { borderColor: 'hsl(0 84.2% 60.2%)' },
                          },
                        }}
                      />
                      <TextField
                        fullWidth
                        label="Impact"
                        value={story.impact}
                        onChange={(e) => handleSuccessStoryChange(index, "impact", e.target.value)}
                        sx={{
                          '& .MuiInputBase-input': { color: 'hsl(var(--foreground))' },
                          '& .MuiInputLabel-root': { color: 'hsl(var(--muted-foreground))' },
                          '& .MuiInputLabel-root.Mui-focused': { color: 'hsl(0 84.2% 60.2%)' },
                          '& .MuiOutlinedInput-root': {
                            '& fieldset': { borderColor: 'hsl(var(--border))' },
                            '&:hover fieldset': { borderColor: 'hsl(0 84.2% 60.2%)' },
                            '&.Mui-focused fieldset': { borderColor: 'hsl(0 84.2% 60.2%)' },
                          },
                        }}
                      />
                    </Box>
                    
                    <input
                      accept="image/*"
                      style={{ display: "none" }}
                      id={`success-story-upload-${index}`}
                      type="file"
                      onChange={(e) => handleImageUpload(e, "successStory", index)}
                    />
                    <label htmlFor={`success-story-upload-${index}`}>
                      <Button
                        variant="outlined"
                        component="span"
                        fullWidth
                        startIcon={<Upload size={16} />}
                        sx={{
                          backgroundColor: 'hsl(0 84.2% 60.2%)',
                          color: 'white',
                          borderColor: 'hsl(0 84.2% 60.2%)',
                          '&:hover': {
                            backgroundColor: 'hsl(0 84.2% 50.2%)',
                            borderColor: 'hsl(0 84.2% 50.2%)',
                          },
                        }}
                      >
                        Upload Image
                      </Button>
                    </label>
                  </Box>
                ))}
              </Box>

              {/* Save Button */}
              <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4 }}>
                <DarkButton onClick={handleSave} sx={{ px: 4, py: 1.5 }}>
                  Save Changes
                </DarkButton>
              </Box>
            </Box>
          )}

          {selectedPage === "Portfolio" && (
            <Box sx={{ mt: 4 }}>
              {/* Current Startups */}
              <Typography variant="h5" sx={{ fontFamily: "Poppins", fontWeight: 600, color: "hsl(var(--foreground))", mb: 3 }}>
                Current Startups
              </Typography>
              {currentStartups.map((startup, index) => (
                <Box key={index} sx={{ p: 3, mb: 3, border: "1px solid hsl(var(--border))", borderRadius: "var(--radius)" }}>
                  <TextField fullWidth label="Name" value={startup.name} onChange={(e) => {
                    const updated = [...currentStartups];
                    updated[index].name = e.target.value;
                    setCurrentStartups(updated);
                  }} sx={{ ...textFieldStyles, mb: 2 }} />
                  <TextField fullWidth multiline rows={2} label="Description" value={startup.description} onChange={(e) => {
                    const updated = [...currentStartups];
                    updated[index].description = e.target.value;
                    setCurrentStartups(updated);
                  }} sx={{ ...textFieldStyles, mb: 2 }} />
                  <TextField fullWidth label="Category" value={startup.category} onChange={(e) => {
                    const updated = [...currentStartups];
                    updated[index].category = e.target.value;
                    setCurrentStartups(updated);
                  }} sx={{ ...textFieldStyles, mb: 2 }} />
                  {startup.image && <img src={startup.image} alt={startup.name} style={{ width: "100%", maxHeight: "200px", objectFit: "cover", borderRadius: "8px", marginBottom: "12px" }} />}
                  <input accept="image/*" style={{ display: "none" }} id={`current-startup-${index}`} type="file" onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        const updated = [...currentStartups];
                        updated[index].image = reader.result as string;
                        setCurrentStartups(updated);
                      };
                      reader.readAsDataURL(file);
                    }
                  }} />
                  <label htmlFor={`current-startup-${index}`}>
                    <Button variant="outlined" component="span" fullWidth startIcon={<Upload size={16} />} sx={uploadButtonStyles}>Upload Image</Button>
                  </label>
                </Box>
              ))}
              <Button startIcon={<Plus />} onClick={() => setCurrentStartups([...currentStartups, { name: "", description: "", image: "", category: "" }])} sx={{ ...uploadButtonStyles, mb: 4 }}>Add Startup</Button>

              {/* Graduated Startups */}
              <Typography variant="h5" sx={{ fontFamily: "Poppins", fontWeight: 600, color: "hsl(var(--foreground))", mb: 3, mt: 4 }}>
                Graduated Startups
              </Typography>
              {graduatedStartups.map((startup, index) => (
                <Box key={index} sx={{ p: 3, mb: 3, border: "1px solid hsl(var(--border))", borderRadius: "var(--radius)" }}>
                  <TextField fullWidth label="Name" value={startup.name} onChange={(e) => {
                    const updated = [...graduatedStartups];
                    updated[index].name = e.target.value;
                    setGraduatedStartups(updated);
                  }} sx={{ ...textFieldStyles, mb: 2 }} />
                  <TextField fullWidth multiline rows={2} label="Description" value={startup.description} onChange={(e) => {
                    const updated = [...graduatedStartups];
                    updated[index].description = e.target.value;
                    setGraduatedStartups(updated);
                  }} sx={{ ...textFieldStyles, mb: 2 }} />
                  <TextField fullWidth label="Category" value={startup.category} onChange={(e) => {
                    const updated = [...graduatedStartups];
                    updated[index].category = e.target.value;
                    setGraduatedStartups(updated);
                  }} sx={{ ...textFieldStyles, mb: 2 }} />
                  {startup.image && <img src={startup.image} alt={startup.name} style={{ width: "100%", maxHeight: "200px", objectFit: "cover", borderRadius: "8px", marginBottom: "12px" }} />}
                  <input accept="image/*" style={{ display: "none" }} id={`graduated-startup-${index}`} type="file" onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        const updated = [...graduatedStartups];
                        updated[index].image = reader.result as string;
                        setGraduatedStartups(updated);
                      };
                      reader.readAsDataURL(file);
                    }
                  }} />
                  <label htmlFor={`graduated-startup-${index}`}>
                    <Button variant="outlined" component="span" fullWidth startIcon={<Upload size={16} />} sx={uploadButtonStyles}>Upload Image</Button>
                  </label>
                </Box>
              ))}
              <Button startIcon={<Plus />} onClick={() => setGraduatedStartups([...graduatedStartups, { name: "", description: "", image: "", category: "" }])} sx={uploadButtonStyles}>Add Graduated Startup</Button>

              <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4 }}>
                <DarkButton onClick={handleSave}>Save Changes</DarkButton>
              </Box>
            </Box>
          )}

          {selectedPage === "People" && (
            <Box sx={{ mt: 4 }}>
              {/* Founder */}
              <Typography variant="h5" sx={{ fontFamily: "Poppins", fontWeight: 600, color: "hsl(var(--foreground))", mb: 3 }}>
                Founder
              </Typography>
              <Box sx={{ p: 3, mb: 4, border: "1px solid hsl(var(--border))", borderRadius: "var(--radius)" }}>
                <TextField fullWidth label="Name" value={founder.name} onChange={(e) => setFounder({ ...founder, name: e.target.value })} sx={{ ...textFieldStyles, mb: 2 }} />
                <TextField fullWidth label="Role" value={founder.role} onChange={(e) => setFounder({ ...founder, role: e.target.value })} sx={{ ...textFieldStyles, mb: 2 }} />
                <TextField fullWidth multiline rows={3} label="Bio" value={founder.bio} onChange={(e) => setFounder({ ...founder, bio: e.target.value })} sx={{ ...textFieldStyles, mb: 2 }} />
                {founder.image && <img src={founder.image} alt={founder.name} style={{ width: "100%", maxHeight: "200px", objectFit: "cover", borderRadius: "8px", marginBottom: "12px" }} />}
                <input accept="image/*" style={{ display: "none" }} id="founder-image" type="file" onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => setFounder({ ...founder, image: reader.result as string });
                    reader.readAsDataURL(file);
                  }
                }} />
                <label htmlFor="founder-image">
                  <Button variant="outlined" component="span" fullWidth startIcon={<Upload size={16} />} sx={uploadButtonStyles}>Upload Image</Button>
                </label>
              </Box>

              {/* CEO */}
              <Typography variant="h5" sx={{ fontFamily: "Poppins", fontWeight: 600, color: "hsl(var(--foreground))", mb: 3 }}>
                CEO
              </Typography>
              <Box sx={{ p: 3, mb: 4, border: "1px solid hsl(var(--border))", borderRadius: "var(--radius)" }}>
                <TextField fullWidth label="Name" value={ceo.name} onChange={(e) => setCeo({ ...ceo, name: e.target.value })} sx={{ ...textFieldStyles, mb: 2 }} />
                <TextField fullWidth label="Role" value={ceo.role} onChange={(e) => setCeo({ ...ceo, role: e.target.value })} sx={{ ...textFieldStyles, mb: 2 }} />
                <TextField fullWidth multiline rows={3} label="Bio" value={ceo.bio} onChange={(e) => setCeo({ ...ceo, bio: e.target.value })} sx={{ ...textFieldStyles, mb: 2 }} />
                {ceo.image && <img src={ceo.image} alt={ceo.name} style={{ width: "100%", maxHeight: "200px", objectFit: "cover", borderRadius: "8px", marginBottom: "12px" }} />}
                <input accept="image/*" style={{ display: "none" }} id="ceo-image" type="file" onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => setCeo({ ...ceo, image: reader.result as string });
                    reader.readAsDataURL(file);
                  }
                }} />
                <label htmlFor="ceo-image">
                  <Button variant="outlined" component="span" fullWidth startIcon={<Upload size={16} />} sx={uploadButtonStyles}>Upload Image</Button>
                </label>
              </Box>

              {/* Board Members */}
              <Typography variant="h5" sx={{ fontFamily: "Poppins", fontWeight: 600, color: "hsl(var(--foreground))", mb: 3 }}>
                Board Members
              </Typography>
              {boardMembers.map((member, index) => (
                <Box key={index} sx={{ p: 3, mb: 3, border: "1px solid hsl(var(--border))", borderRadius: "var(--radius)" }}>
                  <TextField fullWidth label="Name" value={member.name} onChange={(e) => {
                    const updated = [...boardMembers];
                    updated[index].name = e.target.value;
                    setBoardMembers(updated);
                  }} sx={{ ...textFieldStyles, mb: 2 }} />
                  <TextField fullWidth label="Role" value={member.role} onChange={(e) => {
                    const updated = [...boardMembers];
                    updated[index].role = e.target.value;
                    setBoardMembers(updated);
                  }} sx={{ ...textFieldStyles, mb: 2 }} />
                  <TextField fullWidth multiline rows={3} label="Bio" value={member.bio} onChange={(e) => {
                    const updated = [...boardMembers];
                    updated[index].bio = e.target.value;
                    setBoardMembers(updated);
                  }} sx={{ ...textFieldStyles, mb: 2 }} />
                  {member.image && <img src={member.image} alt={member.name} style={{ width: "100%", maxHeight: "200px", objectFit: "cover", borderRadius: "8px", marginBottom: "12px" }} />}
                  <input accept="image/*" style={{ display: "none" }} id={`board-member-${index}`} type="file" onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        const updated = [...boardMembers];
                        updated[index].image = reader.result as string;
                        setBoardMembers(updated);
                      };
                      reader.readAsDataURL(file);
                    }
                  }} />
                  <label htmlFor={`board-member-${index}`}>
                    <Button variant="outlined" component="span" fullWidth startIcon={<Upload size={16} />} sx={uploadButtonStyles}>Upload Image</Button>
                  </label>
                </Box>
              ))}
              <Button startIcon={<Plus />} onClick={() => setBoardMembers([...boardMembers, { name: "", role: "", bio: "", image: "" }])} sx={uploadButtonStyles}>Add Board Member</Button>

              <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4 }}>
                <DarkButton onClick={handleSave}>Save Changes</DarkButton>
              </Box>
            </Box>
          )}

          {selectedPage === "Facilities" && (
            <Box sx={{ mt: 4 }}>
              {/* Facility Showcase Videos */}
              <Typography variant="h5" sx={{ fontFamily: "Poppins", fontWeight: 600, color: "hsl(var(--foreground))", mb: 3 }}>
                Facility Showcase Videos
              </Typography>
              {facilityVideos.map((video, index) => (
                <Box key={index} sx={{ p: 3, mb: 3, border: "1px solid hsl(var(--border))", borderRadius: "var(--radius)", position: "relative" }}>
                  {facilityVideos.length > 1 && (
                    <IconButton
                      onClick={() => setFacilityVideos(facilityVideos.filter((_, i) => i !== index))}
                      sx={{ position: "absolute", top: 8, right: 8, color: "hsl(0 84.2% 60.2%)" }}
                    >
                      <Trash2 size={20} />
                    </IconButton>
                  )}
                  <TextField fullWidth label="Video Link" value={video.link} onChange={(e) => {
                    const updated = [...facilityVideos];
                    updated[index].link = e.target.value;
                    setFacilityVideos(updated);
                  }} sx={{ ...textFieldStyles, mb: 2 }} />
                  <TextField fullWidth label="Description" value={video.description} onChange={(e) => {
                    const updated = [...facilityVideos];
                    updated[index].description = e.target.value;
                    setFacilityVideos(updated);
                  }} sx={{ ...textFieldStyles, mb: 2 }} />
                  <TextField fullWidth multiline rows={3} label="Details" value={video.details} onChange={(e) => {
                    const updated = [...facilityVideos];
                    updated[index].details = e.target.value;
                    setFacilityVideos(updated);
                  }} sx={textFieldStyles} />
                </Box>
              ))}
              <Button startIcon={<Plus />} onClick={() => setFacilityVideos([...facilityVideos, { link: "", description: "", details: "" }])} sx={{ ...uploadButtonStyles, mb: 4 }}>Add Video</Button>

              {/* Shared Infrastructure */}
              <Typography variant="h5" sx={{ fontFamily: "Poppins", fontWeight: 600, color: "hsl(var(--foreground))", mb: 3 }}>
                Shared Infrastructure
              </Typography>
              {sharedInfra.map((facility, index) => (
                <Box key={facility.id} sx={{ p: 3, mb: 3, border: "1px solid hsl(var(--border))", borderRadius: "var(--radius)", position: "relative" }}>
                  {sharedInfra.length > 1 && (
                    <IconButton
                      onClick={() => setSharedInfra(sharedInfra.filter((_, i) => i !== index))}
                      sx={{ position: "absolute", top: 8, right: 8, color: "hsl(0 84.2% 60.2%)" }}
                    >
                      <Trash2 size={20} />
                    </IconButton>
                  )}
                  <TextField fullWidth label="Name" value={facility.name} onChange={(e) => {
                    const updated = [...sharedInfra];
                    updated[index].name = e.target.value;
                    setSharedInfra(updated);
                  }} sx={{ ...textFieldStyles, mb: 2 }} />
                  <TextField fullWidth multiline rows={2} label="Description" value={facility.description} onChange={(e) => {
                    const updated = [...sharedInfra];
                    updated[index].description = e.target.value;
                    setSharedInfra(updated);
                  }} sx={{ ...textFieldStyles, mb: 2 }} />
                  <TextField fullWidth label="Image URL" value={facility.image} onChange={(e) => {
                    const updated = [...sharedInfra];
                    updated[index].image = e.target.value;
                    setSharedInfra(updated);
                  }} sx={{ ...textFieldStyles, mb: 2 }} />
                  <TextField fullWidth multiline rows={2} label="Features (comma-separated)" value={facility.features.join(', ')} onChange={(e) => {
                    const updated = [...sharedInfra];
                    updated[index].features = e.target.value.split(',').map(f => f.trim());
                    setSharedInfra(updated);
                  }} sx={textFieldStyles} />
                </Box>
              ))}
              <Button startIcon={<Plus />} onClick={() => {
                const newId = Math.max(...sharedInfra.map(f => f.id), 0) + 1;
                setSharedInfra([...sharedInfra, { id: newId, name: "", description: "", image: "", features: [] }]);
              }} sx={{ ...uploadButtonStyles, mb: 4 }}>Add Shared Infrastructure</Button>

              {/* TCETBI Infrastructure */}
              <Typography variant="h5" sx={{ fontFamily: "Poppins", fontWeight: 600, color: "hsl(var(--foreground))", mb: 3 }}>
                TCETBI Infrastructure
              </Typography>
              {tcetbiInfra.map((facility, index) => (
                <Box key={facility.id} sx={{ p: 3, mb: 3, border: "1px solid hsl(var(--border))", borderRadius: "var(--radius)", position: "relative" }}>
                  {tcetbiInfra.length > 1 && (
                    <IconButton
                      onClick={() => setTcetbiInfra(tcetbiInfra.filter((_, i) => i !== index))}
                      sx={{ position: "absolute", top: 8, right: 8, color: "hsl(0 84.2% 60.2%)" }}
                    >
                      <Trash2 size={20} />
                    </IconButton>
                  )}
                  <TextField fullWidth label="Name" value={facility.name} onChange={(e) => {
                    const updated = [...tcetbiInfra];
                    updated[index].name = e.target.value;
                    setTcetbiInfra(updated);
                  }} sx={{ ...textFieldStyles, mb: 2 }} />
                  <TextField fullWidth multiline rows={2} label="Description" value={facility.description} onChange={(e) => {
                    const updated = [...tcetbiInfra];
                    updated[index].description = e.target.value;
                    setTcetbiInfra(updated);
                  }} sx={{ ...textFieldStyles, mb: 2 }} />
                  <TextField fullWidth label="Image URL" value={facility.image} onChange={(e) => {
                    const updated = [...tcetbiInfra];
                    updated[index].image = e.target.value;
                    setTcetbiInfra(updated);
                  }} sx={{ ...textFieldStyles, mb: 2 }} />
                  <TextField fullWidth multiline rows={2} label="Features (comma-separated)" value={facility.features.join(', ')} onChange={(e) => {
                    const updated = [...tcetbiInfra];
                    updated[index].features = e.target.value.split(',').map(f => f.trim());
                    setTcetbiInfra(updated);
                  }} sx={textFieldStyles} />
                </Box>
              ))}
              <Button startIcon={<Plus />} onClick={() => {
                const newId = Math.max(...tcetbiInfra.map(f => f.id), 0) + 1;
                setTcetbiInfra([...tcetbiInfra, { id: newId, name: "", description: "", image: "", features: [] }]);
              }} sx={uploadButtonStyles}>Add TCETBI Infrastructure</Button>

              <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4 }}>
                <DarkButton onClick={handleSave}>Save Changes</DarkButton>
              </Box>
            </Box>
          )}

          {selectedPage === "Program" && (
            <Box sx={{ mt: 4 }}>
              <Typography variant="h5" sx={{ fontFamily: "Poppins", fontWeight: 600, color: "hsl(var(--foreground))", mb: 3 }}>
                Programs
              </Typography>
              {programs.map((program, index) => (
                <Box key={index} sx={{ p: 3, mb: 3, border: "1px solid hsl(var(--border))", borderRadius: "var(--radius)", position: "relative" }}>
                  {programs.length > 1 && (
                    <IconButton
                      onClick={() => setPrograms(programs.filter((_, i) => i !== index))}
                      sx={{ position: "absolute", top: 8, right: 8, color: "hsl(0 84.2% 60.2%)" }}
                    >
                      <Trash2 size={20} />
                    </IconButton>
                  )}
                  <TextField fullWidth label="Title" value={program.title} onChange={(e) => {
                    const updated = [...programs];
                    updated[index].title = e.target.value;
                    setPrograms(updated);
                  }} sx={{ ...textFieldStyles, mb: 2 }} />
                  <TextField fullWidth multiline rows={3} label="Description" value={program.description} onChange={(e) => {
                    const updated = [...programs];
                    updated[index].description = e.target.value;
                    setPrograms(updated);
                  }} sx={{ ...textFieldStyles, mb: 2 }} />
                  <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, mb: 2 }}>
                    <TextField fullWidth label="Duration" value={program.duration} onChange={(e) => {
                      const updated = [...programs];
                      updated[index].duration = e.target.value;
                      setPrograms(updated);
                    }} sx={textFieldStyles} />
                    <TextField fullWidth label="Category" value={program.category} onChange={(e) => {
                      const updated = [...programs];
                      updated[index].category = e.target.value;
                      setPrograms(updated);
                    }} sx={textFieldStyles} />
                  </Box>
                  <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, mb: 2 }}>
                    <TextField fullWidth label="Start Date" value={program.startDate} onChange={(e) => {
                      const updated = [...programs];
                      updated[index].startDate = e.target.value;
                      setPrograms(updated);
                    }} sx={textFieldStyles} />
                    <TextField fullWidth label="End Date" value={program.endDate} onChange={(e) => {
                      const updated = [...programs];
                      updated[index].endDate = e.target.value;
                      setPrograms(updated);
                    }} sx={textFieldStyles} />
                  </Box>
                  <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, mb: 2 }}>
                    <TextField fullWidth label="Participants" type="number" value={program.participants} onChange={(e) => {
                      const updated = [...programs];
                      updated[index].participants = e.target.value;
                      setPrograms(updated);
                    }} sx={textFieldStyles} />
                    <TextField fullWidth label="Status" value={program.status} onChange={(e) => {
                      const updated = [...programs];
                      updated[index].status = e.target.value;
                      setPrograms(updated);
                    }} sx={textFieldStyles} />
                  </Box>
                  <TextField fullWidth label="Image URL" value={program.image} onChange={(e) => {
                    const updated = [...programs];
                    updated[index].image = e.target.value;
                    setPrograms(updated);
                  }} sx={{ ...textFieldStyles, mb: 2 }} />
                  <input accept="image/*" style={{ display: "none" }} id={`program-image-${index}`} type="file" onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        const updated = [...programs];
                        updated[index].image = reader.result as string;
                        setPrograms(updated);
                      };
                      reader.readAsDataURL(file);
                    }
                  }} />
                  <label htmlFor={`program-image-${index}`}>
                    <Button component="span" variant="outlined" startIcon={<Upload />} sx={uploadButtonStyles}>
                      Upload Program Image
                    </Button>
                  </label>
                </Box>
              ))}
              <Button startIcon={<Plus />} onClick={() => setPrograms([...programs, { 
                title: "", 
                description: "", 
                image: "",
                duration: "", 
                category: "",
                startDate: "",
                endDate: "",
                participants: "",
                status: ""
              }])} sx={uploadButtonStyles}>Add Program</Button>

              <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4 }}>
                <DarkButton onClick={handleSave}>Save Changes</DarkButton>
              </Box>
            </Box>
          )}

          {selectedPage === "Media" && (
            <Box sx={{ mt: 4 }}>
              <Typography variant="h5" sx={{ fontFamily: "Poppins", fontWeight: 600, color: "hsl(var(--foreground))", mb: 3 }}>
                Media Gallery
              </Typography>
              {mediaImages.map((media, index) => (
                <Box key={media.id} sx={{ p: 3, mb: 3, border: "1px solid hsl(var(--border))", borderRadius: "var(--radius)", position: "relative" }}>
                  <IconButton onClick={() => setMediaImages(mediaImages.filter(m => m.id !== media.id))} sx={{ position: "absolute", top: 8, right: 8, color: "hsl(0 84.2% 60.2%)" }}>
                    <Trash2 size={20} />
                  </IconButton>
                  
                  <TextField fullWidth label="Title" value={media.title} onChange={(e) => {
                    const updated = [...mediaImages];
                    updated[index].title = e.target.value;
                    setMediaImages(updated);
                  }} sx={{ ...textFieldStyles, mb: 2 }} />
                  
                  <TextField fullWidth label="Alt Text" value={media.alt} onChange={(e) => {
                    const updated = [...mediaImages];
                    updated[index].alt = e.target.value;
                    setMediaImages(updated);
                  }} sx={{ ...textFieldStyles, mb: 2 }} />
                  
                  <TextField fullWidth label="Category" value={media.category} onChange={(e) => {
                    const updated = [...mediaImages];
                    updated[index].category = e.target.value;
                    setMediaImages(updated);
                  }} sx={{ ...textFieldStyles, mb: 2 }} placeholder="e.g., events, workshops, meetings" />
                  
                  <TextField fullWidth label="Album" value={media.album} onChange={(e) => {
                    const updated = [...mediaImages];
                    updated[index].album = e.target.value;
                    setMediaImages(updated);
                  }} sx={{ ...textFieldStyles, mb: 2 }} placeholder="Album name" />
                  
                  <TextField fullWidth multiline rows={2} label="Description" value={media.description} onChange={(e) => {
                    const updated = [...mediaImages];
                    updated[index].description = e.target.value;
                    setMediaImages(updated);
                  }} sx={{ ...textFieldStyles, mb: 2 }} />
                  
                  {media.src && <img src={media.src} alt={media.alt || media.title} style={{ width: "100%", maxHeight: "200px", objectFit: "cover", borderRadius: "8px", marginBottom: "12px" }} />}
                  <input accept="image/*" style={{ display: "none" }} id={`media-image-${index}`} type="file" onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        const updated = [...mediaImages];
                        updated[index].src = reader.result as string;
                        setMediaImages(updated);
                      };
                      reader.readAsDataURL(file);
                    }
                  }} />
                  <label htmlFor={`media-image-${index}`}>
                    <Button variant="outlined" component="span" fullWidth startIcon={<Upload size={16} />} sx={uploadButtonStyles}>Upload Image</Button>
                  </label>
                </Box>
              ))}
              <Button startIcon={<Plus />} onClick={() => setMediaImages([...mediaImages, { 
                id: mediaImages.length + 1, 
                src: "", 
                alt: "", 
                category: "", 
                title: "", 
                description: "", 
                album: "" 
              }])} sx={uploadButtonStyles}>Add Media Item</Button>

              <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4 }}>
                <DarkButton onClick={handleSave}>Save Changes</DarkButton>
              </Box>
            </Box>
          )}

          {selectedPage === "Blogs" && (
            <Box sx={{ mt: 4 }}>
              <Typography variant="h5" sx={{ fontFamily: "Poppins", fontWeight: 600, color: "hsl(var(--foreground))", mb: 3 }}>
                Blog Posts
              </Typography>
              {blogs.map((blog, index) => (
                <Box key={blog.id} sx={{ p: 3, mb: 3, border: "1px solid hsl(var(--border))", borderRadius: "var(--radius)", position: "relative" }}>
                  {blogs.length > 1 && (
                    <IconButton
                      onClick={() => setBlogs(blogs.filter(b => b.id !== blog.id))}
                      sx={{ position: "absolute", top: 8, right: 8, color: "hsl(0 84.2% 60.2%)" }}
                    >
                      <Trash2 size={20} />
                    </IconButton>
                  )}
                  
                  <TextField fullWidth label="Title" value={blog.title} onChange={(e) => {
                    const updated = [...blogs];
                    updated[index].title = e.target.value;
                    setBlogs(updated);
                  }} sx={{ ...textFieldStyles, mb: 2 }} />
                  
                  <TextField fullWidth multiline rows={2} label="Excerpt" value={blog.excerpt} onChange={(e) => {
                    const updated = [...blogs];
                    updated[index].excerpt = e.target.value;
                    setBlogs(updated);
                  }} sx={{ ...textFieldStyles, mb: 2 }} />
                  
                  <TextField fullWidth multiline rows={4} label="Content" value={blog.content} onChange={(e) => {
                    const updated = [...blogs];
                    updated[index].content = e.target.value;
                    setBlogs(updated);
                  }} sx={{ ...textFieldStyles, mb: 2 }} />
                  
                  <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, mb: 2 }}>
                    <TextField fullWidth label="Author" value={blog.author} onChange={(e) => {
                      const updated = [...blogs];
                      updated[index].author = e.target.value;
                      setBlogs(updated);
                    }} sx={textFieldStyles} />
                    <TextField fullWidth label="Date" value={blog.date} onChange={(e) => {
                      const updated = [...blogs];
                      updated[index].date = e.target.value;
                      setBlogs(updated);
                    }} sx={textFieldStyles} />
                  </Box>
                  
                  <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, mb: 2 }}>
                    <TextField fullWidth label="Category" value={blog.category} onChange={(e) => {
                      const updated = [...blogs];
                      updated[index].category = e.target.value;
                      setBlogs(updated);
                    }} sx={textFieldStyles} />
                    <TextField fullWidth label="Read Time (minutes)" type="number" value={blog.readTime} onChange={(e) => {
                      const updated = [...blogs];
                      updated[index].readTime = Number(e.target.value);
                      setBlogs(updated);
                    }} sx={textFieldStyles} />
                  </Box>
                  
                  <TextField fullWidth label="Image URL" value={blog.image} onChange={(e) => {
                    const updated = [...blogs];
                    updated[index].image = e.target.value;
                    setBlogs(updated);
                  }} sx={{ ...textFieldStyles, mb: 2 }} />
                  
                  {blog.image && <img src={blog.image} alt={blog.title} style={{ width: "100%", maxHeight: "200px", objectFit: "cover", borderRadius: "8px", marginBottom: "12px" }} />}
                  <input accept="image/*" style={{ display: "none" }} id={`blog-image-${index}`} type="file" onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        const updated = [...blogs];
                        updated[index].image = reader.result as string;
                        setBlogs(updated);
                      };
                      reader.readAsDataURL(file);
                    }
                  }} />
                  <label htmlFor={`blog-image-${index}`}>
                    <Button variant="outlined" component="span" fullWidth startIcon={<Upload size={16} />} sx={uploadButtonStyles}>Upload Image</Button>
                  </label>
                </Box>
              ))}
              <Button startIcon={<Plus />} onClick={() => setBlogs([...blogs, { 
                id: Math.max(...blogs.map(b => b.id), 0) + 1,
                title: "", 
                excerpt: "", 
                content: "",
                author: "",
                date: "",
                category: "",
                image: "",
                readTime: 5
              }])} sx={uploadButtonStyles}>Add Blog Post</Button>

              <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4 }}>
                <DarkButton onClick={handleSave}>Save Changes</DarkButton>
              </Box>
            </Box>
          )}

          {selectedPage === "Contact" && (
            <Box sx={{ mt: 4 }}>
              <Typography variant="h5" sx={{ fontFamily: "Poppins", fontWeight: 600, color: "hsl(var(--foreground))", mb: 3 }}>
                Contact Information
              </Typography>
              <Box sx={{ p: 3, border: "1px solid hsl(var(--border))", borderRadius: "var(--radius)" }}>
                <TextField fullWidth label="Address" value={contactInfo.address} onChange={(e) => setContactInfo({ ...contactInfo, address: e.target.value })} sx={{ ...textFieldStyles, mb: 2 }} />
                <TextField fullWidth label="Email" type="email" value={contactInfo.email} onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })} sx={{ ...textFieldStyles, mb: 2 }} />
                <TextField fullWidth label="Phone" value={contactInfo.phone} onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })} sx={{ ...textFieldStyles, mb: 2 }} />
                <TextField fullWidth label="Office Hours" value={contactInfo.officeHours} onChange={(e) => setContactInfo({ ...contactInfo, officeHours: e.target.value })} sx={textFieldStyles} />
              </Box>

              <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4 }}>
                <DarkButton onClick={handleSave}>Save Changes</DarkButton>
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};
