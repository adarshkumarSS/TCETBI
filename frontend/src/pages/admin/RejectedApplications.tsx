import { Box, Typography, Chip } from "@mui/material";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface RejectedApplication {
  id: string;
  businessName: string;
  leadName: string;
  rejectedDate: string;
  reason: string;
}

const mockRejected: RejectedApplication[] = [
  {
    id: "1",
    businessName: "Old Tech Corp",
    leadName: "Mike Johnson",
    rejectedDate: "2025-08-10",
    reason: "Incomplete documentation",
  },
  {
    id: "2",
    businessName: "Budget Solutions",
    leadName: "Sarah Williams",
    rejectedDate: "2025-08-25",
    reason: "Not aligned with incubation criteria",
  },
];

export const RejectedApplications = () => {
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
        <Typography
          variant="h4"
          sx={{
            fontFamily: "Poppins, sans-serif",
            fontWeight: 700,
            color: "hsl(var(--foreground))",
            mb: 4,
          }}
        >
          Rejected Applications
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
            gap: 3,
          }}
        >
          {mockRejected.map((app) => (
            <Card key={app.id}>
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
      </Box>
    </Box>
  );
};
