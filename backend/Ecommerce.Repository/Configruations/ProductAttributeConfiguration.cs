using Ecommerce.Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection.Emit;
using System.Text;
using System.Threading.Tasks;

namespace Ecommerce.Repository.Configruations
{
    public class ProductAttributeConfiguration : IEntityTypeConfiguration<ProductAttributes>
    {
         public void Configure(EntityTypeBuilder<ProductAttributes> builder)
         {
            //builder.Property(pa=>pa.CreatedAt).HasDefaultValueSql("GETUTCDATE()");
            //builder.Property(pa => pa.UpdatedAt).HasDefaultValueSql("GETUTCDATE()");
            //builder.Property(pa=>pa.IsFilterable).HasDefaultValue(false);
            builder
      .HasOne(p => p.AttributeValue)
    .WithMany()
    .HasForeignKey(p => p.AttributeValueId)
    .OnDelete(DeleteBehavior.Restrict); // ✅ or NoAction

            builder
                   .HasOne(p => p.Product)
                .WithMany(p => p.ProductAttributes)
                .HasForeignKey(p => p.ProductId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
