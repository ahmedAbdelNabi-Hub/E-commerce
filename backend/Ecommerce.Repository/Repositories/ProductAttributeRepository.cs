using Ecommerce.Core.Entities;
using Ecommerce.Core.Repositories;
using Ecommerce.Repository.Data;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Ecommerce.Repository.Repositories
{
    public class ProductAttributeRepository : GenericRepository<ProductAttributes>, IProductAttributeRepository
    {
        private readonly EcommerceDbContext _dbContext;

        public ProductAttributeRepository(EcommerceDbContext dbContext) : base(dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<List<(string FilterName, List<string> FilterValues, int ProductCount)>> GetGroupedProductAttributesAsync(string categoryName)
        {

            var result = await (from pa in _dbContext.ProductAttributes
                                join p in _dbContext.Product on pa.ProductId equals p.id
                                join c in _dbContext.Category on p.CategoryId equals c.id
                                where c.CategoryName == categoryName  && pa.IsFilterable
                                group pa by pa.AttributeName into grouped
                                select new
                                {
                                    FilterName = grouped.Key,
                                    FilterValues = grouped.Select(pa => pa.AttributeValue).Distinct().ToList(),
                                    ProductCount = grouped.Count()
                                })
                    .ToListAsync();

            return result.Select(r => (r.FilterName, r.FilterValues, r.ProductCount)).ToList();
        }
    }
}
