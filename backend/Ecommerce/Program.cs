using Ecommerce.core;
using Ecommerce.core.Repositories;
using EcommerceContract.Extensions;
using EcommerceContract.Helpers.profile;
using EcommerceContract.Middlewares;
using Ecommerce.Repository;
using Ecommerce.Repository.Data;
using Ecommerce.Repository.Repositories;
using EcommerceContract.ErrorResponses;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.StaticFiles;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using Ecommerce.Extensions;
using Ecommerce.Repository.Data.DataSeed;
using System.Text.Json.Serialization;
using StackExchange.Redis;

namespace EcommerceContract
{
    public class Program
    {
        public static async Task Main(string[] args)
        {
            #region   Add services to the container.

            var builder = WebApplication.CreateBuilder(args);

            builder.Services.AddControllers(options => options.Filters.Add<ValidateModelAttribute>())
            .AddJsonOptions(options =>
            {
                options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles; //IgnoreCycles
                options.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
            });

            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();
            builder.Services.AddApplicationService(builder.Configuration);
            builder.Services.AddCorsService();
            builder.Services.AddIdentityServices();
            builder.Services.JwtService(builder.Configuration);
            builder.Services.AddRedisSerivce(builder.Configuration);

            var app = builder.Build();
            #endregion

            #region Update Database

            using (var scope = app.Services.CreateScope())
            {
                var services = scope.ServiceProvider;
                var dbContext = services.GetRequiredService<EcommerceDbContext>();

                try
                {
                    await dbContext.Database.MigrateAsync();
                    await RoleSeeder.SeedRoles(services);
                    await StatusSeeder.SeedStatuses(services);
                    await SeedData.SeedDeliveryMethods(services); 
                }
                catch (Exception ex)
                {
                    var logger = services.GetRequiredService<ILogger<Program>>();
                    logger.LogError(ex, "An error occurred while seeding the database.");
                }
            }
       
            #endregion

            #region Configure the HTTP request pipeline.

            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseMiddleware<ExceptionMiddleware>();
            app.UseCors("AllowAll");

            var provider = new FileExtensionContentTypeProvider();
            provider.Mappings[".avif"] = "image/avif";
            app.UseStaticFiles(new StaticFileOptions
            {
                ContentTypeProvider = provider
            });

            app.UseHttpsRedirection();
            app.UseAuthentication();
            app.UseAuthorization();
            app.MapControllers();

            app.Run();
            #endregion
        }
    }
}
