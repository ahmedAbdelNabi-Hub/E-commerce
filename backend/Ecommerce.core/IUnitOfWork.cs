using Ecommerce.core.Entities;
using Ecommerce.core.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ecommerce.core
{
    public interface IUnitOfWork : IAsyncDisposable
    {
        IGenericRepository<TEntity> Repository<TEntity>() where TEntity : BaseEntity;
        Task<int> CompleteAsync();
    }
}
