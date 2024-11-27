using Ecommerce.Core.Repositories;
using Ecommerce.Repository;
using StackExchange.Redis;

namespace Ecommerce.Extensions
{
    public static class RedisExtentionsServices
    {
        public static IServiceCollection  AddRedisSerivce(this IServiceCollection Services ,IConfiguration configuration )
        {
            var RedisConnectionString = configuration.GetConnectionString("RedisConnection");
            Services.AddSingleton<IConnectionMultiplexer>(ConnectionMultiplexer.Connect(RedisConnectionString));
            Services.AddScoped<IBasketRepository, BasketRepository>();
            return Services;
        }
    }
}
