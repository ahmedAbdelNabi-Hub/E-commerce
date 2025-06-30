using Ecommerce.Core.Repositories;
using Ecommerce.Core.Entities;
using System.Threading.Tasks;
using Ecommerce.core.Entities;
using Ecommerce.core.Repositories;

namespace Ecommerce.Core
{
    public interface IUnitOfWork
    {
        Task BeginTransactionAsync();
        Task<bool> CommitAsync();
        Task RollbackAsync();
        Task<int> CompleteAsync();
        IGenericRepository<TEntity> Repository<TEntity>() where TEntity : BaseEntity;
        IProductAttributeRepository GetProductAttributeRepository();
    }
}
