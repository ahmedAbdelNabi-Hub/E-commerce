import { FormGroup, AbstractControl } from '@angular/forms';

// Enhanced error message mapping
const ERROR_MESSAGES: { [key: string]: (error: any, controlName: string) => string } = {
  required: (error: any, controlName: string) => `${formatControlName(controlName)} is required.`,

  email: (error: any, controlName: string) => `Please enter a valid email address.`,

  minlength: (error: any, controlName: string) => {
    const minLength = error.requiredLength;
    const actualLength = error.actualLength;
    return `${formatControlName(controlName)} must be at least ${minLength} characters long. (Current: ${actualLength})`;
  },

  maxlength: (error: any, controlName: string) => {
    const maxLength = error.requiredLength;
    const actualLength = error.actualLength;
    return `${formatControlName(controlName)} cannot exceed ${maxLength} characters. (Current: ${actualLength})`;
  },

  min: (error: any, controlName: string) => {
    const minValue = error.min;
    return `${formatControlName(controlName)} must be greater than or equal to ${minValue}.`;
  },

  max: (error: any, controlName: string) => {
    const maxValue = error.max;
    return `${formatControlName(controlName)} must be less than or equal to ${maxValue}.`;
  },

  pattern: (error: any, controlName: string) => {
    // Custom messages for common patterns
    const patternMessages: { [key: string]: string } = {
      'phoneNumber': 'Please enter a valid phone number (10-15 digits).',
      'email': 'Please enter a valid email address.',
      'password': 'Password format is invalid.',
      'zipCode': 'Please enter a valid zip code.',
      'url': 'Please enter a valid URL.'
    };

    return patternMessages[controlName] || `${formatControlName(controlName)} format is invalid.`;
  },

  strongDescription: (error: any, controlName: string) => error.message || `${formatControlName(controlName)} description is not strong enough.`,

  strongName: (error: any, controlName: string) => error.message || `${formatControlName(controlName)} name requirements not met.`,

  strongPassword: (error: any, controlName: string) => error.message || 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.',

  strongBrand: (error: any, controlName: string) => `${formatControlName(controlName)} contains a forbidden brand.`,

  dimensionsFormat: () => 'Dimensions must be in the format: Length x Width x Height',

  positiveNumber: (error: any, controlName: string) => `${formatControlName(controlName)} must be a positive number.`,

  requiredFile: () => 'An image file is required.',

  alphanumeric: (error: any, controlName: string) => `${formatControlName(controlName)} must be alphanumeric with commas allowed.`,

  lettersAndSpaces: (error: any, controlName: string) => `${formatControlName(controlName)} must contain only letters and be at least 2 characters long.`,

  // Custom validation errors
  passwordMismatch: () => 'Passwords do not match.',

  phoneNumber: (error: any, controlName: string) => 'Please enter a valid phone number.',

  fileSize: (error: any, controlName: string) => {
    const maxSize = error.maxSize ? formatFileSize(error.maxSize) : '5MB';
    return `File size must not exceed ${maxSize}.`;
  },

  fileType: (error: any, controlName: string) => {
    const allowedTypes = error.allowedTypes?.join(', ') || 'image files';
    return `Only ${allowedTypes} are allowed.`;
  },

  dateRange: (error: any, controlName: string) => {
    if (error.min && error.max) {
      return `Date must be between ${formatDate(error.min)} and ${formatDate(error.max)}.`;
    } else if (error.min) {
      return `Date must be after ${formatDate(error.min)}.`;
    } else if (error.max) {
      return `Date must be before ${formatDate(error.max)}.`;
    }
    return `${formatControlName(controlName)} date is invalid.`;
  },

  uniqueValue: (error: any, controlName: string) => `${formatControlName(controlName)} must be unique.`,

  async: (error: any, controlName: string) => error.message || `${formatControlName(controlName)} validation failed.`,
};

/**
 * Get error message for a form control
 * @param form FormGroup instance
 * @param controlName Name of the form control
 * @param customMessages Optional custom error messages
 * @returns Error message string or null if no error
 */
