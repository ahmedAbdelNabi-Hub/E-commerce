using Ecommerce.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ecommerce.Core.Repositories
{
    public interface IBasketRepository<T>
    {
        Task<T?> GetBasketAsync(string id);
        Task<T?> UpdateBasketAsync(string id, T RedisView);
        Task<bool> DeleteBasketAsync(string id);
    }
}
