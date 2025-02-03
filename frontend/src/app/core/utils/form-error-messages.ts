import { FormGroup } from '@angular/forms';

export function getErrorMessage(form: FormGroup, controlName: string): string | null {
  const control = form.get(controlName);
  if (!control?.touched || !control?.errors) {
    return null;
  }

  if (control?.hasError('required')) {
    return `${controlName} is required.`;
  }
  if (control?.hasError('strongDescription')) {
    return `${control.errors?.['strongDescription']}`;
  }
  if (control?.hasError('min')) {
    return `${controlName} must be greater than the minimum allowed value.`;
  }
  if (control?.hasError('max')) {
    return `${controlName} must be less than the maximum allowed value.`;
  }
  if (control?.hasError('minlength')) {
    const minLength = control.errors?.['minlength'].requiredLength;
    return `${controlName} must be at least ${minLength} characters long.`;
  }
  if (control?.hasError('maxlength')) {
    const maxLength = control.errors?.['maxlength'].requiredLength;
    return `${controlName} cannot exceed ${maxLength} characters.`;
  }
  if (control?.hasError('pattern')) {
    return `${controlName} format is invalid.`;
  }
  if (control?.hasError('dimensionsFormat')) {
    return 'Dimensions must be in the format: Length x Width x Height';
  }
  if (control?.hasError('positiveNumber')) {
    return `${controlName} must be a positive number.`;
  }
  if (control?.hasError('dimensionsFormat')) {
    return 'Dimensions must be in the format: Length x Width x Height';
  }
  if (control?.hasError('strongName')) {
    return `${control.errors?.['strongName']}`
  }
  if (control?.hasError('requiredFile')) {
    return 'An image file is required.';
  }
  if (control?.hasError('strongBrand')) {
    return `${controlName} contains a forbidden brand.`;
  }
  if (control?.hasError('alphanumeric')) {
    return `${controlName} must be alphanumeric with commas allowed`;
  }
  if (control?.hasError('lettersAndSpaces')) {
    return `${controlName}  must contain only letters and be at least 2 characters long`;
  }


  return null;
}
