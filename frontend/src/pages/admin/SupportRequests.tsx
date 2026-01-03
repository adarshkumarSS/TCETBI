import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Tabs, Tab, Paper, Table, TableBody, TableCell, TableContainer, TableHead, 
  TableRow, Button, Chip, TextField, Dialog, DialogTitle, DialogContent, DialogActions, 
  IconButton, Grid, Divider
} from '@mui/material';
import { 
  ArrowLeft, CheckCircle, XCircle, Search, Eye, Banknote, Users, Lightbulb 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supportService } from '../../api/supportService';
import { toast } from 'sonner';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export const SupportRequests = () => {
  const navigate = useNavigate();
  const [value, setValue] = useState(0);
  const [fundingRequests, setFundingRequests] = useState<any[]>([]);
  const [mentoringRequests, setMentoringRequests] = useState<any[]>([]);
  const [validationRequests, setValidationRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Dialog State
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [actionType, setActionType] = useState<'approve' | 'reject' | 'note'>('note'); // This might be redundant with new dialog logic
  const [requestType, setRequestType] = useState<'funding' | 'mentoring' | 'validation'>('funding');

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const [funding, mentoring, validation] = await Promise.all([
        supportService.getFundingRequests(),
        supportService.getMentoringRequests(),
        supportService.getValidationRequests()
      ]);
      setFundingRequests(funding);
      setMentoringRequests(mentoring);
      setValidationRequests(validation);
    } catch (error) {
      console.error("Failed to fetch requests", error);
      toast.error("Failed to fetch support requests");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    setSearchTerm(''); // Reset search on tab change
  };

  const handleOpenDialog = (request: any, type: 'funding' | 'mentoring' | 'validation') => {
    setSelectedRequest(request);
    setRequestType(type);
    setAdminNotes(request.admin_notes || '');
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedRequest(null);
    setAdminNotes('');
  };

  const handleQuickAction = async (request: any, type: 'funding' | 'mentoring' | 'validation', action: 'approve' | 'reject') => {
    try {
        const status = action === 'approve' ? 'approved' : 'rejected';
        const data = { status };
        
        if (type === 'funding') await supportService.updateFundingStatus(request.id, data);
        else if (type === 'mentoring') await supportService.updateMentoringStatus(request.id, data);
        else await supportService.updateValidationStatus(request.id, data);
  
        toast.success(`Request ${status} successfully`);
        fetchRequests();
    } catch (error) {
        toast.error("Failed to update status");
    }
  };

  const handleSubmitAction = async () => {
    if (!selectedRequest) return;

    try {
      const data = { status: selectedRequest.status, admin_notes: adminNotes };
      // Here we only update notes essentially if strictly following logic, but let's assume this dialog is for notes mostly if status isn't changed via buttons
      
      if (requestType === 'funding') {
        await supportService.updateFundingStatus(selectedRequest.id, data);
      } else if (requestType === 'mentoring') {
        await supportService.updateMentoringStatus(selectedRequest.id, data);
      } else {
        await supportService.updateValidationStatus(selectedRequest.id, data);
      }
      
      toast.success('Notes updated successfully');
      fetchRequests();
      handleCloseDialog();
    } catch (error) {
      toast.error('Failed to update request');
    }
  };

  // Helper to filter list
  const filterList = (list: any[]) => {
      return list.filter(item => 
          (item.startup_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
          (item.name?.toLowerCase() || '').includes(searchTerm.toLowerCase())
      );
  };

  const renderRequestView = (
      requests: any[], 
      type: 'funding' | 'mentoring' | 'validation',
      title: string
  ) => {
      const filtered = filterList(requests);
      const pending = requests.filter(r => r.status === 'pending');

      return (
        <Grid container spacing={4}>
            {/* Main List */}
            <Grid size={{ xs: 12, lg: 8 }}>
                <Paper sx={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "var(--radius)", p: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Typography variant="h6" sx={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, color: "hsl(var(--primary))" }}>
                            All {title}
                        </Typography>
                        <TextField
                            size="small"
                            placeholder="Search requests..."
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
                                    <TableCell sx={{ fontFamily: "Poppins, sans-serif", fontWeight: 600 }}>Startup / Applicant</TableCell>
                                    <TableCell sx={{ fontFamily: "Poppins, sans-serif", fontWeight: 600 }}>Date</TableCell>
                                    <TableCell sx={{ fontFamily: "Poppins, sans-serif", fontWeight: 600 }}>Status</TableCell>
                                    <TableCell sx={{ fontFamily: "Poppins, sans-serif", fontWeight: 600 }}>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filtered.map((req) => (
                                    <TableRow key={req.id}>
                                        <TableCell>
                                            <Typography variant="subtitle2" sx={{ fontFamily: "Poppins, sans-serif", fontWeight: 600 }}>
                                                {req.startup_name || req.name || 'Unknown'}
                                            </Typography>
                                            <Typography variant="caption" color="textSecondary">
                                                {type === 'funding' && `₹${req.amount_requested}`}
                                                {type === 'mentoring' && req.domain}
                                                {type === 'validation' && req.target_market}
                                            </Typography>
                                        </TableCell>
                                        <TableCell sx={{ fontFamily: "Poppins, sans-serif" }}>
                                            {new Date(req.created_at).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell>
                                            <Chip 
                                                label={req.status} 
                                                size="small" 
                                                color={req.status === 'approved' ? 'success' : req.status === 'rejected' ? 'error' : 'warning'}
                                                sx={{ textTransform: 'capitalize' }}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <IconButton size="small" onClick={() => handleOpenDialog(req, type)} color="primary">
                                                <Eye size={16} />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {filtered.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={4} align="center" sx={{ py: 4, color: "text.secondary" }}>
                                            No requests found
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
                        Pending Approvals ({pending.length})
                    </Typography>

                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        {pending.length > 0 ? pending.map((req) => (
                            <Box key={req.id} sx={{ p: 2, border: "1px solid hsl(var(--border))", borderRadius: "var(--radius)", backgroundColor: "hsl(var(--muted) / 0.3)" }}>
                                <Box sx={{ mb: 2 }}>
                                    <Typography sx={{ fontFamily: "Poppins, sans-serif", fontWeight: 600 }}>
                                        {req.startup_name || req.name}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: "text.secondary", fontSize: '0.85rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                        {req.description || req.problem_statement || req.idea_details}
                                    </Typography>
                                </Box>
                                
                                <Box sx={{ display: "flex", gap: 1 }}>
                                    <Button 
                                        size="small" 
                                        variant="contained" 
                                        color="success" 
                                        fullWidth 
                                        startIcon={<CheckCircle size={14} />}
                                        onClick={() => handleQuickAction(req, type, 'approve')}
                                    >
                                        Approve
                                    </Button>
                                    <Button 
                                        size="small" 
                                        variant="outlined" 
                                        color="error" 
                                        fullWidth
                                        startIcon={<XCircle size={14} />}
                                        onClick={() => handleQuickAction(req, type, 'reject')}
                                    >
                                        Reject
                                    </Button>
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
      );
  };

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "hsl(var(--background))", pt: 16, px: 4 }}>
      <Box sx={{ maxWidth: "100%", mx: "auto" }}>
        
        {/* Header */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4 }}>
          <IconButton onClick={() => navigate("/admin")} sx={{ color: "hsl(var(--foreground))", "&:hover": { backgroundColor: "hsl(var(--muted))" } }}>
            <ArrowLeft size={24} />
          </IconButton>
          <Typography variant="h4" sx={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, color: "hsl(var(--foreground))" }}>
            Support Requests
          </Typography>
        </Box>

        <Paper sx={{ mb: 4, borderRadius: "var(--radius)", overflow: 'hidden' }}>
             <Tabs 
                value={value} 
                onChange={handleChange} 
                variant="fullWidth"
                sx={{ 
                    borderBottom: 1, 
                    borderColor: 'divider',
                    '& .MuiTab-root': { 
                        py: 2, 
                        fontFamily: 'Poppins, sans-serif',
                        fontWeight: 600
                    }
                }}
            >
                <Tab icon={<Banknote size={20} />} iconPosition="start" label="Funding Support" />
                <Tab icon={<Users size={20} />} iconPosition="start" label="Mentoring Support" />
                <Tab icon={<Lightbulb size={20} />} iconPosition="start" label="Idea Validation" />
            </Tabs>
        </Paper>

        <CustomTabPanel value={value} index={0}>
            {renderRequestView(fundingRequests, 'funding', 'Funding Requests')}
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
            {renderRequestView(mentoringRequests, 'mentoring', 'Mentoring Requests')}
        </CustomTabPanel>
        <CustomTabPanel value={value} index={2}>
            {renderRequestView(validationRequests, 'validation', 'Validation Requests')}
        </CustomTabPanel>

        {/* Notes/Detail Dialog */}
        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
            <DialogTitle>Request Details</DialogTitle>
            <DialogContent>
                <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {selectedRequest && (
                        <Box>
                            <Grid container spacing={2}>
                                {Object.entries(selectedRequest).map(([key, val]) => {
                                    if (['id', 'user', 'created_at', 'updated_at', 'pitch_deck'].includes(key)) return null;
                                    if (typeof val === 'object' || Array.isArray(val)) return null;
                                    return (
                                        <Grid size={{ xs: 12, sm: 6 }} key={key}>
                                            <Typography variant="caption" color="textSecondary" sx={{ textTransform: 'uppercase' }}>
                                                {key.replace(/_/g, ' ')}
                                            </Typography>
                                            <Typography variant="body1">
                                                {String(val)}
                                            </Typography>
                                        </Grid>
                                    );
                                })}
                                {/* Handle File/Pitch Deck */}
                                {selectedRequest.pitch_deck && (
                                    <Grid size={{ xs: 12 }}>
                                        <Typography variant="caption" color="textSecondary">PITCH DECK</Typography>
                                        <Box>
                                            <Button 
                                                variant="outlined" 
                                                size="small" 
                                                href={selectedRequest.pitch_deck} 
                                                target="_blank"
                                            >
                                                View Document
                                            </Button>
                                        </Box>
                                    </Grid>
                                )}
                            </Grid>
                        </Box>
                    )}
                    
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="subtitle2">Admin Notes</Typography>
                    <TextField
                        fullWidth
                        multiline
                        rows={4}
                        placeholder="Add internal notes..."
                        value={adminNotes}
                        onChange={(e) => setAdminNotes(e.target.value)}
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCloseDialog}>Cancel</Button>
                <Button onClick={handleSubmitAction} variant="contained">Save Notes</Button>
            </DialogActions>
        </Dialog>

      </Box>
    </Box>
  );
};
