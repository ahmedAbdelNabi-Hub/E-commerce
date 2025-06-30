using Ecommerce.Core.Entities.order;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ecommerce.Contracts.DTOs.order
{
    public class OrderDTO
    {
        public int id { get; set; } 
        public string BuyerEmail { get; set; }
        public DateTimeOffset OrderDate { get; set; } = DateTimeOffset.UtcNow;
        public string Status { get; set; } 
        public AddressDto ShippingAddress { get; set; }
        public DeliveryMethod DeliveryMethod { get; set; }
        public ICollection<OrderItem> Items { get; set; } = new List<OrderItem>();
        public decimal SubTotal { get; set; }
        public string PaymentMethod { get; set; }

        public string PaymentIntentId { get; set; } = String.Empty;
        public decimal GetTotal() => SubTotal + (DeliveryMethod?.Cost ?? 0);
    }
}
