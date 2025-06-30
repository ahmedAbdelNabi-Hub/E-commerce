import {
  Component,
  OnInit,
  ViewChild,
  ChangeDetectionStrategy
} from '@angular/core';
import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexStroke,
  ApexXAxis,
  ApexFill,
  ApexTooltip,
  ApexAnnotations,
  ApexMarkers,
  ApexYAxis,
  ApexGrid,
  ApexTheme
} from 'ng-apexcharts';

import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { IRevenuePoint } from '../../../../../../core/models/interfaces/IRevenuePoint';
import { DashboardService } from '../../../../../../core/services/dashboard.service';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  markers: ApexMarkers;
  fill: ApexFill;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  tooltip: ApexTooltip;
  stroke: ApexStroke;
  annotations: ApexAnnotations;
  grid: ApexGrid;
  theme: ApexTheme;
};

@Component({
  selector: 'app-order-status-chart',
  templateUrl: './order-status-chart.component.html',
  styleUrls: ['./order-status-chart.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderStatusChartComponent implements OnInit {
  @ViewChild('chart', { static: true }) chart!: ChartComponent;
  public chartOptions!: Partial<ChartOptions>;

  constructor(private dashboardService: DashboardService) { }

  ngOnInit(): void {
    this.loadRevenueData();
  }

  private loadRevenueData(): void {
    this.dashboardService.getRevenueTimeSeries()
      .pipe(catchError(error => {
        console.error('Failed to load chart data:', error);
        return of([]);
      }))
      .subscribe((data: IRevenuePoint[]) => {
        this.initChart(data);
      });
  }

  private initChart(data: IRevenuePoint[]): void {
    const formattedData = data.map(p => ({
      x: new Date(p.timestamp).getTime(),
      y: Number(p.totalEarned.toFixed(2))
    }));

    this.chartOptions = {
      series: [{
        name: "Revenue",
        data: formattedData
      }],
      chart: {
        type: "area",
        height: 250,
        fontFamily: 'Inter, sans-serif',
        toolbar: { show: false },
        zoom: { enabled: false },
        animations: {
          enabled: true,
          easing: 'easeinout',
          speed: 800,
          dynamicAnimation: {
            enabled: true,
            speed: 350
          }
        },
        background: 'transparent',
        dropShadow: {
          enabled: true,
          opacity: 0.1,
          blur: 3,
          left: 0,
          top: 0
        }
      },
      annotations: { yaxis: [], xaxis: [] },
      dataLabels: { enabled: false },
      markers: {
        size: 4,
        colors: ["#10b981"],
        strokeColors: "#ffffff",
        strokeWidth: 2,
        hover: { size: 6, sizeOffset: 2 }
      },
      stroke: {
        curve: "smooth",
        width: 3,
        lineCap: 'round',
        colors: ["#10b981"]
      },
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.5,
          opacityTo: 0.1,
          stops: [0, 90, 100],
          colorStops: [
            { offset: 0, color: "#10b981", opacity: 0.5 },
            { offset: 90, color: "#10b981", opacity: 0.1 },
            { offset: 100, color: "#10b981", opacity: 0 }
          ]
        }
      },
      grid: {
        borderColor: "#f1f5f9",
        strokeDashArray: 4,
        xaxis: { lines: { show: true } },
        yaxis: { lines: { show: true } },
        padding: { top: 0, right: 0, bottom: 0, left: 0 }
      },
      xaxis: {
        type: "datetime",
        tickAmount: 4,
        labels: {
          format: "dd MMM",
          style: {
            fontSize: "10px",
            fontWeight: 500,
            colors: "#64748b",
            fontFamily: 'Inter, sans-serif'
          }
        },
        axisBorder: { show: false },
        axisTicks: { show: false },
        crosshairs: {
          show: true,
          width: 1,
          position: 'back',
          opacity: 0.9,
          stroke: {
            color: '#10b981',
            width: 1,
            dashArray: 3,
          }
        }
      },
      yaxis: {
        labels: {
          formatter: (val) => `${val.toLocaleString("en-US")} EGP`,
          style: {
            fontSize: "10px",
            fontWeight: 500,
            colors: "#64748b",
            fontFamily: 'Inter, sans-serif'
          }
        },
        axisBorder: { show: false },
        axisTicks: { show: false },
        min: (min) => min - (min * 0.1),
        max: (max) => max + (max * 0.1),
        tickAmount: 4
      },
      tooltip: {
        theme: 'dark',
        x: { format: "dd MMM yyyy" },
        y: {
          formatter: (val) => `${val.toLocaleString("en-US")} EGP`
        },
        style: {
          fontSize: '10px',
          fontFamily: 'Inter, sans-serif'
        },
        marker: { show: true }
      }
    };
  }
}
