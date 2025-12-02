import { useState, useEffect } from "react";
import { Box, Typography, Switch, FormControlLabel, IconButton } from "@mui/material";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DarkButton } from "@/components/ui/DarkButton";
import { Settings2, Database, Bell, Shield, Palette, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const Settings = () => {
  const navigate = useNavigate();
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [settings, setSettings] = useState({
    enableNotifications: true,
    maintenanceMode: false,
    allowNewApplications: true,
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    darkMode: false,
  });

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      navigate('/auth');
    } else {
      setIsAuthenticated(true);
    }
    setIsAuthLoading(false);

    const savedSettings = localStorage.getItem('admin_settings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, [navigate]);

  const handleSettingChange = (setting: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSettings = { ...settings, [setting]: event.target.checked };
    setSettings(newSettings);
    localStorage.setItem('admin_settings', JSON.stringify(newSettings));
    toast.success("Settings updated");
  };

  if (isAuthLoading) {
    // ... (keep existing loading state)
    return (
      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor: "hsl(var(--background))",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Loader2 size={32} className="animate-spin" />
          <Typography variant="body1">Checking authentication...</Typography>
        </Box>
      </Box>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

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
            Admin Settings
          </Typography>
        </Box>

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
                control={<Switch checked={settings.enableNotifications} onChange={handleSettingChange('enableNotifications')} />}
                label="Enable Notifications"
                sx={{ mb: 2, display: "block" }}
              />
              <FormControlLabel
                control={<Switch checked={settings.maintenanceMode} onChange={handleSettingChange('maintenanceMode')} />}
                label="Maintenance Mode"
                sx={{ mb: 2, display: "block" }}
              />
              <FormControlLabel
                control={<Switch checked={settings.allowNewApplications} onChange={handleSettingChange('allowNewApplications')} />}
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
              <DarkButton fullWidth sx={{ mb: 2 }} onClick={() => toast.info("Database backup coming soon")}>
                Backup Database
              </DarkButton>
              <DarkButton fullWidth sx={{ mb: 2 }} onClick={() => toast.info("Data export coming soon")}>
                Export Data
              </DarkButton>
              <DarkButton fullWidth onClick={() => toast.info("Cache clear coming soon")}>Clear Cache</DarkButton>
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
                control={<Switch checked={settings.emailNotifications} onChange={handleSettingChange('emailNotifications')} />}
                label="Email Notifications"
                sx={{ mb: 2, display: "block" }}
              />
              <FormControlLabel
                control={<Switch checked={settings.pushNotifications} onChange={handleSettingChange('pushNotifications')} />}
                label="Push Notifications"
                sx={{ mb: 2, display: "block" }}
              />
              <FormControlLabel
                control={<Switch checked={settings.smsNotifications} onChange={handleSettingChange('smsNotifications')} />}
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
              <DarkButton fullWidth sx={{ mb: 2 }} onClick={() => toast.info("Password change coming soon")}>
                Change Password
              </DarkButton>
              <DarkButton fullWidth sx={{ mb: 2 }} onClick={() => toast.info("2FA coming soon")}>
                Two-Factor Auth
              </DarkButton>
              <DarkButton fullWidth onClick={() => toast.info("Audit logs coming soon")}>View Audit Logs</DarkButton>
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
              <DarkButton fullWidth onClick={() => toast.info("Theme reset coming soon")}>Reset Theme</DarkButton>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};
