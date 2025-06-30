import { Component, Input, OnChanges, SimpleChanges, ViewChild } from "@angular/core";
import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,

  ApexStroke,
  ApexXAxis,
  ApexFill,
  ApexTooltip,
  ApexTheme,
  ApexAnnotations,
  ApexMarkers,
  ApexTitleSubtitle,
  ApexYAxis
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  markers: ApexMarkers;
  title: ApexTitleSubtitle;
  fill: ApexFill;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  tooltip: ApexTooltip;
  stroke: ApexStroke;
  annotations: ApexAnnotations;
};
export const data = [
  [new Date("01 Mar 2012").getTime(), 30000],
  [new Date("02 Mar 2012").getTime(), 30005],
  [new Date("03 Mar 2012").getTime(), 3200],
  [new Date("04 Mar 2012").getTime(), 41000],
  [new Date("05 Mar 2012").getTime(), 49000],
  [new Date("06 Mar 2012").getTime(), 55000],
  [new Date("07 Mar 2012").getTime(), 60000],
  [new Date("08 Mar 2012").getTime(), 72000],
  [new Date("09 Mar 2012").getTime(), 65000],
  [new Date("10 Mar 2012").getTime(), 5800],
  [new Date("11 Mar 2012").getTime(), 62000],
  [new Date("12 Mar 2012").getTime(), 70000],
  [new Date("13 Mar 2012").getTime(), 68000],
  [new Date("14 Mar 2012").getTime(), 80000],
  [new Date("15 Mar 2012").getTime(), 7400],
  [new Date("16 Mar 2012").getTime(), 8500],
  [new Date("17 Mar 2012").getTime(), 9000],
  [new Date("18 Mar 2012").getTime(), 95000],
  [new Date("19 Mar 2012").getTime(), 1000],
  [new Date("20 Mar 2012").getTime(), 10500],
  [new Date("21 Mar 2012").getTime(), 980],
  [new Date("22 Mar 2012").getTime(), 10200],
  [new Date("23 Mar 2012").getTime(), 110000],
  [new Date("24 Mar 2012").getTime(), 108000],
  [new Date("25 Mar 2012").getTime(), 11500],
  [new Date("26 Mar 2012").getTime(), 12000],
  [new Date("27 Mar 2012").getTime(), 12500],
  [new Date("28 Mar 2012").getTime(), 1300],
  [new Date("29 Mar 2012").getTime(), 12800],
  [new Date("30 Mar 2012").getTime(), 13500]
];



@Component({
  selector: 'app-order-status-chart',
  templateUrl: './order-status-chart.component.html',
  styleUrl: './order-status-chart.component.css'
})
export class OrderStatusChartComponent {
  @ViewChild("chart", { static: false }) chart!: ChartComponent;
  public chartOptions!: Partial<ChartOptions>;
  public activeOptionButton = "all";



  constructor() {
    this.initChart();
  }

  initChart(): void {
    this.chartOptions = {
      series: [
        {
          name: "Visits",
          data: data
        }
      ],
      chart: {
        type: "area",
        height: 350,
        toolbar: {
          show: true
        }
      },
      title: {
        align: "left",
        style: {
          fontSize: "16px",
          fontWeight: "bold"
        }
      },
      annotations: {
        yaxis: [
          {
            y: 30,
            borderColor: "#e11d48",
            label: {
              text: "Low Traffic",
              style: {
                color: "#fff",
                background: "#e11d48"
              }
            }
          }
        ],
        xaxis: [
          {
            x: new Date("14 Nov 2012").getTime(),
            borderColor: "#2563eb",
            label: {
              text: "Campaign Launch",
              style: {
                color: "#fff",
                background: "#2563eb"
              }
            }
          }
        ]
      },
      dataLabels: {
        enabled: false
      },
      markers: {
        size: 3,
        colors: ["#3b82f6"],
        strokeColors: "#fff",
        strokeWidth: 2
      },
      stroke: {
        curve: "smooth",
        width: 2
      },
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.2,
          stops: [0, 100]
        }
      },
      xaxis: {
        type: "datetime",
        tickAmount: 6,
        min: new Date("01 Mar 2012").getTime(),
        labels: {
          format: "dd MMM"
        }
      },
      yaxis: {
        labels: {
          formatter: (val) => `${val}`,
          style: {
            fontSize: "12px",
            colors: "#666"
          }
        }
      },
      tooltip: {
        x: {
          format: "dd MMM yyyy"
        }
      }
    };
  }

  public updateOptions(option: string): void {
    this.activeOptionButton = option;
  }
}
