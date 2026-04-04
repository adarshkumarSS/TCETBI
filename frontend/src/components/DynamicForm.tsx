import { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Typography,
  CircularProgress,
  Grid,
  Paper,
  Chip,
  FormHelperText,
  Radio,
  RadioGroup,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { CloudUpload, Send, CheckCircle } from '@mui/icons-material';
import { toast } from 'sonner';
import { dynamicFormService } from '../api/dynamicFormService';
import { motion, AnimatePresence } from 'framer-motion';
import { DEFAULT_FORM_TEMPLATES, type FormFieldData } from '../constants/formTemplates';

interface DynamicFormProps {
  formType: string;
  onSuccess?: () => void;
}

export const DynamicForm = ({ formType, onSuccess }: DynamicFormProps) => {
  const [fields, setFields] = useState<FormFieldData[]>([]);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [files, setFiles] = useState<Record<string, File>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [openValidationDialog, setOpenValidationDialog] = useState(false);

  useEffect(() => {
    loadFormStructure();
  }, [formType]);

  const loadFormStructure = async () => {
    try {
      const data = await dynamicFormService.getFormStructure(formType);
      let formFields = data?.fields || [];

      // Fallback to default template if no fields returned from backend
      if (formFields.length === 0 && DEFAULT_FORM_TEMPLATES[formType]) {
        formFields = DEFAULT_FORM_TEMPLATES[formType].fields;
      }

      // Sort fields by order
      formFields.sort((a, b) => a.order - b.order);

      setFields(formFields);
      
      // Initialize form data with default values
      const initialData: Record<string, any> = {};
      formFields.forEach((field: FormFieldData) => {
        if (field.field_type === 'checkbox') {
          // If it has options, it's a multi-checkbox (array), otherwise single (boolean)
          initialData[field.field_name] = field.options && field.options.length > 0 ? [] : false;
        } else {
          initialData[field.field_name] = '';
        }
      });
      setFormData(initialData);
    } catch (error) {
      console.warn(`Failed to fetch form structure for ${formType}, attempting fallback...`, error);
      
      if (DEFAULT_FORM_TEMPLATES[formType]) {
        const formFields = [...DEFAULT_FORM_TEMPLATES[formType].fields].sort((a, b) => a.order - b.order);
        setFields(formFields);
        
        const initialData: Record<string, any> = {};
        formFields.forEach((field: FormFieldData) => {
          if (field.field_type === 'checkbox') {
            initialData[field.field_name] = field.options && field.options.length > 0 ? [] : false;
          } else {
            initialData[field.field_name] = '';
          }
        });
        setFormData(initialData);
      } else {
        toast.error('Failed to load form');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (fieldName: string, value: any) => {
    setFormData({ ...formData, [fieldName]: value });
    if (errors[fieldName]) {
      setErrors({ ...errors, [fieldName]: '' });
    }
  };

  const handleFileChange = (fieldName: string, file: File | null, field: FormFieldData) => {
    if (!file) return;

    // Check validation rules
    if (field.validation_rules) {
      const { allowed_file_types, max_file_size } = field.validation_rules;
      
      // Type validation
      if (allowed_file_types && allowed_file_types.length > 0) {
        const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
        if (!allowed_file_types.map(t => t.toLowerCase()).includes(fileExtension)) {
          toast.error(`Invalid file type. Allowed types: ${allowed_file_types.join(', ')}`);
          setErrors({ ...errors, [fieldName]: `Please upload a file with these extensions: ${allowed_file_types.join(', ')}` });
          // Clear file from state on failure
          setFiles(prev => {
            const next = { ...prev };
            delete next[fieldName];
            return next;
          });
          setFormData(prev => ({ ...prev, [fieldName]: '' }));
          return;
        }
      }

      // Size validation
      if (max_file_size) {
        const fileSizeMB = file.size / (1024 * 1024);
        if (fileSizeMB > max_file_size) {
          toast.error(`File too large. Max size: ${max_file_size}MB`);
          setErrors({ ...errors, [fieldName]: `File must be smaller than ${max_file_size}MB` });
          // Clear file from state on failure
          setFiles(prev => {
            const next = { ...prev };
            delete next[fieldName];
            return next;
          });
          setFormData(prev => ({ ...prev, [fieldName]: '' }));
          return;
        }
      }
    }

    setFiles({ ...files, [fieldName]: file });
    setFormData({ ...formData, [fieldName]: file.name });
    if (errors[fieldName]) {
      setErrors({ ...errors, [fieldName]: '' });
    }
  };

  const handleCheckboxChange = (fieldName: string, option: string, checked: boolean) => {
    const currentValues = Array.isArray(formData[fieldName]) ? [...formData[fieldName]] : [];
    if (checked) {
      if (!currentValues.includes(option)) currentValues.push(option);
    } else {
      const index = currentValues.indexOf(option);
      if (index > -1) currentValues.splice(index, 1);
    }
    setFormData({ ...formData, [fieldName]: currentValues });
    if (errors[fieldName]) {
      setErrors({ ...errors, [fieldName]: '' });
    }
  };
      
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    fields.forEach((field) => {
      if (field.is_required) {
        const value = formData[field.field_name];
        if (!value || (typeof value === 'string' && value.trim() === '')) {
          newErrors[field.field_name] = `${field.label} is missing`;
        }
      }
      
      // Email validation
      if (field.field_type === 'email' && formData[field.field_name]) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData[field.field_name])) {
          newErrors[field.field_name] = 'Please enter a valid email';
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      // Collect missing field labels for the modal
      const missing: string[] = [];
      fields.forEach((field) => {
        if (field.is_required) {
          const value = formData[field.field_name];
          if (!value || (typeof value === 'string' && value.trim() === '')) {
            missing.push(field.label);
          }
        }
        if (field.field_type === 'email' && formData[field.field_name]) {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(formData[field.field_name])) {
            missing.push(`${field.label} (invalid email)`);
          }
        }
      });
      setValidationErrors(missing);
      setOpenValidationDialog(true);
      return;
    }

    if (formType === 'incubation_application' && !openConfirmDialog) {
      setOpenConfirmDialog(true);
      return;
    }

    setOpenConfirmDialog(false);
    executeSubmit();
  };

  const executeSubmit = async () => {
    setSubmitting(true);
    try {
      const submitData = new FormData();
      
      // Add regular form data
      Object.keys(formData).forEach((key) => {
        const field = fields.find(f => f.field_name === key);
        // Only append if it's not a file field OR if a file actually exists for it
        // This prevents sending filenames as strings or empty strings for missing files
        if (field?.field_type !== 'file') {
          submitData.append(key, formData[key]);
        }
      });
      
      // Add files
      Object.keys(files).forEach((key) => {
        submitData.append(key, files[key]);
      });

      await dynamicFormService.submitForm(formType, submitData);
      toast.success('Form submitted successfully!');
      
      // Reset form
      const resetData: Record<string, any> = {};
      fields.forEach((field) => {
        resetData[field.field_name] = field.field_type === 'checkbox' ? false : '';
      });
      setFormData(resetData);
      setFiles({});
      
      if (onSuccess) onSuccess();
    } catch (error) {
      toast.error('Failed to submit form');
    } finally {
      setSubmitting(false);
    }
  };

  const shouldShowField = (field: FormFieldData) => {
    if (!field.conditional_logic) return true;
    
    const { field_name, value } = field.conditional_logic;
    return formData[field_name] === value;
  };

  const getFieldWidth = (field: FormFieldData) => {
    // Auto-adjust field widths based on field type
    switch (field.field_type) {
      case 'textarea':
        return { xs: 12 }; // Full width for text areas
      case 'checkbox':
        return { xs: 12 }; // Full width for checkboxes
      case 'file':
        return { xs: 12 }; // Full width for file uploads
      case 'email':
      case 'phone':
        return { xs: 12, md: 6 }; // Half width on medium+ screens
      default:
        return { xs: 12, sm: 6 }; // Half width on small+ screens
    }
  };

  const renderField = (field: FormFieldData) => {
    if (!shouldShowField(field)) return null;

    const fieldWidth = getFieldWidth(field);
    const hasError = !!errors[field.field_name];

    return (
      <Grid size={fieldWidth} key={field.id}>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {field.field_type === 'text' && (
            <Box>
              <TextField
                fullWidth
                label={field.label}
                value={formData[field.field_name] || ''}
                onChange={(e) => handleInputChange(field.field_name, e.target.value)}
                placeholder={field.placeholder}
                required={field.is_required}
                error={hasError}
                variant="outlined"
                size="medium"
              />
              {(errors[field.field_name] || field.help_text) && (
                <Typography variant="caption" sx={{ display: 'block', mt: 0.5, color: hasError ? 'error.main' : 'text.secondary', ml: 1 }}>
                  {errors[field.field_name] || field.help_text}
                </Typography>
              )}
            </Box>
          )}

          {field.field_type === 'email' && (
            <Box>
              <TextField
                fullWidth
                type="email"
                label={field.label}
                value={formData[field.field_name] || ''}
                onChange={(e) => handleInputChange(field.field_name, e.target.value)}
                placeholder={field.placeholder}
                required={field.is_required}
                error={hasError}
                variant="outlined"
                size="medium"
              />
              {(errors[field.field_name] || field.help_text) && (
                <Typography variant="caption" sx={{ display: 'block', mt: 0.5, color: hasError ? 'error.main' : 'text.secondary', ml: 1 }}>
                  {errors[field.field_name] || field.help_text}
                </Typography>
              )}
            </Box>
          )}

          {field.field_type === 'number' && (
            <Box>
              <TextField
                fullWidth
                type="number"
                label={field.label}
                value={formData[field.field_name] || ''}
                onChange={(e) => handleInputChange(field.field_name, e.target.value)}
                placeholder={field.placeholder}
                required={field.is_required}
                error={hasError}
                variant="outlined"
                size="medium"
              />
              {(errors[field.field_name] || field.help_text) && (
                <Typography variant="caption" sx={{ display: 'block', mt: 0.5, color: hasError ? 'error.main' : 'text.secondary', ml: 1 }}>
                  {errors[field.field_name] || field.help_text}
                </Typography>
              )}
            </Box>
          )}

          {field.field_type === 'phone' && (
            <Box>
              <TextField
                fullWidth
                type="tel"
                label={field.label}
                value={formData[field.field_name] || ''}
                onChange={(e) => handleInputChange(field.field_name, e.target.value)}
                placeholder={field.placeholder}
                required={field.is_required}
                error={hasError}
                variant="outlined"
                size="medium"
              />
              {(errors[field.field_name] || field.help_text) && (
                <Typography variant="caption" sx={{ display: 'block', mt: 0.5, color: hasError ? 'error.main' : 'text.secondary', ml: 1 }}>
                  {errors[field.field_name] || field.help_text}
                </Typography>
              )}
            </Box>
          )}

          {field.field_type === 'textarea' && (
            <Box>
              <TextField
                fullWidth
                multiline
                rows={4}
                label={field.label}
                value={formData[field.field_name] || ''}
                onChange={(e) => handleInputChange(field.field_name, e.target.value)}
                placeholder={field.placeholder}
                required={field.is_required}
                error={hasError}
                variant="outlined"
              />
              {(errors[field.field_name] || field.help_text) && (
                <Typography variant="caption" sx={{ display: 'block', mt: 0.5, color: hasError ? 'error.main' : 'text.secondary', ml: 1 }}>
                  {errors[field.field_name] || field.help_text}
                </Typography>
              )}
            </Box>
          )}

          {field.field_type === 'select' && (
            <Box>
              <FormControl fullWidth error={hasError} required={field.is_required}>
                <InputLabel>{`${field.label}${field.is_required ? ' *' : ''}`}</InputLabel>
                <Select
                  value={formData[field.field_name] || ''}
                  onChange={(e) => handleInputChange(field.field_name, e.target.value)}
                  label={`${field.label}${field.is_required ? ' *' : ''}`}
                  required={field.is_required}
                  size="medium"
                >
                  {field.options?.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {(errors[field.field_name] || field.help_text) && (
                <Typography variant="caption" sx={{ display: 'block', mt: 0.5, color: hasError ? 'error.main' : 'text.secondary', ml: 1 }}>
                  {errors[field.field_name] || field.help_text}
                </Typography>
              )}
            </Box>
          )}

          {field.field_type === 'checkbox' && (
            <Box>
              <Typography variant="body1" sx={{ mb: 1, color: hasError ? 'error.main' : 'text.primary', fontWeight: 500 }}>
                {field.label} {field.is_required && '*'}
              </Typography>
              {field.options && field.options.length > 0 ? (
                <Grid container spacing={1}>
                  {field.options.map((option) => (
                    <Grid size={{ xs: 12, sm: 6 }} key={option}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={Array.isArray(formData[field.field_name]) && formData[field.field_name].includes(option)}
                            onChange={(e) => handleCheckboxChange(field.field_name, option, e.target.checked)}
                            sx={{
                              color: 'hsl(var(--primary))',
                              '&.Mui-checked': { color: 'hsl(var(--primary))' },
                            }}
                          />
                        }
                        label={option}
                      />
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData[field.field_name] || false}
                      onChange={(e) => handleInputChange(field.field_name, e.target.checked)}
                      required={field.is_required}
                      sx={{
                        color: 'hsl(var(--primary))',
                        '&.Mui-checked': { color: 'hsl(var(--primary))' },
                      }}
                    />
                  }
                  label="I agree / Yes"
                />
              )}
              {(errors[field.field_name] || field.help_text) && (
                <Typography variant="caption" sx={{ display: 'block', mt: 0.5, color: hasError ? 'error.main' : 'text.secondary', ml: 1 }}>
                  {errors[field.field_name] || field.help_text}
                </Typography>
              )}
            </Box>
          )}

          {field.field_type === 'date' && (
            <Box>
              <TextField
                fullWidth
                type="date"
                label={field.label}
                value={formData[field.field_name] || ''}
                onChange={(e) => handleInputChange(field.field_name, e.target.value)}
                required={field.is_required}
                error={hasError}
                InputLabelProps={{ shrink: true }}
                variant="outlined"
                size="medium"
              />
              {(errors[field.field_name] || field.help_text) && (
                <Typography variant="caption" sx={{ display: 'block', mt: 0.5, color: hasError ? 'error.main' : 'text.secondary', ml: 1 }}>
                  {errors[field.field_name] || field.help_text}
                </Typography>
              )}
            </Box>
          )}

          {field.field_type === 'radio' && (
            <Box>
              <FormControl component="fieldset" error={hasError} required={field.is_required}>
                <Typography variant="body1" sx={{ mb: 1, color: hasError ? 'error.main' : 'text.primary', fontWeight: 500 }}>
                  {field.label} {field.is_required && '*'}
                </Typography>
                <RadioGroup
                  value={formData[field.field_name] || ''}
                  onChange={(e) => handleInputChange(field.field_name, e.target.value)}
                >
                  <Grid container spacing={1}>
                    {field.options?.map((option) => (
                      <Grid size={{ xs: 12, sm: 6 }} key={option}>
                        <FormControlLabel 
                          value={option} 
                          control={<Radio sx={{ color: 'hsl(var(--primary))', '&.Mui-checked': { color: 'hsl(var(--primary))' } }} />} 
                          label={option} 
                        />
                      </Grid>
                    ))}
                  </Grid>
                </RadioGroup>
                {(errors[field.field_name] || field.help_text) && (
                  <FormHelperText sx={{ ml: 0 }}>
                    {errors[field.field_name] || field.help_text}
                  </FormHelperText>
                )}
              </FormControl>
            </Box>
          )}

          {field.field_type === 'file' && (
            <Box>
              <Button
                component="label"
                variant="outlined"
                startIcon={<CloudUpload />}
                fullWidth
                sx={{
                  py: 1.5,
                  borderColor: hasError ? 'error.main' : 'divider',
                  color: hasError ? 'error.main' : 'text.primary',
                  '&:hover': {
                    borderColor: hasError ? 'error.main' : 'primary.main',
                    bgcolor: 'action.hover',
                  },
                }}
              >
                {files[field.field_name] ? files[field.field_name].name : field.label}
                <input
                  type="file"
                  hidden
                  onChange={(e) => handleFileChange(field.field_name, e.target.files?.[0] || null, field)}
                  required={field.is_required}
                />
              </Button>
              {files[field.field_name] && (
                <Chip
                  label={files[field.field_name].name}
                  onDelete={() => {
                    const newFiles = { ...files };
                    delete newFiles[field.field_name];
                    setFiles(newFiles);
                    setFormData({ ...formData, [field.field_name]: '' });
                  }}
                  sx={{ mt: 1 }}
                  color="primary"
                  icon={<CheckCircle />}
                  size="small"
                />
              )}
              {(() => {
                const rules = field.validation_rules;
                let helperText = field.help_text || '';
                if (rules) {
                  const ruleText = [];
                  if (rules.allowed_file_types?.length) ruleText.push(`Allowed: ${rules.allowed_file_types.join(', ')}`);
                  if (rules.max_file_size) ruleText.push(`Max size: ${rules.max_file_size}MB`);
                  if (ruleText.length > 0) {
                    helperText = helperText ? `${helperText} (${ruleText.join(' | ')})` : ruleText.join(' | ');
                  }
                }
                return (errors[field.field_name] || helperText) && (
                  <Typography variant="caption" sx={{ display: 'block', mt: 0.5, color: hasError ? 'error.main' : 'text.secondary', ml: 1 }}>
                    {errors[field.field_name] || helperText}
                  </Typography>
                );
              })()}
            </Box>
          )}
        </motion.div>
      </Grid>
    );
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Grid container spacing={2.5}>
        <AnimatePresence>
          {fields.map((field) => renderField(field))}
        </AnimatePresence>

        <Grid size={{ xs: 12 }}>
          <Button
            type="submit"
            variant="contained"
            size="large"
            fullWidth
            disabled={submitting}
            startIcon={submitting ? <CircularProgress size={20} /> : <Send />}
            sx={{
              mt: 2,
              py: 1.5,
              fontSize: '1rem',
              fontWeight: 600,
              textTransform: 'none',
              boxShadow: 2,
              '&:hover': {
                boxShadow: 4,
              },
            }}
          >
            {submitting ? 'Submitting...' : 'Submit Form'}
          </Button>
        </Grid>
      </Grid>

      {/* Confirmation Dialog for Incubation Application */}
      <Dialog
        open={openConfirmDialog}
        onClose={() => setOpenConfirmDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: '24px', p: 1 }
        }}
      >
        <DialogTitle sx={{ fontWeight: 700, fontSize: '1.5rem' }}>
          Confirm Application
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ color: 'text.secondary', mb: 2 }}>
            Please confirm that your Gmail address **{formData.email}** is correct.
          </Typography>
          <Box sx={{ p: 2, bgcolor: 'hsl(var(--primary) / 0.05)', borderRadius: '12px', border: '1px solid hsl(var(--primary) / 0.1)' }}>
            <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
              All further information regarding your application and your login credentials for the TCETBI portal will be sent to this email address.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button 
            onClick={() => setOpenConfirmDialog(false)} 
            sx={{ borderRadius: '12px', px: 3 }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained" 
            sx={{ borderRadius: '12px', px: 4 }}
            disabled={submitting}
          >
            {submitting ? <CircularProgress size={24} color="inherit" /> : 'Confirm & Submit'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Validation Errors Modal */}
      <Dialog
        open={openValidationDialog}
        onClose={() => setOpenValidationDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: '24px', p: 1 }
        }}
      >
        <DialogTitle sx={{ fontWeight: 700, fontSize: '1.3rem', color: 'error.main', display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 32, height: 32, borderRadius: '50%', bgcolor: 'error.main', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography sx={{ color: 'white', fontWeight: 700, fontSize: '1.1rem' }}>!</Typography>
          </Box>
          Missing Required Details
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
            Please fill in the following required fields before submitting:
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {validationErrors.map((label, i) => (
              <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 1.5, bgcolor: 'error.main', borderRadius: '12px', opacity: 0.08 + 0.92, background: 'hsl(0 84% 60% / 0.08)', border: '1px solid hsl(0 84% 60% / 0.15)' }}>
                <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'error.main', flexShrink: 0 }} />
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {label} is missing
                </Typography>
              </Box>
            ))}
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={() => setOpenValidationDialog(false)}
            variant="contained"
            color="error"
            sx={{ borderRadius: '12px', px: 4, textTransform: 'none', fontWeight: 600 }}
          >
            Got it, I'll fix it
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
