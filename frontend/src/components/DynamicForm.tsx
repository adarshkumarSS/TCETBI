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
} from '@mui/material';
import { CloudUpload, Send, CheckCircle } from '@mui/icons-material';
import { toast } from 'sonner';
import { dynamicFormService } from '../api/dynamicFormService';
import { motion, AnimatePresence } from 'framer-motion';

interface FormFieldData {
  id: number;
  field_name: string;
  label: string;
  field_type: string;
  placeholder?: string;
  help_text?: string;
  is_required: boolean;
  options?: string[];
  conditional_logic?: any;
  validation_rules?: any;
}

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

  useEffect(() => {
    loadFormStructure();
  }, [formType]);

  const loadFormStructure = async () => {
    try {
      const data = await dynamicFormService.getFormStructure(formType);
      setFields(data.fields || []);
      
      // Initialize form data with default values
      const initialData: Record<string, any> = {};
      data.fields?.forEach((field: FormFieldData) => {
        if (field.field_type === 'checkbox') {
          initialData[field.field_name] = false;
        } else {
          initialData[field.field_name] = '';
        }
      });
      setFormData(initialData);
    } catch (error) {
      toast.error('Failed to load form');
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

  const handleFileChange = (fieldName: string, file: File | null) => {
    if (file) {
      setFiles({ ...files, [fieldName]: file });
      setFormData({ ...formData, [fieldName]: file.name });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    fields.forEach((field) => {
      if (field.is_required) {
        const value = formData[field.field_name];
        if (!value || (typeof value === 'string' && value.trim() === '')) {
          newErrors[field.field_name] = `${field.label} is required`;
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
      toast.error('Please fill in all required fields');
      return;
    }

    setSubmitting(true);
    try {
      const submitData = new FormData();
      
      // Add regular form data
      Object.keys(formData).forEach((key) => {
        if (!files[key]) {
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
                label={field.label}
              />
              {field.help_text && (
                <Typography variant="caption" sx={{ display: 'block', mt: 0.5, color: 'text.secondary', ml: 4 }}>
                  {field.help_text}
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
                  onChange={(e) => handleFileChange(field.field_name, e.target.files?.[0] || null)}
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
              {(errors[field.field_name] || field.help_text) && (
                <Typography variant="caption" sx={{ display: 'block', mt: 0.5, color: hasError ? 'error.main' : 'text.secondary', ml: 1 }}>
                  {errors[field.field_name] || field.help_text}
                </Typography>
              )}
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
    </Box>
  );
};
