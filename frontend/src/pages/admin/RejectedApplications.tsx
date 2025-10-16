import { useState } from "react";
import { Box, Typography, Chip, IconButton, Modal, Backdrop, Fade } from "@mui/material";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DarkButton } from "@/components/ui/DarkButton";
import { ArrowLeft, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface RejectedApplication {
  id: string;
  profilePicture?: string;
  businessName: string;
  entrepreneurResume?: string;
  salutation: string;
  leadName: string;
  fatherName: string;
  age: number;
  email: string;
  residentialMobile: string;
  officeMobile?: string;
  address: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  businessType: string;
  legalEntity: string;
  businessDescription: string;
  servicesExpected: {
    chair: boolean;
    table: boolean;
    monitor: boolean;
    telephone: boolean;
    fax: boolean;
    webAccess: boolean;
    conferenceRooms: boolean;
  };
  numberOfChairs?: number;
  fullTimeEmployees?: number;
  partTimeEmployees?: number;
  consultants?: number;
  reference1: {
    name: string;
    mobile: string;
    email: string;
    address: string;
  };
  reference2: {
    name: string;
    mobile: string;
    email: string;
    address: string;
  };
  declarationAccepted: boolean;
  rejectedDate: string;
  reason: string;
}

const mockRejected: RejectedApplication[] = [
  {
    id: "1",
    businessName: "Old Tech Corp",
    salutation: "Mr",
    leadName: "Mike Johnson",
    fatherName: "Robert Johnson",
    age: 40,
    email: "mike@oldtech.com",
    residentialMobile: "+91 98765 55555",
    address: "789 Old Street",
    city: "Mumbai",
    state: "Maharashtra",
    postcode: "400001",
    country: "India",
    businessType: "High Technology",
    legalEntity: "Corporation",
    businessDescription: "Legacy technology solutions provider.",
    servicesExpected: {
      chair: true,
      table: true,
      monitor: true,
      telephone: true,
      fax: true,
      webAccess: true,
      conferenceRooms: true,
    },
    fullTimeEmployees: 5,
    reference1: {
      name: "Dr. Anderson",
      mobile: "+91 98765 66666",
      email: "anderson@example.com",
      address: "111 Reference Lane"
    },
    reference2: {
      name: "Prof. Williams",
      mobile: "+91 98765 77777",
      email: "williams@example.com",
      address: "222 Ref Street"
    },
    declarationAccepted: true,
    rejectedDate: "2025-08-10",
    reason: "Incomplete documentation",
  },
  {
    id: "2",
    businessName: "Budget Solutions",
    salutation: "Mrs",
    leadName: "Sarah Williams",
    fatherName: "James Williams",
    age: 38,
    email: "sarah@budgetsolutions.com",
    residentialMobile: "+91 98765 88888",
    address: "321 Budget Ave",
    city: "Pune",
    state: "Maharashtra",
    postcode: "411001",
    country: "India",
    businessType: "Services",
    legalEntity: "Partnership",
    businessDescription: "Budget consulting and financial planning services.",
    servicesExpected: {
      chair: true,
      table: true,
      monitor: false,
      telephone: false,
      fax: false,
      webAccess: true,
      conferenceRooms: false,
    },
    fullTimeEmployees: 2,
    partTimeEmployees: 1,
    reference1: {
      name: "Mr. Sharma",
      mobile: "+91 98765 99999",
      email: "sharma@example.com",
      address: "333 Finance Road"
    },
    reference2: {
      name: "Ms. Gupta",
      mobile: "+91 98765 00000",
      email: "gupta@example.com",
      address: "444 Budget Lane"
    },
    declarationAccepted: true,
    rejectedDate: "2025-08-25",
    reason: "Not aligned with incubation criteria",
  },
];

export const RejectedApplications = () => {
  const navigate = useNavigate();
  const [selectedApp, setSelectedApp] = useState<RejectedApplication | null>(null);
  const [open, setOpen] = useState(false);

  const handleOpen = (app: RejectedApplication) => {
    setSelectedApp(app);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedApp(null);
  };

  const handleApprove = () => {
    console.log("Re-approved:", selectedApp);
    handleClose();
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "hsl(var(--background))",
        pt: 12,
        px: 4,
      }}
    >
      <Box
        sx={{
          maxWidth: "1200px",
          mx: "auto",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4 }}>
          <IconButton
            onClick={() => navigate("/admin")}
            sx={{
              color: "hsl(var(--foreground))",
              "&:hover": { backgroundColor: "hsl(var(--muted))" },
            }}
          >
            <ArrowLeft size={24} />
          </IconButton>
          <Typography
            variant="h4"
            sx={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 700,
              color: "hsl(var(--foreground))",
            }}
          >
            Rejected Applications
          </Typography>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
            gap: 3,
          }}
        >
          {mockRejected.map((app) => (
            <Card
              key={app.id}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => handleOpen(app)}
            >
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {app.businessName}
                  <Chip
                    label="Rejected"
                    size="small"
                    sx={{
                      backgroundColor: "hsl(var(--destructive))",
                      color: "#fff",
                    }}
                  />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Lead: {app.leadName}
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  Rejected: {app.rejectedDate}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "hsl(var(--muted-foreground))",
                    fontStyle: "italic",
                  }}
                >
                  Reason: {app.reason}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>

        <Modal
          open={open}
          onClose={handleClose}
          closeAfterTransition
          slots={{ backdrop: Backdrop }}
          slotProps={{
            backdrop: {
              timeout: 500,
            },
          }}
        >
          <Fade in={open}>
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: { xs: "90%", sm: "800px" },
                maxHeight: "90vh",
                overflow: "auto",
                bgcolor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "var(--radius)",
                boxShadow: 24,
                p: 4,
              }}
            >
              {selectedApp && (
                <>
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
                    <Typography
                      variant="h5"
                      sx={{
                        fontFamily: "Poppins, sans-serif",
                        fontWeight: 700,
                        color: "hsl(var(--foreground))",
                      }}
                    >
                      Rejected Application Details
                    </Typography>
                    <Chip
                      label="Rejected"
                      sx={{
                        backgroundColor: "hsl(var(--destructive))",
                        color: "#fff",
                      }}
                    />
                  </Box>

                  <Box sx={{ mb: 2, p: 2, bgcolor: "hsl(var(--muted))", borderRadius: "var(--radius)" }}>
                    <Typography variant="subtitle2" sx={{ color: "hsl(var(--muted-foreground))", fontWeight: 600 }}>
                      Rejection Reason
                    </Typography>
                    <Typography variant="body1" sx={{ fontStyle: "italic" }}>{selectedApp.reason}</Typography>
                    <Typography variant="body2" sx={{ color: "hsl(var(--muted-foreground))", mt: 1 }}>
                      Rejected on: {selectedApp.rejectedDate}
                    </Typography>
                  </Box>

                  {/* Business Information */}
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: "hsl(var(--primary))" }}>
                    Business Information
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" sx={{ color: "hsl(var(--muted-foreground))" }}>
                      Business Name
                    </Typography>
                    <Typography variant="body1">{selectedApp.businessName}</Typography>
                  </Box>

                  {/* Lead Entrepreneur Details */}
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, mt: 3, color: "hsl(var(--primary))" }}>
                    Lead Entrepreneur Details
                  </Typography>
                  <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, mb: 2 }}>
                    <Box>
                      <Typography variant="subtitle2" sx={{ color: "hsl(var(--muted-foreground))" }}>
                        Salutation & Name
                      </Typography>
                      <Typography variant="body1">{selectedApp.salutation} {selectedApp.leadName}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" sx={{ color: "hsl(var(--muted-foreground))" }}>
                        Father's Name
                      </Typography>
                      <Typography variant="body1">{selectedApp.fatherName}</Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, mb: 2 }}>
                    <Box>
                      <Typography variant="subtitle2" sx={{ color: "hsl(var(--muted-foreground))" }}>
                        Age
                      </Typography>
                      <Typography variant="body1">{selectedApp.age}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" sx={{ color: "hsl(var(--muted-foreground))" }}>
                        Email
                      </Typography>
                      <Typography variant="body1">{selectedApp.email}</Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, mb: 2 }}>
                    <Box>
                      <Typography variant="subtitle2" sx={{ color: "hsl(var(--muted-foreground))" }}>
                        Residential Mobile
                      </Typography>
                      <Typography variant="body1">{selectedApp.residentialMobile}</Typography>
                    </Box>
                    {selectedApp.officeMobile && (
                      <Box>
                        <Typography variant="subtitle2" sx={{ color: "hsl(var(--muted-foreground))" }}>
                          Office Mobile
                        </Typography>
                        <Typography variant="body1">{selectedApp.officeMobile}</Typography>
                      </Box>
                    )}
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" sx={{ color: "hsl(var(--muted-foreground))" }}>
                      Address
                    </Typography>
                    <Typography variant="body1">{selectedApp.address}, {selectedApp.city}, {selectedApp.state} - {selectedApp.postcode}, {selectedApp.country}</Typography>
                  </Box>

                  {/* Business Details */}
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, mt: 3, color: "hsl(var(--primary))" }}>
                    About Business
                  </Typography>
                  <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, mb: 2 }}>
                    <Box>
                      <Typography variant="subtitle2" sx={{ color: "hsl(var(--muted-foreground))" }}>
                        Type of Business
                      </Typography>
                      <Typography variant="body1">{selectedApp.businessType}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" sx={{ color: "hsl(var(--muted-foreground))" }}>
                        Legal Entity
                      </Typography>
                      <Typography variant="body1">{selectedApp.legalEntity}</Typography>
                    </Box>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" sx={{ color: "hsl(var(--muted-foreground))" }}>
                      Business Description
                    </Typography>
                    <Typography variant="body1">{selectedApp.businessDescription}</Typography>
                  </Box>

                  {/* Services Expected */}
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, mt: 3, color: "hsl(var(--primary))" }}>
                    Services Expected
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2">
                      {Object.entries(selectedApp.servicesExpected)
                        .filter(([_, value]) => value)
                        .map(([key]) => key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1'))
                        .join(", ") || "None"}
                    </Typography>
                  </Box>

                  {/* Team Details */}
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, mt: 3, color: "hsl(var(--primary))" }}>
                    Team Details
                  </Typography>
                  <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 2, mb: 2 }}>
                    {selectedApp.fullTimeEmployees !== undefined && (
                      <Box>
                        <Typography variant="subtitle2" sx={{ color: "hsl(var(--muted-foreground))" }}>
                          Full-time Employees
                        </Typography>
                        <Typography variant="body1">{selectedApp.fullTimeEmployees}</Typography>
                      </Box>
                    )}
                    {selectedApp.partTimeEmployees !== undefined && (
                      <Box>
                        <Typography variant="subtitle2" sx={{ color: "hsl(var(--muted-foreground))" }}>
                          Part-time Employees
                        </Typography>
                        <Typography variant="body1">{selectedApp.partTimeEmployees}</Typography>
                      </Box>
                    )}
                    {selectedApp.consultants !== undefined && (
                      <Box>
                        <Typography variant="subtitle2" sx={{ color: "hsl(var(--muted-foreground))" }}>
                          Consultants
                        </Typography>
                        <Typography variant="body1">{selectedApp.consultants}</Typography>
                      </Box>
                    )}
                  </Box>

                  {/* References */}
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, mt: 3, color: "hsl(var(--primary))" }}>
                    References
                  </Typography>
                  <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, mb: 3 }}>
                    <Box sx={{ p: 2, border: "1px solid hsl(var(--border))", borderRadius: "var(--radius)" }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>Reference 1</Typography>
                      <Typography variant="body2"><strong>Name:</strong> {selectedApp.reference1.name}</Typography>
                      <Typography variant="body2"><strong>Mobile:</strong> {selectedApp.reference1.mobile}</Typography>
                      <Typography variant="body2"><strong>Email:</strong> {selectedApp.reference1.email}</Typography>
                      <Typography variant="body2"><strong>Address:</strong> {selectedApp.reference1.address}</Typography>
                    </Box>
                    <Box sx={{ p: 2, border: "1px solid hsl(var(--border))", borderRadius: "var(--radius)" }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>Reference 2</Typography>
                      <Typography variant="body2"><strong>Name:</strong> {selectedApp.reference2.name}</Typography>
                      <Typography variant="body2"><strong>Mobile:</strong> {selectedApp.reference2.mobile}</Typography>
                      <Typography variant="body2"><strong>Email:</strong> {selectedApp.reference2.email}</Typography>
                      <Typography variant="body2"><strong>Address:</strong> {selectedApp.reference2.address}</Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
                    <DarkButton
                      startIcon={<Check />}
                      onClick={handleApprove}
                      sx={{ backgroundColor: "#22c55e", "&:hover": { backgroundColor: "#16a34a" } }}
                    >
                      Re-Approve Application
                    </DarkButton>
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
