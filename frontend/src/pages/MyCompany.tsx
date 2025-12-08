import { Paper, Typography, Box, Button, Avatar, TextField, Chip, Dialog, DialogTitle, DialogContent, DialogActions, Divider, IconButton, Card, CardContent } from "@mui/material";
import { Business, Edit, Send, Language, Person, Description, Image, ArrowBack, CloudUpload, Add, Delete } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import userService from "../api/userService";
import { uploadToCloudinary } from "../utils/uploadToCloudinary";
import { ResizeModal } from "../components/ResizeModal";

export const MyCompany = () => {
  const navigate = useNavigate();
  const [company, setCompany] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRequestingEdit, setIsRequestingEdit] = useState(false);
  const [isEditingDraft, setIsEditingDraft] = useState(false);
  const [editChangesSummary, setEditChangesSummary] = useState("");

  // Edited company data
  const [editedCompanyData, setEditedCompanyData] = useState({
    name: "",
    logo: "",
    description: "",
    sector: "",
    founded: "",
    website: "",
    location: "",
    linkedin: "",
    twitter: "",
    facebook: "",
    ceo_name: "",
    ceo_image: "",
    ceo_bio: "",
    products: []
  });

  // User remarks
  const [userRemarks, setUserRemarks] = useState("");

  // Image upload states
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [isUploadingCeoImage, setIsUploadingCeoImage] = useState(false);

  // Refs for file inputs
  const logoInputRef = useRef<HTMLInputElement>(null);
  const ceoImageInputRef = useRef<HTMLInputElement>(null);

  // File objects for deferred upload
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [ceoImageFile, setCeoImageFile] = useState<File | null>(null);

  // Resize Modal State
  const [resizeModal, setResizeModal] = useState({
    open: false,
    image: "",
    target: "" as "logo" | "ceo",
  });

  // Confirmation dialogs
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    title: "",
    message: "",
    action: "",
    onConfirm: () => { }
  });

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('user_token');
    const adminToken = localStorage.getItem('admin_token');

    if (adminToken) {
      // Redirect admin users
      navigate('/admin');
      return;
    }

    if (!token) {
      navigate('/auth');
      return;
    }

    fetchCompanyData();
  }, [navigate]);

  const fetchCompanyData = async () => {
    try {
      setIsLoading(true);
      const response = await userService.getCompanyRequest();

      if (response.company_request) {
        setCompany(response.company_request);

        // Initialize edited data if approved OR if it's a draft/rejected request we might want to edit
        const req = response.company_request;
        setEditedCompanyData({
          name: req.name || "",
          logo: req.logo || "",
          description: req.description || "",
          sector: req.sector || "",
          founded: req.founded || "",
          website: req.website || "",
          location: req.location || "",
          linkedin: req.linkedin || "",
          twitter: req.twitter || "",
          facebook: req.facebook || "",
          ceo_name: req.ceo_name || "",
          ceo_image: req.ceo_image || "",
          ceo_bio: req.ceo_bio || "",
          products: req.products || []
        });

        // If it's a draft or rejected, we automatically enter edit mode if the user clicks "Edit"
        // But for now, we just load the data.
      } else {
        // No company request found
        setCompany(null);
        // Initialize empty data for new request
        setEditedCompanyData({
          name: "",
          logo: "",
          description: "",
          sector: "",
          founded: "",
          website: "",
          location: "",
          linkedin: "",
          twitter: "",
          facebook: "",
          ceo_name: "",
          ceo_image: "",
          ceo_bio: "",
          products: []
        });
      }
    } catch (error) {
      console.error("Failed to fetch company data:", error);
      toast.error("Failed to load company information");
      navigate('/user/dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle file selection and open resize modal
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>, target: "logo" | "ceo") => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setResizeModal({
          open: true,
          image: reader.result as string,
          target,
        });
      };
      reader.readAsDataURL(file);
    }
    // Reset input so same file can be selected again
    event.target.value = "";
  };

  // Handle saving cropped image from modal
  const handleResizeSave = (croppedFile: File) => {
    const previewUrl = URL.createObjectURL(croppedFile);

    if (resizeModal.target === "logo") {
      setLogoFile(croppedFile);
      setEditedCompanyData((prev) => ({ ...prev, logo: previewUrl }));
    } else {
      setCeoImageFile(croppedFile);
      setEditedCompanyData((prev) => ({ ...prev, ceo_image: previewUrl }));
    }

    setResizeModal({ open: false, image: "", target: "logo" });
  };

  // Generate change summary
  const generateChangeSummary = () => {
    const changes: string[] = [];

    if (editedCompanyData.name !== (company?.name || "")) {
      changes.push(`Company name changed from "${company?.name || "N/A"}" to "${editedCompanyData.name}"`);
    }
    if (editedCompanyData.logo !== (company?.logo || "")) {
      changes.push("Company logo updated");
    }
    if (editedCompanyData.description !== (company?.description || "")) {
      changes.push("Company description updated");
    }
    if (editedCompanyData.sector !== (company?.sector || "")) {
      changes.push(`Sector changed from "${company?.sector || "N/A"}" to "${editedCompanyData.sector}"`);
    }
    if (editedCompanyData.founded !== (company?.founded || "")) {
      changes.push(`Founded year changed from "${company?.founded || "N/A"}" to "${editedCompanyData.founded}"`);
    }
    if (editedCompanyData.website !== (company?.website || "")) {
      changes.push(`Website changed from "${company?.website || "N/A"}" to "${editedCompanyData.website}"`);
    }
    if (editedCompanyData.location !== (company?.location || "")) {
      changes.push(`Location changed from "${company?.location || "N/A"}" to "${editedCompanyData.location}"`);
    }
    if (editedCompanyData.linkedin !== (company?.linkedin || "")) {
      changes.push("LinkedIn updated");
    }
    if (editedCompanyData.twitter !== (company?.twitter || "")) {
      changes.push("Twitter updated");
    }
    if (editedCompanyData.facebook !== (company?.facebook || "")) {
      changes.push("Facebook updated");
    }
    if (editedCompanyData.ceo_name !== (company?.ceo_name || "")) {
      changes.push(`CEO name changed from "${company?.ceo_name || "N/A"}" to "${editedCompanyData.ceo_name}"`);
    }
    if (editedCompanyData.ceo_image !== (company?.ceo_image || "")) {
      changes.push("CEO image updated");
    }
    if (editedCompanyData.ceo_bio !== (company?.ceo_bio || "")) {
      changes.push("CEO bio updated");
    }

    // Check products changes
    const originalProducts = company?.products || [];
    const editedProducts = editedCompanyData.products || [];
    if (originalProducts.length !== editedProducts.length) {
      changes.push(`Products/Services updated (${editedProducts.length} items)`);
    } else {
      // Check if product details changed
      const productsChanged = originalProducts.some((orig: any, index: number) => {
        const edited = editedProducts[index];
        return !edited || orig.title !== edited.title || orig.desc !== edited.desc;
      });
      if (productsChanged) {
        changes.push("Products/Services details updated");
      }
    }

    return changes.length > 0 ? changes.join("\n• ") : "No changes detected";
  };

  const handleSubmitEditRequest = () => {
    // Generate the change summary
    const changeSummary = generateChangeSummary();

    // Combine auto-generated summary with user remarks
    const fullSummary = changeSummary +
      (userRemarks.trim() ? `\n\nUser Remarks: ${userRemarks.trim()}` : "");

    setConfirmDialog({
      open: true,
      title: "Submit Edit Request",
      message: "Are you sure you want to submit this edit request for admin review? You will be notified once it's reviewed.",
      action: "Submit",
      onConfirm: async () => {
        try {
          setIsLoading(true); // Show loading state

          let finalLogoUrl = editedCompanyData.logo;
          let finalCeoImageUrl = editedCompanyData.ceo_image;

          // Upload Logo if changed
          if (logoFile) {
            try {
              finalLogoUrl = await uploadToCloudinary(logoFile, "TCETBI/CompanyLogos");
            } catch (error) {
              console.error("Logo upload failed:", error);
              toast.error("Failed to upload logo");
              setIsLoading(false);
              return;
            }
          }

          // Upload CEO Image if changed
          if (ceoImageFile) {
            try {
              finalCeoImageUrl = await uploadToCloudinary(ceoImageFile, "TCETBI/CEOImages");
            } catch (error) {
              console.error("CEO image upload failed:", error);
              toast.error("Failed to upload CEO image");
              setIsLoading(false);
              return;
            }
          }

          // Submit with final URLs
          await userService.submitCompanyEditRequest({
            ...editedCompanyData,
            logo: finalLogoUrl,
            ceo_image: finalCeoImageUrl,
            edit_changes_summary: fullSummary
          });

          setIsRequestingEdit(false);
          setUserRemarks("");
          setLogoFile(null);
          setCeoImageFile(null);
          toast.success("Edit request submitted for review!");

          // Refresh data
          fetchCompanyData();
        } catch (error: any) {
          console.error("Failed to submit edit request:", error);
          toast.error(error?.response?.data?.error || "Failed to submit edit request");
        } finally {
          setIsLoading(false);
        }
      }
    });
  };

  const handleSaveDraft = async (submitAfterSave = false) => {
    try {
      setIsLoading(true);

      let finalLogoUrl = editedCompanyData.logo;
      let finalCeoImageUrl = editedCompanyData.ceo_image;

      // Upload Logo if changed
      if (logoFile) {
        try {
          finalLogoUrl = await uploadToCloudinary(logoFile, "TCETBI/CompanyLogos");
          // Update state so we don't re-upload if they save again without changing
          setLogoFile(null);
          setEditedCompanyData(prev => ({ ...prev, logo: finalLogoUrl }));
        } catch (error) {
          console.error("Logo upload failed:", error);
          toast.error("Failed to upload logo");
          setIsLoading(false);
          return;
        }
      }

      // Upload CEO Image if changed
      if (ceoImageFile) {
        try {
          finalCeoImageUrl = await uploadToCloudinary(ceoImageFile, "TCETBI/CEOImages");
          setCeoImageFile(null);
          setEditedCompanyData(prev => ({ ...prev, ceo_image: finalCeoImageUrl }));
        } catch (error) {
          console.error("CEO image upload failed:", error);
          toast.error("Failed to upload CEO image");
          setIsLoading(false);
          return;
        }
      }

      // Save Draft
      await userService.updateCompanyRequest({
        ...editedCompanyData,
        logo: finalLogoUrl,
        ceo_image: finalCeoImageUrl
      });

      if (submitAfterSave) {
        await userService.submitCompanyRequest();
        toast.success("Company request submitted successfully!");
        setIsEditingDraft(false);
        fetchCompanyData();
      } else {
        toast.success("Draft saved successfully!");
      }
    } catch (error: any) {
      console.error("Failed to save/submit request:", error);
      toast.error(error?.response?.data?.error || "Failed to save request");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitNewRequest = () => {
    setConfirmDialog({
      open: true,
      title: "Submit Company Request",
      message: "Are you sure you want to submit your company details? You won't be able to edit them while under review.",
      action: "Submit",
      onConfirm: () => handleSaveDraft(true)
    });
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor: "hsl(var(--background))",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          pt: 12,
        }}
      >
        <Typography>Loading your company information...</Typography>
      </Box>
    );
  }

  if (!isEditingDraft && (!company || company.status !== 'approved')) {
    // Show landing/status page if not approved and not currently editing
    return (
      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor: "hsl(var(--background))",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          pt: 12,
          px: 4
        }}
      >
        <Paper
          sx={{
            p: 4,
            maxWidth: "600px",
            width: "100%",
            textAlign: "center",
            border: "1px solid hsl(var(--border))",
            borderRadius: "var(--radius)",
            backgroundColor: "hsl(var(--card))"
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 700,
              color: "hsl(var(--foreground))",
              mb: 2
            }}
          >
            {!company ? "Create Company Portfolio" :
              company.status === 'draft' ? "Draft Saved" :
                company.status === 'rejected' ? "Request Rejected" :
                  "Application Under Review"}
          </Typography>

          <Typography
            variant="body1"
            sx={{
              fontFamily: "Poppins, sans-serif",
              color: "hsl(var(--muted-foreground))",
              mb: 4
            }}
          >
            {!company
              ? "You haven't created a company portfolio request yet. Create one to be featured on our portfolio page."
              : company.status === 'pending' || company.status === 'submitted'
                ? "Your company portfolio is currently under review by the admin. You will be notified once it is approved."
                : company.status === 'rejected'
                  ? `Your request was rejected. Reason: ${company.admin_notes || "No reason provided."}`
                  : "You have a saved draft. Continue editing to submit your request."
            }
          </Typography>

          <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
            <Button
              variant="outlined"
              onClick={() => navigate('/user/dashboard')}
              sx={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 600
              }}
            >
              Back to Dashboard
            </Button>

            {(!company || company.status === 'draft' || company.status === 'rejected') && (
              <Button
                variant="contained"
                onClick={() => setIsEditingDraft(true)}
                startIcon={!company ? <Add /> : <Edit />}
                sx={{
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 600
                }}
              >
                {!company ? "Create Profile" : "Edit & Resubmit"}
              </Button>
            )}
          </Box>
        </Paper>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "hsl(var(--background))",
        pt: 16,
        px: 4,
        pb: 4,
      }}
    >
      <Box
        sx={{
          maxWidth: "1000px",
          mx: "auto",
        }}
      >
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate('/user/dashboard')}
            sx={{
              mb: 3,
              fontFamily: "Poppins, sans-serif",
            }}
          >
            Back to Dashboard
          </Button>

          <Typography
            variant="h3"
            sx={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 700,
              color: "hsl(var(--primary))",
              mb: 2,
            }}
          >
            My Company
          </Typography>
          <Typography
            sx={{
              fontFamily: "Poppins, sans-serif",
              color: "hsl(var(--muted-foreground))",
              fontSize: "18px",
              mb: 3,
            }}
          >
            View how your company appears on the TCE-TBI portfolio page
          </Typography>

          <Chip
            label="Approved & Live on Portfolio"
            color="success"
            sx={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 600,
              fontSize: "14px",
              px: 2,
              py: 1,
            }}
          />
        </Box>

        {/* Company Display - Redesigned */}
        {company && company.status === 'approved' && (
          <Box sx={{ mb: 6 }}>
            {/* Hero Section */}
            <Box
              sx={{
                position: "relative",
                height: "200px",
                background: "linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--primary) / 0.6) 100%)",
                borderRadius: "var(--radius) var(--radius) 0 0",
                mb: 8
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  bottom: -40,
                  left: 40,
                  display: "flex",
                  alignItems: "end",
                  gap: 3
                }}
              >
                <Avatar
                  src={company.logo}
                  sx={{
                    width: 140,
                    height: 140,
                    border: "4px solid hsl(var(--background))",
                    backgroundColor: "hsl(var(--background))",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                  }}
                  variant="rounded"
                >
                  <Business sx={{ fontSize: "4rem", color: "hsl(var(--muted-foreground))" }} />
                </Avatar>
                <Box sx={{ mb: 1 }}>
                  <Typography
                    variant="h3"
                    sx={{
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: 700,
                      color: "hsl(var(--foreground))",
                      textShadow: "0 2px 4px rgba(0,0,0,0.1)"
                    }}
                  >
                    {company.name}
                  </Typography>
                  <Chip
                    label={company.sector || "Sector N/A"}
                    size="small"
                    sx={{
                      mt: 1,
                      backgroundColor: "hsl(var(--background))",
                      fontWeight: 600
                    }}
                  />
                </Box>
              </Box>
            </Box>

            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "2fr 1fr" }, gap: 4 }}>

              {/* Left Column: Main Content */}
              <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>

                {/* Description */}
                <Card sx={{ border: "1px solid hsl(var(--border))", boxShadow: "none" }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" sx={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
                      <Description sx={{ fontSize: 20 }} /> About the Company
                    </Typography>
                    <Typography variant="body1" sx={{ fontFamily: "Poppins, sans-serif", lineHeight: 1.7, color: "hsl(var(--muted-foreground))" }}>
                      {company.description || "No description provided."}
                    </Typography>
                  </CardContent>
                </Card>

                {/* Products & Services */}
                <Card sx={{ border: "1px solid hsl(var(--border))", boxShadow: "none" }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" sx={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, mb: 3, display: "flex", alignItems: "center", gap: 1 }}>
                      <Image sx={{ fontSize: 20 }} /> Products & Services
                    </Typography>

                    {company.products && company.products.length > 0 ? (
                      <Box sx={{ display: "grid", gap: 3 }}>
                        {company.products.map((product: any, index: number) => (
                          <Box
                            key={index}
                            sx={{
                              p: 2,
                              borderRadius: 2,
                              backgroundColor: "hsl(var(--muted) / 0.5)",
                              border: "1px solid hsl(var(--border))"
                            }}
                          >
                            <Typography variant="subtitle1" sx={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, color: "hsl(var(--primary))", mb: 1 }}>
                              {product.title}
                            </Typography>
                            <Typography variant="body2" sx={{ fontFamily: "Poppins, sans-serif", color: "hsl(var(--muted-foreground))" }}>
                              {product.desc}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    ) : (
                      <Typography variant="body2" sx={{ color: "hsl(var(--muted-foreground))", fontStyle: "italic" }}>
                        No products listed.
                      </Typography>
                    )}
                  </CardContent>
                </Card>

              </Box>

              {/* Right Column: Sidebar Info */}
              <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>

                {/* Company Details */}
                <Card sx={{ border: "1px solid hsl(var(--border))", boxShadow: "none" }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" sx={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, mb: 3 }}>
                      Overview
                    </Typography>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Typography variant="body2" sx={{ color: "hsl(var(--muted-foreground))" }}>Founded</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>{company.founded || "N/A"}</Typography>
                      </Box>
                      <Divider />
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Typography variant="body2" sx={{ color: "hsl(var(--muted-foreground))" }}>Location</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>{company.location || "N/A"}</Typography>
                      </Box>
                      <Divider />
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Typography variant="body2" sx={{ color: "hsl(var(--muted-foreground))" }}>Stage</Typography>
                        <Chip label="Incubated" size="small" color="primary" variant="outlined" />
                      </Box>
                    </Box>
                  </CardContent>
                </Card>

                {/* CEO Profile */}
                <Card sx={{ border: "1px solid hsl(var(--border))", boxShadow: "none" }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" sx={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, mb: 3 }}>
                      Leadership
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                      <Avatar src={company.ceo_image} sx={{ width: 64, height: 64 }}>
                        <Person />
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{company.ceo_name || "CEO Name"}</Typography>
                        <Typography variant="caption" sx={{ color: "hsl(var(--muted-foreground))" }}>Chief Executive Officer</Typography>
                      </Box>
                    </Box>
                    {company.ceo_bio && (
                      <Typography variant="body2" sx={{ color: "hsl(var(--muted-foreground))", fontSize: "0.875rem", lineHeight: 1.6 }}>
                        {company.ceo_bio}
                      </Typography>
                    )}
                  </CardContent>
                </Card>

                {/* Contact Links */}
                <Card sx={{ border: "1px solid hsl(var(--border))", boxShadow: "none" }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" sx={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, mb: 3 }}>
                      Connect
                    </Typography>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                      {company.website && (
                        <Button
                          variant="outlined"
                          startIcon={<Language />}
                          href={company.website}
                          target="_blank"
                          fullWidth
                          sx={{ justifyContent: "flex-start", textTransform: "none" }}
                        >
                          Website
                        </Button>
                      )}
                      {company.linkedin && (
                        <Button
                          variant="outlined"
                          startIcon={<Box component="span" className="fab fa-linkedin" />}
                          href={company.linkedin}
                          target="_blank"
                          fullWidth
                          sx={{ justifyContent: "flex-start", textTransform: "none" }}
                        >
                          LinkedIn
                        </Button>
                      )}
                      {/* Add other social links if needed */}
                    </Box>
                  </CardContent>
                </Card>

              </Box>
            </Box>
          </Box>
        )}    {/* Edit/Create Request Form */}
        {(isRequestingEdit || isEditingDraft) && (
          <Paper
            sx={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "var(--radius)",
              p: 4,
              mb: 4,
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
              {isEditingDraft ? "Company Profile Details" : "Request Company Edit"}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontFamily: "Poppins, sans-serif",
                color: "hsl(var(--muted-foreground))",
                mb: 3,
              }}
            >
              {isEditingDraft
                ? "Fill in your company details below. You can save as draft or submit for approval."
                : "Edit your company information below. Changes will be automatically detected and submitted for admin approval."
              }
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {/* Basic Information */}
              <Typography variant="subtitle1" sx={{ fontWeight: 600, fontFamily: "Poppins, sans-serif" }}>
                Basic Information
              </Typography>

              <Box sx={{ display: "flex", gap: 3, flexDirection: { xs: "column", md: "row" } }}>
                <TextField
                  fullWidth
                  label="Company Name"
                  value={editedCompanyData.name}
                  onChange={(e) => setEditedCompanyData({ ...editedCompanyData, name: e.target.value })}
                  sx={{ fontFamily: "Poppins, sans-serif" }}
                />
                <TextField
                  fullWidth
                  label="Sector"
                  value={editedCompanyData.sector}
                  onChange={(e) => setEditedCompanyData({ ...editedCompanyData, sector: e.target.value })}
                  sx={{ fontFamily: "Poppins, sans-serif" }}
                />
              </Box>

              {/* Logo Upload Section */}
              <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                <Avatar
                  src={editedCompanyData.logo}
                  variant="rounded"
                  sx={{ width: 64, height: 64, border: "1px solid hsl(var(--border))" }}
                >
                  <Business />
                </Avatar>
                <Box>
                  <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>Company Logo</Typography>
                  <Button
                    variant="outlined"
                    startIcon={<CloudUpload />}
                    onClick={() => logoInputRef.current?.click()}
                    sx={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    Upload Logo
                  </Button>
                </Box>
              </Box>

              <Box sx={{ display: "flex", gap: 3, flexDirection: { xs: "column", md: "row" } }}>
                <TextField
                  fullWidth
                  label="Founded Year"
                  value={editedCompanyData.founded}
                  onChange={(e) => setEditedCompanyData({ ...editedCompanyData, founded: e.target.value })}
                  sx={{ fontFamily: "Poppins, sans-serif" }}
                />
                <TextField
                  fullWidth
                  label="Location"
                  value={editedCompanyData.location}
                  onChange={(e) => setEditedCompanyData({ ...editedCompanyData, location: e.target.value })}
                  sx={{ fontFamily: "Poppins, sans-serif" }}
                />
              </Box>

              <TextField
                fullWidth
                label="Website"
                value={editedCompanyData.website}
                onChange={(e) => setEditedCompanyData({ ...editedCompanyData, website: e.target.value })}
                sx={{ fontFamily: "Poppins, sans-serif" }}
              />

              <Box sx={{ display: "flex", gap: 3, flexDirection: { xs: "column", md: "row" } }}>
                <TextField
                  fullWidth
                  label="LinkedIn"
                  value={editedCompanyData.linkedin}
                  onChange={(e) => setEditedCompanyData({ ...editedCompanyData, linkedin: e.target.value })}
                  sx={{ fontFamily: "Poppins, sans-serif" }}
                />
                <TextField
                  fullWidth
                  label="Twitter"
                  value={editedCompanyData.twitter}
                  onChange={(e) => setEditedCompanyData({ ...editedCompanyData, twitter: e.target.value })}
                  sx={{ fontFamily: "Poppins, sans-serif" }}
                />
                <TextField
                  fullWidth
                  label="Facebook"
                  value={editedCompanyData.facebook}
                  onChange={(e) => setEditedCompanyData({ ...editedCompanyData, facebook: e.target.value })}
                  sx={{ fontFamily: "Poppins, sans-serif" }}
                />
              </Box>

              <TextField
                fullWidth
                multiline
                rows={3}
                label="Description"
                value={editedCompanyData.description}
                onChange={(e) => setEditedCompanyData({ ...editedCompanyData, description: e.target.value })}
                sx={{ fontFamily: "Poppins, sans-serif" }}
              />

              {/* CEO Information */}
              <Typography variant="subtitle1" sx={{ fontWeight: 600, fontFamily: "Poppins, sans-serif", mt: 2 }}>
                CEO Information
              </Typography>

              <TextField
                fullWidth
                label="CEO Name"
                value={editedCompanyData.ceo_name}
                onChange={(e) => setEditedCompanyData({ ...editedCompanyData, ceo_name: e.target.value })}
                sx={{ fontFamily: "Poppins, sans-serif" }}
              />

              {/* CEO Image Upload Section */}
              <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                <Avatar
                  src={editedCompanyData.ceo_image}
                  sx={{ width: 64, height: 64, border: "1px solid hsl(var(--border))" }}
                >
                  <Person />
                </Avatar>
                <Box>
                  <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>CEO Image</Typography>
                  <Button
                    variant="outlined"
                    startIcon={<CloudUpload />}
                    onClick={() => ceoImageInputRef.current?.click()}
                    sx={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    Upload Photo
                  </Button>
                </Box>
              </Box>

              <TextField
                fullWidth
                multiline
                rows={3}
                label="CEO Bio"
                value={editedCompanyData.ceo_bio}
                onChange={(e) => setEditedCompanyData({ ...editedCompanyData, ceo_bio: e.target.value })}
                sx={{ fontFamily: "Poppins, sans-serif" }}
              />

              {/* Products & Services */}
              <Typography variant="subtitle1" sx={{ fontWeight: 600, fontFamily: "Poppins, sans-serif", mt: 2 }}>
                Products & Services
              </Typography>

              {(editedCompanyData.products || []).map((product: any, index: number) => (
                <Box
                  key={index}
                  sx={{
                    mb: 2,
                    border: "1px solid hsl(var(--border))",
                    p: 2,
                    borderRadius: 2,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 1,
                    }}
                  >
                    <Typography variant="body2" fontWeight={600}>
                      Product {index + 1}
                    </Typography>
                    <Button
                      size="small"
                      color="error"
                      onClick={() => {
                        const updated = editedCompanyData.products.filter((_: any, i: number) => i !== index);
                        setEditedCompanyData({ ...editedCompanyData, products: updated });
                      }}
                    >
                      <Delete />
                    </Button>
                  </Box>

                  <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <TextField
                      fullWidth
                      label="Title"
                      value={product.title || ""}
                      onChange={(e) => {
                        const updated = [...editedCompanyData.products];
                        updated[index] = { ...updated[index], title: e.target.value };
                        setEditedCompanyData({ ...editedCompanyData, products: updated });
                      }}
                      sx={{ fontFamily: "Poppins, sans-serif" }}
                    />
                    <TextField
                      fullWidth
                      multiline
                      rows={2}
                      label="Description"
                      value={product.desc || ""}
                      onChange={(e) => {
                        const updated = [...editedCompanyData.products];
                        updated[index] = { ...updated[index], desc: e.target.value };
                        setEditedCompanyData({ ...editedCompanyData, products: updated });
                      }}
                      sx={{ fontFamily: "Poppins, sans-serif" }}
                    />
                  </Box>
                </Box>
              ))}

              <Button
                variant="outlined"
                startIcon={<Add />}
                onClick={() => setEditedCompanyData({
                  ...editedCompanyData,
                  products: [...(editedCompanyData.products || []), { title: "", desc: "" }]
                })}
                sx={{
                  fontFamily: "Poppins, sans-serif",
                  borderColor: "hsl(var(--primary))",
                  color: "hsl(var(--primary))",
                }}
              >
                Add Product
              </Button>

              {/* Change Summary */}
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 600, fontFamily: "Poppins, sans-serif", mb: 2 }}>
                Detected Changes
              </Typography>

              <TextField
                fullWidth
                multiline
                rows={6}
                label="Change Summary (Auto-generated)"
                value={generateChangeSummary()}
                sx={{ fontFamily: "Poppins, sans-serif", mb: 2 }}
                InputProps={{
                  readOnly: true,
                }}
              />

              {/* User Remarks */}
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Additional Remarks (Optional)"
                placeholder="Add any additional context or notes about these changes..."
                value={userRemarks}
                onChange={(e) => setUserRemarks(e.target.value)}
                sx={{ fontFamily: "Poppins, sans-serif", mb: 3 }}
              />

              <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
                <Button
                  variant="outlined"
                  onClick={() => {
                    if (isEditingDraft) {
                      setIsEditingDraft(false);
                      if (!company) navigate('/user/dashboard');
                    } else {
                      setIsRequestingEdit(false);
                      setUserRemarks("");
                      // Reset edited data to original
                      setEditedCompanyData({
                        name: company?.name || "",
                        logo: company?.logo || "",
                        description: company?.description || "",
                        sector: company?.sector || "",
                        founded: company?.founded || "",
                        website: company?.website || "",
                        location: company?.location || "",
                        linkedin: company?.linkedin || "",
                        twitter: company?.twitter || "",
                        facebook: company?.facebook || "",
                        ceo_name: company?.ceo_name || "",
                        ceo_image: company?.ceo_image || "",
                        ceo_bio: company?.ceo_bio || "",
                        products: company?.products || []
                      });
                    }
                  }}
                  sx={{
                    fontFamily: "Poppins, sans-serif",
                  }}
                >
                  Cancel
                </Button>

                {isEditingDraft && (
                  <Button
                    variant="outlined"
                    onClick={() => handleSaveDraft(false)}
                    disabled={isLoading}
                    sx={{
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: 600
                    }}
                  >
                    Save Draft
                  </Button>
                )}

                <Button
                  variant="contained"
                  onClick={isEditingDraft ? handleSubmitNewRequest : handleSubmitEditRequest}
                  disabled={isLoading}
                  sx={{
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 600,
                  }}
                >
                  {isEditingDraft ? "Submit Request" : "Submit Edit Request"}
                </Button>
              </Box>
            </Box>
          </Paper>
        )}

        {/* Action Buttons */}
        {!isRequestingEdit && !isEditingDraft && company && company.status === 'approved' && (
          <Box sx={{ display: "flex", gap: 2, justifyContent: "center", flexWrap: "wrap" }}>
            <Button
              variant="contained"
              startIcon={<Edit />}
              onClick={() => setIsRequestingEdit(true)}
              size="large"
              sx={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 600,
                px: 4,
                py: 1.5,
              }}
            >
              Request Edit
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate('/portfolio')}
              size="large"
              sx={{
                fontFamily: "Poppins, sans-serif",
                px: 4,
                py: 1.5,
              }}
            >
              View Public Portfolio
            </Button>
          </Box>
        )}

        {/* Confirmation Dialog */}
        <Dialog
          open={confirmDialog.open}
          onClose={() => setConfirmDialog({ ...confirmDialog, open: false })}
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
              color: confirmDialog.action === 'Delete' ? 'hsl(0 84.2% 60.2%)' : 'hsl(var(--primary))',
            }}
          >
            {confirmDialog.title}
          </DialogTitle>
          <DialogContent>
            <Typography sx={{ mt: 1, fontFamily: "Poppins, sans-serif" }}>
              {confirmDialog.message}
            </Typography>
          </DialogContent>
          <DialogActions sx={{ px: 3, py: 2 }}>
            <Button
              onClick={() => setConfirmDialog({ ...confirmDialog, open: false })}
              sx={{ color: "hsl(var(--muted-foreground))", fontFamily: "Poppins, sans-serif" }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                confirmDialog.onConfirm();
                setConfirmDialog({ ...confirmDialog, open: false });
              }}
              variant="contained"
              color={confirmDialog.action === 'Delete' ? 'error' : 'primary'}
              sx={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 600,
              }}
            >
              {confirmDialog.action}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Hidden file inputs for image uploads */}
        <input
          type="file"
          ref={logoInputRef}
          onChange={(e) => handleFileSelect(e, "logo")}
          accept="image/*"
          style={{ display: 'none' }}
        />
        <input
          type="file"
          ref={ceoImageInputRef}
          onChange={(e) => handleFileSelect(e, "ceo")}
          accept="image/*"
          style={{ display: 'none' }}
        />

        {/* Resize Modal */}
        <ResizeModal
          open={resizeModal.open}
          image={resizeModal.image}
          onClose={() => setResizeModal({ ...resizeModal, open: false })}
          onSave={handleResizeSave}
        />
      </Box>
    </Box>
  );
};
