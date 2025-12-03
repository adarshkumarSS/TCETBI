import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Grid,
  Paper,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

import { styled } from "@mui/material/styles";
import { CloudUpload, ArrowBack } from "@mui/icons-material";
import { Link,useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ConfirmSubmitModal } from "../components/ConfirmSubmitModal";
import { SubmitLoader } from "./SubmitLoader";
import { submitIncubationApplication } from "../api/incubationService";

const StyledBox = styled(Box)(() => ({
  minHeight: "100vh",
  background: "hsl(var(--background))",
  paddingTop: "80px",
  paddingBottom: "40px",
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  background: "hsl(var(--card))",
  borderRadius: "var(--radius)",
  padding: theme.spacing(3, 6),
  [theme.breakpoints.down("md")]: {
    padding: theme.spacing(3),
  },
  boxShadow: "0 20px 60px rgba(220, 20, 60, 0.15)",
  border: "1px solid hsl(var(--border))",
  margin: "0 auto",
}));

const StyledTextField = styled(TextField)({
  "& .MuiOutlinedInput-root": {
    fontFamily: "Poppins, sans-serif",
    "& fieldset": {
      borderColor: "hsl(var(--border))",
    },
    "&:hover fieldset": {
      borderColor: "hsl(var(--primary))",
    },
    "&.Mui-focused fieldset": {
      borderColor: "hsl(var(--primary))",
    },
  },
  "& .MuiInputLabel-root": {
    fontFamily: "Poppins, sans-serif",
    color: "hsl(var(--muted-foreground))",
    "&.Mui-focused": {
      color: "hsl(var(--primary))",
    },
  },
  "& .MuiInputBase-input": {
    fontFamily: "Poppins, sans-serif",
    color: "hsl(var(--foreground))",
  },
  "& .MuiInputBase-input:-webkit-autofill": {
    WebkitBoxShadow: "0 0 0 1000px hsl(var(--background)) inset",
    WebkitTextFillColor: "hsl(var(--foreground))",
  },
  "& .MuiInputBase-input:-webkit-autofill:hover": {
    WebkitBoxShadow: "0 0 0 1000px hsl(var(--background)) inset",
    WebkitTextFillColor: "hsl(var(--foreground))",
  },
  "& .MuiInputBase-input:-webkit-autofill:focus": {
    WebkitBoxShadow: "0 0 0 1000px hsl(var(--background)) inset",
    WebkitTextFillColor: "hsl(var(--foreground))",
  },
  "& .MuiInputBase-input:-webkit-autofill:active": {
    WebkitBoxShadow: "0 0 0 1000px hsl(var(--background)) inset",
    WebkitTextFillColor: "hsl(var(--foreground))",
  },
});

const PrimaryButton = styled(Button)({
  backgroundColor: "hsl(var(--primary))",
  color: "#fff",
  fontFamily: "Poppins, sans-serif",
  fontWeight: 600,
  padding: "14px 32px",
  borderRadius: "var(--radius)",
  textTransform: "none",
  fontSize: "16px",
  boxShadow: "0 4px 20px rgba(220, 20, 60, 0.3)",
  "&:hover": {
    backgroundColor: "hsl(var(--destructive))",
    boxShadow: "0 6px 30px rgba(220, 20, 60, 0.4)",
    transform: "translateY(-2px)",
  },
  transition: "all 0.3s ease",
});

const UploadBox = styled(Box)({
  fontFamily: "Poppins, sans-serif",
  fontWeight: 500,
  padding: "12px 24px",
  borderRadius: "var(--radius)",
  textTransform: "none",
  border: "1px solid hsl(var(--border))",
  color: "hsl(var(--foreground))",
  backgroundColor: "transparent",
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px",
  width: "100%",
  "&:hover": {
    backgroundColor: "hsl(var(--muted))",
    borderColor: "hsl(var(--primary))",
  },
  transition: "all 0.3s ease",
});

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontFamily: "Poppins, sans-serif",
  fontWeight: 700,
  fontSize: "24px",
  [theme.breakpoints.down("md")]: {
    fontSize: "20px",
  },
  color: "hsl(var(--primary))",
  marginBottom: "24px",
  marginTop: "40px",
  paddingBottom: "12px",
  borderBottom: "2px solid hsl(var(--border))",
}));

