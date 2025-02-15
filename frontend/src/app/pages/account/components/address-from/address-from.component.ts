import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { getErrorMessage } from '../../../../core/utils/form-error-messages';
import { AlphanumericValidator, lettersAndSpacesValidator } from '../../../../core/validators/general-validators';
import { Perform } from '../../../../core/models/classes/Perform';
import { IBaseApiResponse } from '../../../../core/models/interfaces/IBaseApiResponse';
import { AddressService } from '../../../../core/services/address.service';
import { tap } from 'rxjs';
import { MessageService } from '../../../../core/services/Message.service';
import { IAddress } from '../../../../core/models/interfaces/IAddress';

@Component({
  selector: 'app-address-from',
  templateUrl: './address-from.component.html',
  styleUrl: './address-from.component.css'
})
export class AddressFromComponent implements OnInit {
  @Output("address") address = new EventEmitter<IAddress>();
  addressForm !: FormGroup
  private _formBuilder = inject(FormBuilder);
  private _addressService = inject(AddressService);
  preformApi = new Perform<IBaseApiResponse>();
  private messageService = inject(MessageService);
  ngOnInit(): void {
    this.initialControl();
  }
  initialControl(): void {
    this.addressForm = this._formBuilder.group({
      fullName: ['', [Validators.required, lettersAndSpacesValidator()]],
      phone: ['', [Validators.required, AlphanumericValidator()]],
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
      this.postAddress();
      this.address.emit(this.addressForm.value);
      this.addressForm.reset();
    } else {
      console.log('Form is invalid.');
    }
  }

  postAddress(): void {
    this.preformApi.load(this._addressService.postAddress(this.addressForm.value).pipe(
      tap(response => {
        if (response.statusCode == 200) {
          this.messageService.showSuccess('Address added successfully');
        }
      })
    ));
  }

}
