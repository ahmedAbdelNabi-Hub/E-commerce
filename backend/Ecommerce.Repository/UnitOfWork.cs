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
        private readonly EcommerceDbContext _dbContext;
        private readonly Dictionary<string, object> _repositories;
        private IDbContextTransaction _transaction;
        private IProductAttributeRepository _productAttributeRepository;

        public UnitOfWork(EcommerceDbContext dbContext)
        {
            _dbContext = dbContext;
            _repositories = new Dictionary<string, object>();
        }

        public async Task BeginTransactionAsync()
        {
            _transaction = await _dbContext.Database.BeginTransactionAsync();
        }

        public async Task<bool> CommitAsync()
        {
            try
            {
                await _transaction.CommitAsync();
                return true;
            }
            catch
            {
                await _transaction.RollbackAsync();
                return false;
            }
            finally
            {
                await _transaction.DisposeAsync();
                _transaction = null!;
            }

        }
        public async Task RollbackAsync()
        {
            if (_transaction != null)
            {
                await _dbContext.Database.RollbackTransactionAsync();
                await _transaction.DisposeAsync();
                _transaction = null!;
            }
        }
        public async Task<int> CompleteAsync()
        {
            return await _dbContext.SaveChangesAsync();
        }
        public void Dispose()
        {
            _dbContext.Dispose();
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
                    var repositoryInstance = Activator.CreateInstance(repositoryType.MakeGenericType(typeof(TEntity)), _dbContext);
                    _repositories.Add(type, repositoryInstance!);
                }
            }

            return (IGenericRepository<TEntity>)_repositories[type];
        }

        // Specific repository for ProductAttributes
        public IProductAttributeRepository GetProductAttributeRepository()
        {
            _productAttributeRepository ??= new ProductAttributeRepository(_dbContext);
            return _productAttributeRepository;
        }
    }
}
