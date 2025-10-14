import { Box, Typography, Switch, FormControlLabel } from "@mui/material";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DarkButton } from "@/components/ui/DarkButton";
import { Settings2, Database, Bell, Shield, Palette } from "lucide-react";

export const Settings = () => {
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
          Admin Settings
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
            gap: 3,
          }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings2 size={20} />
                General Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <FormControlLabel
                control={<Switch defaultChecked />}
                label="Enable Notifications"
                sx={{ mb: 2, display: "block" }}
              />
              <FormControlLabel
                control={<Switch />}
                label="Maintenance Mode"
                sx={{ mb: 2, display: "block" }}
              />
              <FormControlLabel
                control={<Switch defaultChecked />}
                label="Allow New Applications"
                sx={{ display: "block" }}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database size={20} />
                Database
              </CardTitle>
            </CardHeader>
            <CardContent>
              <DarkButton fullWidth sx={{ mb: 2 }}>
                Backup Database
              </DarkButton>
              <DarkButton fullWidth sx={{ mb: 2 }}>
                Export Data
              </DarkButton>
              <DarkButton fullWidth>Clear Cache</DarkButton>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell size={20} />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <FormControlLabel
                control={<Switch defaultChecked />}
                label="Email Notifications"
                sx={{ mb: 2, display: "block" }}
              />
              <FormControlLabel
                control={<Switch defaultChecked />}
                label="Push Notifications"
                sx={{ mb: 2, display: "block" }}
              />
              <FormControlLabel
                control={<Switch />}
                label="SMS Notifications"
                sx={{ display: "block" }}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield size={20} />
                Security
              </CardTitle>
            </CardHeader>
            <CardContent>
              <DarkButton fullWidth sx={{ mb: 2 }}>
                Change Password
              </DarkButton>
              <DarkButton fullWidth sx={{ mb: 2 }}>
                Two-Factor Auth
              </DarkButton>
              <DarkButton fullWidth>View Audit Logs</DarkButton>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette size={20} />
                Appearance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <FormControlLabel
                control={<Switch />}
                label="Dark Mode"
                sx={{ mb: 2, display: "block" }}
              />
              <DarkButton fullWidth>Reset Theme</DarkButton>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};
