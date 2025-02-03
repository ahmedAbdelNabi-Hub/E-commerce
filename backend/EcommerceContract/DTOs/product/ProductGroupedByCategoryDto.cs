using Ecommerce.core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ecommerce.Contracts.DTOs.product
{
    public class ProductGroupedByCategoryDto
    {
        public string CategoryName { get; set; } // Category Name
        public IEnumerable<Product> Products { get; set; } // List of Products in this category
    }
}
