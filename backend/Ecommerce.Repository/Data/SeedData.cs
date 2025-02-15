using System.Collections.Generic;
using System.IO;
using System.Text.Json;
using System.Threading.Tasks;
using Ecommerce.Core.Entities.order;
using Ecommerce.Repository.Data;
using Google;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

public static class SeedData
{
    public static async Task SeedDeliveryMethods(IServiceProvider serviceProvider)
    {
        using var scope = serviceProvider.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<EcommerceDbContext>();
        if (!await context.DeliveryMethods.AnyAsync())
        {
            var jsonData = await File.ReadAllTextAsync("../Ecommerce.Repository/Data/DataSeed/deliveryMethods.json");
            var deliveryMethods = JsonSerializer.Deserialize<List<DeliveryMethod>>(jsonData);

            if (deliveryMethods != null)
            {
                await context.DeliveryMethods.AddRangeAsync(deliveryMethods);
                await context.SaveChangesAsync();
            }
        }
    }
}
