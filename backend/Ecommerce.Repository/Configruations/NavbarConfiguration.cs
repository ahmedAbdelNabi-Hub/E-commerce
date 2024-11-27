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
    public class NavbarConfiguration : IEntityTypeConfiguration<Navbar>
    {
        public void Configure(EntityTypeBuilder<Navbar> builder)
        {
            builder.Property(n => n.Name).IsRequired().HasMaxLength(255);
            builder.Property(n=>n.Url).IsRequired().HasMaxLength(100);

            builder.HasMany(n => n.Menus)
           .WithOne(m => m.Navbar)
           .HasForeignKey(m => m.NavbarId)   
           .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
