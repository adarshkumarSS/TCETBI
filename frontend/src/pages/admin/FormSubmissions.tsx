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
import { Visibility, Download, Delete, WarningAmber } from '@mui/icons-material';
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

const getSubmissionUserDetails = (s: any) => {
  if (s.user_details && s.user_details.full_name && s.user_details.full_name !== 'N/A' && s.user_details.full_name !== 'Guest User') {
    return s.user_details;
  }
  
  const fv = s.field_values || [];
  const nameFv = fv.find((f: any) => ['name', 'fullname', 'fullname', 'yourname', 'applicantname', 'foundername'].includes((f.field_name || f.field_label || '').toLowerCase().replace(/[^a-z]/g, '')));
  const emailFv = fv.find((f: any) => ['email', 'emailaddress', 'contactemail'].includes((f.field_name || f.field_label || '').toLowerCase().replace(/[^a-z]/g, '')));
  
  return {
    full_name: nameFv?.value || s.user_details?.full_name || 'Guest User',
    email: emailFv?.value || s.user_details?.email || 'N/A'
  };
};

export const FormSubmissions = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [detailDialog, setDetailDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Filters
  const [formTypeFilter, setFormTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [clearConfirmOpen, setClearConfirmOpen] = useState(false);

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
            { field_label: 'Idea Details', field_type: 'textarea', value: v.idea_details },
            { field_label: 'Testing & Validation Requirements', field_type: 'textarea', value: v.testing_requirements }
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
          form_name: i.form_name || 'Incubation Application',
          form_type: 'incubation_application',
          status: i.status || 'pending',
          created_at: i.created_at,
          user_details: i.user_details ? {
            full_name: i.user_details.full_name,
            email: i.user_details.email
          } : {
            full_name: i.founder_name || i.user?.full_name || 'N/A',
            email: i.email || i.user?.email || 'N/A'
          },
          field_values: i.field_values || []
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

  const [adminNotes, setAdminNotes] = useState('');
  const [mentorName, setMentorName] = useState('');

  const handleUpdateStatus = async (status: string) => {
    if (!selectedSubmission) return;

    try {
      await formBuilderService.updateSubmissionStatus(selectedSubmission.id, status, adminNotes, mentorName);
      toast.success('Status updated successfully');
      setDetailDialog(false);
      setAdminNotes('');
      setMentorName('');
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

  // Color theme per form type
  const getFormTypeTheme = (formType: string) => {
    switch (formType) {
      case 'mentor_application':
        return { bg: 'hsl(293 70% 50% / 0.06)', border: 'hsl(293 70% 50% / 0.15)', accent: '#d946ef' };
      case 'funding_request':
      case 'funding_support':
      case 'company_funding_support':
        return { bg: 'hsl(38 92% 50% / 0.06)', border: 'hsl(38 92% 50% / 0.15)', accent: '#f59e0b' };
      case 'mentoring_request':
      case 'mentoring_support':
        return { bg: 'hsl(199 89% 48% / 0.06)', border: 'hsl(199 89% 48% / 0.15)', accent: '#0ea5e9' };
      case 'validation_request':
      case 'idea_validation':
        return { bg: 'hsl(160 84% 39% / 0.06)', border: 'hsl(160 84% 39% / 0.15)', accent: '#10b981' };
      case 'incubation_application':
        return { bg: 'hsl(221 83% 53% / 0.06)', border: 'hsl(221 83% 53% / 0.15)', accent: '#3b82f6' };
      case 'contact':
        return { bg: 'hsl(142 71% 45% / 0.06)', border: 'hsl(142 71% 45% / 0.15)', accent: '#22c55e' };
      default:
        return { bg: 'hsl(var(--muted) / 0.3)', border: 'hsl(var(--border))', accent: '#8b5cf6' };
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const fetchAllUnfilteredSubmissions = async (): Promise<Submission[]> => {
    const results = await Promise.allSettled([
      formBuilderService.listSubmissions('', ''),
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
      allSubmissions = [...allSubmissions, ...dynamicForms];
    }

    // 2. Mentors
    if (results[1].status === 'fulfilled') {
      const rawData = results[1].value;
      let mentors: any[] = [];
      if (Array.isArray(rawData)) mentors = rawData;
      else if (rawData && Array.isArray(rawData.results)) mentors = rawData.results;

      const formatted = mentors.map((m: any) => ({
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
    if (results[2].status === 'fulfilled') {
       const rawData = results[2].value;
       let funding: any[] = [];
       if (Array.isArray(rawData)) funding = rawData;
       else if (rawData && Array.isArray(rawData.results)) funding = rawData.results;

       const formatted = funding.map((f: any) => ({
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
    if (results[3].status === 'fulfilled') {
      const rawData = results[3].value;
      let mentoring: any[] = [];
      if (Array.isArray(rawData)) mentoring = rawData;
      else if (rawData && Array.isArray(rawData.results)) mentoring = rawData.results;
      
      const formatted = mentoring.map((m: any) => ({
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
    if (results[4].status === 'fulfilled') {
      const rawData = results[4].value;
      let validation: any[] = [];
      if (Array.isArray(rawData)) validation = rawData;
      else if (rawData && Array.isArray(rawData.results)) validation = rawData.results;

      const formatted = validation.map((v: any) => ({
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
          { field_label: 'Idea Details', field_type: 'textarea', value: v.idea_details },
          { field_label: 'Testing & Validation Requirements', field_type: 'textarea', value: v.testing_requirements }
        ]
      }));
      allSubmissions = [...allSubmissions, ...formatted];
    }

    // 6. Incubation Applications
    if (results[5].status === 'fulfilled') {
      const incubationData = results[5].value;
      let incubationList: any[] = [];
      
      if (Array.isArray(incubationData)) {
          incubationList = incubationData;
      } else if (incubationData && Array.isArray(incubationData.results)) {
          incubationList = incubationData.results;
      } else if (incubationData && Array.isArray(incubationData.applications)) {
          incubationList = incubationData.applications;
      }

      const formatted = incubationList.map((i: any) => ({
        id: i.id,
        form_name: i.form_name || 'Incubation Application',
        form_type: 'incubation_application',
        status: i.status || 'pending',
        created_at: i.created_at,
        user_details: i.user_details ? {
          full_name: i.user_details.full_name,
          email: i.user_details.email
        } : {
          full_name: i.founder_name || i.user?.full_name || 'N/A',
          email: i.email || i.user?.email || 'N/A'
        },
        field_values: i.field_values || []
      }));
      allSubmissions = [...allSubmissions, ...formatted];
    }
    
    allSubmissions.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    return allSubmissions;
  };

  const exportToCSV = (targetSubmissions: Submission[] = submissions) => {
    const standardHeaders = ['Form Type', 'Status', 'Submitted At', 'User Name', 'User Email'];
    const dynamicHeadersSet = new Set<string>();
    
    targetSubmissions.forEach(s => {
      (s.field_values || []).forEach(fv => {
        if (fv.field_label) {
          dynamicHeadersSet.add(fv.field_label);
        }
      });
    });
    
    const dynamicHeaders = Array.from(dynamicHeadersSet);
    const allHeaders = [...standardHeaders, ...dynamicHeaders];
    
    const escapeCSVField = (val: any) => {
      if (val === null || val === undefined) return '';
      let strVal = String(val);
      const needsEscaping = strVal.includes(',') || strVal.includes('"') || strVal.includes('\n') || strVal.includes('\r');
      if (needsEscaping) {
        strVal = strVal.replace(/"/g, '""');
        return `"${strVal}"`;
      }
      return strVal;
    };

    const rows = targetSubmissions.map(s => {
      const u = getSubmissionUserDetails(s);
      const fvMap = new Map<string, string>();
      (s.field_values || []).forEach(fv => {
        if (fv.field_label) {
          let val = fv.value || '';
          if (fv.file_url) {
            val = fv.file_url;
          }
          fvMap.set(fv.field_label, val);
        }
      });

      const rowData = [
        s.form_name,
        s.status,
        formatDate(s.created_at),
        u.full_name || 'Anonymous',
        u.email || 'N/A',
        ...dynamicHeaders.map(header => fvMap.get(header) || '')
      ];

      return rowData.map(escapeCSVField).join(',');
    });

    const csvContent = [
      allHeaders.map(escapeCSVField).join(','),
      ...rows
    ].join('\n');

    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `form-submissions-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleClearSubmissionsOnly = async () => {
    setClearConfirmOpen(false);
    setLoading(true);
    try {
      const res = await formBuilderService.clearAllSubmissions();
      toast.success(res?.message || 'Successfully cleared all submissions');
      loadSubmissions();
    } catch (error: any) {
      console.error(error);
      toast.error(error?.response?.data?.error || 'Failed to clear submissions');
    } finally {
      setLoading(false);
    }
  };

  const handleExportAndClear = async () => {
    setClearConfirmOpen(false);
    setLoading(true);
    try {
      const allSubmissions = await fetchAllUnfilteredSubmissions();
      if (allSubmissions.length > 0) {
        exportToCSV(allSubmissions);
      }
      const res = await formBuilderService.clearAllSubmissions();
      toast.success(res?.message || 'Successfully exported and cleared all submissions');
      loadSubmissions();
    } catch (error: any) {
      console.error(error);
      toast.error(error?.response?.data?.error || 'Failed to export and clear submissions');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xl" sx={{ pt: 12, pb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Form Submissions
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<Download />}
            onClick={() => exportToCSV()}
            disabled={submissions.length === 0}
          >
            Export CSV
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<Delete />}
            onClick={() => setClearConfirmOpen(true)}
            disabled={submissions.length === 0}
          >
            Clear All
          </Button>
        </Box>
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
                <MenuItem value="company_funding_support">Company Funding Request</MenuItem>
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
            {submissions.map((submission) => {
              const theme = getFormTypeTheme(submission.form_type);
              return (
              <TableRow key={submission.id} hover sx={{ borderLeft: `4px solid ${theme.accent}`, '&:hover': { bgcolor: theme.bg } }}>
                <TableCell>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    {submission.form_name}
                  </Typography>
                </TableCell>
                <TableCell>
                  {(() => {
                    const u = getSubmissionUserDetails(submission);
                    return (
                      <Box>
                        <Typography variant="body2">{u.full_name}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {u.email}
                        </Typography>
                      </Box>
                    );
                  })()}
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
                    onClick={() => {
                        handleViewDetails(submission.id);
                        setAdminNotes(submission.admin_notes || '');
                    }}
                    color="primary"
                  >
                    <Visibility />
                  </IconButton>
                </TableCell>
              </TableRow>
              );
            })}
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
                {selectedSubmission.field_values.map((fieldValue, index) => {
                  const theme = getFormTypeTheme(selectedSubmission.form_type);
                  return (
                  <Grid size={{ xs: 12 }} key={index}>
                    <Paper sx={{ p: 2, bgcolor: theme.bg, border: `1px solid ${theme.border}`, borderRadius: '12px' }}>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                        {fieldValue.field_label}
                      </Typography>
                      {fieldValue.field_type === 'file' || fieldValue.file_url || (typeof fieldValue.value === 'string' && (fieldValue.value.startsWith('http://') || fieldValue.value.startsWith('https://'))) ? (
                        <Box sx={{ mt: 1 }}>
                          {(() => {
                            const url = fieldValue.file_url || fieldValue.value;
                            const isImage = typeof url === 'string' && /\.(jpg|jpeg|png|gif|webp|bmp)/i.test(url.toLowerCase().split('?')[0]);
                            if (isImage) {
                              return (
                                <Box sx={{ mt: 1, maxWidth: '200px', maxHeight: '200px', borderRadius: '8px', overflow: 'hidden', border: '1px solid hsl(var(--border))' }}>
                                  <a href={url} target="_blank" rel="noreferrer">
                                    <img src={url} alt={fieldValue.field_label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                  </a>
                                </Box>
                              );
                            }
                            return (
                              <Button
                                variant="outlined"
                                href={url}
                                target="_blank"
                                size="small"
                              >
                                View File
                              </Button>
                            );
                          })()}
                        </Box>
                      ) : (
                        <Typography variant="body1">
                          {fieldValue.value || '-'}
                        </Typography>
                      )}
                    </Paper>
                  </Grid>
                  );
                })}
              </Grid>

              <Box sx={{ mt: 4 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>Admin Processing</Typography>
                <Grid container spacing={2}>
                   {selectedSubmission.form_type === 'mentoring_support' && (
                     <Grid size={{ xs: 12 }}>
                        <TextField
                           label="Assigned Mentor Name"
                           fullWidth
                           placeholder="Enter name of mentor to include in the email"
                           value={mentorName}
                           onChange={(e) => setMentorName(e.target.value)}
                           sx={{ mb: 2 }}
                        />
                     </Grid>
                   )}
                   <Grid size={{ xs: 12 }}>
                      <TextField
                        label="Admin Notes / Feedback"
                        fullWidth
                        multiline
                        rows={3}
                        placeholder="These notes will be included in the automated email sent to the user."
                        value={adminNotes}
                        onChange={(e) => setAdminNotes(e.target.value)}
                      />
                   </Grid>
                </Grid>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Box sx={{ display: 'flex', gap: 1, width: '100%', justifyContent: 'space-between', p: 1 }}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button onClick={() => handleUpdateStatus('approved')} color="success" variant="contained">
                Approve Request
              </Button>
              <Button onClick={() => handleUpdateStatus('rejected')} color="error" variant="contained">
                Reject Request
              </Button>
              {selectedSubmission?.status === 'pending' && (
                <Button onClick={() => handleUpdateStatus('in_progress')} color="warning" variant="contained">
                    Mark In Progress
                </Button>
              )}
            </Box>
            <Button onClick={() => setDetailDialog(false)} variant="outlined">Close</Button>
          </Box>
        </DialogActions>
      </Dialog>

      {/* Clear Submissions Confirmation Dialog */}
      <Dialog open={clearConfirmOpen} onClose={() => setClearConfirmOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, bgcolor: 'error.light', color: 'error.contrastText', py: 2 }}>
          <WarningAmber />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>Danger: Irreversible Action</Typography>
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Typography variant="body1" sx={{ mb: 2, fontWeight: 500 }}>
            Are you sure you want to delete all form submissions and legacy applications from the system?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            This action is completely permanent and cannot be undone. It will clear all dynamic form submissions, funding requests, mentoring requests, validation requests, incubation applications, and mentor profiles.
          </Typography>
          <Paper sx={{ p: 2, bgcolor: 'action.hover', border: '1px dashed', borderColor: 'error.main', borderRadius: 2 }}>
            <Typography variant="body2" color="error.main" sx={{ fontWeight: 600 }}>
              ⚠️ Recommendation: Export as CSV first to keep a backup of the records.
            </Typography>
          </Paper>
        </DialogContent>
        <DialogActions sx={{ p: 3, display: 'flex', justifyContent: 'space-between' }}>
          <Button onClick={() => setClearConfirmOpen(false)} variant="outlined">
            Cancel
          </Button>
          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <Button
              onClick={handleClearSubmissionsOnly}
              color="error"
              variant="text"
            >
              Clear Only
            </Button>
            <Button
              onClick={handleExportAndClear}
              color="error"
              variant="contained"
              startIcon={<Download />}
            >
              Export & Clear
            </Button>
          </Box>
        </DialogActions>
      </Dialog>
    </Container>
  );
};
