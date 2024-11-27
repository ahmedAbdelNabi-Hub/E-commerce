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
 
        public Task UpdateAsync(T entity)
        {
            if (entity == null) throw new ArgumentNullException(nameof(entity));
            _dbContext.Entry(entity).State = EntityState.Modified;
            return Task.CompletedTask;
        }

  
        public async Task<T> GetByIdSpecAsync(ISpecifications<T> spec)
        {
            if (spec == null) throw new ArgumentNullException(nameof(spec));
            return await ApplySpecification(spec).FirstOrDefaultAsync();
        }

       
        public async Task<IReadOnlyList<T>> GetAllWithSpecAsync(ISpecifications<T> spec)
        {
            if (spec == null) throw new ArgumentNullException(nameof(spec));
            return await ApplySpecification(spec).AsNoTracking().ToListAsync();
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
