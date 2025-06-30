using Ecommerce.core.Entities;
using Ecommerce.Core.Enums;
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
        public PaymentMethods PaymentMethod { get; set; } = PaymentMethods.COD;
        public string PaymentIntentId { get; set; } = String.Empty;
        public decimal Total { get; set; } 

    }
}
