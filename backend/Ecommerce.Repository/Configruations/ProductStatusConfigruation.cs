using Ecommerce.core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ecommerce.Repository.Configruations
{
    internal class ProductStatusConfigruation : IEntityTypeConfiguration<ProductStatus>
    {
        public void Configure(EntityTypeBuilder<ProductStatus> builder)
        {
            builder.Property(ps=>ps.id).ValueGeneratedOnAdd();
            builder.HasKey(pk => new { pk.ProductId, pk.StatusId });
        }
    }
}
