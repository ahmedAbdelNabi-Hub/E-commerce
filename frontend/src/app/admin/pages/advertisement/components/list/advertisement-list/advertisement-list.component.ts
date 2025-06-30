import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { tap, catchError, of, delay, pipe } from 'rxjs';
import { Iadvertisement } from '../../../../../../core/models/interfaces/ImageSlider';
import { AdvertisementService } from '../../../../../../core/services/advertisement.service';
import { Perform } from '../../../../../../core/models/classes/Perform';
import { IBaseApiResponse } from '../../../../../../core/models/interfaces/IBaseApiResponse';
import { MessageService } from '../../../../../../core/services/Message.service';

@Component({
  selector: 'app-advertisement-list',
  templateUrl: './advertisement-list.component.html',
  styleUrl: './advertisement-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdvertisementListComponent implements OnInit {
  private advertisementService = inject(AdvertisementService)
  advertisements = signal<Iadvertisement[]>([]);
  preformApi = new Perform<IBaseApiResponse>();
  private messageService = inject(MessageService);

  ngOnInit(): void {

    this.advertisementService.getAdvertisements().pipe(
      tap(response => {
        this.advertisements.set(response);
        console.log(this.advertisements())
      }),
      catchError(error => {
        console.error('Error fetching image slider:', error);
        return of([]); // Return an empty array on error
      }),
    ).subscribe();
  }

  toggleStatus(id: number, index: number) {
    this.preformApi.load(
      this.advertisementService.toggleStatusAdvertisement(id).pipe(
        tap(() => {
          const updatedAds = [...this.advertisements()];
          updatedAds[index] = {
            ...updatedAds[index],
            isActive: !updatedAds[index].isActive
          };
          this.advertisements.set(updatedAds);
          this.messageService.showSuccess("The advertisement status has been changed successfully");
        })
      )
    )
  }
}
