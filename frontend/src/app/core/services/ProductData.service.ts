import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ProductDataService {

    private formData: any = null;

    setFormData(data: any) {
        this.formData = data;
    }

    getFormData() {
        return this.formData;
    }

    clearFormData() {
        this.formData = null;
    }

}