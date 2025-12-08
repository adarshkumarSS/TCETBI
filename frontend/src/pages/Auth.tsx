import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Box, Container, Typography, TextField, Button, IconButton, InputAdornment, Divider, useTheme, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { Visibility, VisibilityOff, Google, LinkedIn, ArrowBack } from '@mui/icons-material';
import { Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import authService from '../api/authService';

const StyledBox = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'hsl(var(--background))',
  padding: theme.spacing(2),
  marginTop: '0',
}));

const AuthCard = styled(motion.div)({
  background: 'hsl(var(--card))',
  borderRadius: 'var(--radius)',
  padding: '48px',
  maxWidth: '480px',
  width: '100%',
  boxShadow: '0 20px 60px rgba(220, 20, 60, 0.15)',
  border: '1px solid hsl(var(--border))',
  margin: '0 auto',
});

const StyledTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    fontFamily: 'Poppins, sans-serif',
    '& fieldset': {
      borderColor: 'hsl(var(--border))',
    },
    '&:hover fieldset': {
      borderColor: 'hsl(var(--primary))',
    },
    '&.Mui-focused fieldset': {
      borderColor: 'hsl(var(--primary))',
    },
    '& input:-webkit-autofill': {
      WebkitBoxShadow: '0 0 0 100px hsl(var(--card)) inset',
      WebkitTextFillColor: 'hsl(var(--foreground))',
      borderRadius: 'inherit',
    },
    '& input:-webkit-autofill:hover': {
      WebkitBoxShadow: '0 0 0 100px hsl(var(--card)) inset',
      WebkitTextFillColor: 'hsl(var(--foreground))',
    },
    '& input:-webkit-autofill:focus': {
      WebkitBoxShadow: '0 0 0 100px hsl(var(--card)) inset',
      WebkitTextFillColor: 'hsl(var(--foreground))',
    },
  },
  '& .MuiInputLabel-root': {
    fontFamily: 'Poppins, sans-serif',
    color: 'hsl(var(--muted-foreground))',
    '&.Mui-focused': {
      color: 'hsl(var(--primary))',
    },
    '&.MuiFormLabel-filled': {
      color: 'hsl(var(--muted-foreground))',
    },
  },
  '& .MuiInputBase-input': {
    fontFamily: 'Poppins, sans-serif',
    color: 'hsl(var(--foreground))',
    '&:-webkit-autofill': {
      WebkitTextFillColor: 'hsl(var(--foreground)) !important',
    },
  },
  '& .MuiOutlinedInput-input': {
    '&:-webkit-autofill': {
      WebkitBoxShadow: '0 0 0 100px hsl(var(--card)) inset',
      WebkitTextFillColor: 'hsl(var(--foreground))',
      caretColor: 'hsl(var(--foreground))',
    },
  },
  // Hide browser's default password toggle
  '& input[type="password"]::-webkit-credentials-auto-fill-button': {
    display: 'none !important',
    visibility: 'hidden',
    pointerEvents: 'none',
    position: 'absolute',
    right: 0,
  },
  '& input[type="password"]::-webkit-contacts-auto-fill-button': {
    display: 'none !important',
    visibility: 'hidden',
    pointerEvents: 'none',
    position: 'absolute',
    right: 0,
  },
  '& input[type="password"]::-webkit-strong-password-auto-fill-button': {
    display: 'none !important',
    visibility: 'hidden',
    pointerEvents: 'none',
    position: 'absolute',
    right: 0,
  },
});

const PrimaryButton = styled(Button)({
  backgroundColor: 'hsl(var(--primary))',
  color: '#fff',
  fontFamily: 'Poppins, sans-serif',
  fontWeight: 600,
  padding: '12px 24px',
  borderRadius: 'var(--radius)',
  textTransform: 'none',
  fontSize: '16px',
  boxShadow: '0 4px 20px rgba(220, 20, 60, 0.3)',
  '&:hover': {
    backgroundColor: 'hsl(var(--destructive))',
    boxShadow: '0 6px 30px rgba(220, 20, 60, 0.4)',
    transform: 'translateY(-2px)',
  },
  transition: 'all 0.3s ease',
});

const SocialButton = styled(Button)({
  fontFamily: 'Poppins, sans-serif',
  fontWeight: 500,
  padding: '12px 24px',
  borderRadius: 'var(--radius)',
  textTransform: 'none',
  border: '1px solid hsl(var(--border))',
  color: 'hsl(var(--foreground))',
  backgroundColor: 'transparent',
  '&:hover': {
    backgroundColor: 'hsl(var(--muted))',
    borderColor: 'hsl(var(--primary))',
  },
  transition: 'all 0.3s ease',
});

