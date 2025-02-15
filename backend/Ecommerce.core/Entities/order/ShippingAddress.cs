using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ecommerce.Core.Entities.order
{
    public class ShippingAddress
    {
        public string FullName { get; set; }
        public string Phone { get; set; }
        public string City { get; set; }
        public string Area { get; set; }
        public string Landmark { get; set; }
        public string Street { get; set; }
    }
}
