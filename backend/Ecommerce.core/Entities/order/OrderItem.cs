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
        public int ProductId { get; set; }
        public string ProductName { get; set; } 
        public string PictureUrl { get; set; }
        public decimal Price { get; set; } 
        public int Quantity { get; set; } 
        public DateTime CreatedAt { get; set; } 
        public DateTime UpdatedAt { get; set;}

        public decimal TotalPrice => Price * Quantity;
    }

}
