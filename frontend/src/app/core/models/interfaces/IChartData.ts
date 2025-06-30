export interface ChartData {
  totalSales: number
  totalClients: number
  totalOrders: number
  totalProducts: number
  categoryRevenueChart: categoryRevenueChart;
  orderStatusChart: orderStatusChart;
}

export interface categoryRevenueChart {
  series: { name: string; data: number[] }[];
  categories: string[];
};
export interface orderStatusChart {
  series: { name: string; data: number[] }[];
  categories: string[];
};