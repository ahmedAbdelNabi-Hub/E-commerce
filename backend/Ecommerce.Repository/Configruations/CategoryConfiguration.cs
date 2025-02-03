using Ecommerce.core.Entities;
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
    public class CategoryConfiguration : IEntityTypeConfiguration<Category>
    {
        public void Configure(EntityTypeBuilder<Category> builder)
        {

            builder.HasKey(e => e.id);  

            builder.Property(e => e.CategoryName)
                .IsRequired()
                .HasMaxLength(100);   

            

            builder.Property(e => e.CategoryType)
                    .IsRequired()
                    .HasMaxLength(100);  


            builder.Property(e => e.Image)
                    .HasMaxLength(250);  

        }
    }
}
