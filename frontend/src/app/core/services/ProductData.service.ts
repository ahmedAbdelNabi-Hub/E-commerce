import { Injectable } from '@angular/core';
import { IProduct } from '../models/interfaces/IProduct';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProductDataService {
    private formData: BehaviorSubject<IProduct | null> = new BehaviorSubject<IProduct | null>(null);
    formData$ = this.formData.asObservable();
    setFormData(data: IProduct) {
        this.formData.next(data);
    }
    clearFormData() {
        this.formData.next(null);
        this.formData.complete
    }

}