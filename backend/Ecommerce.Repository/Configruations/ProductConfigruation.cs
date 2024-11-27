﻿using Ecommerce.core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

//builder.Service.add
// product -- category 
//    m     --    1      is have one (collection)
namespace Ecommerce.Repository.Configruations
{
    public class ProductConfigruation : IEntityTypeConfiguration<Product>
    {
        public void Configure(EntityTypeBuilder<Product> builder)
        {

            builder.Property(p => p.DeliveryTimeInDays).IsRequired().HasDefaultValue(4);

     

            builder.Property(p => p.Name)
                .IsRequired()
                .HasMaxLength(200);

            builder.Property(p => p.Description)
                .HasMaxLength(1000);

        

         
            builder.Property(p => p.Brand)
                .IsRequired()
                .HasMaxLength(100);

            builder.Property(p => p.SKU)
                .HasMaxLength(50)
                .IsRequired();

            
            builder.HasOne(p => p.Category)
                .WithMany(c => c.Products)  
                .HasForeignKey(p => p.CategoryId)
                .OnDelete(DeleteBehavior.Cascade);  

            // Price & Discount
            builder.Property(p => p.Price)
                .HasColumnType("decimal(18,2)");

            builder.Property(p => p.Discount)
                .HasColumnType("decimal(18,2)")
                .HasDefaultValue(0);

            // Stock, Rating, Reviews
            builder.Property(p => p.StockQuantity)
                .HasDefaultValue(0);

            // Images
            builder.Property(p => p.ImageUrl)
                .HasMaxLength(500);

            // Timestamps
            builder.Property(p => p.CreatedAt)
                .HasDefaultValueSql("GETDATE()");

            builder.Property(p => p.OfferStartDate)
             .HasDefaultValueSql("GETDATE()");

            builder.Property(p => p.UpdatedAt)
                .HasDefaultValueSql("GETDATE()");
        }
    }
}
