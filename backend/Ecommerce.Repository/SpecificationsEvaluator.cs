using Ecommerce.Contracts.DTOs;
using Ecommerce.core.Entities;
using Ecommerce.core.Specifications;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace Ecommerce.Repository
{
    public static class SpecificationsEvaluator<T> where T : BaseEntity
    {
        public static IQueryable<T> GetQuery(IQueryable<T> inputQuery, ISpecifications<T> specifications)
        {
            var query = inputQuery;

            if (specifications.Criteria != null)
            {
                query = query.Where(specifications.Criteria);
            }

            if (specifications.OrderBy is not null)
            {
                query = query.OrderBy(specifications.OrderBy);
            }

            if (specifications.OrderByDescending is not null)
            {
                query = query.OrderByDescending(specifications.OrderByDescending);
            }

            if (specifications.IsPaginationEnabled)
            {
                query = query.Skip(specifications.Skip).Take(specifications.Take);  
            }

            if (specifications.Includes.Any())
            {
                query = specifications.Includes
              .Aggregate(query, (current, include) => current.Include(include));
            }

            // Apply complex Includes (for Include -> ThenInclude chains) using Aggregate
            if (specifications.IncludeExpressions.Any())
            {
                query = specifications.IncludeExpressions
                    .Aggregate(query, (current, includeExpression) => includeExpression(current));
            }

            if (specifications.GroupByExpression != null)
            {
                // Perform grouping and directly project to a result type
                query.GroupBy(specifications.GroupByExpression).SelectMany(x => x);
              
            }

            
       
            return query;
        }
    }
}


