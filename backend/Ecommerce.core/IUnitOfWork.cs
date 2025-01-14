using Ecommerce.Core.Repositories;
using Ecommerce.Core.Entities;
using System.Threading.Tasks;
using Ecommerce.core.Entities;
using Ecommerce.core.Repositories;

namespace Ecommerce.Core
{
    public interface IUnitOfWork
    {
        // Start a new transaction
        Task BeginTransactionAsync();

        // Commit the current transaction
        Task CommitAsync();

        // Rollback the current transaction
        Task RollbackAsync();

        // Complete changes and save data
        Task<int> CompleteAsync();

        // Generic repository access
        IGenericRepository<TEntity> Repository<TEntity>() where TEntity : BaseEntity;

        // Specific repository for ProductAttributes
        IProductAttributeRepository GetProductAttributeRepository();
    }
}
