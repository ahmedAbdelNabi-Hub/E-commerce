import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTooltip,
  ApexStroke,
  ApexYAxis,
  ApexTitleSubtitle,
  ApexFill,
  ApexGrid
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  tooltip: ApexTooltip;
  dataLabels: ApexDataLabels;
  yaxis: ApexYAxis;
  fill: ApexFill;
  title: ApexTitleSubtitle;
  grid: ApexGrid;
};
//PS E:\E-commerce> npm install -S apexcharts ng-apexcharts@latest --legacy-peer-deps

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css',
  providers: [DatePipe]

})
export class AdminDashboardComponent {
  selectedDate: string;
  @ViewChild("chart") chart!: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  public chartOptions2: Partial<ChartOptions>;

  // In your Angular component's TypeScript file
items = [
  {
      label: 'المنتجات', 
      icon: 'bx bxs-coffee',
      items: [
          {
              label: ' إضافة منتج', 
              icon: 'bx bx-plus',
              command: () => {
                
              }
          },
          {
              label: 'عرض الكل', // View All
              icon: 'bx bx-list',
              command: () => {
                  // Logic for viewing all products
              }
          }
      ]
  }
];


  public generateData(baseval: any, count: any, yrange: any) {
    var i = 0;
    var series = [];
    while (i < count) {
      var x = Math.floor(Math.random() * (750 - 1 + 1)) + 1;
      var y =
        Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;
      var z = Math.floor(Math.random() * (75 - 15 + 1)) + 15;

      series.push([x, y, z]);
      baseval += 86400000;
      i++;
    }
    return series;
  }

  constructor(private datePipe: DatePipe) {
    this.selectedDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd') || '';


    this.chartOptions2 = {
      series: [
        {
          name: "series1",
          data: [31, 40, 28, 51, 42, 109, 100]
        },
        {
          name: "series2",
          data: [11, 32, 45, 32, 34, 52, 41]
        }
      ],
      chart: {
        height: 350,
        type: "area"
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: "smooth"
      },
      xaxis: {
        type: "datetime",
        categories: [
          "2018-09-19T00:00:00.000Z",
          "2018-09-19T01:30:00.000Z",
          "2018-09-19T02:30:00.000Z",
          "2018-09-19T03:30:00.000Z",
          "2018-09-19T04:30:00.000Z",
          "2018-09-19T05:30:00.000Z",
          "2018-09-19T06:30:00.000Z"
        ]
      },
      tooltip: {
        x: {
          format: "dd/MM/yy HH:mm"
        }
      }
    };


    this.chartOptions = {
      series: [
        {
          name: "north",
          data: [
            {
              x: 1996,
              y: 322
            },
            {
              x: 1997,
              y: 324
            },
            {
              x: 1998,
              y: 329
            },
            {
              x: 1999,
              y: 342
            },
            {
              x: 2000,
              y: 348
            },
            {
              x: 2001,
              y: 334
            },
            {
              x: 2002,
              y: 325
            },
            {
              x: 2003,
              y: 316
            },
            {
              x: 2004,
              y: 318
            },
            {
              x: 2005,
              y: 330
            },
            {
              x: 2006,
              y: 355
            },
            {
              x: 2007,
              y: 366
            },
            {
              x: 2008,
              y: 337
            },
            {
              x: 2009,
              y: 352
            },
            {
              x: 2010,
              y: 377
            },
            {
              x: 2011,
              y: 383
            },
            {
              x: 2012,
              y: 344
            },
            {
              x: 2013,
              y: 366
            },
            {
              x: 2014,
              y: 389
            },
            {
              x: 2015,
              y: 334
            }
          ]
        },
        {
          name: "south",
          data: [
            {
              x: 1996,
              y: 162
            },
            {
              x: 1997,
              y: 90
            },
            {
              x: 1998,
              y: 50
            },
            {
              x: 1999,
              y: 77
            },
            {
              x: 2000,
              y: 35
            },
            {
              x: 2001,
              y: -45
            },
            {
              x: 2002,
              y: -88
            },
            {
              x: 2003,
              y: -120
            },
            {
              x: 2004,
              y: -156
            },
            {
              x: 2005,
              y: -123
            },
            {
              x: 2006,
              y: -88
            },
            {
              x: 2007,
              y: -66
            },
            {
              x: 2008,
              y: -45
            },
            {
              x: 2009,
              y: -29
            },
            {
              x: 2010,
              y: -45
            },
            {
              x: 2011,
              y: -88
            },
            {
              x: 2012,
              y: -132
            },
            {
              x: 2013,
              y: -146
            },
            {
              x: 2014,
              y: -169
            },
            {
              x: 2015,
              y: -184
            }
          ]
        }
      ],
      chart: {
        type: "area",
        height: 350
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: "straight"
      },

      title: {
        text: "Area with Negative Values",
        align: "left",
        style: {
          fontSize: "14px"
        }
      },
      xaxis: {
        type: "datetime",
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false
        }
      },
      yaxis: {
        tickAmount: 4,
        floating: false,

        labels: {
          offsetY: -7,
          offsetX: 0
        },
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false
        }
      },
      fill: {
        opacity: 0.5
      },
      tooltip: {
        x: {
          format: "yyyy"
        },
        fixed: {
          enabled: false,
          position: "topRight"
        }
      },
      grid: {
        yaxis: {
          lines: {
            offsetX: -30
          }
        },
        padding: {
          left: 20
        }
      }
    };
  }

}