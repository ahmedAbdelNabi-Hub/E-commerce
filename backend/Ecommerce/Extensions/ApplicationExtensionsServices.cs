using Ecommerce.core.Repositories;
using Ecommerce.core;
using EcommerceContract.Helpers.profile;
using Ecommerce.Repository.Repositories;
using Ecommerce.Repository;
using Microsoft.AspNetCore.Mvc;
using EcommerceContract.ErrorResponses;
using Ecommerce.Repository.Data;
using Microsoft.EntityFrameworkCore;
using Ecommerce.Contracts.Interfaces;
using Ecommerce.service;
using Ecommerce.Core.Repositories;
using Ecommerce.Contracts.DTOs;
using Ecommerce.Core;
using Ecommerce.Service;

namespace EcommerceContract.Extensions
{
    public static class ApplicationExtensionsServices
    {
        public static IServiceCollection AddApplicationService(this IServiceCollection Services, IConfiguration configuration)
        {
            Services.AddDbContext<EcommerceDbContext>(Options =>
            {
                Options.UseSqlServer(configuration.GetConnectionString("DefaultConnection"));
            });
            Services.Configure<IISServerOptions>(options =>
            {
                options.AutomaticAuthentication = false;
            });
            Services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));
            Services.AddScoped<IUnitOfWork, UnitOfWork>();
            Services.AddScoped<IProductAttributeRepository,ProductAttributeRepository>();
            Services.AddAutoMapper(typeof(MappingProfiles));
            Services.AddScoped<IAuthService, AuthService>();
            Services.AddTransient<IEmailService, EmailService>();
            Services.AddScoped<IOrderService, OrderService>();
            Services.AddScoped<IPaymentService, PaymentService>();

            /*            Services.Configure<ApiBehaviorOptions>(options =>
                        {
                            options.InvalidModelStateResponseFactory = (context) =>
                            {
                                var errors = context.ModelState
                                    .Where(m => m.Value.Errors.Count > 0)
                                    .ToDictionary(
                                        kvp => kvp.Key, // Property name (e.g., "email")
                                        kvp => kvp.Value.Errors.Select(e => e.ErrorMessage).AsEnumerable() // Use AsEnumerable() to match IEnumerable<string>
                                    );

                                var validationErrorApiResponse = new ErrorApiResponse(errors);
                                return new BadRequestObjectResult(validationErrorApiResponse);
                            };
                        });*/

            return Services;
        }

    }
}
