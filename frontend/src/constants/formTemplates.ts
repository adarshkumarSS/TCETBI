
export interface FormFieldData {
  id: number;
  field_name: string;
  label: string;
  field_type: string;
  placeholder?: string;
  help_text?: string;
  is_required: boolean;
  order: number;
  options?: string[];
  conditional_logic?: any;
  validation_rules?: any;
}

export interface FormTemplate {
  form_type: string;
  name: string;
  description: string;
  fields: FormFieldData[];
}

export const DEFAULT_FORM_TEMPLATES: Record<string, FormTemplate> = {
  funding_support: {
    form_type: 'funding_support',
    name: 'Funding Support',
    description: 'Apply for funding schemes like NIDHI PRAYAS, NIDHI EIR, SISFS, and Idea Hackathon',
    fields: [
      { id: 1, field_name: 'name', label: 'Full Name', field_type: 'text', is_required: true, order: 0 },
      { id: 2, field_name: 'email', label: 'Email Address', field_type: 'email', is_required: true, order: 1 },
      { id: 3, field_name: 'phone', label: 'Phone Number', field_type: 'phone', is_required: true, order: 2 },
      { id: 4, field_name: 'startup_name', label: 'Startup / Company Name', field_type: 'text', is_required: true, order: 3 },
      {
        id: 5,
        field_name: 'scheme',
        label: 'Funding Scheme',
        field_type: 'select',
        is_required: true,
        order: 4,
        options: ['Idea Hackathon', 'NIDHI PRAYAS', 'NIDHI EIR', 'SISFS', 'Other']
      },
      { id: 6, field_name: 'amount_requested', label: 'Amount Required (in ₹)', field_type: 'number', is_required: false, order: 5 },
      { id: 7, field_name: 'description', label: 'Startup Details & Funding Purpose', field_type: 'textarea', is_required: true, order: 6, placeholder: 'Tell us about your startup and why you need this funding...' },
      { id: 8, field_name: 'pitch_deck', label: 'Upload Pitch Deck (PDF)', field_type: 'file', is_required: false, order: 7 },
    ],
  },
  mentoring_support: {
    form_type: 'mentoring_support',
    name: 'Mentoring Support',
    description: 'Connect with industry experts and seasoned entrepreneurs',
    fields: [
      { id: 9, field_name: 'name', label: 'Your Name', field_type: 'text', is_required: true, order: 0 },
      { id: 10, field_name: 'email', label: 'Email', field_type: 'email', is_required: true, order: 1 },
      { id: 11, field_name: 'phone', label: 'Phone', field_type: 'phone', is_required: false, order: 2 },
      { id: 12, field_name: 'startup_name', label: 'Startup Name', field_type: 'text', is_required: true, order: 3 },
      { id: 13, field_name: 'domain', label: 'Domain', field_type: 'text', is_required: false, order: 4 },
      { id: 14, field_name: 'description', label: 'Mentoring Needs', field_type: 'textarea', is_required: true, order: 5 },
    ],
  },
  idea_validation: {
    form_type: 'idea_validation',
    name: 'Idea Validation',
    description: 'Validate your MVP, test your assumptions, and refine your product strategy',
    fields: [
      { id: 15, field_name: 'name', label: 'Your Name', field_type: 'text', is_required: true, order: 0 },
      { id: 16, field_name: 'email', label: 'Email Address', field_type: 'email', is_required: true, order: 1 },
      { id: 17, field_name: 'phone', label: 'Phone', field_type: 'phone', is_required: false, order: 2 },
      { id: 18, field_name: 'startup_name', label: 'Idea Title / Startup Name', field_type: 'text', is_required: true, order: 3 },
      { id: 19, field_name: 'target_market', label: 'Domain (e.g. HealthTech, EdTech)', field_type: 'text', is_required: true, order: 4 },
      { id: 20, field_name: 'idea_details', label: 'Detailed Idea Description', field_type: 'textarea', is_required: true, order: 5, placeholder: 'What problem are you solving? How does your product work?' },
      { id: 21, field_name: 'testing_requirements', label: 'Testing & Validation Requirements', field_type: 'textarea', is_required: false, order: 6, placeholder: 'What specific help do you need for validation?' },
      { id: 22, field_name: 'pitch_deck', label: 'Upload Pitch Deck (PDF/PPTX)', field_type: 'file', is_required: false, order: 7 },
    ],
  },
  contact: {
    form_type: 'contact',
    name: 'Contact Us',
    description: 'Get in touch with us',
    fields: [
      { id: 23, field_name: 'name', label: 'Name', field_type: 'text', is_required: true, order: 0 },
      { id: 24, field_name: 'email', label: 'Email', field_type: 'email', is_required: true, order: 1 },
      { id: 25, field_name: 'phone', label: 'Phone', field_type: 'phone', is_required: false, order: 2 },
      { id: 26, field_name: 'subject', label: 'Subject', field_type: 'text', is_required: true, order: 3 },
      { id: 27, field_name: 'message', label: 'Message', field_type: 'textarea', is_required: true, order: 4 },
    ],
  },
  incubation_application: {
    form_type: 'incubation_application',
    name: 'Incubation Application',
    description: 'Application for Incubation Services at TCE-TBI',
    fields: [
      { id: 28, field_name: 'profile_image', label: 'Profile Photo', field_type: 'file', is_required: true, order: 0 },
      { id: 29, field_name: 'resume', label: 'Entrepreneur Resume (PDF)', field_type: 'file', is_required: true, order: 1 },
      { id: 30, field_name: 'businessName', label: 'Name of Business', field_type: 'text', is_required: true, order: 2 },
      { id: 31, field_name: 'businessDescription', label: 'Business Description', field_type: 'textarea', is_required: true, order: 3 },
      {
        id: 32,
        field_name: 'businessType',
        label: 'Type of Business',
        field_type: 'select',
        is_required: true,
        order: 4,
        options: ['Services', 'High Technology', 'Other']
      },
      {
        id: 33,
        field_name: 'legalEntity',
        label: 'Legal Entity',
        field_type: 'select',
        is_required: true,
        order: 5,
        options: ['Proprietorship', 'Partnership', 'Private Limited', 'LLP', 'Other']
      },
      {
        id: 34,
        field_name: 'salutation',
        label: 'Salutation',
        field_type: 'select',
        is_required: true,
        order: 6,
        options: ['Mr', 'Mrs', 'Dr', 'Prof']
      },
      { id: 35, field_name: 'fullName', label: 'Full Name', field_type: 'text', is_required: true, order: 7 },
      { id: 36, field_name: 'fatherName', label: 'Father Name', field_type: 'text', is_required: true, order: 8 },
      { id: 37, field_name: 'age', label: 'Age', field_type: 'number', is_required: true, order: 9 },
      { id: 38, field_name: 'email', label: 'Email', field_type: 'email', is_required: true, order: 10, help_text: 'The Gmail ID provided will be used for future communications and TCETBI portal credentials upon approval.' },
      { id: 39, field_name: 'resMobile', label: 'Residential Mobile', field_type: 'phone', is_required: true, order: 11 },
      { id: 40, field_name: 'offMobile', label: 'Office Mobile', field_type: 'phone', is_required: false, order: 12 },
      { id: 41, field_name: 'address', label: 'Postal / Residential Address', field_type: 'textarea', is_required: true, order: 13 },
      { id: 42, field_name: 'city', label: 'City', field_type: 'text', is_required: true, order: 14 },
      { id: 43, field_name: 'state', label: 'State', field_type: 'text', is_required: true, order: 15 },
      { id: 44, field_name: 'post', label: 'Post', field_type: 'text', is_required: true, order: 16 },
      { id: 45, field_name: 'country', label: 'Country', field_type: 'text', is_required: true, order: 17 },
      { id: 46, field_name: 'numChairs', label: 'Number of Chairs Required', field_type: 'number', is_required: false, order: 18 },
      { id: 47, field_name: 'fullTimeEmployees', label: 'Full Time Employees', field_type: 'number', is_required: false, order: 19 },
      { id: 48, field_name: 'partTimeEmployees', label: 'Part Time Employees', field_type: 'number', is_required: false, order: 20 },
      { id: 49, field_name: 'consultants', label: 'Consultants', field_type: 'number', is_required: false, order: 21 },
      { id: 50, field_name: 'reference1Name', label: 'Reference 1 - Name', field_type: 'text', is_required: true, order: 22 },
      { id: 51, field_name: 'reference1Mobile', label: 'Reference 1 - Mobile', field_type: 'phone', is_required: true, order: 23 },
      { id: 52, field_name: 'reference1Email', label: 'Reference 1 - Email', field_type: 'email', is_required: true, order: 24 },
      { id: 53, field_name: 'reference1Address', label: 'Reference 1 - Address', field_type: 'textarea', is_required: true, order: 25 },
      { id: 54, field_name: 'reference2Name', label: 'Reference 2 - Name', field_type: 'text', is_required: true, order: 26 },
      { id: 55, field_name: 'reference2Mobile', label: 'Reference 2 - Mobile', field_type: 'phone', is_required: true, order: 27 },
      { id: 56, field_name: 'reference2Email', label: 'Reference 2 - Email', field_type: 'email', is_required: true, order: 28 },
      { id: 57, field_name: 'reference2Address', label: 'Reference 2 - Address', field_type: 'textarea', is_required: true, order: 29 },
      { id: 58, field_name: 'declaration', label: 'I agree to the terms and conditions', field_type: 'checkbox', is_required: true, order: 30 },
    ],
  },
};
