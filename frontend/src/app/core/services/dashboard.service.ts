import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ChartData } from '../models/interfaces/IChartData';
import { HttpClient } from '@angular/common/http';
import { IRevenuePoint } from '../models/interfaces/IRevenuePoint';

@Injectable({ providedIn: 'root' })
export class DashboardService {
    constructor() { }
    private _http = inject(HttpClient);
    getCounterData(): Observable<ChartData> {
        return this._http.get<ChartData>("https://localhost:7197/api/orders/counter");
    }
    getRevenueTimeSeries(): Observable<IRevenuePoint[]> {
        return this._http.get<IRevenuePoint[]>(`https://localhost:7197/api/orders/revenue-series`);
    }
}