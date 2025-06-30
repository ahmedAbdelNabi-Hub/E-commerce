using Ecommerce.Core.Entities.order;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ecommerce.Repository.Configruations
{
    internal class OrderItemsConfiguration : IEntityTypeConfiguration<OrderItem>
    {
       
public void Configure(EntityTypeBuilder<OrderItem> builder)
        {
            builder.Property(ot => ot.CreatedAt).HasDefaultValueSql("GETDATE()");
            builder.Property(ot => ot.UpdatedAt).HasDefaultValueSql("GETDATE()");

        }
    }
}
