using Ecommerce.Core.Repositories;
using Ecommerce.Repository;
using StackExchange.Redis;

namespace Ecommerce.Extensions
{
    public static class RedisExtentionsServices
    {
        public static IServiceCollection AddRedisSerivce(this IServiceCollection services, IConfiguration configuration)
        {
            var options = new ConfigurationOptions
            {
                EndPoints = { "redis-18604.c251.east-us-mz.azure.redns.redis-cloud.com:18604" },
                Password = "u7rHgl8Zuj03ZNgXjJUgFkAXAASdfp5N",
                Ssl = false,
                User = "default",
                AbortOnConnectFail = false,
                ConnectTimeout = 10000,         
                SyncTimeout = 10000,             
                KeepAlive = 180
            };

            var redis = ConnectionMultiplexer.Connect(options);
            services.AddSingleton<IConnectionMultiplexer>(redis);
            services.AddScoped(typeof(IBasketRepository<>), typeof(BasketRepository<>));

            return services;
        }
    }
}