// Styled IconButton for password visibility
const StyledIconButton = styled(IconButton)(({ theme }) => ({
  color: 'hsl(var(--primary))', // Red color in both light and dark mode
  '&:hover': {
    backgroundColor: 'rgba(220, 20, 60, 0.1)',
  },
}));

const BackButton = styled(IconButton)<{ component?: typeof Link; to?: string }>({
  color: 'hsl(var(--primary))',
  marginBottom: '16px',
  borderRadius: '50%',
  padding: '12px',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: 'rgba(220, 20, 60, 0.2)',
    boxShadow: '0 0 20px rgba(220, 20, 60, 0.3)',
    transform: 'scale(1.1)',
  },
});

export const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    username: '',
    phone: '',
  });
  const [errors, setErrors] = useState({
    password: '',
    confirmPassword: '',
  });
  const [loginError, setLoginError] = useState('');
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [accountStatus, setAccountStatus] = useState<{
    status: 'pending' | 'blocked' | '';
    message: string;
    action: string;
    ceoContact: { name: string; position: string; email: string };
  } | null>(null);
  const [showAccountStatusModal, setShowAccountStatusModal] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const validatePassword = (password: string) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < minLength) {
      return 'Password must be at least 8 characters long';
    }
    if (!hasUpperCase || !hasLowerCase) {
      return 'Password must contain both uppercase and lowercase letters';
    }
    if (!hasNumbers) {
      return 'Password must contain at least one number';
    }
    if (!hasSpecialChar) {
      return 'Password must contain at least one special character';
    }
    return '';
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const password = e.target.value;
    setFormData({ ...formData, password });
    if (!isLogin) {
      setErrors({ ...errors, password: validatePassword(password) });
    }
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const confirmPassword = e.target.value;
    setFormData({ ...formData, confirmPassword });
    if (confirmPassword !== formData.password) {
      setErrors({ ...errors, confirmPassword: 'Passwords do not match' });
    } else {
      setErrors({ ...errors, confirmPassword: '' });
    }
  };

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isLogin && formData.email && formData.password) {
      setIsLoggingIn(true);
      // First try admin login
      try {
        const adminResponse = await authService.adminLogin({
          email: formData.email,
          password: formData.password
        });
        // Store admin tokens
        localStorage.setItem('admin_token', adminResponse.access);
        localStorage.setItem('admin_refresh', adminResponse.refresh);
        localStorage.setItem('admin_user', JSON.stringify(adminResponse.user));
        // Redirect to admin dashboard
        navigate('/admin');
      } catch (adminError) {
        // Admin login failed, try user login
        try {
          const userResponse = await authService.userLogin({
            username: formData.email,
            password: formData.password
          });
          // Store user tokens
          localStorage.setItem('user_token', userResponse.access);
          localStorage.setItem('user_refresh', userResponse.refresh);
          localStorage.setItem('user_user', JSON.stringify(userResponse.user));
          // Redirect to user dashboard
          navigate('/user/dashboard');
        } catch (userError: any) {
          // Check if it's a status-related error (pending/blocked)
          const errorData = userError.response?.data;
          if (errorData?.user_status === 'pending' || errorData?.user_status === 'blocked') {
            setAccountStatus({
              status: errorData.user_status,
              message: errorData.message,
              action: errorData.action,
              ceoContact: errorData.ceo_contact
            });
            setShowAccountStatusModal(true);
          } else {
            // Regular login error
            setLoginError('Invalid username or password');
            setShowErrorModal(true);
          }
        }
      } finally {
        setIsLoggingIn(false);
      }
    } else if (!isLogin) {
      // User registration
      try {
        const registrationData = {
          username: formData.email, // use email as username
          email: formData.email,
          full_name: formData.fullName,
          phone: formData.phone,
          password: formData.password,
          password_confirm: formData.confirmPassword
        };
        const response = await authService.userRegister(registrationData);
        setSuccessMessage(response.message);
        setShowSuccessModal(true);
        // Reset form
        setFormData({
          email: '',
          password: '',
          confirmPassword: '',
          fullName: '',
          username: '',
          phone: '',
        });
      } catch (error: any) {
        console.error('Registration failed:', error);
        let errorMessage = error.response?.data?.email?.[0] || error.response?.data?.username?.[0] || error.response?.data?.error || 'Registration failed. Please try again.';
        // Replace "username" with "mail id" in the error message
        errorMessage = errorMessage.replace(/username/g, 'mail id');
        setLoginError(errorMessage);
        setShowErrorModal(true);
      }
    }
  };

  return (
    <StyledBox>
      <Container
        maxWidth="sm"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          minHeight: '100vh',
          pt: 4
        }}
      >
        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2, mb: 2, width: '100%' }}>
          <BackButton
            onClick={() => {
              if (!isLogin) {
                setIsLogin(true);
              } else {
                navigate('/');
              }
            }}
          >
            <ArrowBack />
          </BackButton>
          <Box sx={{ flex: 1 }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              style={{ width: '100%' }}
            >
              {/* Apply for Incubation Section - Prominent Call-to-Action */}
              <Box sx={{ textAlign: 'center', mb: 6 }}>
                <Link to="/apply-incubation" style={{ textDecoration: 'none' }}>
                  <PrimaryButton
                    size="large"
                    sx={{
                      fontSize: '16px',
                      padding: '12px 24px',
                      minWidth: '200px',
                      backgroundColor: 'hsl(var(--primary))',
                      color: '#fff',
                      border: '2px solid hsl(var(--primary))',
                      '&:hover': {
                        backgroundColor: '#fff',
                        color: 'hsl(var(--primary))',
                        transform: 'scale(1.05)',
                        border: '2px solid hsl(var(--primary))',
                      },
                      boxShadow: '0 4px 20px rgba(220, 20, 60, 0.4)',
                      mb: 1,
                    }}
                  >
                    🚀 Apply for Incubation
                  </PrimaryButton>
                </Link>
                <Typography
                  sx={{
                    fontFamily: 'Poppins, sans-serif',
                    fontSize: '14px',
                    color: 'hsl(var(--muted-foreground))',
                    fontStyle: 'italic',
                  }}
                >
                  Transform your idea into reality - One step ahead for growth!
                </Typography>
              </Box>

              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Typography
                  variant="h3"
                  sx={{
                    fontFamily: 'Poppins, sans-serif',
                    fontWeight: 700,
                    color: 'hsl(var(--primary))',
                    mb: 2,
                  }}
                >
                  {isLogin ? 'Welcome Back' : 'Create Account'}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    fontFamily: 'Poppins, sans-serif',
                    color: 'hsl(var(--muted-foreground))',
                  }}
                >
                  {isLogin
                    ? 'Enter your credentials to access your account'
                    : 'Fill in your details to get started'}
                </Typography>
              </Box>

              <AuthCard
                key={isLogin ? 'login' : 'register'}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <form onSubmit={handleSubmit}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <AnimatePresence mode="wait">
                      {!isLogin && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <StyledTextField
                            fullWidth
                            label="Full Name"
                            variant="outlined"
                            value={formData.fullName}
                            onChange={(e) =>
                              setFormData({ ...formData, fullName: e.target.value })
                            }
                            required
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <StyledTextField
                      fullWidth
                      label="Email"
                      type="email"
                      variant="outlined"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      required
                    />

                    <StyledTextField
                      fullWidth
                      label="Password"
                      type={showPassword ? 'text' : 'password'}
                      variant="outlined"
                      value={formData.password}
                      onChange={handlePasswordChange}
                      error={!isLogin && !!errors.password}
                      helperText={!isLogin ? errors.password : ''}
                      required
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <StyledIconButton
                              onClick={() => setShowPassword(!showPassword)}
                              edge="end"
                            >
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </StyledIconButton>
                          </InputAdornment>
                        ),
                      }}
                    />

                    <AnimatePresence mode="wait">
                      {!isLogin && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <StyledTextField
                            fullWidth
                            label="Confirm Password"
                            type={showConfirmPassword ? 'text' : 'password'}
                            variant="outlined"
                            value={formData.confirmPassword}
                            onChange={handleConfirmPasswordChange}
                            error={!!errors.confirmPassword}
                            helperText={errors.confirmPassword}
                            required
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  <StyledIconButton
                                    onClick={() =>
                                      setShowConfirmPassword(!showConfirmPassword)
                                    }
                                    edge="end"
                                  >
                                    {showConfirmPassword ? (
                                      <VisibilityOff />
                                    ) : (
                                      <Visibility />
                                    )}
                                  </StyledIconButton>
                                </InputAdornment>
                              ),
                            }}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {isLogin && (
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography
                          component={Link}
                          to="/forgot-password"
                          sx={{
                            fontFamily: 'Poppins, sans-serif',
                            fontSize: '14px',
                            color: 'hsl(var(--primary))',
                            textDecoration: 'none',
                            '&:hover': {
                              textDecoration: 'underline',
                            },
                          }}
                        >
                          Forgot Password?
                        </Typography>
                      </Box>
                    )}

                    <PrimaryButton
                      type="submit"
                      fullWidth
                      disabled={isLoggingIn}
                      sx={{
                        ...(isLoggingIn && {
                          opacity: 0.7,
                          pointerEvents: 'none',
                        })
                      }}
                    >
                      {isLoggingIn ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Loader2 size={18} className="animate-spin" />
                          <span>Logging in...</span>
                        </Box>
                      ) : (
                        isLogin ? 'Login' : 'Register'
                      )}
                    </PrimaryButton>

                    <Divider sx={{ my: 2 }}>
                      <Typography
                        sx={{
                          fontFamily: 'Poppins, sans-serif',
                          color: 'hsl(var(--muted-foreground))',
                          fontSize: '14px',
                        }}
                      >
                        OR
                      </Typography>
                    </Divider>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <SocialButton fullWidth startIcon={<Google />}>
                        Continue with Google
                      </SocialButton>
                      <SocialButton fullWidth startIcon={<LinkedIn />}>
                        Continue with LinkedIn
                      </SocialButton>
                    </Box>

                    <Box sx={{ textAlign: 'center', mt: 2 }}>
                      <Typography
                        sx={{
                          fontFamily: 'Poppins, sans-serif',
                          color: 'hsl(var(--muted-foreground))',
                          fontSize: '14px',
                        }}
                      >
                        {isLogin ? "Don't have an account? " : 'Already have an account? '}
                        <Typography
                          component="span"
                          onClick={() => setIsLogin(!isLogin)}
                          sx={{
                            color: 'hsl(var(--primary))',
                            cursor: 'pointer',
                            fontWeight: 600,
                            '&:hover': {
                              textDecoration: 'underline',
                            },
                          }}
                        >
                          {isLogin ? 'Register' : 'Login'}
                        </Typography>
                      </Typography>
                    </Box>
                  </Box>
                </form>
              </AuthCard>
            </motion.div>
          </Box>
        </Box>

        {/* Error Modal for Invalid Credentials */}
        <Dialog
          open={showErrorModal}
          onClose={() => setShowErrorModal(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle
            sx={{
              color: 'hsl(var(--destructive))',
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 600,
            }}
          >
            Login Failed
          </DialogTitle>
          <DialogContent>
            <Typography
              sx={{
                fontFamily: 'Poppins, sans-serif',
                color: 'hsl(var(--foreground))',
              }}
            >
              {loginError}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setShowErrorModal(false)}
              sx={{
                fontFamily: 'Poppins, sans-serif',
                color: 'hsl(var(--primary))',
              }}
            >
              Try Again
            </Button>
          </DialogActions>
        </Dialog>

        {/* Success Modal */}
        <Dialog
          open={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle
            sx={{
              color: 'hsl(var(--primary))',
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 600,
            }}
          >
            Registration Successful
          </DialogTitle>
          <DialogContent>
            <Typography
              sx={{
                fontFamily: 'Poppins, sans-serif',
                color: 'hsl(var(--foreground))',
              }}
            >
              {successMessage}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setShowSuccessModal(false);
                setIsLogin(true);
              }}
              sx={{
                fontFamily: 'Poppins, sans-serif',
                color: 'hsl(var(--primary))',
              }}
            >
              OK
            </Button>
          </DialogActions>
        </Dialog>

        {/* Account Status Modal - For Pending/Blocked Users */}
        <Dialog
          open={showAccountStatusModal}
          onClose={() => setShowAccountStatusModal(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle
            sx={{
              color: accountStatus?.status === 'pending' ? 'hsl(var(--warning))' : 'hsl(var(--destructive))',
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 600,
            }}
          >
            Account Status
          </DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Typography
                sx={{
                  fontFamily: 'Poppins, sans-serif',
                  color: 'hsl(var(--foreground))',
                  mb: 2,
                }}
              >
                {accountStatus?.message}
              </Typography>

              <Box sx={{
                backgroundColor: 'hsl(var(--muted))',
                p: 2,
                borderRadius: '8px',
                border: '1px solid hsl(var(--border))'
              }}>
                <Typography
                  sx={{
                    fontFamily: 'Poppins, sans-serif',
                    fontWeight: 600,
                    color: 'hsl(var(--primary))',
                    mb: 1,
                  }}
                >
                  For assistance, contact:
                </Typography>

                <Typography
                  sx={{
                    fontFamily: 'Poppins, sans-serif',
                    color: 'hsl(var(--foreground))',
                    fontSize: '16px',
                    fontWeight: 500,
                  }}
                >
                  {accountStatus?.ceoContact.name}
                </Typography>

                <Typography
                  sx={{
                    fontFamily: 'Poppins, sans-serif',
                    color: 'hsl(var(--muted-foreground))',
                    fontSize: '14px',
                    mb: 1,
                  }}
                >
                  {accountStatus?.ceoContact.position}
                </Typography>

                <Typography
                  sx={{
                    fontFamily: 'Poppins, sans-serif',
                    color: 'hsl(var(--primary))',
                    fontSize: '16px',
                    fontWeight: 500,
                  }}
                >
                  📧 {accountStatus?.ceoContact.email}
                </Typography>
              </Box>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setShowAccountStatusModal(false)}
              sx={{
                fontFamily: 'Poppins, sans-serif',
                color: 'hsl(var(--primary))',
              }}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </StyledBox>
  );
};
