import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { getErrorMessage } from '../../../../core/utils/form-error-messages';
import { AlphanumericValidator, lettersAndSpacesValidator } from '../../../../core/validators/general-validators';

@Component({
  selector: 'app-address-from',
  templateUrl: './address-from.component.html',
  styleUrl: './address-from.component.css'
})
export class AddressFromComponent implements OnInit {

  addressForm !: FormGroup
  private _formBuilder = inject(FormBuilder);
  ngOnInit(): void {
    this.initialControl();
  }
  initialControl(): void {
    this.addressForm = this._formBuilder.group({
      city: ['', [Validators.required, lettersAndSpacesValidator()]],
      area: ['', [Validators.required, lettersAndSpacesValidator()]],
      landmark: ['', [Validators.required, AlphanumericValidator()]],
      street: ['', [Validators.required, AlphanumericValidator()]],
    })
  }
  isControlInvalid(controlName: string): boolean | undefined {
    const control = this.addressForm.get(controlName);
    return control?.invalid && (control?.touched || control?.dirty);
  }
  getErrorMessage(controlName: string): string | null {
    return getErrorMessage(this.addressForm, controlName);
  }
  onSubmit(): void {
    if (this.addressForm.valid) {
      console.log('Form Submitted:', this.addressForm.value);
    } else {
      console.log('Form is invalid.');
    }
  }
}
