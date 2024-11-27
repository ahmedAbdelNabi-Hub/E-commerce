using Ecommerce.core.Entities;
using Ecommerce.core.Repositories;
using Ecommerce.core;
using Ecommerce.Repository.Data;
using Ecommerce.Repository.Repositories;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Ecommerce.Repository
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly EcommerceDbContext _context;
        private readonly Dictionary<string, object> _repositories;  // To store repositories

        public UnitOfWork(EcommerceDbContext DbContext)
        {
            _context = DbContext;
            _repositories = new Dictionary<string, object>();
        }

        // This method will commit all pending changes to the database
        public async Task<int> CompleteAsync()
        {
            return await _context.SaveChangesAsync();
        }

        // Dispose the database context
        public async ValueTask DisposeAsync()
        {
            await _context.DisposeAsync();
        }

        // Generic method to get a repository for the given entity type
        public IGenericRepository<TEntity> Repository<TEntity>() where TEntity : BaseEntity
        {
            // Check if the repository for TEntity already exists in the dictionary
            var type = typeof(TEntity).Name;
            if (!_repositories.ContainsKey(type))
            {
                // Create a new GenericRepository for the entity and store it in the dictionary
                var repositoryType = typeof(GenericRepository<>);
                var repositoryInstance = Activator.CreateInstance(repositoryType.MakeGenericType(typeof(TEntity)), _context);
                _repositories.Add(type, repositoryInstance);
            }
            return (IGenericRepository<TEntity>)_repositories[type];
        }
    }
}
