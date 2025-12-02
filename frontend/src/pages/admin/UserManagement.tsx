import { useEffect, useState } from "react";
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button, Chip, Paper, TextField, Snackbar, Alert } from "@mui/material";
import Grid from "@mui/material/Grid";
import { ArrowLeft, Loader2, CheckCircle, XCircle, Ban, Trash2, UserPlus, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { userService } from "../../api/userService";

export const UserManagement = () => {
  const navigate = useNavigate();
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [users, setUsers] = useState([]);
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [action, setAction] = useState("");

  // User creation states
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [createUserForm, setCreateUserForm] = useState({
    email: '',
    password: '',
    full_name: '',
    phone: ''
  });
  const [userCreationLoading, setUserCreationLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' | 'info' | 'warning' });

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      navigate('/auth');
    } else {
      setIsAuthenticated(true);
    }
    setIsAuthLoading(false);
  }, [navigate]);

  useEffect(() => {
    if (isAuthenticated) {
      loadUsers();
      loadPendingUsers();
    }
  }, [isAuthenticated]);

  const loadUsers = async () => {
    try {
      const response = await userService.getUsers();
      setUsers(response.users);
    } catch (error) {
      console.error("Failed to load users:", error);
    }
  };

  const loadPendingUsers = async () => {
    try {
      const response = await userService.getPendingUsers();
      setPendingUsers(response.users);
    } catch (error) {
      console.error("Failed to load pending users:", error);
    }
  };

  const handleApproveUser = async (userId: number) => {
    try {
      await userService.updateUserStatus(userId, "approved");
      loadUsers();
      loadPendingUsers();
    } catch (error) {
      console.error("Failed to approve user:", error);
    }
  };

  const handleRejectUser = async (userId: number) => {
    try {
      await userService.updateUserStatus(userId, "blocked");
      loadUsers();
      loadPendingUsers();
    } catch (error) {
      console.error("Failed to reject user:", error);
    }
  };

  const handleToggleBlock = async (userId: number, currentStatus: string) => {
    // If currently blocked, approve. If approved or pending, block.
    const newStatus = currentStatus === "blocked" ? "approved" : "blocked";
    try {
      await userService.updateUserStatus(userId, newStatus);
      setSnackbar({ open: true, message: `User ${newStatus === 'blocked' ? 'blocked' : 'unblocked'} successfully`, severity: 'success' });
      loadUsers();
    } catch (error) {
      console.error("Failed to update user status:", error);
      setSnackbar({ open: true, message: 'Failed to update user status', severity: 'error' });
    }
  };

  const handleSetToPending = async (userId: number) => {
    try {
      await userService.updateUserStatus(userId, "pending");
      setSnackbar({ open: true, message: 'User status set to pending', severity: 'success' });
      loadUsers();
      loadPendingUsers(); // Also refresh pending users since they might appear there now
    } catch (error) {
      console.error("Failed to set user status to pending:", error);
      setSnackbar({ open: true, message: 'Failed to update user status', severity: 'error' });
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      try {
        await userService.deleteUser(userId);
        setSnackbar({ open: true, message: 'User deleted successfully', severity: 'success' });
        loadUsers();
      } catch (error) {
        console.error("Failed to delete user:", error);
        setSnackbar({ open: true, message: 'Failed to delete user', severity: 'error' });
      }
    }
  };

  const handleCreateUser = async () => {
    if (!createUserForm.email || !createUserForm.password || !createUserForm.full_name) {
      setSnackbar({ open: true, message: 'Email, password, and full name are required.', severity: 'error' });
      return;
    }

    setUserCreationLoading(true);
    try {
      await userService.createUser({
        email: createUserForm.email,
        password: createUserForm.password,
        full_name: createUserForm.full_name,
        phone: createUserForm.phone || undefined
      });

      setSnackbar({ open: true, message: 'User created successfully!', severity: 'success' });
      setShowCreateUserModal(false);
      setCreateUserForm({ email: '', password: '', full_name: '', phone: '' });
      loadUsers(); // Refresh the users list
    } catch (error: any) {
      console.error("Create user error:", error);
      let errorMessage = 'Failed to create user.';
      if (error.response?.data) {
        if (error.response.data.error) errorMessage = error.response.data.error;
        else if (error.response.data.message) errorMessage = error.response.data.message;
        else if (error.response.data.email) errorMessage = `Email: ${error.response.data.email[0]}`;
        else if (error.response.data.username) errorMessage = `Username: ${error.response.data.username[0]}`;
        else if (error.response.data.password) errorMessage = `Password: ${error.response.data.password[0]}`;
      }
      setSnackbar({ open: true, message: errorMessage, severity: 'error' });
    } finally {
      setUserCreationLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (isAuthLoading) {
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
        pt: 16,
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
            User Management
          </Typography>
          <Box sx={{ ml: 'auto' }}>
            <Button
              variant="contained"
              startIcon={<UserPlus size={18} />}
              onClick={() => setShowCreateUserModal(true)}
              sx={{
                backgroundColor: "hsl(var(--primary))",
                "&:hover": { backgroundColor: "hsl(var(--primary) / 0.9)" },
                borderRadius: "8px",
                px: 3,
                py: 1,
              }}
            >
              Create User
            </Button>
          </Box>
        </Box>

        <Grid container spacing={4}>
          <Grid size={{xs:12, lg:8}}>
            <Paper
              sx={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "var(--radius)",
                p: 3,
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 600,
                  color: "hsl(var(--primary))",
                  mb: 3,
                }}
              >
                All Users
              </Typography>

              <TableContainer sx={{ maxHeight: 'none', overflow: 'visible' }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontFamily: "Poppins, sans-serif", fontWeight: 600 }}>Username</TableCell>
                      <TableCell sx={{ fontFamily: "Poppins, sans-serif", fontWeight: 600 }}>Email</TableCell>
                      <TableCell sx={{ fontFamily: "Poppins, sans-serif", fontWeight: 600 }}>Status</TableCell>
                      <TableCell sx={{ fontFamily: "Poppins, sans-serif", fontWeight: 600 }}>Joined</TableCell>
                      <TableCell sx={{ fontFamily: "Poppins, sans-serif", fontWeight: 600 }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell sx={{ fontFamily: "Poppins, sans-serif" }}>{user.username}</TableCell>
                        <TableCell sx={{ fontFamily: "Poppins, sans-serif" }}>{user.email}</TableCell>
                        <TableCell>
                          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                            <Chip
                              label={user.status}
                              color={user.status === "approved" ? "success" : user.status === "blocked" ? "error" : "warning"}
                              size="small"
                            />
                            {user.is_staff && (
                              <Chip
                                label="ADMIN"
                                color="primary"
                                size="small"
                                variant="outlined"
                              />
                            )}
                          </Box>
                        </TableCell>
                        <TableCell sx={{ fontFamily: "Poppins, sans-serif" }}>
                          {new Date(user.date_joined).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <IconButton
                            size="small"
                            color={user.status === "blocked" ? "success" : "error"}
                            onClick={() => handleToggleBlock(user.id, user.status)}
                          >
                            {user.status === "blocked" ? <CheckCircle size={16} /> : <Ban size={16} />}
                          </IconButton>
                          <IconButton
                            size="small"
                            color="warning"
                            title="Set to Pending"
                            onClick={() => handleSetToPending(user.id)}
                          >
                            <Clock size={16} />
                          </IconButton>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDeleteUser(user.id)}
                          >
                            <Trash2 size={16} />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>

          <Grid size={{xs:12, lg:4}}>
            <Paper
              sx={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "var(--radius)",
                p: 3,
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 600,
                  color: "hsl(var(--primary))",
                  mb: 3,
                }}
              >
                Pending Approvals
              </Typography>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {pendingUsers.map((user) => (
                  <Box
                    key={user.id}
                    sx={{
                      p: 2,
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "var(--radius)",
                      backgroundColor: "hsl(var(--muted))",
                    }}
                  >
                    <Typography sx={{ fontFamily: "Poppins, sans-serif", fontWeight: 600 }}>
                      {user.full_name || user.username}
                      {user.is_staff && (
                        <Chip
                          label="ADMIN"
                          color="primary"
                          size="small"
                          variant="outlined"
                          sx={{ ml: 1, fontSize: "10px", height: "16px" }}
                        />
                      )}
                    </Typography>
                    <Typography sx={{ fontFamily: "Poppins, sans-serif", fontSize: "14px", color: "hsl(var(--muted-foreground))" }}>
                      {user.email}
                    </Typography>
                    <Box sx={{ mt: 1, display: "flex", gap: 1 }}>
                      <Button
                        size="small"
                        color="success"
                        variant="outlined"
                        onClick={() => handleApproveUser(user.id)}
                      >
                        Approve
                      </Button>
                      <Button
                        size="small"
                        color="error"
                        variant="outlined"
                        onClick={() => handleRejectUser(user.id)}
                      >
                        Reject
                      </Button>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      {/* Create User Modal */}
      <Dialog open={showCreateUserModal} onClose={() => setShowCreateUserModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Typography variant="h6" sx={{ fontFamily: "Poppins, sans-serif", fontWeight: 600 }}>
            Create New User
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
            <TextField
              label="Email"
              type="email"
              value={createUserForm.email}
              onChange={(e) => setCreateUserForm({ ...createUserForm, email: e.target.value })}
              fullWidth
              required
            />
            <TextField
              label="Password"
              type="password"
              value={createUserForm.password}
              onChange={(e) => setCreateUserForm({ ...createUserForm, password: e.target.value })}
              fullWidth
              required
            />
            <TextField
              label="Full Name"
              value={createUserForm.full_name}
              onChange={(e) => setCreateUserForm({ ...createUserForm, full_name: e.target.value })}
              fullWidth
              required
            />
            <TextField
              label="Phone (Optional)"
              type="tel"
              value={createUserForm.phone}
              onChange={(e) => setCreateUserForm({ ...createUserForm, phone: e.target.value })}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowCreateUserModal(false)} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleCreateUser}
            variant="contained"
            disabled={userCreationLoading}
            sx={{
              backgroundColor: "hsl(var(--primary))",
              "&:hover": { backgroundColor: "hsl(var(--primary) / 0.9)" },
            }}
          >
            {userCreationLoading ? <Loader2 size={16} className="animate-spin" /> : "Create User"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};
