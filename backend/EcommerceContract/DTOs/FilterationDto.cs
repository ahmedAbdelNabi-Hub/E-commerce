using Ecommerce.core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
namespace Ecommerce.Contracts.DTOs
{
    public class FilterationDto
    {
        public string FilterName { get; set; }
        public List<string> FilterValues { get; set; }
        public int ProductCount { get; set; } // Renamed for clarity
    }
}
