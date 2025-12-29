import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Grid,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import { Visibility, Download } from '@mui/icons-material';
import { toast } from 'sonner';
import { formBuilderService } from '../../api/formBuilderService';

interface Submission {
  id: number;
  form_name: string;
  form_type: string;
  status: string;
  created_at: string;
  user_details?: {
    full_name: string;
    email: string;
  };
  field_values: Array<{
    field_label: string;
    field_type: string;
    value: string;
    file_url?: string;
  }>;
}

export const FormSubmissions = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [detailDialog, setDetailDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Filters
  const [formTypeFilter, setFormTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    loadSubmissions();
  }, [formTypeFilter, statusFilter]);

  const loadSubmissions = async () => {
    setLoading(true);
    try {
      const data = await formBuilderService.listSubmissions(formTypeFilter, statusFilter);
      setSubmissions(data);
    } catch (error) {
      toast.error('Failed to load submissions');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (submissionId: number) => {
    try {
      const data = await formBuilderService.getSubmission(submissionId);
      setSelectedSubmission(data);
      setDetailDialog(true);
    } catch (error) {
      toast.error('Failed to load submission details');
    }
  };

  const handleUpdateStatus = async (status: string) => {
    if (!selectedSubmission) return;

    try {
      await formBuilderService.updateSubmissionStatus(selectedSubmission.id, status);
      toast.success('Status updated successfully');
      setDetailDialog(false);
      loadSubmissions();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'success';
      case 'rejected':
        return 'error';
      case 'in_progress':
        return 'warning';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const exportToCSV = () => {
    // Simple CSV export
    const headers = ['Form Type', 'Status', 'Submitted At', 'User'];
    const rows = submissions.map(s => [
      s.form_name,
      s.status,
      formatDate(s.created_at),
      s.user_details?.full_name || 'Anonymous'
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `form-submissions-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Form Submissions
        </Typography>
        <Button
          variant="outlined"
          startIcon={<Download />}
          onClick={exportToCSV}
          disabled={submissions.length === 0}
        >
          Export CSV
        </Button>
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <FormControl fullWidth>
              <InputLabel>Form Type</InputLabel>
              <Select
                value={formTypeFilter}
                onChange={(e) => setFormTypeFilter(e.target.value)}
                label="Form Type"
              >
                <MenuItem value="">All Forms</MenuItem>
                <MenuItem value="funding_support">Funding Support</MenuItem>
                <MenuItem value="mentoring_support">Mentoring Support</MenuItem>
                <MenuItem value="idea_validation">Idea Validation</MenuItem>
                <MenuItem value="incubation_application">Incubation Application</MenuItem>
                <MenuItem value="contact">Contact</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                label="Status"
              >
                <MenuItem value="">All Status</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="approved">Approved</MenuItem>
                <MenuItem value="rejected">Rejected</MenuItem>
                <MenuItem value="in_progress">In Progress</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Submissions Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Form Type</TableCell>
              <TableCell>Submitted By</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Submitted At</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {submissions.map((submission) => (
              <TableRow key={submission.id} hover>
                <TableCell>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    {submission.form_name}
                  </Typography>
                </TableCell>
                <TableCell>
                  {submission.user_details ? (
                    <Box>
                      <Typography variant="body2">{submission.user_details.full_name}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {submission.user_details.email}
                      </Typography>
                    </Box>
                  ) : (
                    <Typography variant="body2" color="text.secondary">Anonymous</Typography>
                  )}
                </TableCell>
                <TableCell>
                  <Chip
                    label={submission.status}
                    color={getStatusColor(submission.status)}
                    size="small"
                    sx={{ textTransform: 'capitalize' }}
                  />
                </TableCell>
                <TableCell>{formatDate(submission.created_at)}</TableCell>
                <TableCell align="right">
                  <IconButton
                    size="small"
                    onClick={() => handleViewDetails(submission.id)}
                    color="primary"
                  >
                    <Visibility />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {submissions.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                  <Typography color="text.secondary">
                    {loading ? 'Loading submissions...' : 'No submissions found'}
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Detail Dialog */}
      <Dialog open={detailDialog} onClose={() => setDetailDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">{selectedSubmission?.form_name} Details</Typography>
            <Chip
              label={selectedSubmission?.status}
              color={getStatusColor(selectedSubmission?.status || '')}
              size="small"
              sx={{ textTransform: 'capitalize' }}
            />
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          {selectedSubmission && (
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 2, color: 'text.secondary' }}>
                Submitted: {formatDate(selectedSubmission.created_at)}
              </Typography>

              <Grid container spacing={2}>
                {selectedSubmission.field_values.map((fieldValue, index) => (
                  <Grid size={{ xs: 12 }} key={index}>
                    <Paper sx={{ p: 2, bgcolor: 'background.default' }}>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                        {fieldValue.field_label}
                      </Typography>
                      {fieldValue.file_url ? (
                        <Button
                          variant="text"
                          href={fieldValue.file_url}
                          target="_blank"
                          size="small"
                          sx={{ mt: 1 }}
                        >
                          View File
                        </Button>
                      ) : (
                        <Typography variant="body1">
                          {fieldValue.value || '-'}
                        </Typography>
                      )}
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Box sx={{ display: 'flex', gap: 1, width: '100%', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button onClick={() => handleUpdateStatus('approved')} color="success" variant="contained">
                Approve
              </Button>
              <Button onClick={() => handleUpdateStatus('rejected')} color="error" variant="contained">
                Reject
              </Button>
              <Button onClick={() => handleUpdateStatus('in_progress')} color="warning" variant="contained">
                In Progress
              </Button>
            </Box>
            <Button onClick={() => setDetailDialog(false)}>Close</Button>
          </Box>
        </DialogActions>
      </Dialog>
    </Container>
  );
};
