using Ecommerce.core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ecommerce.Core.Entities.order
{
    public class OrderItem : BaseEntity
    {
        public int ProductId { get; set; } // ID of the product
        public string ProductName { get; set; } // Name of the product
        public string PictureUrl { get; set; } // URL of the product image
        public decimal Price { get; set; } // Price per unit
        public int Quantity { get; set; } // Number of items ordered
        public DateTime CreatedAt { get; set; } 
        public DateTime UpdatedAt { get; set;}

        // Calculated property for total price
        public decimal TotalPrice => Price * Quantity;
    }

}
