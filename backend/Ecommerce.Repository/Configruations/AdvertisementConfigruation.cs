using Ecommerce.Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;

namespace Ecommerce.Repository.Configruations
{
    public class AdvertisementConfigruation : IEntityTypeConfiguration<Advertisement>
    {
        public void Configure(EntityTypeBuilder<Advertisement> builder)
        {

            // Primary Key
            builder.HasKey(a => a.id);

            // Properties Configuration
            builder.Property(a => a.LargeImage)
                   .IsRequired()
                   .HasMaxLength(500);

            builder.Property(a => a.SmallImage)
                   .HasMaxLength(500);

            builder.Property(a => a.LinkUrl)
                   .HasMaxLength(500);

            builder.Property(a => a.Title)
                   .IsRequired()
                   .HasMaxLength(200);

            builder.Property(a => a.Subtitle)
                   .HasMaxLength(200);

            builder.Property(a => a.Description)
                   .HasMaxLength(1000);

            builder.Property(a => a.Direction)
                   .HasMaxLength(50);

            builder.Property(a => a.TargetPage)
                   .HasMaxLength(100);

            builder.Property(a => a.Section)
                   .HasMaxLength(100);

         

            builder.Property(a => a.CreatedAt)
       .HasColumnType("datetime")
       .HasDefaultValueSql("GETDATE()")
       . ValueGeneratedOnAdd();
            

            builder.Property(a => a.UpdatedAt)
                   .HasColumnType("datetime")
                   .HasDefaultValueSql("GETDATE()").ValueGeneratedOnAddOrUpdate(); ;


        

            builder.Property(a => a.IsActive)
                   .HasDefaultValue(true);
        }
    }
}
