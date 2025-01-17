using StackExchange.Redis;
using System.Text.Json;
using System.Threading.Tasks;
using Ecommerce.Core.Entities;
using Ecommerce.Core.Repositories;

namespace Ecommerce.Repository
{
    public class BasketRepository<T> : IBasketRepository<T> where T : class
    {
        private readonly IDatabase _database;

        public BasketRepository(IConnectionMultiplexer redis)
        {
            _database = redis.GetDatabase();
        }

        public async Task<T?> GetBasketAsync(string id)
        {
            var basket = await _database.StringGetAsync(id);

            return string.IsNullOrEmpty(basket) ? null : JsonSerializer.Deserialize<T>(basket!);
        }

        public async Task<T?> UpdateBasketAsync(string id,T basket)
        {
            var basketJson = JsonSerializer.Serialize(basket);
            var created = await _database.StringSetAsync(id, basketJson,TimeSpan.FromDays(3));
            return created ? basket : null;
        }

        public async Task<bool> DeleteBasketAsync(string id)
        {
            return await _database.KeyDeleteAsync(id);
        }
    }
}
