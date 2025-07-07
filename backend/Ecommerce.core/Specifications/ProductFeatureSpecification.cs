using Ecommerce.core.Specifications;
using Ecommerce.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ecommerce.Core.Specifications
{
    public class ProductFeatureSpecification : Specification<ProductFeature>
    {
        public ProductFeatureSpecification() { }
        public ProductFeatureSpecification(int productId)
        {
            AddCriteria(f=>f.ProductId==productId);
        }
    }
}
