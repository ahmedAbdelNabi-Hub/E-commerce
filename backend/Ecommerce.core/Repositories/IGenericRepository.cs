using Ecommerce.core.Entities;
using Ecommerce.core.Specifications;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Ecommerce.core.Repositories
{
    public interface IGenericRepository<T> where T : BaseEntity
    {
        Task<List<T>> GetByIdsAsync(List<int> ids);
        Task<IReadOnlyList<T>> GetAllWithSpecAsync(ISpecifications<T> Spec);
        Task<IReadOnlyList<T>> GetAllWithTrackingAsync(ISpecifications<T> Spec);
        Task<IReadOnlyList<T>> GetAllAsync();
        Task<T> GetByIdAsync(int id);
        Task<List<TResult>> GetProjectedAsync<TResult>(Expression<Func<T, TResult>> selector, ISpecifications<T> spec);
        IQueryable<T> GetQueryableWithSpec(ISpecifications<T> spec);
        Task<T> GetByIdSpecAsync(ISpecifications<T> Spec);
        Task AddAsync(T entity);
        Task DeleteRangeAsync(IEnumerable<T> entities);
        Task  UpdateAsync(T entity);
        Task AddRangeAsync(IEnumerable<T> entities);
        Task  DeleteAsync(T entity);
        Task<int> CountWithSpec(ISpecifications<T> Spec);

    }
}
