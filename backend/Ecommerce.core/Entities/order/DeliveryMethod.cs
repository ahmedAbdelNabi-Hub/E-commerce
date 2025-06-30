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
        public string ShortName { get; set; } 
        public string Description { get; set; } 
        public decimal Cost { get; set; } 
    }

}
