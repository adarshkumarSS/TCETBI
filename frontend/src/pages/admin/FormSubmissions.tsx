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
import { supportService } from '../../api/supportService';
import { getIncubationApplications } from '../../api/incubationService';

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

// ... (existing imports)

  const loadSubmissions = async () => {
    setLoading(true);
    try {
      const results = await Promise.allSettled([
        formBuilderService.listSubmissions(formTypeFilter === 'dynamic' ? '' : formTypeFilter, statusFilter),
        supportService.getMentors(),
        supportService.getFundingRequests(),
        supportService.getMentoringRequests(),
        supportService.getValidationRequests(),
        getIncubationApplications()
      ]);

      let allSubmissions: Submission[] = [];

      // 1. Dynamic Forms
      if (results[0].status === 'fulfilled') {
        const rawData = results[0].value;
        let dynamicForms: any[] = [];
        if (Array.isArray(rawData)) dynamicForms = rawData;
        else if (rawData && Array.isArray(rawData.results)) dynamicForms = rawData.results;

        if (!['mentor_application', 'funding_request', 'mentoring_request', 'validation_request', 'incubation_application'].includes(formTypeFilter)) {
           allSubmissions = [...allSubmissions, ...dynamicForms];
        }
      }

      // Helper to match filter
      const matchesFilter = (type: string, status: string) => {
        const typeMatch = !formTypeFilter || formTypeFilter === type;
        const statusMatch = !statusFilter || statusFilter === status;
        return typeMatch && statusMatch;
      };

      // 2. Mentors
      if (results[1].status === 'fulfilled' && matchesFilter('mentor_application', '')) {
        const rawData = results[1].value;
        let mentors: any[] = [];
        if (Array.isArray(rawData)) mentors = rawData;
        else if (rawData && Array.isArray(rawData.results)) mentors = rawData.results;

        const formatted = mentors
          .filter((m: any) => !statusFilter || m.status === statusFilter)
          .map((m: any) => ({
          id: m.id,
          form_name: 'Mentor Application',
          form_type: 'mentor_application',
          status: m.status,
          created_at: m.created_at || new Date().toISOString(),
          user_details: {
            full_name: `${m.salutation} ${m.name}`,
            email: m.email
          },
          field_values: [
            { field_label: 'Designation', field_type: 'text', value: m.designation },
            { field_label: 'Domain', field_type: 'text', value: m.domain },
            { field_label: 'Experience (Years)', field_type: 'number', value: m.years_of_experience?.toString() },
            { field_label: 'LinkedIn', field_type: 'url', value: m.linkedin },
            { field_label: 'Bio', field_type: 'textarea', value: m.bio },
            { field_label: 'Expertise', field_type: 'text', value: m.expertise },
            { field_label: 'Profile Photo', field_type: 'file', value: 'View Photo', file_url: m.image }
          ]
        }));
        allSubmissions = [...allSubmissions, ...formatted];
      }

      // 3. Funding
      if (results[2].status === 'fulfilled' && matchesFilter('funding_request', '')) {
         const rawData = results[2].value;
         let funding: any[] = [];
         if (Array.isArray(rawData)) funding = rawData;
         else if (rawData && Array.isArray(rawData.results)) funding = rawData.results;

         const formatted = funding
           .filter((f: any) => !statusFilter || f.status === statusFilter)
           .map((f: any) => ({
           id: f.id,
           form_name: 'Funding Request',
           form_type: 'funding_request',
           status: f.status,
           created_at: f.created_at,
           user_details: {
             full_name: f.name || f.user_details?.full_name || 'N/A',
             email: f.email || f.user_details?.email || 'N/A'
           },
           field_values: [
             { field_label: 'Startup Name', field_type: 'text', value: f.startup_name },
             { field_label: 'Scheme', field_type: 'text', value: f.scheme },
             { field_label: 'Amount Requested', field_type: 'text', value: f.amount_requested },
             { field_label: 'Pitch Deck', field_type: 'file', value: 'View Deck', file_url: f.pitch_deck },
             { field_label: 'Description', field_type: 'textarea', value: f.description }
           ]
         }));
         allSubmissions = [...allSubmissions, ...formatted];
      }

      // 4. Mentoring Requests
      if (results[3].status === 'fulfilled' && matchesFilter('mentoring_request', '')) {
        const rawData = results[3].value;
        let mentoring: any[] = [];
        if (Array.isArray(rawData)) mentoring = rawData;
        else if (rawData && Array.isArray(rawData.results)) mentoring = rawData.results;
        
        const formatted = mentoring
          .filter((m: any) => !statusFilter || m.status === statusFilter)
          .map((m: any) => ({
          id: m.id,
          form_name: 'Mentoring Request',
          form_type: 'mentoring_request',
          status: m.status,
          created_at: m.created_at,
          user_details: {
            full_name: m.name || m.user_details?.full_name || 'N/A',
            email: m.email || m.user_details?.email || 'N/A'
          },
          field_values: [
            { field_label: 'Startup Name', field_type: 'text', value: m.startup_name },
            { field_label: 'Domain', field_type: 'text', value: m.domain },
            { field_label: 'Problem Statement', field_type: 'textarea', value: m.problem_statement },
            { field_label: 'Specific Mentor', field_type: 'text', value: m.mentor_details?.name || 'Any' }
          ]
        }));
        allSubmissions = [...allSubmissions, ...formatted];
      }

      // 5. Validation Requests
      if (results[4].status === 'fulfilled' && matchesFilter('validation_request', '')) {
        const rawData = results[4].value;
        let validation: any[] = [];
        if (Array.isArray(rawData)) validation = rawData;
        else if (rawData && Array.isArray(rawData.results)) validation = rawData.results;

        const formatted = validation
          .filter((v: any) => !statusFilter || v.status === statusFilter)
          .map((v: any) => ({
          id: v.id,
          form_name: 'Validation Request',
          form_type: 'validation_request',
          status: v.status,
          created_at: v.created_at,
          user_details: {
            full_name: v.name || v.user_details?.full_name || 'N/A',
            email: v.email || v.user_details?.email || 'N/A'
          },
          field_values: [
            { field_label: 'Startup Name', field_type: 'text', value: v.startup_name },
            { field_label: 'Target Market', field_type: 'text', value: v.target_market },
            { field_label: 'Idea Description', field_type: 'textarea', value: v.description }
          ]
        }));
        allSubmissions = [...allSubmissions, ...formatted];
      }

      // 6. Incubation Applications
      if (results[5].status === 'fulfilled' && matchesFilter('incubation_application', '')) {
        const incubationData = results[5].value;
        let incubationList: any[] = [];
        
        if (Array.isArray(incubationData)) {
            incubationList = incubationData;
        } else if (incubationData && Array.isArray(incubationData.results)) {
            incubationList = incubationData.results;
        } else if (incubationData && Array.isArray(incubationData.applications)) {
            incubationList = incubationData.applications;
        } else {
            console.warn("Unexpected incubation data format:", incubationData);
        }

        const formatted = incubationList
          .filter((i: any) => !statusFilter || i.status === statusFilter)
          .map((i: any) => ({
          id: i.id,
          form_name: 'Incubation Application',
          form_type: 'incubation_application',
          status: i.status || 'pending',
          created_at: i.created_at,
          user_details: {
            full_name: i.founder_name || i.user?.full_name || 'N/A',
            email: i.email || i.user?.email || 'N/A'
          },
          field_values: [
             { field_label: 'Startup Name', field_type: 'text', value: i.startup_name },
             { field_label: 'Sector', field_type: 'text', value: i.sector },
             { field_label: 'Phone', field_type: 'text', value: i.phone_number },
             { field_label: 'Description', field_type: 'textarea', value: i.description },
             { field_label: 'Pitch Deck', field_type: 'file', value: 'View Deck', file_url: i.pitch_deck }
          ]
        }));
        allSubmissions = [...allSubmissions, ...formatted];
      }
      
      // Sort by created_at desc
      allSubmissions.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      setSubmissions(allSubmissions);
    } catch (error) {
      console.error(error);
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
                <MenuItem value="mentor_application">Mentor Application</MenuItem>
                <MenuItem value="funding_request">Funding Request</MenuItem>
                <MenuItem value="mentoring_request">Mentoring Request</MenuItem>
                <MenuItem value="validation_request">Idea Validation</MenuItem>
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
