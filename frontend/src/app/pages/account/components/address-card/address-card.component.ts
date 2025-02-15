import { Component, Input, input } from '@angular/core';
import { IAddress } from '../../../../core/models/interfaces/IAddress';

@Component({
  selector: 'app-address-card',
  templateUrl: './address-card.component.html',
  styleUrl: './address-card.component.css'
})
export class AddressCardComponent {
  @Input("data") data !: IAddress;
  
}
