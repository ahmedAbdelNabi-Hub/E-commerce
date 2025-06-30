using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ecommerce.Contracts.DTOs.Charts
{
    public class ChartResponseDTO
    {
        public List<ChartSeriesDTO> Series { get; set; }
        public List<string> Categories { get; set; }
    }
}
