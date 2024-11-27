using Ecommerce.core.Entities;
using Microsoft.EntityFrameworkCore.Query;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Ecommerce.core.Specifications
{
    public class Specification<T> : ISpecifications<T> where T : BaseEntity
    {
        public Expression<Func<T, bool>> Criteria { get; private set; }
        public List<Expression<Func<T, object>>> Includes { get; private set; } = new List<Expression<Func<T, object>>>();
        public List<Func<IQueryable<T>, IQueryable<T>>> IncludeExpressions { get; } = new List<Func<IQueryable<T>, IQueryable<T>>>();
        public Expression<Func<T, object>> GroupByExpression { get; private set; }
        public Expression<Func<T, object>> OrderByDescending { get; private set; }
        public  Expression<Func<T, object>> OrderBy { get; private set; }

        public int Skip { get; private set; }
        public int Take { get; private set; }

        public bool IsPaginationEnabled { get; private set; }
     
        public Specification()
        {
            
        }

        public Specification(Expression<Func<T,bool>> criteria) 
        {
            AddCriteria(criteria);
        }

        protected void AddCriteria(Expression<Func<T,bool>> criteria)
        { 
            Criteria = criteria;
        }

        protected void AddIncludeExpression(Func<IQueryable<T>, IQueryable<T>> includeFunc)
        {
            IncludeExpressions.Add(includeFunc);
        }

        protected void AddInclude(Expression<Func<T, object>> include) 
        {
            Includes.Add(include);  
        }

        protected void AddGroupBy (Expression<Func<T, object>> group)
        {
            this.GroupByExpression = group;
        }

        protected void AddOrderByDescending(Expression<Func<T,object>> orderByDescending)
        {
            this.OrderByDescending= orderByDescending;
        }
        protected void AddOrderBy(Expression<Func<T, object>> orderBy)
        {
            this.OrderBy = orderBy;
        }

        protected void ApplyPagination(int skip , int take)
        {
            this.IsPaginationEnabled= true; 
            this.Skip = skip;
            this.Take = take;
        }



    }
   
}
