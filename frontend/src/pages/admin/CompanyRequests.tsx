import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Paper,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Card,
  CardContent,
  Avatar,
  Divider,
  IconButton,
  Collapse,
  Tabs,
  Tab,
  Badge
} from "@mui/material";
import {
  CheckCircle,
  Cancel,
  ExpandMore,
  ExpandLess,
  Business,
  Person,
  LocationOn,
  Language,
  Description,
  Image,
} from "@mui/icons-material";
import { FileEdit } from "lucide-react";
import { toast } from "sonner";
import userService from "../../api/userService";

interface AdminCompanyRequest {
  id: number;
  user: {
    id: number;
    username: string;
    email: string;
    full_name: string;
  };
  name: string;
  logo?: string;
  description?: string;
  sector: string;
  founded: string;
  website?: string;
  location: string;
  linkedin?: string;
  twitter?: string;
  facebook?: string;
  products: Array<{title: string, desc: string}>;
  ceo_name?: string;
  ceo_image?: string;
  ceo_bio?: string;
  status: string;
  admin_notes?: string;
  created_at: string;
  updated_at: string;
  is_edit_request?: boolean;
  edit_changes_summary?: string;
}

export const CompanyRequests = () => {
  const [requests, setRequests] = useState<AdminCompanyRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<AdminCompanyRequest | null>(null);
  const [reviewDialog, setReviewDialog] = useState({
    open: false,
    action: 'approve' as 'approve' | 'reject',
    remarks: '',
    requestId: 0,
  });
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
  const [searchParams, setSearchParams] = useSearchParams();
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab === "edit") {
      setTabValue(1);
    } else {
      setTabValue(0);
    }
  }, [searchParams]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    setSearchParams(newValue === 1 ? { tab: "edit" } : {});
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await userService.getCompanyRequestsAdmin();
      setRequests(response.company_requests as unknown as AdminCompanyRequest[]);
    } catch (error) {
      console.error("Failed to fetch company requests:", error);
      toast.error("Failed to load company requests");
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async () => {
    if (!reviewDialog.requestId) return;

    try {
      const response = await userService.reviewCompanyRequest(
        reviewDialog.requestId,
        reviewDialog.action,
        reviewDialog.remarks
      );

      toast.success(response.message);
      setReviewDialog({ open: false, action: 'approve', remarks: '', requestId: 0 });
      fetchRequests(); // Refresh the list
    } catch (error) {
      console.error("Failed to review request:", error);
      toast.error("Failed to process request");
    }
  };

  const openReviewDialog = (request: AdminCompanyRequest, action: 'approve' | 'reject') => {
    setReviewDialog({
      open: true,
      action,
      remarks: '',
      requestId: request.id,
    });
  };

  const toggleRowExpansion = (requestId: number) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(requestId)) {
      newExpanded.delete(requestId);
    } else {
      newExpanded.add(requestId);
    }
    setExpandedRows(newExpanded);
  };

  const filteredRequests = requests.filter(req => {
    if (tabValue === 0) return !req.is_edit_request;
    if (tabValue === 1) return req.is_edit_request;
    return true;
  });

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "400px",
        }}
      >
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, pt: 16 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography
          variant="h4"
          sx={{
            fontFamily: "Poppins, sans-serif",
            fontWeight: 700,
            color: "hsl(var(--primary))",
          }}
        >
          {tabValue === 0 ? "Company Portfolio Requests" : "Company Edit Requests"}
        </Typography>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="company requests tabs">
          <Tab 
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Business fontSize="small" />
                New Requests
                <Badge 
                  badgeContent={requests.filter(r => !r.is_edit_request && r.status === 'submitted').length} 
                  color="primary"
                  sx={{ ml: 1 }}
                />
              </Box>
            } 
            sx={{ fontFamily: "Poppins, sans-serif", textTransform: "none", fontWeight: 600 }}
          />
          <Tab 
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <FileEdit fontSize="small" />
                Edit Requests
                <Badge 
                  badgeContent={requests.filter(r => r.is_edit_request && r.status === 'submitted').length} 
                  color="warning"
                  sx={{ ml: 1 }}
                />
              </Box>
            } 
            sx={{ fontFamily: "Poppins, sans-serif", textTransform: "none", fontWeight: 600 }}
          />
        </Tabs>
      </Box>

      <Paper
        sx={{
          backgroundColor: "hsl(var(--card))",
          border: "1px solid hsl(var(--border))",
          borderRadius: "var(--radius)",
        }}
      >
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontFamily: "Poppins, sans-serif", fontWeight: 600 }}>
                  Company Details
                </TableCell>
                <TableCell sx={{ fontFamily: "Poppins, sans-serif", fontWeight: 600 }}>
                  User
                </TableCell>
                <TableCell sx={{ fontFamily: "Poppins, sans-serif", fontWeight: 600 }}>
                  Submitted
                </TableCell>
                <TableCell sx={{ fontFamily: "Poppins, sans-serif", fontWeight: 600 }}>
                  Status
                </TableCell>
                <TableCell sx={{ fontFamily: "Poppins, sans-serif", fontWeight: 600 }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRequests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} sx={{ textAlign: "center", py: 6 }}>
                    <Typography sx={{ fontFamily: "Poppins, sans-serif", color: "hsl(var(--muted-foreground))" }}>
                      No {tabValue === 0 ? "new" : "edit"} requests found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredRequests.map((request) => (
                  <>
                    <TableRow key={request.id} hover>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                          {request.logo && (
                            <Avatar
                              src={request.logo}
                              sx={{ width: 40, height: 40 }}
                            >
                              <Business />
                            </Avatar>
                          )}
                          <Box>
                            <Typography
                              sx={{
                                fontFamily: "Poppins, sans-serif",
                                fontWeight: 600,
                                color: "hsl(var(--foreground))"
                              }}
                            >
                              {request.name}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{
                                fontFamily: "Poppins, sans-serif",
                                color: "hsl(var(--muted-foreground))"
                              }}
                            >
                              {request.sector} • {request.founded}
                            </Typography>
                          </Box>
                          <IconButton
                            size="small"
                            onClick={() => toggleRowExpansion(request.id)}
                          >
                            {expandedRows.has(request.id) ? <ExpandLess /> : <ExpandMore />}
                          </IconButton>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography
                            sx={{
                              fontFamily: "Poppins, sans-serif",
                              fontWeight: 500,
                              color: "hsl(var(--foreground))"
                            }}
                          >
                            {request.user.full_name || request.user.username}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              fontFamily: "Poppins, sans-serif",
                              color: "hsl(var(--muted-foreground))"
                            }}
                          >
                            {request.user.email}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography
                          sx={{
                            fontFamily: "Poppins, sans-serif",
                            color: "hsl(var(--muted-foreground))"
                          }}
                        >
                          {new Date(request.created_at).toLocaleDateString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label="Submitted"
                          color="warning"
                          sx={{ fontFamily: "Poppins, sans-serif" }}
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", gap: 1 }}>
                          <Button
                            size="small"
                            variant="contained"
                            color="success"
                            startIcon={<CheckCircle />}
                            onClick={() => openReviewDialog(request, 'approve')}
                            sx={{ fontFamily: "Poppins, sans-serif" }}
                          >
                            Approve
                          </Button>
                          <Button
                            size="small"
                            variant="outlined"
                            color="error"
                            startIcon={<Cancel />}
                            onClick={() => openReviewDialog(request, 'reject')}
                            sx={{ fontFamily: "Poppins, sans-serif" }}
                          >
                            Reject
                          </Button>
                        </Box>
                      </TableCell>
                    </TableRow>

                    {/* Expanded Details Row */}
                    <TableRow>
                      <TableCell colSpan={5} sx={{ py: 0 }}>
                        <Collapse in={expandedRows.has(request.id)} timeout="auto" unmountOnExit>
                            <Box sx={{ p: 3, backgroundColor: "hsl(var(--muted) / 0.3)", borderRadius: "var(--radius)" }}>
                              
                              {/* Header Section */}
                              <Box sx={{ display: "flex", alignItems: "center", gap: 3, mb: 4 }}>
                                <Avatar
                                  src={request.logo}
                                  sx={{
                                    width: 80,
                                    height: 80,
                                    border: "2px solid hsl(var(--border))",
                                    backgroundColor: "hsl(var(--background))"
                                  }}
                                  variant="rounded"
                                >
                                  <Business sx={{ fontSize: "2.5rem", color: "hsl(var(--muted-foreground))" }} />
                                </Avatar>
                                <Box>
                                  <Typography variant="h5" sx={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, color: "hsl(var(--foreground))" }}>
                                    {request.name}
                                  </Typography>
                                  <Chip 
                                    label={request.sector} 
                                    size="small" 
                                    sx={{ mt: 0.5, fontWeight: 500, backgroundColor: "hsl(var(--background))", border: "1px solid hsl(var(--border))" }} 
                                  />
                                </Box>
                              </Box>

                              {/* Edit Requirements Summary */}
                              {request.is_edit_request && request.edit_changes_summary && (
                                <Box sx={{ mb: 4, p: 2, backgroundColor: "hsl(var(--warning) / 0.1)", border: "1px solid hsl(var(--warning) / 0.5)", borderRadius: "var(--radius)" }}>
                                  <Typography variant="subtitle2" sx={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, color: "hsl(var(--warning))", mb: 1, display: "flex", alignItems: "center", gap: 1 }}>
                                    <FileEdit size={18} /> Proposed Changes Summary
                                  </Typography>
                                  <Typography variant="body2" sx={{ fontFamily: "Poppins, sans-serif", color: "hsl(var(--foreground))", whiteSpace: "pre-line" }}>
                                    {request.edit_changes_summary}
                                  </Typography>
                                </Box>
                              )}

                              <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "2fr 1fr" }, gap: 3 }}>
                                
                                {/* Left Column */}
                                <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                                  
                                  {/* Description */}
                                  <Card sx={{ border: "1px solid hsl(var(--border))", boxShadow: "none" }}>
                                    <CardContent sx={{ p: 2.5 }}>
                                      <Typography variant="subtitle1" sx={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, mb: 1.5, display: "flex", alignItems: "center", gap: 1 }}>
                                        <Description sx={{ fontSize: 20 }} /> Description
                                      </Typography>
                                      <Typography variant="body2" sx={{ fontFamily: "Poppins, sans-serif", lineHeight: 1.6, color: "hsl(var(--muted-foreground))" }}>
                                        {request.description || "No description provided."}
                                      </Typography>
                                    </CardContent>
                                  </Card>

                                  {/* Products */}
                                  <Card sx={{ border: "1px solid hsl(var(--border))", boxShadow: "none" }}>
                                    <CardContent sx={{ p: 2.5 }}>
                                      <Typography variant="subtitle1" sx={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
                                        <Image sx={{ fontSize: 20 }} /> Products & Services
                                      </Typography>
                                      {request.products && request.products.length > 0 ? (
                                        <Box sx={{ display: "grid", gap: 2 }}>
                                          {request.products.map((product, index) => (
                                            <Box 
                                              key={index} 
                                              sx={{ 
                                                p: 2, 
                                                borderRadius: 2, 
                                                backgroundColor: "hsl(var(--muted) / 0.5)",
                                                border: "1px solid hsl(var(--border))"
                                              }}
                                            >
                                              <Typography variant="subtitle2" sx={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, color: "hsl(var(--primary))", mb: 0.5 }}>
                                                {product.title}
                                              </Typography>
                                              <Typography variant="caption" sx={{ fontFamily: "Poppins, sans-serif", color: "hsl(var(--muted-foreground))", fontSize: "0.8rem" }}>
                                                {product.desc}
                                              </Typography>
                                            </Box>
                                          ))}
                                        </Box>
                                      ) : (
                                        <Typography variant="caption" sx={{ color: "hsl(var(--muted-foreground))", fontStyle: "italic" }}>
                                          No products listed.
                                        </Typography>
                                      )}
                                    </CardContent>
                                  </Card>
                                </Box>

                                {/* Right Column */}
                                <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                                  
                                  {/* Overview */}
                                  <Card sx={{ border: "1px solid hsl(var(--border))", boxShadow: "none" }}>
                                    <CardContent sx={{ p: 2.5 }}>
                                      <Typography variant="subtitle1" sx={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, mb: 2 }}>
                                        Overview
                                      </Typography>
                                      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                                        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                          <Typography variant="caption" sx={{ color: "hsl(var(--muted-foreground))" }}>Founded</Typography>
                                          <Typography variant="caption" sx={{ fontWeight: 600 }}>{request.founded}</Typography>
                                        </Box>
                                        <Divider />
                                        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                          <Typography variant="caption" sx={{ color: "hsl(var(--muted-foreground))" }}>Location</Typography>
                                          <Typography variant="caption" sx={{ fontWeight: 600 }}>{request.location}</Typography>
                                        </Box>
                                      </Box>
                                    </CardContent>
                                  </Card>

                                  {/* CEO */}
                                  {(request.ceo_name || request.ceo_image) && (
                                    <Card sx={{ border: "1px solid hsl(var(--border))", boxShadow: "none" }}>
                                      <CardContent sx={{ p: 2.5 }}>
                                        <Typography variant="subtitle1" sx={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, mb: 2 }}>
                                          Leadership
                                        </Typography>
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
                                          <Avatar src={request.ceo_image} sx={{ width: 48, height: 48 }}>
                                            <Person />
                                          </Avatar>
                                          <Box>
                                            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{request.ceo_name || "CEO"}</Typography>
                                            <Typography variant="caption" sx={{ color: "hsl(var(--muted-foreground))" }}>CEO</Typography>
                                          </Box>
                                        </Box>
                                        {request.ceo_bio && (
                                          <Typography variant="caption" sx={{ display: "block", mt: 1, color: "hsl(var(--muted-foreground))", lineHeight: 1.5 }}>
                                            {request.ceo_bio}
                                          </Typography>
                                        )}
                                      </CardContent>
                                    </Card>
                                  )}

                                  {/* Contact */}
                                  <Card sx={{ border: "1px solid hsl(var(--border))", boxShadow: "none" }}>
                                    <CardContent sx={{ p: 2.5 }}>
                                      <Typography variant="subtitle1" sx={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, mb: 2 }}>
                                        Contact
                                      </Typography>
                                      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                                        {request.website && (
                                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                            <Language sx={{ fontSize: 16, color: "hsl(var(--muted-foreground))" }} />
                                            <Typography 
                                              component="a" 
                                              href={request.website} 
                                              target="_blank" 
                                              variant="caption" 
                                              sx={{ color: "hsl(var(--primary))", textDecoration: "none", "&:hover": { textDecoration: "underline" } }}
                                            >
                                              Website
                                            </Typography>
                                          </Box>
                                        )}
                                        {/* Add other social links similarly if needed */}
                                      </Box>
                                    </CardContent>
                                  </Card>

                                </Box>
                              </Box>
                            </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Review Dialog */}
      <Dialog
        open={reviewDialog.open}
        onClose={() => setReviewDialog({ open: false, action: 'approve', remarks: '', requestId: 0 })}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: "hsl(var(--card))",
            color: "hsl(var(--foreground))",
            borderRadius: "var(--radius)",
            border: "1px solid hsl(var(--border))",
          },
        }}
      >
        <DialogTitle
          sx={{
            fontFamily: "Poppins, sans-serif",
            fontWeight: 600,
            color: reviewDialog.action === 'approve' ? 'hsl(var(--primary))' : 'hsl(var(--destructive))',
          }}
        >
          {reviewDialog.action === 'approve' ? 'Approve' : 'Reject'} Company Request
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ mb: 2, fontFamily: "Poppins, sans-serif" }}>
            {reviewDialog.action === 'approve'
              ? 'Are you sure you want to approve this company request? It will be added to the portfolio.'
              : 'Please provide a reason for rejecting this company request.'
            }
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            label={reviewDialog.action === 'approve' ? 'Approval Notes (Optional)' : 'Rejection Reason (Required)'}
            value={reviewDialog.remarks}
            onChange={(e) => setReviewDialog({ ...reviewDialog, remarks: e.target.value })}
            required={reviewDialog.action === 'reject'}
            sx={{ fontFamily: "Poppins, sans-serif" }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button
            onClick={() => setReviewDialog({ open: false, action: 'approve', remarks: '', requestId: 0 })}
            sx={{ color: "hsl(var(--muted-foreground))", fontFamily: "Poppins, sans-serif" }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleReview}
            variant="contained"
            color={reviewDialog.action === 'approve' ? 'success' : 'error'}
            disabled={reviewDialog.action === 'reject' && !reviewDialog.remarks.trim()}
            sx={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 600,
            }}
          >
            {reviewDialog.action === 'approve' ? 'Approve' : 'Reject'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
