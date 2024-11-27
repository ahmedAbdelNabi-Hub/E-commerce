using Ecommerce.core.Entities.identity;
using Ecommerce.Repository.Data;
using Microsoft.AspNetCore.Identity;

namespace Ecommerce.Extensions
{
    public static class IdentityExtentionServices
    {
        public static IServiceCollection AddIdentityServices(this IServiceCollection Services)
        {
            Services.AddIdentity<AppUser, IdentityRole>(option =>
            {
                option.SignIn.RequireConfirmedEmail = true;
                option.Tokens.EmailConfirmationTokenProvider = TokenOptions.DefaultProvider;

            }).AddEntityFrameworkStores<EcommerceDbContext>()
              .AddDefaultTokenProviders();
            Services.Configure<DataProtectionTokenProviderOptions>(option => { 
            option.TokenLifespan=TimeSpan.FromHours(1); 
            });
            return Services;
        }
    }
}