const BackButtonRoot = styled(IconButton)({
  color: "hsl(var(--primary))",
  marginBottom: "16px",
  "&:hover": {
    backgroundColor: "rgba(220, 20, 60, 0.1)",
  },
});

const BackButton = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (window.history.length > 1) {
      navigate(-1); // go back in history
    } else {
      navigate("/auth"); // fallback if no history
    }
  };
  return (
    <BackButtonRoot onClick={handleClick}>
      <ArrowBack />
    </BackButtonRoot>
  );
};

export const ApplyIncubation = () => {
  const [profileFile, setProfileFile] = useState<File | null>(null);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    businessName: "",
    salutation: "Mr",
    fullName: "",
    fatherName: "",
    age: "",
    email: "",
    resMobile: "",
    offMobile: "",
    address: "",
    city: "",
    state: "",
    post: "",
    country: "India",
    businessType: "Services",
    businessDescription: "",
    legalEntity: "Proprietorship",
    numChairs: "",
    fullTimeEmployees: "",
    partTimeEmployees: "",
    consultants: "",
    reference1Name: "",
    reference1Mobile: "",
    reference1Email: "",
    reference1Address: "",
    reference2Name: "",
    reference2Mobile: "",
    reference2Email: "",
    reference2Address: "",
    services: {
      chair: false,
      table: false,
      monitor: false,
      telephone: false,
      fax: false,
      webAccess: false,
      conferenceRooms: false,
    },
    declaration: false,
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setProfileFile(file);
    setProfileImage(URL.createObjectURL(file));
  };

  const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      if (file.type !== 'application/pdf') {
        toast.error("Only PDF files are allowed");
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Resume must be less than 2MB");
        return;
      }
      setResumeFile(file);
    }
  };

  // Robust input handler for reference fields to catch paste/autofill
  const handleReferenceChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Multi-event handler for text fields (catches onChange, onPaste, onInput, onBlur)
  const createTextFieldHandlers = (fieldKey: string) => ({
    value: formData[fieldKey as keyof typeof formData] as string,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
      handleReferenceChange(fieldKey, e.target.value),
    onPaste: (e: React.ClipboardEvent<HTMLInputElement>) =>
      // Trigger state update after paste
      setTimeout(() => handleReferenceChange(fieldKey, e.currentTarget.value), 0),
    onInput: (e: React.FormEvent<HTMLInputElement>) =>
      handleReferenceChange(fieldKey, (e.target as HTMLInputElement).value),
    onBlur: (e: React.FocusEvent<HTMLInputElement>) =>
      handleReferenceChange(fieldKey, e.target.value),
  });

  const validateFormData = () => {
    const errors: string[] = [];

    // Business Information
    if (!formData.businessName.trim()) errors.push("Business Name");
    if (!formData.businessDescription.trim()) errors.push("Business Description");

    // Personal Information
    if (!formData.fullName.trim()) errors.push("Full Name");
    if (!formData.fatherName.trim()) errors.push("Father Name");
    if (!formData.age.trim()) errors.push("Age");
    if (!formData.email.trim()) errors.push("Email");
    if (!formData.resMobile.trim()) errors.push("Residential Mobile");
    if (!formData.address.trim()) errors.push("Address");
    if (!formData.city.trim()) errors.push("City");
    if (!formData.state.trim()) errors.push("State");
    if (!formData.post.trim()) errors.push("Post");
    if (!formData.country.trim()) errors.push("Country");

    // References (all fields required for now)
    if (!formData.reference1Name.trim()) errors.push("Reference 1 Name");
    if (!formData.reference1Mobile.trim()) errors.push("Reference 1 Mobile");
    if (!formData.reference1Email.trim()) errors.push("Reference 1 Email");
    if (!formData.reference1Address.trim()) errors.push("Reference 1 Address");

    if (!formData.reference2Name.trim()) errors.push("Reference 2 Name");
    if (!formData.reference2Mobile.trim()) errors.push("Reference 2 Mobile");
    if (!formData.reference2Email.trim()) errors.push("Reference 2 Email");
    if (!formData.reference2Address.trim()) errors.push("Reference 2 Address");

    // Declaration
    if (!formData.declaration) errors.push("Declaration agreement");

    // File Validation
    if (!profileFile && !profileImage) errors.push("Profile Photo");
    if (!resumeFile) errors.push("Resume");

    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form data
    const validationErrors = validateFormData();
    if (validationErrors.length > 0) {
      setValidationErrors(validationErrors);
      setShowValidationModal(true);
      return;
    }

    setConfirmOpen(true);
  };

  const submitRef = useRef(false);
  const actuallySubmit = useCallback(async () => {
    if (submitRef.current || loading) return; // Prevent multiple submissions
    submitRef.current = true;
    setLoading(true);

    console.log("FORM SUBMIT: Single submission initiated");

    const form = new FormData();

    // Attach files
    if (profileFile) form.append("profile_image", profileFile);
    if (resumeFile) form.append("resume", resumeFile);

    // Attach all form fields
    Object.entries(formData).forEach(([key, value]) => {
      if (typeof value === "object") {
        form.append(key, JSON.stringify(value));
      } else {
        form.append(key, value as any);
      }
    });

    try {
      const result = await submitIncubationApplication(form);
      console.log("FORM SUBMIT: Success", result);

      // Show success modal
      setLoading(false); // Remove loading indicator
      setShowSuccessModal(true);
      submitRef.current = false; // Reset for next submission

      return; // Don't execute finally block
    } catch (err) {
      console.error("FORM SUBMIT: Error", err);
      alert(err.error || "Submission failed");
      submitRef.current = false; // Reset on error to allow retry
      setLoading(false);
    }
  }, [loading, profileFile, resumeFile, formData, navigate]);

  return (
    <StyledBox>
      <Container maxWidth="lg" sx={{ py: 2 }}>
        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2, mb: 2 }}>
          <BackButton />
          <Box sx={{ flex: 1 }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Box sx={{ textAlign: "center", mb: 4 }}>
                <Typography
                  variant="h3"
                  sx={{
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 700,
                    color: "hsl(var(--primary))",
                    mb: 2,
                    fontSize: { xs: "2rem", md: "3rem" },
                  }}
                >
                  Application for Incubation Services
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "Poppins, sans-serif",
                    color: "hsl(var(--muted-foreground))",
                    fontSize: { xs: "14px", md: "16px" },
                    mb: 3,
                    lineHeight: 1.6,
                  }}
                >
                  TECHNOLOGY BUSINESS INCUBATOR (TCE-TBI)
                  <br />
                  THIAGARAJAR COLLEGE OF ENGINEERING
                  <br />
                  MADURAI – 625 015
                </Typography>
              </Box>

              <StyledPaper>
                <form onSubmit={handleSubmit}>
                  {/* Profile Picture */}
                  <Box
                    sx={{ display: "flex", justifyContent: "center", mb: 6 }}
                  >
                    <Box sx={{ textAlign: "center" }}>
                      <Avatar
                        src={profileImage || ""}
                        sx={{
                          width: 120,
                          height: 120,
                          mb: 2,
                          border: "3px solid hsl(var(--primary))",
                          mx: "auto",
                        }}
                      />
                      <input
                        accept="image/*"
                        style={{ display: "none" }}
                        id="profile-upload"
                        type="file"
                        onChange={handleImageUpload}
                      />
                      <label htmlFor="profile-upload">
                        <UploadBox sx={{ width: "auto", px: 4 }}>
                          <CloudUpload />
                          Upload Photo
                        </UploadBox>
                      </label>
                    </Box>
                  </Box>

                  {/* Business Information */}
                  <SectionTitle>Business Information</SectionTitle>
                  <Grid container spacing={3} alignItems="flex-end">
                    <Grid size={{ xs: 12, md: 8 }}>
                      <StyledTextField
                        fullWidth
                        label="Name of Business"
                        value={formData.businessName}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            businessName: e.target.value,
                          })
                        }
                        required
                      />
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                      <Typography sx={{ fontStyle: 'italic', color: 'hsl(var(--foreground))', fontSize: '14px', mt: 1 }}>
                        * If business entity has not been formed yet, please indicate the name of the lead entrepreneur
                      </Typography>
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                      <input
                        accept=".pdf"
                        style={{ display: "none" }}
                        id="resume-upload"
                        type="file"
                        onChange={handleResumeUpload}
                      />
                      <label htmlFor="resume-upload">
                        <UploadBox>
                          <CloudUpload />
                          {resumeFile ? resumeFile.name : "Upload Entrepreneur Resume (PDF)"}
                        </UploadBox>
                      </label>
                    </Grid>
                    {resumeFile && (
                      <Grid size={{ xs: 12 }}>
                        <Box sx={{ mt: 2, p: 2, border: '1px solid hsl(var(--border))', borderRadius: '8px', backgroundColor: 'hsl(var(--muted)/0.3)' }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                            <Typography variant="subtitle2" sx={{ fontFamily: 'Poppins, sans-serif' }}>Resume Preview</Typography>
                            <Button 
                              size="small" 
                              color="error" 
                              onClick={() => setResumeFile(null)}
                              sx={{ textTransform: 'none' }}
                            >
                              Remove
                            </Button>
                          </Box>
                          <iframe 
                            src={URL.createObjectURL(resumeFile)} 
                            width="100%" 
                            height="500px" 
                            style={{ border: 'none', borderRadius: '4px', backgroundColor: 'white' }}
                            title="Resume Preview"
                          />
                        </Box>
                      </Grid>
                    )}
                  </Grid>

                  {/* Personal Information */}
                  <SectionTitle>Lead Entrepreneur Details</SectionTitle>
                  <Grid container spacing={3}>
                    <Grid size={{ xs: 12, sm: 3, md: 2 }}>
                      <FormControl fullWidth>
                        <InputLabel
                          sx={{
                            fontFamily: "Poppins, sans-serif",
                            color: "hsl(var(--muted-foreground))",
                            "&.Mui-focused": { color: "hsl(var(--primary))" },
                          }}
                        >
                          Salutation
                        </InputLabel>
                        <Select
                          value={formData.salutation}
                          label="Salutation"
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              salutation: e.target.value,
                            })
                          }
                          sx={{
                            fontFamily: "Poppins, sans-serif",
                            color: "hsl(var(--foreground))",
                            "& .MuiOutlinedInput-notchedOutline": {
                              borderColor: "hsl(var(--border))",
                            },
                            "&:hover .MuiOutlinedInput-notchedOutline": {
                              borderColor: "hsl(var(--primary))",
                            },
                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                              borderColor: "hsl(var(--primary))",
                            },
                          }}
                        >
                          <MenuItem
                            value="Mr"
                            sx={{
                              fontFamily: "Poppins, sans-serif",
                              color: "hsl(var(--foreground))",
                            }}
                          >
                            Mr
                          </MenuItem>
                          <MenuItem
                            value="Mrs"
                            sx={{
                              fontFamily: "Poppins, sans-serif",
                              color: "hsl(var(--foreground))",
                            }}
                          >
                            Mrs
                          </MenuItem>
                          <MenuItem
                            value="Dr"
                            sx={{
                              fontFamily: "Poppins, sans-serif",
                              color: "hsl(var(--foreground))",
                            }}
                          >
                            Dr
                          </MenuItem>
                          <MenuItem
                            value="Prof"
                            sx={{
                              fontFamily: "Poppins, sans-serif",
                              color: "hsl(var(--foreground))",
                            }}
                          >
                            Prof
                          </MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 9, md: 10 }}>
                      <StyledTextField
                        fullWidth
                        label="Full Name"
                        value={formData.fullName}
                        onChange={(e) =>
                          setFormData({ ...formData, fullName: e.target.value })
                        }
                        required
                      />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                      <StyledTextField
                        fullWidth
                        label="Father Name"
                        value={formData.fatherName}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            fatherName: e.target.value,
                          })
                        }
                        required
                      />
                    </Grid>



                    <Grid size={{ xs: 12, sm: 6 }}>
                      <StyledTextField
                        fullWidth
                        label="Age"
                        type="number"
                        value={formData.age}
                        onChange={(e) =>
                          setFormData({ ...formData, age: e.target.value })
                        }
                        required
                      />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                      <StyledTextField
                        fullWidth
                        label="Email"
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        required
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <StyledTextField
                        fullWidth
                        label="Residential Mobile"
                        value={formData.resMobile}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            resMobile: e.target.value,
                          })
                        }
                        required
                      />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                      <StyledTextField
                        fullWidth
                        label="Office Mobile"
                        value={formData.offMobile}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            offMobile: e.target.value,
                          })
                        }
                      />
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                      <StyledTextField
                        fullWidth
                        label="Postal / Residential Address"
                        multiline
                        rows={3}
                        value={formData.address}
                        onChange={(e) =>
                          setFormData({ ...formData, address: e.target.value })
                        }
                        required
                      />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                      <StyledTextField
                        fullWidth
                        label="City"
                        value={formData.city}
                        onChange={(e) =>
                          setFormData({ ...formData, city: e.target.value })
                        }
                        required
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                      <StyledTextField
                        fullWidth
                        label="State"
                        value={formData.state}
                        onChange={(e) =>
                          setFormData({ ...formData, state: e.target.value })
                        }
                        required
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                      <StyledTextField
                        fullWidth
                        label="Post"
                        value={formData.post}
                        onChange={(e) =>
                          setFormData({ ...formData, post: e.target.value })
                        }
                        required
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                      <StyledTextField
                        fullWidth
                        label="Country"
                        value={formData.country}
                        onChange={(e) =>
                          setFormData({ ...formData, country: e.target.value })
                        }
                        required
                      />
                    </Grid>
                  </Grid>

                  {/* About Business */}
                  <SectionTitle>About Business</SectionTitle>
                  <Grid container spacing={3}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <FormControl fullWidth>
                        <InputLabel
                          sx={{
                            fontFamily: "Poppins, sans-serif",
                            color: "hsl(var(--muted-foreground))",
                            "&.Mui-focused": { color: "hsl(var(--primary))" },
                          }}
                        >
                          Type of Business
                        </InputLabel>
                        <Select
                          value={formData.businessType}
                          label="Type of Business"
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              businessType: e.target.value,
                            })
                          }
                          sx={{
                            fontFamily: "Poppins, sans-serif",
                            color: "hsl(var(--foreground))",
                            "& .MuiOutlinedInput-notchedOutline": {
                              borderColor: "hsl(var(--border))",
                            },
                            "&:hover .MuiOutlinedInput-notchedOutline": {
                              borderColor: "hsl(var(--primary))",
                            },
                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                              borderColor: "hsl(var(--primary))",
                            },
                          }}
                        >
                          <MenuItem
                            value="Services"
                            sx={{
                              fontFamily: "Poppins, sans-serif",
                              color: "hsl(var(--foreground))",
                            }}
                          >
                            Services
                          </MenuItem>
                          <MenuItem
                            value="High Technology"
                            sx={{
                              fontFamily: "Poppins, sans-serif",
                              color: "hsl(var(--foreground))",
                            }}
                          >
                            High Technology
                          </MenuItem>
                          <MenuItem
                            value="Other"
                            sx={{
                              fontFamily: "Poppins, sans-serif",
                              color: "hsl(var(--foreground))",
                            }}
                          >
                            Other
                          </MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <FormControl fullWidth>
                        <InputLabel
                          sx={{
                            fontFamily: "Poppins, sans-serif",
                            color: "hsl(var(--muted-foreground))",
                            "&.Mui-focused": { color: "hsl(var(--primary))" },
                          }}
                        >
                          Legal Entity
                        </InputLabel>
                        <Select
                          value={formData.legalEntity}
                          label="Legal Entity"
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              legalEntity: e.target.value,
                            })
                          }
                          sx={{
                            fontFamily: "Poppins, sans-serif",
                            color: "hsl(var(--foreground))",
                            "& .MuiOutlinedInput-notchedOutline": {
                              borderColor: "hsl(var(--border))",
                            },
                            "&:hover .MuiOutlinedInput-notchedOutline": {
                              borderColor: "hsl(var(--primary))",
                            },
                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                              borderColor: "hsl(var(--primary))",
                            },
                          }}
                        >
                          <MenuItem
                            value="Proprietorship"
                            sx={{
                              fontFamily: "Poppins, sans-serif",
                              color: "hsl(var(--foreground))",
                            }}
                          >
                            Proprietorship
                          </MenuItem>
                          <MenuItem
                            value="Partnership"
                            sx={{
                              fontFamily: "Poppins, sans-serif",
                              color: "hsl(var(--foreground))",
                            }}
                          >
                            Partnership
                          </MenuItem>
                          <MenuItem
                            value="Corporation"
                            sx={{
                              fontFamily: "Poppins, sans-serif",
                              color: "hsl(var(--foreground))",
                            }}
                          >
                            Corporation
                          </MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <StyledTextField
                        fullWidth
                        label="Briefly describe your business"
                        multiline
                        rows={4}
                        value={formData.businessDescription}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            businessDescription: e.target.value,
                          })
                        }
                        required
                      />
                    </Grid>
                  </Grid>

                  {/* Services Expected */}
                  <SectionTitle>Services Expected from TCE-TBI</SectionTitle>
                  <FormGroup>
                    <Typography
                      sx={{
                        fontFamily: "Poppins, sans-serif",
                        color: "hsl(var(--foreground))",
                        mb: 2,
                        fontSize: "14px",
                        fontStyle: "italic",
                      }}
                    >
                      Number of employees that will be resident (if applicable)
                    </Typography>
                    <Grid container spacing={2}>
                      {Object.keys(formData.services).map((service) => (
                        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={service}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={
                                  formData.services[
                                    service as keyof typeof formData.services
                                  ]
                                }
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    services: {
                                      ...formData.services,
                                      [service]: e.target.checked,
                                    },
                                  })
                                }
                                sx={{
                                  color: "hsl(var(--border))",
                                  "&.Mui-checked": {
                                    color: "hsl(var(--primary))",
                                  },
                                }}
                              />
                            }
                            label={
                              <Typography
                                sx={{
                                  fontFamily: "Poppins, sans-serif",
                                  color: "hsl(var(--foreground))",
                                }}
                              >
                                {service.charAt(0).toUpperCase() +
                                  service.slice(1).replace(/([A-Z])/g, " $1")}
                              </Typography>
                            }
                          />
                        </Grid>
                      ))}
                    </Grid>
                  </FormGroup>

                  <Grid container spacing={3} sx={{ mt: 2 }}>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                      <StyledTextField
                        fullWidth
                        label="Number of Chairs"
                        type="number"
                        value={formData.numChairs}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            numChairs: e.target.value,
                          })
                        }
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                      <StyledTextField
                        fullWidth
                        label="Full-time Employees"
                        type="number"
                        value={formData.fullTimeEmployees}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            fullTimeEmployees: e.target.value,
                          })
                        }
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                      <StyledTextField
                        fullWidth
                        label="Part-time Employees"
                        type="number"
                        value={formData.partTimeEmployees}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            partTimeEmployees: e.target.value,
                          })
                        }
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                      <StyledTextField
                        fullWidth
                        label="Consultants"
                        type="number"
                        value={formData.consultants}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            consultants: e.target.value,
                          })
                        }
                      />
                    </Grid>
                  </Grid>

                  {/* References */}
                  <SectionTitle>References</SectionTitle>
                  <Typography
                    sx={{
                      fontFamily: "Poppins, sans-serif",
                      color: "hsl(var(--muted-foreground))",
                      mb: 3,
                      fontSize: "14px",
                    }}
                  >
                    Give two references here, verification will be done after
                    completion of the selection process
                  </Typography>

                  {/* Reference 1 */}
                  <Box
                    sx={{
                      mb: 4,
                      p: 3,
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "var(--radius)",
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: "Poppins, sans-serif",
                        fontWeight: 600,
                        color: "hsl(var(--primary))",
                        mb: 3,
                        fontSize: "18px",
                      }}
                    >
                      Reference 01
                    </Typography>
                    <Grid container spacing={3}>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <StyledTextField
                          fullWidth
                          label="Name"
                          {...createTextFieldHandlers("reference1Name")}
                          required
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <StyledTextField
                          fullWidth
                          label="Mobile"
                          {...createTextFieldHandlers("reference1Mobile")}
                          required
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <StyledTextField
                          fullWidth
                          label="Email"
                          type="email"
                          {...createTextFieldHandlers("reference1Email")}
                          required
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <StyledTextField
                          fullWidth
                          label="Address"
                          {...createTextFieldHandlers("reference1Address")}
                          required
                        />
                      </Grid>
                    </Grid>
                  </Box>

                  {/* Reference 2 */}
                  <Box
                    sx={{
                      mb: 4,
                      p: 3,
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "var(--radius)",
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: "Poppins, sans-serif",
                        fontWeight: 600,
                        color: "hsl(var(--primary))",
                        mb: 3,
                        fontSize: "18px",
                      }}
                    >
                      Reference 02
                    </Typography>
                    <Grid container spacing={3}>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <StyledTextField
                          fullWidth
                          label="Name"
                          {...createTextFieldHandlers("reference2Name")}
                          required
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <StyledTextField
                          fullWidth
                          label="Mobile"
                          {...createTextFieldHandlers("reference2Mobile")}
                          required
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <StyledTextField
                          fullWidth
                          label="Email"
                          type="email"
                          {...createTextFieldHandlers("reference2Email")}
                          required
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <StyledTextField
                          fullWidth
                          label="Address"
                          {...createTextFieldHandlers("reference2Address")}
                          required
                        />
                      </Grid>
                    </Grid>
                  </Box>

                  {/* Declaration */}
                  <SectionTitle>Declaration</SectionTitle>
                  <Box
                    sx={{
                      p: 3,
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "var(--radius)",
                    }}
                  >
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formData.declaration}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              declaration: e.target.checked,
                            })
                          }
                          sx={{
                            color: "hsl(var(--border))",
                            "&.Mui-checked": { color: "hsl(var(--primary))" },
                          }}
                        />
                      }
                      label={
                        <Typography
                          sx={{
                            fontFamily: "Poppins, sans-serif",
                            fontSize: "14px",
                            lineHeight: 1.6,
                            color: "hsl(var(--foreground))",
                          }}
                        >
                          The information that I/we have provided is correct. I
                          further declare that the information that I have
                          provided here with are not proprietary in nature and
                          that I would not make any claim on same. I have also
                          read and understood and accepted the terms and
                          conditions set forth in the disclaimer in the
                          beginning of this application.
                        </Typography>
                      }
                    />
                  </Box>

                  <Box sx={{ mt: 6, textAlign: "center" }}>
                    <PrimaryButton
                      type="submit"
                      size="large"
                      sx={{ minWidth: "200px" }}
                      disabled={loading}
                    >
                      {loading ? "Submitting..." : "Submit Application"}
                    </PrimaryButton>
                  </Box>

                  <Box
                    sx={{
                      mt: 6,
                      p: 3,
                      background: "hsl(var(--muted))",
                      borderRadius: "var(--radius)",
                      border: "1px solid hsl(var(--border))",
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: "Poppins, sans-serif",
                        color: "hsl(var(--muted-foreground))",
                        fontSize: "14px",
                        textAlign: "center",
                        lineHeight: 1.6,
                      }}
                    >
                      The completed application with all enclosure may be
                      emailed to <strong>ceotbi@tce.edu</strong> or{" "}
                      <strong>tbi@tce.edu</strong>
                      <br />
                      or printed and filled copy may be sent by courier or post
                      to
                      <br />
                      <strong>
                        Chief Executive Officer (CEO)
                        <br />
                        Technology Business Incubator (TBI)
                        <br />
                        Thiagarajar College of Engineering, Madurai-625015
                        Tamilnadu / India
                      </strong>
                    </Typography>
                  </Box>
                </form>
              </StyledPaper>
            </motion.div>
          </Box>
        </Box>
      </Container>

      <ConfirmSubmitModal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={() => {
          setConfirmOpen(false);
          setTimeout(() => actuallySubmit(), 50); // prevents StrictMode double fire
        }}
      />

      {/* Validation Modal */}
      <Dialog
        open={showValidationModal}
        onClose={() => setShowValidationModal(false)}
        aria-labelledby="validation-dialog-title"
        aria-describedby="validation-dialog-description"
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle
          id="validation-dialog-title"
          sx={{
            fontFamily: "Poppins, sans-serif",
            color: "hsl(var(--primary))",
            fontSize: "24px",
            textAlign: "center",
            pt: 3,
          }}
        >
          Please Fill Required Fields
        </DialogTitle>
        <DialogContent
          id="validation-dialog-description"
          sx={{
            color: "hsl(var(--foreground))",
            fontFamily: "Poppins, sans-serif",
            px: 4,
          }}
        >
          <Typography
            sx={{
              fontFamily: "Poppins, sans-serif",
              color: "hsl(var(--muted-foreground))",
              mb: 2,
              fontSize: "14px",
            }}
          >
            The following fields are required but missing or empty:
          </Typography>
          <Box
            component="ul"
            sx={{
              pl: 3,
              m: 0,
              fontFamily: "Poppins, sans-serif",
              fontSize: "14px",
              lineHeight: 1.6,
            }}
          >
            {validationErrors.map((error, index) => (
              <li key={index} style={{ color: "hsl(var(--destructive))" }}>
                {error}
              </li>
            ))}
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 4, pb: 3, justifyContent: "center" }}>
          <PrimaryButton
            onClick={() => setShowValidationModal(false)}
            sx={{
              minWidth: "120px",
              backgroundColor: "hsl(var(--primary))",
              "&:hover": {
                backgroundColor: "hsl(var(--destructive))",
              },
            }}
          >
            OK, I'll Fill Them
          </PrimaryButton>
        </DialogActions>
      </Dialog>

      {/* Success Modal */}
      <Dialog
        open={showSuccessModal}
        sx={{
          "& .MuiPaper-root": {
            borderRadius: "12px",
            padding: "16px",
          }
        }}
      >
        <DialogTitle
          sx={{
            fontFamily: "Poppins, sans-serif",
            color: "hsl(var(--success, #16a34a))",
            fontSize: "28px",
            textAlign: "center",
            paddingBottom: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "12px",
          }}
        >
          <Box
            sx={{
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              backgroundColor: "hsl(var(--success, #16a34a))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ✓
          </Box>
          Application Submitted Successfully!
        </DialogTitle>
        <DialogContent sx={{ textAlign: "center", pb: 3 }}>
          <Typography
            sx={{
              fontFamily: "Poppins, sans-serif",
              color: "hsl(var(--foreground))",
              fontSize: "16px",
              mb: 2,
            }}
          >
            Thank you for submitting your incubation application.
          </Typography>
          <Typography
            sx={{
              fontFamily: "Poppins, sans-serif",
              color: "hsl(var(--muted-foreground))",
              fontSize: "14px",
              lineHeight: 1.5,
            }}
          >
            Your application for <strong>{formData.businessName}</strong> has been received and is being reviewed.
            <br />
            A confirmation notification has been sent and an email dispatched to the CEO.
          </Typography>
          <Typography
            sx={{
              fontFamily: "Poppins, sans-serif",
              color: "hsl(var(--muted-foreground))",
              fontSize: "14px",
              mt: 2,
              fontStyle: "italic",
            }}
          >
            Click the button below to continue.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 4, pb: 3, justifyContent: "center" }}>
          <PrimaryButton
            onClick={() => {
              setShowSuccessModal(false);
              navigate("/contact");
            }}
            sx={{
              minWidth: "200px",
            }}
          >
            Go to Contact Page
          </PrimaryButton>
        </DialogActions>
      </Dialog>

      {loading && <SubmitLoader />}
    </StyledBox>
  );
};
