using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Ecommerce.Core.Entities
{
    public class BasketItem
    {
        public int ProductId { get; set; }
        public string ProductName { get; set; }
        public string Description { get; set; }
        public string Brand { get; set; }
        public int Quantity { get; set; }
        public decimal Price { get; set; }
        public decimal? OfferPrice { get; set; }
        public string ImageUrl { get; set; }
        public int UnitOfStock { get; set; }
        public int DeliveryTimeInDays { get; set; }
        [JsonIgnore]

        public decimal SubTotal => (decimal)(OfferPrice > 0 ? OfferPrice : Price) * Quantity;
    }

}
