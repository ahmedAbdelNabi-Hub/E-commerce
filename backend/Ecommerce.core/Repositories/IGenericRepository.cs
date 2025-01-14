using Ecommerce.core.Entities;
using Ecommerce.core.Specifications;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ecommerce.core.Repositories
{
    public interface IGenericRepository<T> where T : BaseEntity
    {
      
        Task<IReadOnlyList<T>> GetAllWithSpecAsync(ISpecifications<T> Spec);
        
       Task<IReadOnlyList<T>> GetAllWithTrackingAsync(ISpecifications<T> Spec);

        Task<T> GetByIdSpecAsync(ISpecifications<T> Spec);
        Task AddAsync(T entity);
        Task  UpdateAsync(T entity);
        Task  DeleteAsync(T entity);       
       
        Task<int> CountWithSpec(ISpecifications<T> Spec);

    }
}
