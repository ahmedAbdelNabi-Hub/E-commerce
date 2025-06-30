import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ChartData } from '../models/interfaces/IChartData';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class DashboardService {
    constructor() { }
    private _http = inject(HttpClient);
    getChartData(): Observable<ChartData> {
        return this._http.get<ChartData>("https://localhost:7197/api/orders/dashboard-chart-data");
    }
}