import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function AlphanumericValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const value = control.value;
        if (!value) {
            return null; // Landmark is optional
        }
        const isValid = /^[a-zA-Z0-9\s,]+$/.test(value);
        if (!isValid) {
            return { alphanumeric: ' must be alphanumeric with commas allowed' };
        }
        return null;
    }
}

export function lettersAndSpacesValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const value = control.value;
        if (!value) {
            return null; // Landmark is optional
        }
        const isValid = /^[a-zA-Z\s]+$/.test(value);
        const minLength = value.length >= 2;
        if (!isValid || !minLength) {
            return { lettersAndSpaces: ' must contain only letters and be at least 2 characters long' };
        }

        return null;
    }
}
