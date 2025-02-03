using Ecommerce.core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Ecommerce.Repository.Configruations
{
    public class StatusConfigruation : IEntityTypeConfiguration<Status>
    {
        public void Configure(EntityTypeBuilder<Status> builder)
        {
            // Set the table name
            builder.ToTable("Statuses");

         

            // Configure properties
            builder.Property(s => s.StatusName)
                .IsRequired() // This property is required
                .HasMaxLength(100); // Set max length for the StatusName property

            builder.Property(s => s.StatusDescription)
                .HasMaxLength(500); // Set max length for the StatusDescription property

            // Configure relationships
            builder.HasMany(s => s.ProductStatus)
                .WithOne(ps => ps.Status)
                .HasForeignKey(ps => ps.StatusId);
        }
    }
}
