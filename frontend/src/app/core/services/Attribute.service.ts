import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URLS } from '../constant/api-urls';

export interface AttributeValue {
    id: number;
    value: string;
}

export interface ProductAttribute {
    id: number;
    name: string;
    values: AttributeValue[];
}

export interface AttributeDto {
    id ?: number;
    name: string;
    values: string[];
}

@Injectable({ providedIn: 'root' })
export class AttributeService {
    private readonly baseUrl = `${API_URLS.Localhost}/api/attributes`;

    constructor(private http: HttpClient) { }

    getAll(): Observable<ProductAttribute[]> {
        return this.http.get<ProductAttribute[]>(this.baseUrl);
    }

    create(attribute: AttributeDto): Observable<any> {
        return this.http.post(this.baseUrl, attribute);
    }
    update(attribute: AttributeDto , id:number): Observable<any> {
        return this.http.put(this.baseUrl+'/'+id, attribute);
    }

    delete(id: number): Observable<any> {
        return this.http.delete(`${this.baseUrl}/${id}`);
    }
}
