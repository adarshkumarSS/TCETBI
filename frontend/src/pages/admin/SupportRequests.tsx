import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Tabs, Tab, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Chip, TextField, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
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
  const [value, setValue] = useState(0);
  const [fundingRequests, setFundingRequests] = useState<any[]>([]);
  const [mentoringRequests, setMentoringRequests] = useState<any[]>([]);
  const [validationRequests, setValidationRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Dialog State
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [actionType, setActionType] = useState<'approve' | 'reject' | 'note'>('note');
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
  };

  const handleOpenDialog = (request: any, type: 'funding' | 'mentoring' | 'validation', action: 'approve' | 'reject' | 'note') => {
    setSelectedRequest(request);
    setRequestType(type);
    setActionType(action);
    setAdminNotes(request.admin_notes || '');
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedRequest(null);
    setAdminNotes('');
  };

  const handleSubmitAction = async () => {
    if (!selectedRequest) return;

    try {
      let status = selectedRequest.status;
      if (actionType === 'approve') status = 'approved';
      if (actionType === 'reject') status = 'rejected';

      const data = { status, admin_notes: adminNotes };
      
      if (requestType === 'funding') {
        await supportService.updateFundingStatus(selectedRequest.id, data);
      } else if (requestType === 'mentoring') {
        await supportService.updateMentoringStatus(selectedRequest.id, data);
      } else {
        await supportService.updateValidationStatus(selectedRequest.id, data);
      }

      toast.success(`Request ${actionType === 'note' ? 'updated' : actionType + 'd'} successfully`);
      fetchRequests();
      handleCloseDialog();
    } catch (error) {
      console.error("Failed to update request", error);
      toast.error("Failed to update request");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'success';
      case 'rejected': return 'error';
      case 'pending': return 'warning';
      default: return 'default';
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", pt: 12, pb: 8, px: 4, backgroundColor: "hsl(var(--background))" }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 4, color: "hsl(var(--foreground))", fontFamily: "Poppins, sans-serif" }}>
        Support Requests
      </Typography>

      <Paper sx={{ width: '100%', mb: 2, borderRadius: '12px', overflow: 'hidden', border: '1px solid hsl(var(--border))', backgroundColor: "hsl(var(--card))" }}>
        <Tabs value={value} onChange={handleChange} indicatorColor="primary" textColor="primary" variant="fullWidth">
          <Tab label="Funding Requests" sx={{ fontFamily: "Poppins, sans-serif", fontWeight: 600 }} />
          <Tab label="Mentoring Requests" sx={{ fontFamily: "Poppins, sans-serif", fontWeight: 600 }} />
          <Tab label="Validation Requests" sx={{ fontFamily: "Poppins, sans-serif", fontWeight: 600 }} />
        </Tabs>

        <Box sx={{ p: 0 }}>
          {/* Funding Tab */}
          <CustomTabPanel value={value} index={0}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Startup</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Phone</TableCell>
                    <TableCell>Scheme</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {fundingRequests.map((req) => (
                    <TableRow key={req.id}>
                      <TableCell>{req.startup_name}</TableCell>
                      <TableCell>{req.name || req.user_details?.full_name || '-'}</TableCell>
                      <TableCell>{req.email || req.user_details?.email || '-'}</TableCell>
                      <TableCell>{req.phone || req.user_details?.phone || '-'}</TableCell>
                      <TableCell>{req.scheme}</TableCell>
                      <TableCell>{req.amount_requested}</TableCell>
                      <TableCell><Chip label={req.status} color={getStatusColor(req.status) as any} size="small" /></TableCell>
                      <TableCell>
                        <Button size="small" onClick={() => handleOpenDialog(req, 'funding', 'approve')} sx={{ mr: 1 }}>Approve</Button>
                        <Button size="small" color="error" onClick={() => handleOpenDialog(req, 'funding', 'reject')} sx={{ mr: 1 }}>Reject</Button>
                        <Button size="small" color="info" onClick={() => handleOpenDialog(req, 'funding', 'note')}>Notes</Button>
                        {req.pitch_deck && <Button size="small" href={req.pitch_deck} target="_blank" sx={{ ml: 1 }}>View Deck</Button>}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CustomTabPanel>

          {/* Mentoring Tab */}
          <CustomTabPanel value={value} index={1}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Startup</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Phone</TableCell>
                    <TableCell>Domain</TableCell>
                    <TableCell>Mentor</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {mentoringRequests.map((req) => (
                    <TableRow key={req.id}>
                      <TableCell>{req.startup_name}</TableCell>
                      <TableCell>{req.name || req.user_details?.full_name || '-'}</TableCell>
                      <TableCell>{req.email || req.user_details?.email || '-'}</TableCell>
                      <TableCell>{req.phone || req.user_details?.phone || '-'}</TableCell>
                      <TableCell>{req.domain}</TableCell>
                      <TableCell>{req.mentor_details?.name || 'Any'}</TableCell>
                      <TableCell><Chip label={req.status} color={getStatusColor(req.status) as any} size="small" /></TableCell>
                      <TableCell>
                        <Button size="small" onClick={() => handleOpenDialog(req, 'mentoring', 'approve')} sx={{ mr: 1 }}>Approve</Button>
                        <Button size="small" color="error" onClick={() => handleOpenDialog(req, 'mentoring', 'reject')} sx={{ mr: 1 }}>Reject</Button>
                        <Button size="small" color="info" onClick={() => handleOpenDialog(req, 'mentoring', 'note')}>Notes</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CustomTabPanel>

          {/* Validation Tab */}
          <CustomTabPanel value={value} index={2}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Startup</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Phone</TableCell>
                    <TableCell>Target Market</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {validationRequests.map((req) => (
                    <TableRow key={req.id}>
                      <TableCell>{req.startup_name}</TableCell>
                      <TableCell>{req.name || req.user_details?.full_name || '-'}</TableCell>
                      <TableCell>{req.email || req.user_details?.email || '-'}</TableCell>
                      <TableCell>{req.phone || req.user_details?.phone || '-'}</TableCell>
                      <TableCell>{req.target_market}</TableCell>
                      <TableCell><Chip label={req.status} color={getStatusColor(req.status) as any} size="small" /></TableCell>
                      <TableCell>
                        <Button size="small" onClick={() => handleOpenDialog(req, 'validation', 'approve')} sx={{ mr: 1 }}>Approve</Button>
                        <Button size="small" color="error" onClick={() => handleOpenDialog(req, 'validation', 'reject')} sx={{ mr: 1 }}>Reject</Button>
                        <Button size="small" color="info" onClick={() => handleOpenDialog(req, 'validation', 'note')}>Notes</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CustomTabPanel>
        </Box>
      </Paper>

      <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
        <DialogTitle>
          {actionType === 'approve' ? 'Approve Request' : actionType === 'reject' ? 'Reject Request' : 'Update Notes'}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            {actionType === 'approve' ? 'Are you sure you want to approve this request?' : 
             actionType === 'reject' ? 'Are you sure you want to reject this request?' : 
             'Update admin notes for this request.'}
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Admin Notes"
            value={adminNotes}
            onChange={(e) => setAdminNotes(e.target.value)}
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmitAction} variant="contained" color={actionType === 'reject' ? 'error' : 'primary'}>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
