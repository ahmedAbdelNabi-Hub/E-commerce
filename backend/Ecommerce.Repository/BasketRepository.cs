using StackExchange.Redis;
using System.Text.Json;
using System.Threading.Tasks;
using Ecommerce.Core.Entities;
using Ecommerce.Core.Repositories;

namespace Ecommerce.Repository
{
    public class BasketRepository : IBasketRepository
    {
        private readonly IDatabase _database;

        public BasketRepository(IConnectionMultiplexer redis)
        {
            _database = redis.GetDatabase();
        }

        public async Task<CustomerBasket?> GetBasketAsync(string id)
        {
            var basket = await _database.StringGetAsync(id);

            return string.IsNullOrEmpty(basket) ? null : JsonSerializer.Deserialize<CustomerBasket>(basket!);
        }

        public async Task<CustomerBasket?> UpdateBasketAsync(CustomerBasket basket)
        {
            var basketJson = JsonSerializer.Serialize(basket);
            var created = await _database.StringSetAsync(basket.Id, basketJson,TimeSpan.FromMinutes(30));
            return created ? basket : null;
        }

        public async Task<bool> DeleteBasketAsync(string id)
        {
            return await _database.KeyDeleteAsync(id);
        }
    }
}
