using Ecommerce.core.Specifications;
using Ecommerce.Core.Entities.order;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ecommerce.Core.Specifications
{
    public class OrderItemsWithSpecictions : Specification<OrderItem>
    {
        public OrderItemsWithSpecictions() : base()
        {

        }

        public OrderItemsWithSpecictions(ProductSpecParams Params) : base()
        {

            ApplyPagination(Params.PageSize * (Params.PageIndex - 1), Params.PageSize);
            
        }

    }
}
