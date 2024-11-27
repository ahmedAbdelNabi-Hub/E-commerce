using Ecommerce.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ecommerce.Core.Repositories
{
    public interface IBasketRepository
    {
        Task<CustomerBasket?> GetBasketAsync(string  id);
        Task<CustomerBasket?> UpdateBasketAsync(CustomerBasket basket);
        Task <bool> DeleteBasketAsync (string id);
    }
}
