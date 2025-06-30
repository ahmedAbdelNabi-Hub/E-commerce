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
  ApexTheme,
  ApexTitleSubtitle,
  ApexLegend
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
  title: ApexTitleSubtitle;
  legend: ApexLegend;
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
        height: 350,
        fontFamily: 'Inter, sans-serif',
        toolbar: { show: true },
        zoom: { enabled: true },
        animations: {
          enabled: true,
          easing: 'easeinout',
          speed: 800,
          dynamicAnimation: {
            enabled: true,
            speed: 350
          }
        },
        background: '#ffffff',
        dropShadow: {
          enabled: false
        }
      },
      annotations: { yaxis: [], xaxis: [] },
      dataLabels: {
        enabled: false
      },
      legend: {
        show: true,
        position: 'top',
        horizontalAlign: 'right',
        fontSize: '14px',
      },
      markers: {
        size: 4,
        colors: ["#94a3b8"],
        strokeColors: "#ffffff",
        strokeWidth: 2,
        hover: { size: 6, sizeOffset: 2 }
      },
      stroke: {
        curve: "smooth",
        width: 3,
        lineCap: 'round',
        colors: ["#94a3b8"]
      },
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 0.5,
          opacityFrom: 0.4,
          opacityTo: 0.1,
          stops: [0, 90, 100],
          colorStops: [
            { offset: 0, color: "#94a3b8", opacity: 0.4 },
            { offset: 90, color: "#94a3b8", opacity: 0.1 },
            { offset: 100, color: "#94a3b8", opacity: 0 }
          ]
        }
      },
      grid: {
        borderColor: "#f1f5f9",
        strokeDashArray: 4,
        xaxis: { lines: { show: true } },
        yaxis: { lines: { show: true } },
        padding: { top: 10, right: 20, bottom: 10, left: 20 }
      },
      xaxis: {
        type: "datetime",
        tickAmount: 6,
        labels: {
          format: "dd MMM",
          style: {
            fontSize: "12px",
            fontWeight: 400,
            colors: "#64748b",
            fontFamily: 'Inter, sans-serif'
          }
        },
        axisBorder: { show: true, color: '#f1f5f9' },
        axisTicks: { show: true, color: '#f1f5f9' },
        crosshairs: {
          show: true,
          width: 1,
          position: 'back',
          opacity: 0.7,
          stroke: {
            color: '#94a3b8',
            width: 1,
            dashArray: 0,
          }
        }
      },
      yaxis: {
        labels: {
          formatter: (val) => `${val.toLocaleString("en-US")} EGP`,
          style: {
            fontSize: "12px",
            fontWeight: 400,
            colors: "#64748b",
            fontFamily: 'Inter, sans-serif'
          }
        },
        axisBorder: { show: true, color: '#f1f5f9' },
        axisTicks: { show: true, color: '#f1f5f9' },
        min: (min) => min - (min * 0.1),
        max: (max) => max + (max * 0.1),
        tickAmount: 5
      },
      tooltip: {
        theme: 'light',
        x: { format: "dd MMM yyyy" },
        y: {
          formatter: (val) => `${val.toLocaleString("en-US")} EGP`,
          title: {
            formatter: () => 'Revenue:'
          }
        },
        style: {
          fontSize: '12px',
          fontFamily: 'Inter, sans-serif'
        },
        marker: { show: true }
      }
    };
  }
}
