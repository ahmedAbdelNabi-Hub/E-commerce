using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ecommerce.core.Entities
{
    public class ProductStatus:BaseEntity
    {
        public int ProductId { get; set; }
        public Product Product { get; set; }

        public int StatusId { get; set; }
        public Status Status { get; set; }
    }
}
