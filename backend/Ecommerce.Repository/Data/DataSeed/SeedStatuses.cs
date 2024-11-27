using Ecommerce.core.Entities;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Ecommerce.Repository.Data.DataSeed
{
    public static class StatusSeeder
    {
        public static async Task SeedStatuses(IServiceProvider serviceProvider)
        {
            using var context = serviceProvider.GetRequiredService<EcommerceDbContext>();

            // Check if any statuses already exist
            if (!context.Statuses.Any())
            {
                var statuses = new List<Status>
                {
new Status { StatusName = "New Arrival", StatusDescription = "Newly arrived products.", AssignableBy = "admin" },
new Status { StatusName = "Out of Stock", StatusDescription = "Currently unavailable.", AssignableBy = "system" },
new Status { StatusName = "Coming Soon", StatusDescription = "Set to launch soon.", AssignableBy = "system" },
new Status { StatusName = "Pre Order", StatusDescription = "Order now before release.", AssignableBy = "admin" },
new Status { StatusName = "Backordered", StatusDescription = "Temporarily out of stock but can be ordered.", AssignableBy = "system" },
new Status { StatusName = "Limited Edition", StatusDescription = "Available in limited quantities.", AssignableBy = "admin" },
new Status { StatusName = "Seasonal", StatusDescription = "Offered during specific seasons.", AssignableBy = "system" },
new Status { StatusName = "Discontinued", StatusDescription = "No longer in production.", AssignableBy = "system" },
new Status { StatusName = "Featured", StatusDescription = "Highlighted for marketing.", AssignableBy = "admin" },
new Status { StatusName = "Best Seller", StatusDescription = "High sales volume products.", AssignableBy = "system" },
new Status { StatusName = "On Sale", StatusDescription = "Discounted for a limited time.", AssignableBy = "admin" },
new Status { StatusName = "Exclusive", StatusDescription = "Available for select customers.", AssignableBy = "admin" },
new Status { StatusName = "Recommended", StatusDescription = "Suggested based on preferences.", AssignableBy = "system" },
new Status { StatusName = "Clearance", StatusDescription = "Marked down for clearance.", AssignableBy = "admin" },
new Status { StatusName = "Gift Item", StatusDescription = "Perfect for gifting.", AssignableBy = "admin" }


                };

                await context.Statuses.AddRangeAsync(statuses);
                await context.SaveChangesAsync();
            }
        }
    }
}
