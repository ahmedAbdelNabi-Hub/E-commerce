using Ecommerce.core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ecommerce.Core.Entities.order
{
    public class Order : BaseEntity
    {
        public string BuyerEmail { get; set; } 
        public DateTimeOffset OrderDate { get; set; } = DateTimeOffset.UtcNow; 
        public OrderStatus Status { get; set; } = OrderStatus.Pending; 
        public ShippingAddress ShippingAddress { get; set; } 
        public DeliveryMethod DeliveryMethod { get; set; } 
        public ICollection<OrderItem> Items { get; set; } = new List<OrderItem>(); 
        public decimal SubTotal { get; set; } 
        public string PaymentIntentId { get; set; } = String.Empty;
        public decimal GetTotal() => SubTotal + (DeliveryMethod?.Cost ?? 0);
        
    }
}
