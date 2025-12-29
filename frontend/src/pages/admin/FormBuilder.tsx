import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Grid,
  Chip,
} from '@mui/material';
import { Edit, Delete, Add, DragIndicator } from '@mui/icons-material';
import { toast } from 'sonner';
import { formBuilderService } from '../../api/formBuilderService';
import { motion, Reorder } from 'framer-motion';

interface FormField {
  id: number;
  field_name: string;
  label: string;
  field_type: string;
  placeholder?: string;
  help_text?: string;
  is_required: boolean;
  order: number;
  options?: string[];
}

interface FormTemplate {
  id: number;
  name: string;
  form_type: string;
  description?: string;
  is_active: boolean;
  fields: FormField[];
}

export const FormBuilder = () => {
  const [templates, setTemplates] = useState<FormTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<FormTemplate | null>(null);
  const [editFieldDialog, setEditFieldDialog] = useState(false);
  const [currentField, setCurrentField] = useState<Partial<FormField> | null>(null);
  const [loading, setLoading] = useState(false);
  const [orderedFields, setOrderedFields] = useState<FormField[]>([]);

  useEffect(() => {
    loadTemplates();
  }, []);

  useEffect(() => {
    if (selectedTemplate) {
      setOrderedFields([...selectedTemplate.fields].sort((a, b) => a.order - b.order));
    }
  }, [selectedTemplate]);

  const loadTemplates = async () => {
    try {
      const data = await formBuilderService.listTemplates();
      setTemplates(data);
    } catch (error) {
      toast.error('Failed to load form templates');
    }
  };

  const loadTemplate = async (formType: string) => {
    setLoading(true);
    try {
      const data = await formBuilderService.getTemplate(formType);
      setSelectedTemplate(data);
    } catch (error) {
      toast.error('Failed to load template');
    } finally {
      setLoading(false);
    }
  };

  const handleAddField = () => {
    setCurrentField({
      field_name: '',
      label: '',
      field_type: 'text',
      is_required: false,
      order: selectedTemplate?.fields.length || 0,
    });
    setEditFieldDialog(true);
  };

  const handleEditField = (field: FormField) => {
    setCurrentField(field);
    setEditFieldDialog(true);
  };

  const handleSaveField = async () => {
    if (!currentField || !selectedTemplate) return;

    try {
      if (currentField.id) {
        await formBuilderService.updateField(currentField.id, currentField);
        toast.success('Field updated successfully');
      } else {
        await formBuilderService.addField(selectedTemplate.id, currentField);
        toast.success('Field added successfully');
      }
      
      setEditFieldDialog(false);
      setCurrentField(null);
      loadTemplate(selectedTemplate.form_type);
    } catch (error) {
      toast.error('Failed to save field');
    }
  };

  const handleDeleteField = async (fieldId: number) => {
    if (!confirm('Are you sure you want to delete this field?')) return;

    try {
      await formBuilderService.deleteField(fieldId);
      toast.success('Field deleted successfully');
      if (selectedTemplate) {
        loadTemplate(selectedTemplate.form_type);
      }
    } catch (error) {
      toast.error('Failed to delete field');
    }
  };

  const handleReorder = async (newOrder: FormField[]) => {
    setOrderedFields(newOrder);
    
    if (!selectedTemplate) return;

    try {
      const fieldOrders = newOrder.map((field, index) => ({
        id: field.id,
        order: index
      }));
      
      await formBuilderService.reorderFields(selectedTemplate.id, fieldOrders);
      toast.success('Field order updated');
      loadTemplate(selectedTemplate.form_type);
    } catch (error) {
      toast.error('Failed to update field order');
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 700 }}>
        Form Builder
      </Typography>

      <Grid container spacing={3}>
        {/* Template List */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Form Templates
            </Typography>
            {templates.map((template) => (
              <Box
                key={template.id}
                sx={{
                  p: 2,
                  mb: 1,
                  border: '1px solid',
                  borderColor: selectedTemplate?.id === template.id ? 'primary.main' : 'divider',
                  borderRadius: 1,
                  cursor: 'pointer',
                  '&:hover': { bgcolor: 'action.hover' },
                }}
                onClick={() => loadTemplate(template.form_type)}
              >
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  {template.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {template.fields.length} fields
                </Typography>
                <Chip
                  label={template.is_active ? 'Active' : 'Inactive'}
                  size="small"
                  color={template.is_active ? 'success' : 'default'}
                  sx={{ ml: 1 }}
                />
              </Box>
            ))}
          </Paper>
        </Grid>

        {/* Field Editor */}
        <Grid size={{ xs: 12, md: 8 }}>
          {selectedTemplate ? (
            <Paper sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box>
                  <Typography variant="h6">{selectedTemplate.name} - Fields</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Drag fields to reorder them
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={handleAddField}
                >
                  Add Field
                </Button>
              </Box>

              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell width="60px">Order</TableCell>
                      <TableCell>Label</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Required</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <Reorder.Group 
                      axis="y" 
                      values={orderedFields} 
                      onReorder={handleReorder}
                      as="tbody"
                      style={{ display: 'contents' }}
                    >
                      {orderedFields.map((field) => (
                        <Reorder.Item 
                          key={field.id} 
                          value={field}
                          as="tr"
                          style={{ 
                            cursor: 'grab',
                            backgroundColor: 'inherit'
                          }}
                          whileDrag={{ 
                            scale: 1.02,
                            boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                            backgroundColor: 'hsl(var(--muted) / 0.5)',
                            zIndex: 1000
                          }}
                        >
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <DragIndicator sx={{ cursor: 'grab', color: 'text.secondary' }} />
                              <Chip label={field.order} size="small" />
                            </Box>
                          </TableCell>
                          <TableCell>{field.label}</TableCell>
                          <TableCell>
                            <Chip label={field.field_type} size="small" />
                          </TableCell>
                          <TableCell>
                            {field.is_required ? (
                              <Chip label="Required" size="small" color="error" />
                            ) : (
                              <Chip label="Optional" size="small" />
                            )}
                          </TableCell>
                          <TableCell>
                            <IconButton size="small" onClick={() => handleEditField(field)}>
                              <Edit />
                            </IconButton>
                            <IconButton size="small" onClick={() => handleDeleteField(field.id)}>
                              <Delete />
                            </IconButton>
                          </TableCell>
                        </Reorder.Item>
                      ))}
                    </Reorder.Group>
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          ) : (
            <Paper sx={{ p: 8, textAlign: 'center' }}>
              <Typography color="text.secondary">
                Select a form template to edit
              </Typography>
            </Paper>
          )}
        </Grid>
      </Grid>

      {/* Enhanced Field Edit Dialog */}
      <Dialog 
        open={editFieldDialog} 
        onClose={() => setEditFieldDialog(false)} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '24px',
            background: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
          }
        }}
      >
        <DialogTitle sx={{ 
          borderBottom: '1px solid hsl(var(--border))',
          pb: 2,
          background: 'linear-gradient(135deg, hsl(var(--primary) / 0.05) 0%, transparent 100%)'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{
              width: 48,
              height: 48,
              borderRadius: '12px',
              bgcolor: 'hsl(var(--primary) / 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Edit sx={{ color: 'hsl(var(--primary))' }} />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, fontFamily: 'Poppins, sans-serif' }}>
                {currentField?.id ? 'Edit Field' : 'Add New Field'}
              </Typography>
              <Typography variant="caption" sx={{ color: 'hsl(var(--muted-foreground))' }}>
                Configure field properties and behavior
              </Typography>
            </Box>
          </Box>
        </DialogTitle>
        
        <DialogContent sx={{ mt: 3 }}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: 'hsl(var(--primary))' }}>
                Basic Information
              </Typography>
            </Grid>
            
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Field Name (Internal)"
                value={currentField?.field_name || ''}
                onChange={(e) => setCurrentField({ ...currentField, field_name: e.target.value })}
                placeholder="e.g., startup_name"
                helperText="Used internally, no spaces"
              />
            </Grid>
            
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Label (Display)"
                value={currentField?.label || ''}
                onChange={(e) => setCurrentField({ ...currentField, label: e.target.value })}
                placeholder="e.g., Startup Name"
                helperText="Shown to users"
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, mt: 2, color: 'hsl(var(--primary))' }}>
                Field Type
              </Typography>
            </Grid>

            <Grid size={{ xs: 12, md: 8 }}>
              <FormControl fullWidth>
                <InputLabel>Field Type</InputLabel>
                <Select
                  value={currentField?.field_type || 'text'}
                  onChange={(e) => setCurrentField({ ...currentField, field_type: e.target.value })}
                  label="Field Type"
                >
                  <MenuItem value="text">📝 Text</MenuItem>
                  <MenuItem value="email">📧 Email</MenuItem>
                  <MenuItem value="number">🔢 Number</MenuItem>
                  <MenuItem value="phone">📱 Phone</MenuItem>
                  <MenuItem value="textarea">📄 Text Area</MenuItem>
                  <MenuItem value="select">📋 Dropdown</MenuItem>
                  <MenuItem value="checkbox">☑️ Checkbox</MenuItem>
                  <MenuItem value="radio">🔘 Radio</MenuItem>
                  <MenuItem value="file">📎 File Upload</MenuItem>
                  <MenuItem value="date">📅 Date</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={currentField?.is_required || false}
                    onChange={(e) => setCurrentField({ ...currentField, is_required: e.target.checked })}
                  />
                }
                label="Required Field"
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, mt: 2, color: 'hsl(var(--primary))' }}>
                Additional Settings
              </Typography>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Placeholder"
                value={currentField?.placeholder || ''}
                onChange={(e) => setCurrentField({ ...currentField, placeholder: e.target.value })}
                placeholder="Enter placeholder text..."
              />
            </Grid>
            
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Help Text"
                value={currentField?.help_text || ''}
                onChange={(e) => setCurrentField({ ...currentField, help_text: e.target.value })}
                multiline
                rows={2}
                placeholder="Provide helpful instructions..."
              />
            </Grid>
            
            {(currentField?.field_type === 'select' || currentField?.field_type === 'radio') && (
              <Grid size={{ xs: 12 }}>
                <Paper sx={{ p: 3, bgcolor: 'hsl(var(--muted) / 0.3)', borderRadius: '12px' }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
                    Options Configuration
                  </Typography>
                  <TextField
                    fullWidth
                    label="Options (comma-separated)"
                    value={currentField?.options?.join(', ') || ''}
                    onChange={(e) =>
                      setCurrentField({
                        ...currentField,
                        options: e.target.value.split(',').map((s) => s.trim()).filter(s => s),
                      })
                    }
                    placeholder="Option 1, Option 2, Option 3"
                    helperText="Separate each option with a comma"
                    multiline
                    rows={3}
                  />
                  {currentField?.options && currentField.options.length > 0 && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="caption" sx={{ color: 'hsl(var(--muted-foreground))', mb: 1, display: 'block' }}>
                        Preview:
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {currentField.options.map((opt, i) => (
                          <Chip 
                            key={i} 
                            label={opt} 
                            size="small" 
                            sx={{ bgcolor: 'hsl(var(--primary) / 0.1)', color: 'hsl(var(--primary))' }}
                          />
                        ))}
                      </Box>
                    </Box>
                  )}
                </Paper>
              </Grid>
            )}
          </Grid>
        </DialogContent>
        
        <DialogActions sx={{ p: 3, borderTop: '1px solid hsl(var(--border))', gap: 2 }}>
          <Button 
            onClick={() => setEditFieldDialog(false)}
            sx={{ borderRadius: '12px', textTransform: 'none', px: 3 }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSaveField} 
            variant="contained"
            sx={{ 
              borderRadius: '12px',
              textTransform: 'none',
              px: 4,
              background: 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--primary) / 0.8) 100%)',
            }}
          >
            {currentField?.id ? 'Update Field' : 'Add Field'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};
