using Ecommerce.core.Entities;
using Ecommerce.Core.Specifications;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace Ecommerce.core.Specifications
{
    public class ProductStatusWithSpecifications:Specification<ProductStatus>
    {
        public ProductStatusWithSpecifications()
        {
            
        }

        public ProductStatusWithSpecifications(int productId,int StatusId):base(ps => ps.StatusId == StatusId && ps.ProductId == productId)
        {
        }
        public ProductStatusWithSpecifications(ProductSpecParams Params) :base(ps => ps.StatusId == Params.StatusId &&  ps.Product.IsActive == true)
        {
            AddInclude(ps => ps.Product);
            AddOrderByDescending(ps => ps.Product.CreatedAt);
            ApplyPagination(Params.PageSize * (Params.PageIndex - 1), Params.PageSize);

        }

        public ProductStatusWithSpecifications CountProductBeforePagination(ProductSpecParams Params)
        {
            if (Params.StatusId is not null)
            {
                AddCriteria(ps => ps.StatusId == Params.StatusId);
            }
            return this;
        }

    }
}
