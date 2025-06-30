using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ecommerce.Contracts.DTOs.Charts
{
    public class ChartSeriesDTO
    {
        public string Name { get; set; }
        public List<decimal> Data { get; set; }
    }
}
