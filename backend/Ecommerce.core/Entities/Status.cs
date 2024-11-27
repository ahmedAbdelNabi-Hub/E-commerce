using Ecommerce.core.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ecommerce.core.Entities
{
    public class Status:BaseEntity
    {
        public string StatusName { get; set; }
        public string? StatusDescription { get; set; }

        public string AssignableBy { get; set; }
        public ICollection<ProductStatus> ProductStatus { get; set; }


    }
}
