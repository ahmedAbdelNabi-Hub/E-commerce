using Ecommerce.core.Entities;
using Ecommerce.core.Repositories;
using Ecommerce.Core;
using Ecommerce.Core.Entities;
using Ecommerce.Core.Repositories;
using Ecommerce.Repository.Data;
using Ecommerce.Repository.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Ecommerce.Repository
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly EcommerceDbContext _context;
        private readonly Dictionary<string, object> _repositories;
        private IDbContextTransaction _transaction;
        private IProductAttributeRepository _productAttributeRepository;

        public UnitOfWork(EcommerceDbContext dbContext)
        {
            _context = dbContext;
            _repositories = new Dictionary<string, object>();
        }

        // Begin a new transaction
        public async Task BeginTransactionAsync()
        {
            _transaction = await _context.Database.BeginTransactionAsync();
        }

        // Commit the transaction
        public async Task CommitAsync()
        {
            if (_transaction != null)
            {
                await _transaction.CommitAsync();
                _transaction.Dispose();
            }
        }

        // Rollback the transaction in case of failure
        public async Task RollbackAsync()
        {
            if (_transaction != null)
            {
                await _transaction.RollbackAsync();
                _transaction.Dispose();
            }
        }

        // Complete changes and save data
        public async Task<int> CompleteAsync()
        {
            return await _context.SaveChangesAsync();
        }

        // Dispose resources
        public async ValueTask DisposeAsync()
        {
            await _context.DisposeAsync();
        }

        // Generic repository method
        public IGenericRepository<TEntity> Repository<TEntity>() where TEntity : BaseEntity
        {
            var type = typeof(TEntity).Name;

            if (!_repositories.ContainsKey(type))
            {
                if (typeof(TEntity) == typeof(ProductAttributes))
                {
                    _repositories.Add(type, GetProductAttributeRepository());
                }
                else
                {
                    var repositoryType = typeof(GenericRepository<>);
                    var repositoryInstance = Activator.CreateInstance(repositoryType.MakeGenericType(typeof(TEntity)), _context);
                    _repositories.Add(type, repositoryInstance!);
                }
            }

            return (IGenericRepository<TEntity>)_repositories[type];
        }

        // Specific repository for ProductAttributes
        public IProductAttributeRepository GetProductAttributeRepository()
        {
            _productAttributeRepository ??= new ProductAttributeRepository(_context);
            return _productAttributeRepository;
        }
    }
}
