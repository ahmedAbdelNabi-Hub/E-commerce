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
        //public async Task<List<(string FilterName, List<string> FilterValues, int ProductCount)>> GetGroupedProductAttributesAsync(string categoryName)
        //{
        //    var result = await _dbContext.ProductAttributes
        //        .Where(pa => pa.Product.Category.CategoryName == categoryName && pa.IsFilterable)
        //        .GroupBy(pa => pa.AttributeName)
        //        .Select(grouped => new
        //        {
        //            FilterName = grouped.Key,
        //            FilterValues = grouped.Select(pa => pa.AttributeValue).Distinct().ToList(),
        //            ProductCount = grouped.Select(pa => pa.ProductId).Distinct().Count()
        //        })
        //        .ToListAsync();

        //    return result.Select(r => (r.FilterName, r.FilterValues, r.ProductCount)).ToList();
        //}

    }
}
