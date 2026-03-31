import { useState, useEffect, useMemo } from "react";
import { Box, Typography, Modal, Backdrop, Fade, IconButton, Avatar, TextField, InputAdornment, Tabs, Tab } from "@mui/material";
import { Search as SearchIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DarkButton } from "@/components/ui/DarkButton";
import { Check, X, ArrowLeft, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getIncubationApplications, updateApplicationStatus, markApplicationAsRead } from "@/api/incubationService";

interface FieldValue {
  id: number;
  field_label: string;
  field_type: string;
  field_name: string;
  value: string;
  file_url: string | null;
}

interface Application {
  id: number;
  form_name: string;
  form_type: string;
  status: "pending" | "approved" | "rejected";
  is_read: boolean;
  created_at: string;
  field_values: FieldValue[];
  user_details?: any;
}

export const Applications = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState<Application[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<Application[]>([]);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      navigate('/auth');
    } else {
      setIsAuthenticated(true);
    }
    setIsAuthLoading(false);
  }, [navigate]);

  const loadApplications = async () => {
    try {
      setLoading(true);
      const data = await getIncubationApplications();
      console.log("Loaded applications data:", data);
      setApplications(data.applications || []);
    } catch (error) {
      console.error("Failed to load applications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("isAuthenticated change:", isAuthenticated);
    if (isAuthenticated) {
      loadApplications();
    }
  }, [isAuthenticated]);

  // Helper to get field value by name
  const getVal = (app: Application, fieldName: string) => {
    return app.field_values.find(fv => fv.field_name === fieldName)?.value || "";
  };

  useEffect(() => {
    const filtered = applications.filter(app => {
      const bName = getVal(app, 'businessName');
      const fName = getVal(app, 'fullName');
      const email = getVal(app, 'email');
      const bType = getVal(app, 'businessType');

      if (statusFilter !== "all" && app.status !== statusFilter) {
        return false;
      }

      if (searchTerm) {
        const search = searchTerm.toLowerCase();
        return (
          bName.toLowerCase().includes(search) ||
          fName.toLowerCase().includes(search) ||
          email.toLowerCase().includes(search) ||
          bType.toLowerCase().includes(search) ||
          app.status.toLowerCase().includes(search)
        );
      }

      return true;
    });
    setFilteredApplications(filtered);
  }, [applications, searchTerm, statusFilter]);

  const statusCounts = useMemo(() => ({
    all: applications.length,
    pending: applications.filter(app => app.status === 'pending').length,
    approved: applications.filter(app => app.status === 'approved').length,
    rejected: applications.filter(app => app.status === 'rejected').length,
  }), [applications]);

  const handleOpen = async (app: Application) => {
    setSelectedApp(app);
    setOpen(true);
    if (!app.is_read) {
      try {
        await markApplicationAsRead(app.id);
        // Update local state to show it's read immediately
        setApplications(prev => prev.map(item => 
          item.id === app.id ? { ...item, is_read: true } : item
        ));
      } catch (err) {
        console.error("Mark read failed:", err);
      }
    }
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedApp(null);
  };

  const handleApprove = async () => {
    if (!selectedApp) return;
    try {
      setUpdating(true);
      await updateApplicationStatus(selectedApp.id, "approved");
      await loadApplications();
      handleClose();
    } catch (error) {
      console.error("Failed to approve application:", error);
    } finally {
      setUpdating(false);
    }
  };

  const handleReject = async () => {
    if (!selectedApp) return;
    try {
      setUpdating(true);
      await updateApplicationStatus(selectedApp.id, "rejected");
      await loadApplications();
      handleClose();
    } catch (error) {
      console.error("Failed to reject application:", error);
    } finally {
      setUpdating(false);
    }
  };

  if (isAuthLoading) {
    return (
      <Box sx={{ minHeight: "100vh", backgroundColor: "hsl(var(--background))", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Loader2 size={32} className="animate-spin" />
          <Typography variant="body1">Checking authentication...</Typography>
        </Box>
      </Box>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "hsl(var(--background))", pt: 12, px: 4 }}>
      <Box sx={{ maxWidth: "1200px", mx: "auto" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4 }}>
          <IconButton onClick={() => navigate("/admin")} sx={{ color: "hsl(var(--foreground))", "&:hover": { backgroundColor: "hsl(var(--muted))" } }}>
            <ArrowLeft size={24} />
          </IconButton>
          <Typography variant="h4" sx={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, color: "hsl(var(--foreground))" }}>
            Incubation Applications
          </Typography>
        </Box>

        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search applications..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{ startAdornment: (<InputAdornment position="start"><SearchIcon size={20} /></InputAdornment>) }}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'hsl(var(--card))',
                '& fieldset': { borderColor: 'hsl(var(--border))' },
                '&:hover fieldset': { borderColor: 'hsl(var(--ring))' },
                '&.Mui-focused fieldset': { borderColor: 'hsl(var(--ring))' },
              },
              '& .MuiInputBase-input': { color: 'hsl(var(--foreground))' },
            }}
          />
        </Box>

        <Box sx={{ mb: 4 }}>
          <Tabs value={statusFilter} onChange={(_, newValue) => setStatusFilter(newValue)} sx={{ '& .MuiTab-root': { color: 'hsl(var(--muted-foreground))', '&.Mui-selected': { color: 'hsl(var(--primary))' }, minHeight: 48, textTransform: 'none' }, '& .MuiTabs-indicator': { backgroundColor: 'hsl(var(--primary))' } }}>
            <Tab value="all" label={`All (${statusCounts.all})`} />
            <Tab value="pending" label={`Pending (${statusCounts.pending})`} />
            <Tab value="approved" label={`Approved (${statusCounts.approved})`} />
            <Tab value="rejected" label={`Rejected (${statusCounts.rejected})`} />
          </Tabs>
        </Box>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <Loader2 size={32} className="animate-spin" />
            <Typography variant="body1" sx={{ ml: 2 }}>Loading...</Typography>
          </Box>
        ) : filteredApplications.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <Typography variant="h6">No applications found</Typography>
          </Box>
        ) : (
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" }, gap: 3 }}>
            {filteredApplications.map((app) => (
              <Card key={app.id} className={`cursor-pointer hover:shadow-lg transition-shadow ${!app.is_read ? 'border-primary/50' : ''}`} onClick={() => handleOpen(app)}>
                <CardHeader>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <CardTitle className={!app.is_read ? 'font-bold text-primary' : 'font-semibold'}>
                      {getVal(app, 'businessName') || 'Unnamed Venture'}
                    </CardTitle>
                    {!app.is_read && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ px: 1, py: 0.25, bgcolor: 'hsl(var(--primary))', color: 'white', borderRadius: '4px', fontSize: '10px', fontWeight: 700 }}>NEW</Box>
                        <Box sx={{ width: 8, height: 8, bgcolor: 'hsl(var(--primary))', borderRadius: '50%' }} />
                      </Box>
                    )}
                  </Box>
                </CardHeader>
                <CardContent>
                  <Typography variant="body2" sx={{ mb: 1, fontWeight: !app.is_read ? 600 : 400 }}>Lead: {getVal(app, 'fullName') || 'N/A'}</Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>Type: {getVal(app, 'businessType') || 'N/A'}</Typography>
                  <Typography variant="body2" sx={{ mb: 1, textTransform: "capitalize" }}>Status: {app.status}</Typography>
                  <Typography variant="body2" sx={{ color: "hsl(var(--muted-foreground))" }}>Applied: {new Date(app.created_at).toLocaleDateString()}</Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}

        <Modal open={open} onClose={handleClose} closeAfterTransition slots={{ backdrop: Backdrop }}>
          <Fade in={open}>
            <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: { xs: "95%", sm: "850px" }, maxHeight: "90vh", overflow: "auto", bgcolor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "16px", boxShadow: 24, p: { xs: 2, md: 4 } }}>
              {selectedApp && (
                <>
                  <Box sx={{ mb: 4, pb: 2, borderBottom: '1px solid hsl(var(--border))' }}>
                    <Typography variant="h5" sx={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, mb: 1 }}>{getVal(selectedApp, 'businessName')}</Typography>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                      <Typography variant="body2" sx={{ px: 1.5, py: 0.5, borderRadius: 'full', bgcolor: selectedApp.status === 'approved' ? '#dcfce7' : selectedApp.status === 'rejected' ? '#fee2e2' : '#f3f4f6', color: selectedApp.status === 'approved' ? '#166534' : selectedApp.status === 'rejected' ? '#991b1b' : '#374151', textTransform: 'capitalize', fontWeight: 600 }}>
                        {selectedApp.status}
                      </Typography>
                      <Typography variant="caption" sx={{ color: "hsl(var(--muted-foreground))" }}>Submitted on {new Date(selectedApp.created_at).toLocaleString()}</Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
                    {selectedApp.field_values.filter(fv => fv.field_type !== 'file' && fv.field_type !== 'textarea').map(fv => (
                      <Box key={fv.id}>
                        <Typography variant="subtitle2" sx={{ color: "hsl(var(--muted-foreground))", mb: 0.5 }}>{fv.field_label}</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>{fv.value || 'N/A'}</Typography>
                      </Box>
                    ))}
                  </Box>

                  {selectedApp.field_values.filter(fv => fv.field_type === 'textarea').map(fv => (
                    <Box key={fv.id} sx={{ mt: 3 }}>
                      <Typography variant="subtitle2" sx={{ color: "hsl(var(--muted-foreground))", mb: 0.5 }}>{fv.field_label}</Typography>
                      <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>{fv.value || 'N/A'}</Typography>
                    </Box>
                  ))}

                  {selectedApp.field_values.filter(fv => fv.field_type === 'file').length > 0 && (
                    <Box sx={{ mt: 4 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: "hsl(var(--primary))" }}>Attachments</Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                        {selectedApp.field_values.filter(fv => fv.field_type === 'file').map(fv => (
                          <Box key={fv.id} sx={{ p: 2, border: '1px solid hsl(var(--border))', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: 2, minWidth: '200px' }}>
                            {fv.file_url && (fv.file_url.endsWith('.png') || fv.file_url.endsWith('.jpg') || fv.file_url.endsWith('.jpeg')) ? (
                              <Avatar src={fv.file_url} variant="rounded" sx={{ width: 40, height: 40 }} />
                            ) : (
                              <Box sx={{ width: 40, height: 40, bgcolor: 'hsl(var(--muted))', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>📄</Box>
                            )}
                            <Box>
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>{fv.field_label}</Typography>
                              <Typography variant="caption" sx={{ display: 'block' }}>
                                <a href={fv.file_url || '#'} target="_blank" rel="noopener noreferrer" style={{ color: 'hsl(var(--primary))', textDecoration: 'underline' }}>View File</a>
                              </Typography>
                            </Box>
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  )}

                  <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end", mt: 6, pt: 3, borderTop: '1px solid hsl(var(--border))' }}>
                    <DarkButton startIcon={<X />} onClick={handleReject} disabled={selectedApp.status !== "pending" || updating} sx={{ backgroundColor: "hsl(var(--destructive))", "&:hover": { backgroundColor: "hsl(var(--destructive) / 0.9)" } }}>Reject</DarkButton>
                    <DarkButton startIcon={updating ? <Loader2 className="animate-spin" /> : <Check />} onClick={handleApprove} disabled={selectedApp.status !== "pending" || updating} sx={{ backgroundColor: "#22c55e", "&:hover": { backgroundColor: "#16a34a" } }}>{updating ? 'Processing...' : 'Approve'}</DarkButton>
                  </Box>
                </>
              )}
            </Box>
          </Fade>
        </Modal>
      </Box>
    </Box>
  );
};
