using Ecommerce.core.Entities;
using Ecommerce.core.Entities.identity;
using Ecommerce.Core.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace Ecommerce.Repository.Data
{
    public  class EcommerceDbContext : IdentityDbContext<AppUser>
    {
        public DbSet<Navbar> Navbar { get; set; }
        public DbSet<Menu> Menu { get; set; }   
        public DbSet<MenuLinks> MenuLinks { get; set; }
        public DbSet<Status> Statuses { get; set; }
        public DbSet<ProductStatus> ProductStatus { get; set; }
        public DbSet<Advertisement> Advertisement { get; set; }
        public DbSet<Product> Product { get; set; }
        public DbSet<Category> Category { get; set; }
        public DbSet<ProductAttributes> ProductAttributes { get; set; } 
        public EcommerceDbContext(DbContextOptions<EcommerceDbContext> options):base(options) { }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            //add all configruations 
            modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());  
            base.OnModelCreating(modelBuilder);
        }

        protected override void ConfigureConventions(ModelConfigurationBuilder configurationBuilder)
        {
            configurationBuilder.Properties<DateTime>().HaveColumnType("DateTime");
            configurationBuilder.Properties<decimal>().HaveColumnType("decimal(8,2)");
        }
    }
}



/*
 public class EcommerceDbContext : DbContext
{
    public DbSet<Navbar> Navbar { get; set; }
    public DbSet<Menu> Menu { get; set; }
    public DbSet<MenuLinks> MenuLinks { get; set; }
    public DbSet<Advertisement> Advertisement { get; set; }

    public EcommerceDbContext(DbContextOptions<EcommerceDbContext> options) : base(options) { }

    // Automatically set CreatedAt and UpdatedAt
    public override int SaveChanges()
    {
        UpdateTimestamps();
        return base.SaveChanges();
    }

    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        UpdateTimestamps();
        return base.SaveChangesAsync(cancellationToken);
    }

    private void UpdateTimestamps()
    {
        var entities = ChangeTracker
            .Entries()
            .Where(e => e.Entity is BaseEntity && 
                        (e.State == EntityState.Added || e.State == EntityState.Modified));

        foreach (var entityEntry in entities)
        {
            if (entityEntry.State == EntityState.Added)
            {
                ((BaseEntity)entityEntry.Entity).CreatedAt = DateTime.Now;
            }

            ((BaseEntity)entityEntry.Entity).UpdatedAt = DateTime.Now;
        }
    }
}

 
 
 
 */