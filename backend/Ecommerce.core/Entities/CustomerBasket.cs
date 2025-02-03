using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ecommerce.Core.Entities
{
    public class CustomerBasket
    {
        public CustomerBasket(string id)
        {
            BasketItems = new List<BasketItem>();  
            Id = id;   
        }

        public string Id { get; set; }
        public List<BasketItem> BasketItems { get; set; }
    }
}