export function getErrorMessage(
  form: FormGroup,
  controlName: string,
  customMessages?: { [key: string]: string }
): string | null {
  const control = form.get(controlName);

  if (!control || !control.errors || (!control.touched && !control.dirty)) {
    return null;
  }

  // Get the first error key
  const firstErrorKey = Object.keys(control.errors)[0];
  const error = control.errors[firstErrorKey];

  // Check for custom message first
  if (customMessages && customMessages[firstErrorKey]) {
    return customMessages[firstErrorKey];
  }

  // Use built-in error message generator
  const messageGenerator = ERROR_MESSAGES[firstErrorKey];
  if (messageGenerator) {
    return messageGenerator(error, controlName);
  }

  // Fallback for unknown errors
  return `${formatControlName(controlName)} is invalid.`;
}

/**
 * Get all error messages for a form control
 * @param form FormGroup instance
 * @param controlName Name of the form control
 * @returns Array of error messages
 */
export function getAllErrorMessages(form: FormGroup, controlName: string): string[] {
  const control = form.get(controlName);

  if (!control || !control.errors || (!control.touched && !control.dirty)) {
    return [];
  }

  return Object.keys(control.errors).map(errorKey => {
    const error = control.errors![errorKey];
    const messageGenerator = ERROR_MESSAGES[errorKey];

    if (messageGenerator) {
      return messageGenerator(error, controlName);
    }

    return `${formatControlName(controlName)} has ${errorKey} error.`;
  });
}

/**
 * Check if a form control has any errors
 * @param form FormGroup instance
 * @param controlName Name of the form control
 * @returns Boolean indicating if control has errors
 */
export function hasControlError(form: FormGroup, controlName: string): boolean {
  const control = form.get(controlName);
  return !!(control && control.errors && (control.touched || control.dirty));
}

/**
 * Check if a form control has a specific error
 * @param form FormGroup instance
 * @param controlName Name of the form control
 * @param errorType Type of error to check for
 * @returns Boolean indicating if control has the specific error
 */
export function hasSpecificError(form: FormGroup, controlName: string, errorType: string): boolean {
  const control = form.get(controlName);
  return !!(control && control.hasError(errorType) && (control.touched || control.dirty));
}

/**
 * Get form-level error messages
 * @param form FormGroup instance
 * @returns Array of form-level error messages
 */
export function getFormErrors(form: FormGroup): string[] {
  const errors: string[] = [];

  if (form.errors) {
    Object.keys(form.errors).forEach(errorKey => {
      const messageGenerator = ERROR_MESSAGES[errorKey];
      if (messageGenerator) {
        errors.push(messageGenerator(form.errors![errorKey], 'form'));
      } else {
        errors.push(`Form has ${errorKey} error.`);
      }
    });
  }

  return errors;
}

/**
 * Mark all controls in a form as touched and dirty
 * @param form FormGroup instance
 */
export function markAllControlsAsTouched(form: FormGroup): void {
  Object.keys(form.controls).forEach(key => {
    const control = form.get(key);
    if (control) {
      control.markAsTouched();
      control.markAsDirty();

      // Handle nested form groups
      if (control instanceof FormGroup) {
        markAllControlsAsTouched(control);
      }
    }
  });
}

// Helper functions
function formatControlName(controlName: string): string {
  // Convert camelCase to readable format
  return controlName
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .trim();
}

function formatFileSize(bytes: number): string {
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  if (bytes === 0) return '0 Byte';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
}

function formatDate(date: Date | string): string {
  if (typeof date === 'string') {
    date = new Date(date);
  }
  return date.toLocaleDateString();
}

// Additional utility functions for validation
export function createCustomValidator(
  validatorFn: (control: AbstractControl) => any,
  errorKey: string,
  errorMessage: string
) {
  // Register the custom error message
  ERROR_MESSAGES[errorKey] = () => errorMessage;

  return validatorFn;
}