using Ecommerce.core.Entities;
using Ecommerce.Core.Specifications;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Ecommerce.core.Specifications
{
    public class ProductWithSpecifcations:Specification<Product>
    {

        public ProductWithSpecifcations()
        {
            
        }

        public ProductWithSpecifcations CountProductBeforePagination(ProductSpecParams Params)
        {
            if (!string.IsNullOrEmpty(Params.CategoryName))
            {
                AddCriteria(p => p.Category.CategoryName == Params.CategoryName);
            }
            return this;
        }
      

        public ProductWithSpecifcations(ProductSpecParams Params)
        {
            if (!string.IsNullOrEmpty(Params.CategoryName))
            {
                AddCriteria(p => p.Category.CategoryName == Params.CategoryName);
            }
            ApplyPagination(Params.PageSize * (Params.PageIndex - 1),Params.PageSize);

        }


        public ProductWithSpecifcations(int id)
        {
            AddCriteria(p=>p.id==id && p.IsActive == true);
            AddInclude(p => p.Category);
            AddInclude(p => p.ProductAttributes);
        }


        public ProductWithSpecifcations OnOffer()
        {
            DateTime currentDate = DateTime.Now;
            AddCriteria(p => p.OfferStartDate <= currentDate && p.OfferEndDate >= currentDate && p.IsActive == true);
            AddInclude(p => p.Category);
            AddOrderByDescending(p => p.Discount!);
            return this;
        }

        public ProductWithSpecifcations newArrive() {
            AddIncludeExpression(query => query.Include(p => p.ProductStatus).ThenInclude(s=>s.Status));
            AddCriteria(ps => ps.ProductStatus.Any(s => s.Status.StatusName == "New Arrival"));
            AddCriteria(p => p.IsActive == true);
            return this;
        }
    }
}
