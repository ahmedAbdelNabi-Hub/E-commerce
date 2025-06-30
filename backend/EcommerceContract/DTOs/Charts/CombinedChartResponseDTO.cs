using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ecommerce.Contracts.DTOs.Charts
{
    public class CombinedChartResponseDTO
    {
        public decimal TotalSales { get; set; }
        public int TotalClients { get; set; }
        public int TotalOrders { get; set; }
        public int TotalProducts { get; set; }
        public ChartResponseDTO CategoryRevenueChart { get; set; }
        public ChartResponseDTO OrderStatusChart { get; set; }
    }
}
