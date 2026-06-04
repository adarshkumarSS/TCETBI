import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, 
  TableRow, Paper, Dialog, DialogTitle, DialogContent, DialogActions, TextField, 
  IconButton, Chip, Select, MenuItem, InputLabel, FormControl, Divider, Grid
} from '@mui/material';
import { 
  ArrowLeft, Plus, Trash2, CheckCircle, XCircle, Clock, Search, Edit, Eye 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supportService } from '../../api/supportService';
import { toast } from 'sonner';
import { uploadToCloudinary } from '../../utils/uploadToCloudinary';
import { SquareResizeModal } from '../../components/SquareResizeModal';

export const AdminMentors = () => {
  const navigate = useNavigate();
  const [mentors, setMentors] = useState<any[]>([]);
  const [pendingMentors, setPendingMentors] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentMentor, setCurrentMentor] = useState<any>({ 
    salutation: 'Mr',
    name: '', 
    domain: '', 
    expertise: '', 
    email: '', 
    designation: '',
    years_of_experience: 0,
    bio: '', 
    image: '', 
    linkedin: '',
    status: 'pending',
    interested_in: 'both',
    experience_details: [],
    phone: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [imageFile, setImageFile] = useState<File | string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [cropModal, setCropModal] = useState({ open: false, image: '' });

  useEffect(() => {
    fetchMentors();
  }, []);

  const fetchMentors = async () => {
    setLoading(true);
    try {
      const data = await supportService.getMentors();
      setMentors(data);
      setPendingMentors(data.filter((m: any) => m.status === 'pending'));
    } catch (error) {
      console.error("Failed to fetch mentors", error);
      toast.error("Failed to fetch mentors");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: number, newStatus: string) => {
    try {
      await supportService.updateMentor(id, { status: newStatus });
      toast.success(`Mentor ${newStatus} successfully`);
      fetchMentors();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const handleOpenDialog = (mentor?: any) => {
    if (mentor) {
      setCurrentMentor({
        ...mentor,
        experience_details: typeof mentor.experience_details === 'string' 
          ? JSON.parse(mentor.experience_details) 
          : (mentor.experience_details || [])
      });
      setIsEditing(true);
    } else {
      setCurrentMentor({ 
        salutation: 'Mr',
        name: '', 
        domain: '', 
        expertise: '', 
        email: '', 
        designation: '',
        years_of_experience: 0,
        bio: '', 
        image: '', 
        linkedin: '',
        status: 'pending',
        interested_in: 'both',
        experience_details: [],
        phone: ''
      });
      setIsEditing(false);
    }
    setImageFile(null);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleSave = async () => {
    try {
      let imageUrl = currentMentor.image;
      if (imageFile) {
        setUploading(true);
        
        // If imageFile is a string (data/blob url), convert to File
        let fileToUpload = imageFile;
        if (typeof imageFile === 'string' && (imageFile.startsWith('data:') || imageFile.startsWith('blob:'))) {
          const res = await fetch(imageFile);
          const blob = await res.blob();
          fileToUpload = new File([blob], `mentor-admin-${Date.now()}.jpg`, { type: blob.type });
        }

        imageUrl = await uploadToCloudinary(fileToUpload as File, 'TCETBI/Mentors');
        setUploading(false);
      }

      const mentorData = { 
        ...currentMentor, 
        status: isEditing ? currentMentor.status : 'approved',
        image: imageUrl,
        experience_details: currentMentor.experience_details // Send as object
      };

      if (isEditing) {
        await supportService.updateMentor(currentMentor.id, mentorData);
        toast.success("Mentor updated successfully");
      } else {
        await supportService.createMentor(mentorData);
        toast.success("Mentor added successfully");
      }
      fetchMentors();
      handleCloseDialog();
    } catch (error) {
      console.error(error);
      toast.error("Failed to save mentor");
      setUploading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this mentor?")) {
      try {
        await supportService.deleteMentor(id);
        toast.success("Mentor deleted");
        fetchMentors();
      } catch (error) {
        toast.error("Failed to delete mentor");
      }
    }
  };

  const filteredMentors = mentors.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.domain.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "hsl(var(--background))", pt: 16, px: 4 }}>
      <Box sx={{ maxWidth: "100%", mx: "auto" }}>
        
        {/* Header */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4 }}>
          <IconButton onClick={() => navigate("/admin")} sx={{ color: "hsl(var(--foreground))", "&:hover": { backgroundColor: "hsl(var(--muted))" } }}>
            <ArrowLeft size={24} />
          </IconButton>
          <Typography variant="h4" sx={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, color: "hsl(var(--foreground))" }}>
            Mentor Management
          </Typography>
          <Box sx={{ ml: 'auto' }}>
            <Button
              variant="contained"
              startIcon={<Plus size={18} />}
              onClick={() => handleOpenDialog()}
              sx={{ backgroundColor: "hsl(var(--primary))", "&:hover": { backgroundColor: "hsl(var(--primary) / 0.9)" }, borderRadius: "8px", px: 3, py: 1 }}
            >
              Add Mentor
            </Button>
          </Box>
        </Box>

        <Grid container spacing={4}>
          {/* Main List */}
          <Grid size={{ xs: 12, lg: 8 }}>
            <Paper sx={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "var(--radius)", p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, color: "hsl(var(--primary))" }}>
                  All Mentors
                </Typography>
                <TextField
                  size="small"
                  placeholder="Search mentors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{ startAdornment: <Search size={18} style={{ marginRight: 8, color: 'hsl(var(--muted-foreground))' }} /> }}
                  sx={{ width: 250 }}
                />
              </Box>

              <TableContainer sx={{ maxHeight: 'none', overflowX: 'auto' }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontFamily: "Poppins, sans-serif", fontWeight: 600 }}>Mentor</TableCell>
                      <TableCell sx={{ fontFamily: "Poppins, sans-serif", fontWeight: 600 }}>Domain</TableCell>
                      <TableCell sx={{ fontFamily: "Poppins, sans-serif", fontWeight: 600 }}>Status</TableCell>
                      <TableCell sx={{ fontFamily: "Poppins, sans-serif", fontWeight: 600 }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredMentors.map((mentor) => (
                      <TableRow key={mentor.id}>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            {mentor.image && (
                              <img src={mentor.image} alt={mentor.name} style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }} />
                            )}
                            <Box>
                              <Typography variant="subtitle2" sx={{ fontFamily: "Poppins, sans-serif", fontWeight: 600 }}>
                                {mentor.salutation} {mentor.name}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {mentor.designation}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell sx={{ fontFamily: "Poppins, sans-serif" }}>{mentor.domain}</TableCell>
                        <TableCell>
                          <Chip 
                            label={mentor.status} 
                            size="small" 
                            color={mentor.status === 'approved' ? 'success' : mentor.status === 'rejected' ? 'error' : 'warning'}
                            sx={{ textTransform: 'capitalize' }}
                          />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <IconButton size="small" onClick={() => handleOpenDialog(mentor)} color="primary">
                              <Edit size={16} />
                            </IconButton>
                            <IconButton size="small" onClick={() => handleDelete(mentor.id)} color="error">
                              <Trash2 size={16} />
                            </IconButton>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredMentors.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} align="center" sx={{ py: 4, color: "text.secondary" }}>
                          No mentors found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>

          {/* Pending Approvals */}
          <Grid size={{ xs: 12, lg: 4 }}>
            <Paper sx={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "var(--radius)", p: 3 }}>
              <Typography variant="h6" sx={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, color: "hsl(var(--primary))", mb: 3 }}>
                Pending Requests ({pendingMentors.length})
              </Typography>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {pendingMentors.length > 0 ? pendingMentors.map((mentor) => (
                  <Box key={mentor.id} sx={{ p: 2, border: "1px solid hsl(var(--border))", borderRadius: "var(--radius)", backgroundColor: "hsl(var(--muted) / 0.3)" }}>
                    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                       {mentor.image && (
                          <img src={mentor.image} alt={mentor.name} style={{ width: 48, height: 48, borderRadius: '12px', objectFit: 'cover' }} />
                        )}
                        <Box>
                          <Typography sx={{ fontFamily: "Poppins, sans-serif", fontWeight: 600 }}>
                            {mentor.salutation} {mentor.name}
                          </Typography>
                          <Typography variant="caption" sx={{ display: 'block', color: "text.secondary" }}>
                            {mentor.designation} • {mentor.domain}
                          </Typography>
                        </Box>
                    </Box>
                    
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Button 
                        size="small" 
                        variant="contained" 
                        color="success" 
                        fullWidth 
                        startIcon={<CheckCircle size={14} />}
                        onClick={() => handleStatusUpdate(mentor.id, 'approved')}
                      >
                        Approve
                      </Button>
                      <Button 
                        size="small" 
                        variant="outlined" 
                        color="error" 
                        fullWidth
                        startIcon={<XCircle size={14} />}
                        onClick={() => handleStatusUpdate(mentor.id, 'rejected')}
                      >
                        Reject
                      </Button>
                      <IconButton
                         size="small"
                         color="primary"
                         onClick={() => handleOpenDialog(mentor)}
                      >
                        <Eye size={16} />
                      </IconButton>
                    </Box>
                  </Box>
                )) : (
                  <Typography variant="body2" color="text.secondary" align="center">
                    No pending requests
                  </Typography>
                )}
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* Edit/Create Dialog */}
        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
          <DialogTitle>
            {isEditing ? 'Edit Mentor' : 'Add New Mentor'}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Salutation</InputLabel>
                    <Select
                      value={currentMentor.salutation}
                      label="Salutation"
                      onChange={(e) => setCurrentMentor({...currentMentor, salutation: e.target.value})}
                    >
                      <MenuItem value="Mr">Mr.</MenuItem>
                      <MenuItem value="Ms">Ms.</MenuItem>
                      <MenuItem value="Dr">Dr.</MenuItem>
                      <MenuItem value="Prof">Prof.</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12, sm: 8 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Name"
                    value={currentMentor.name}
                    onChange={(e) => setCurrentMentor({...currentMentor, name: e.target.value})}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField fullWidth size="small" label="Email" value={currentMentor.email} onChange={(e) => setCurrentMentor({...currentMentor, email: e.target.value})} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField fullWidth size="small" label="Phone" value={currentMentor.phone || ''} onChange={(e) => setCurrentMentor({...currentMentor, phone: e.target.value})} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField fullWidth size="small" label="Designation" value={currentMentor.designation} onChange={(e) => setCurrentMentor({...currentMentor, designation: e.target.value})} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                   <TextField fullWidth size="small" label="Domain" value={currentMentor.domain} onChange={(e) => setCurrentMentor({...currentMentor, domain: e.target.value})} />
                </Grid>
                 <Grid size={{ xs: 12, sm: 6 }}>
                   <TextField fullWidth size="small" label="LinkedIn URL" value={currentMentor.linkedin} onChange={(e) => setCurrentMentor({...currentMentor, linkedin: e.target.value})} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                   <TextField fullWidth type="number" size="small" label="Years of Experience" value={currentMentor.years_of_experience} onChange={(e) => setCurrentMentor({...currentMentor, years_of_experience: parseInt(e.target.value)})} />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField fullWidth multiline rows={3} size="small" label="Bio" value={currentMentor.bio} onChange={(e) => setCurrentMentor({...currentMentor, bio: e.target.value})} />
                </Grid>
                <Grid size={{ xs: 12 }}>
                   <Typography variant="caption" sx={{ mb: 1, display: 'block' }}>Profile Photo</Typography>
                   <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                     <Box 
                       sx={{ width: 80, height: 80, borderRadius: '12px', bgcolor: 'hsl(var(--muted))', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', cursor: 'pointer', border: '1px dashed hsl(var(--border))' }}
                       onClick={() => document.getElementById('mentor-upload')?.click()}
                     >
                        {imageFile || currentMentor.image ? (
                           <img src={imageFile ? (typeof imageFile === 'string' ? imageFile : URL.createObjectURL(imageFile)) : currentMentor.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : <Plus />}
                     </Box>
                     <Button component="label" size="small" variant="outlined">
                       Upload
                       <input 
                          id="mentor-upload" 
                          type="file" 
                          hidden 
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => setCropModal({ open: true, image: reader.result as string });
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                     </Button>
                   </Box>
                </Grid>
              </Grid>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button onClick={handleSave} variant="contained" disabled={uploading}>
              {uploading ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogActions>
        </Dialog>

        <SquareResizeModal
          open={cropModal.open}
          image={cropModal.image}
          onClose={() => setCropModal({ ...cropModal, open: false })}
          onSave={(cropped) => {
            setImageFile(cropped);
            setCropModal({ ...cropModal, open: false });
          }}
        />
      </Box>
    </Box>
  );
};
