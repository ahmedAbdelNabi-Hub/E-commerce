using Ecommerce.core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ecommerce.Core.Entities.order
{
    public class DeliveryMethod : BaseEntity
    {
        public string ShortName { get; set; } // Short code or name (e.g., "DHL", "Aramex")
        public string Description { get; set; } // Full name or additional details
        public decimal Cost { get; set; } // Shipping cost
    }

}
