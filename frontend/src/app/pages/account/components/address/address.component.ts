import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { AddressService } from '../../../../core/services/address.service';
import { IAddress } from '../../../../core/models/interfaces/IAddress';
import { Perform } from '../../../../core/models/classes/Perform';
import { tap } from 'rxjs';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrl: './address.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddressComponent implements OnInit, OnDestroy {
  private _addressService = inject(AddressService);
  addresses = signal<IAddress[]>([]);
  preformApi = new Perform<IAddress[]>();
  
  ngOnInit(): void {
    this.getAddresses();
  }

  putAddressInaddresses(address: IAddress) {
    this.addresses.set([...this.addresses(), address]);
  }
  getAddresses(): void {
    this.preformApi.load(this._addressService.getAddress());
    this.preformApi.data$.pipe(tap(response => { if (response) { this.addresses.set(response) } })).subscribe();
  }

  ngOnDestroy(): void {
    this.preformApi.unsubscribe();
  }
}
