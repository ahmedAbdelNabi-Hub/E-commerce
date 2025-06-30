using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ecommerce.Contracts.DTOs.Charts
{
    public class RevenuePointDto
    {
        public long Timestamp { get; set; }
        public decimal TotalEarned { get; set; }
    }

}
