import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges, ViewChild } from "@angular/core";
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTooltip,
  ApexStroke,
  ApexGrid,
  ApexFill,
  ApexMarkers,
  ApexYAxis,
  ApexPlotOptions,
  ApexTitleSubtitle
} from "ng-apexcharts";
import { ChartData } from "../../../../../../core/models/interfaces/IChartData";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  fill: ApexFill;
  title: ApexTitleSubtitle;
};

@Component({
  selector: 'app-revenue-chart',
  templateUrl: './revenue-chart.component.html',
  styleUrls: ['./revenue-chart.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RevenueChartComponent implements OnChanges {
  @ViewChild("chart") chart!: ChartComponent;
  public chartOptions: Partial<ChartOptions> = {};
  @Input() series: ChartData | null = null;
  constructor() {}
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['series'] && this.series) {
      this.updateChart();
    }
  }

  private updateChart(): void {

    this.chartOptions = {
      series:this.series?.categoryRevenueChart.series,
      chart: {
        height: 300,
        width: 1200,
        type: "bar",
        toolbar: {
          show: false
        }
      },
      plotOptions: {
        bar: {
          borderRadius: 4,
          columnWidth: "70%",
          borderRadiusApplication: 'end',
          dataLabels: {
            position: "top"
          }
        }
      },
      dataLabels: {
        enabled: true,
        offsetY: -25,
        style: {
          fontSize: "10px",
          colors: ["#eee"]
        },
        background: {
          enabled: true,
          foreColor: 'black',
          padding: 1,
          borderRadius: 3,
          borderWidth: 1,
          borderColor: '#bfdbfe',
          opacity: 0.9,
          dropShadow: {
            enabled: false
          }
        },
      },
      xaxis: {
        categories: this.series?.categoryRevenueChart.categories,
        labels: {
          rotate: 0,
          formatter: (val: string) => val.split(' ')[0],
          style: {
            fontSize: "10px",
            colors: "#666"
          }
        },
        axisBorder: {
          show: true
        },
        axisTicks: {
          show: true
        }
      }
,      
      
      yaxis: {
        show: false,
        
        tickAmount: 4,
        labels: {
          style: {
            fontSize: "12px",
            colors: "#888"
          }
        },
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false
        }
      },
      fill: {
        colors: this.series?.categoryRevenueChart.categories.map((_, i) =>
          i === 7 ? '#3B82F6' : '#D1D5DB'
        )
      },
      
     
    }
  }
}
