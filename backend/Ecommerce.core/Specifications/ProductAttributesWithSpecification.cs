using Ecommerce.core.Specifications;
using Ecommerce.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ecommerce.Core.Specifications
{
    public class ProductAttributesWithSpecification : Specification<ProductAttributes>
    {
        public ProductAttributesWithSpecification()
        {
            AddInclude(p => p.AttributeValue);
        }

        public ProductAttributesWithSpecification(string categoryName):base(pa=>pa.Product.Category.CategoryName==categoryName)
        {
            AddInclude(pa=>pa.Product);
            AddInclude(pa=>pa.Product.Category);
        }
        public ProductAttributesWithSpecification(int id) : base(pa =>pa.ProductId==id)
        {
            AddInclude(x => x.Product);
            AddInclude(x => x.Attribute);
            AddInclude(x => x.AttributeValue);
        }
        public ProductAttributesWithSpecification(int id ,bool valueTask = true):base(pa=>pa.AttributeValueId==id)
        {
            AddInclude(x => x.Attribute);
            AddInclude(x => x.AttributeValue);
        }
    }
}
