import { Component, Input, OnChanges, SimpleChanges, ViewChild } from "@angular/core";
import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexPlotOptions,
  ApexYAxis,
  ApexLegend,
  ApexStroke,
  ApexXAxis,
  ApexFill,
  ApexTooltip
} from "ng-apexcharts";
import { ChartData } from "../../../../../../core/models/interfaces/IChartData";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  tooltip: ApexTooltip;
  dataLabels: ApexDataLabels;
  fill: ApexFill;
  colors?: string[];
};

@Component({
  selector: 'app-order-status-chart',
  templateUrl: './order-status-chart.component.html',
  styleUrl: './order-status-chart.component.css'
})
export class OrderStatusChartComponent implements OnChanges {
  @ViewChild("chart") chart!: ChartComponent;
  public chartOptions: Partial<ChartOptions> = {};

  @Input() chartData: ChartData | null = null;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['chartData'] && this.chartData) {
      this.prepareChart();
      console.log(this.chartData);
    }
  }

  private prepareChart(): void {
   
    this.chartOptions = {
      series : this.chartData?.orderStatusChart.series,
      chart: {
        height: 210,
        type: "area",
        zoom: { enabled: false }
      },
      colors: ['#008FFB', '#00E396', '#FEB019'], // You can adjust as needed
      dataLabels: { enabled: false },
      stroke: { curve: "smooth", width: 3 },
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.3,
          opacityTo: 0.8,
          stops: [0, 90, 100]
        }
      },
      xaxis: {
        type: "category",
        categories: this.chartData?.orderStatusChart.categories,
      },
      tooltip: {
        shared: true,
        y: {
          formatter: (val) => `${val}`,
          title: {
            formatter: (seriesName) => `${seriesName}:`
          }
        }
      }
    };
  }
}


