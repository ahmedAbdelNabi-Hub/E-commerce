using Ecommerce.core.Entities;
using Ecommerce.core.Repositories;
using Ecommerce.core.Specifications;
using Ecommerce.Repository.Data;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Ecommerce.Repository.Repositories
{
    public class GenericRepository<T> : IGenericRepository<T> where T : BaseEntity
    {
        private readonly EcommerceDbContext _dbContext;

        public GenericRepository(EcommerceDbContext dbContext)
        {
            _dbContext = dbContext ?? throw new ArgumentNullException(nameof(dbContext));
            //var x = _dbContext.Product.Where(p => p.OfferPrice > 0).GroupBy(p => p.Category).SelectMany(x=>x);
        }

        public async Task AddAsync(T entity)
        {
            if (entity == null) throw new ArgumentNullException(nameof(entity));
            await _dbContext.Set<T>().AddAsync(entity);
        }
        public Task DeleteAsync(T entity)
        {
            if (entity == null) throw new ArgumentNullException(nameof(entity));
            _dbContext.Set<T>().Remove(entity);
            return Task.CompletedTask;
        }
        public async Task UpdateAsync(T entity)
        {
            if (entity == null) throw new ArgumentNullException(nameof(entity));

            // Check if the entity is already being tracked
            var trackedEntity = _dbContext.Set<T>().Local.FirstOrDefault(e => e.Equals(entity));

            if (trackedEntity == null)
            {
                // Attach the entity to the DbContext if it's not tracked
                _dbContext.Attach(entity);
            }

            // Mark the entity as modified
            _dbContext.Entry(entity).State = EntityState.Modified;

            // Iterate through navigation properties (if any) and mark them as modified too
            foreach (var navigation in _dbContext.Entry(entity).Navigations)
            {
                if (navigation.IsModified)
                {
                    _dbContext.Entry(navigation.CurrentValue!).State = EntityState.Modified;
                }
            }

            // Save changes to the database
            await _dbContext.SaveChangesAsync();
        }
        public async Task<T> GetByIdSpecAsync(ISpecifications<T> spec)
        {
            if (spec == null) throw new ArgumentNullException(nameof(spec));
            return await ApplySpecification(spec).AsTracking().SingleOrDefaultAsync();
        }
        public async Task<IReadOnlyList<T>> GetAllWithSpecAsync(ISpecifications<T> spec)
        {
            if (spec == null) throw new ArgumentNullException(nameof(spec));
            return await ApplySpecification(spec).AsNoTracking().ToListAsync();
        }
        public async Task<IReadOnlyList<T>> GetAllWithTrackingAsync(ISpecifications<T> spec)
        {
            if (spec == null) throw new ArgumentNullException(nameof(spec));
            return await ApplySpecification(spec).ToListAsync();
        }
        public async Task<IReadOnlyList<T>> GetAllAsync()
        {
            return await _dbContext.Set<T>()
                                   .AsNoTracking()
                                   .ToListAsync();
        }
        public async Task<T> GetByIdAsync(int id)
        {
            ArgumentNullException.ThrowIfNull(id, nameof(id));
            return await _dbContext.Set<T>().FindAsync(id);
        }
        public async Task<int> CountWithSpec(ISpecifications<T> Spec)
        {
           return await ApplySpecification(Spec).CountAsync();  
        }
        private IQueryable<T> ApplySpecification(ISpecifications<T> spec)
        {
            if (spec == null) throw new ArgumentNullException(nameof(spec));
            return SpecificationsEvaluator<T>.GetQuery(_dbContext.Set<T>().AsQueryable(), spec);
        }

    }
}
