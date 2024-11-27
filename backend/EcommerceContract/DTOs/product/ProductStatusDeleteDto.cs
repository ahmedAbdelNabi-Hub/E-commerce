using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ecommerce.Contracts.DTOs.product
{
    public class ProductStatusDeleteDto
    {
        public int productId { get; set; }
        public int statusId { get; set; }
    }
}
