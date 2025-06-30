using Ecommerce.Core.Entities.order;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ecommerce.Contracts.DTOs.order
{
    public class OrderParamsDTO
    {
        public string basketId { get; set; }
        public int deliveryMethodId { get; set; }
        public ShippingAddress shippingAddress { get; set; }   

        public string PaymentMethod {get; set; }

    }
}
