using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ecommerce.Contracts.DTOs.order
{
    public class DeliveryMethodsDTO
    {
        public int id { get; set; } 
        public string ShortName { get; set; }
        public string Description { get; set; }
        public decimal Cost { get; set; }
    }
}
