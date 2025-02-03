namespace Ecommerce.Extensions
{
    public static class CorsExtensionsServices
    {
        public static IServiceCollection AddCorsService(this IServiceCollection Services)
        {
           Services.AddCors(options =>
            {
                options.AddPolicy("AllowAll",
                    policy =>
                    {
                        policy.AllowAnyOrigin()
                              .AllowAnyMethod()
                              .AllowAnyHeader();
                    });
            });
            return Services;
        }
    }
}
