import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton } from '@mui/material';
import { Edit, Delete, Add, Search } from '@mui/icons-material';
import { supportService } from '../../api/supportService';
import { toast } from 'sonner';
import { uploadToCloudinary } from '../../utils/uploadToCloudinary';

export const AdminMentors = () => {
  const [mentors, setMentors] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentMentor, setCurrentMentor] = useState<any>({ name: '', domain: '', expertise: '', email: '', bio: '', image: '', linkedin: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchMentors();
  }, []);

  const fetchMentors = async () => {
    setLoading(true);
    try {
      const data = await supportService.getMentors();
      setMentors(data);
    } catch (error) {
      console.error("Failed to fetch mentors", error);
      toast.error("Failed to fetch mentors");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (mentor?: any) => {
    if (mentor) {
      setCurrentMentor(mentor);
      setIsEditing(true);
    } else {
      setCurrentMentor({ name: '', domain: '', expertise: '', email: '', bio: '', image: '', linkedin: '' });
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
        imageUrl = await uploadToCloudinary(imageFile, 'TCETBI/Mentors');
        setUploading(false);
      }

      const mentorData = { ...currentMentor, image: imageUrl };

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
      console.error("Failed to save mentor", error);
      toast.error("Failed to save mentor");
      setUploading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this mentor?")) {
      try {
        await supportService.deleteMentor(id);
        toast.success("Mentor deleted successfully");
        fetchMentors();
      } catch (error) {
        console.error("Failed to delete mentor", error);
        toast.error("Failed to delete mentor");
      }
    }
  };

  const filteredMentors = mentors.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.domain.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (m.expertise && m.expertise.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <Box sx={{ minHeight: "100vh", pt: 12, pb: 8, px: 4, backgroundColor: "hsl(var(--background))" }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: "hsl(var(--foreground))", fontFamily: "Poppins, sans-serif" }}>
          Manage Mentors
        </Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => handleOpenDialog()}>
          Add Mentor
        </Button>
      </Box>

      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', backgroundColor: 'hsl(var(--card))', p: 1, borderRadius: '8px', border: '1px solid hsl(var(--border))' }}>
        <Search sx={{ color: 'hsl(var(--muted-foreground))', mr: 1 }} />
        <TextField
          variant="standard"
          placeholder="Search mentors by name, domain, or expertise..."
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{ disableUnderline: true }}
        />
      </Box>

      <TableContainer component={Paper} sx={{ borderRadius: '12px', border: '1px solid hsl(var(--border))', backgroundColor: "hsl(var(--card))" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Domain</TableCell>
              <TableCell>Expertise</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredMentors.map((mentor) => (
              <TableRow key={mentor.id}>
                <TableCell>{mentor.name}</TableCell>
                <TableCell>{mentor.domain}</TableCell>
                <TableCell>{mentor.expertise || '-'}</TableCell>
                <TableCell>{mentor.email || '-'}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpenDialog(mentor)} color="primary">
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(mentor.id)} color="error">
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {filteredMentors.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">No mentors found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
        <DialogTitle>{isEditing ? 'Edit Mentor' : 'Add Mentor'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Name"
              fullWidth
              value={currentMentor.name}
              onChange={(e) => setCurrentMentor({ ...currentMentor, name: e.target.value })}
            />
            <TextField
              label="Domain (e.g. AI, Fintech, SaaS)"
              fullWidth
              helperText="Separate multiple domains with commas"
              value={currentMentor.domain}
              onChange={(e) => setCurrentMentor({ ...currentMentor, domain: e.target.value })}
            />
            <TextField
              label="Expertise / Specialization"
              fullWidth
              helperText="Separate multiple skills with commas"
              value={currentMentor.expertise}
              onChange={(e) => setCurrentMentor({ ...currentMentor, expertise: e.target.value })}
            />
            <TextField
              label="Email"
              fullWidth
              value={currentMentor.email}
              onChange={(e) => setCurrentMentor({ ...currentMentor, email: e.target.value })}
            />
            <TextField
              label="Bio"
              fullWidth
              multiline
              rows={3}
              value={currentMentor.bio}
              onChange={(e) => setCurrentMentor({ ...currentMentor, bio: e.target.value })}
            />
            <TextField
              label="LinkedIn URL"
              fullWidth
              value={currentMentor.linkedin}
              onChange={(e) => setCurrentMentor({ ...currentMentor, linkedin: e.target.value })}
            />
              <Typography variant="caption" sx={{ color: 'hsl(var(--muted-foreground))' }}>
                Profile Image (Enter filename if in /asset/people/ or upload new)
              </Typography>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                style={{ display: 'block', marginTop: '8px' }}
              />
              <TextField
                margin="dense"
                label="Image Path/URL"
                fullWidth
                size="small"
                value={currentMentor.image}
                onChange={(e) => setCurrentMentor({ ...currentMentor, image: e.target.value })}
              />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" disabled={uploading}>
            {uploading ? 'Uploading...' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
