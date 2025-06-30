using Ecommerce.core.Specifications;
using Ecommerce.Core.Entities.order;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ecommerce.Core.Specifications
{
    public class OrderWithSpecictions : Specification<Order>
    {
        public OrderWithSpecictions()
        {
            
        }

        public OrderWithSpecictions(int PageIndex,int PageSize)
        {
            ApplyPagination(PageSize * (PageIndex - 1), PageSize);
            AddOrderByDescending(o=>o.OrderDate);
        }

        public OrderWithSpecictions(string email):base(o=>o.BuyerEmail==email)
        {
            AddInclude(o=>o.DeliveryMethod);
            AddOrderByDescending(o => o.OrderDate);

            AddInclude(o=>o.Items); 
        }
    
        public OrderWithSpecictions(int orderId) : base(o => o.id == orderId)
        {
            AddInclude(o => o.DeliveryMethod);
            AddInclude(o => o.Items);
        }

        public OrderWithSpecictions(DateTime lastWeekDates) :base(o =>o.OrderDate>=lastWeekDates) 
        {
        }

        public OrderWithSpecictions getOrderWithsessionId(string sessionId)
        {
            AddCriteria(o => o.PaymentIntentId == sessionId);
            return this;
        }

        public OrderWithSpecictions getOrderByStatus(OrderStatus status, int PageIndex = 1, int PageSize = 8)
        {
            AddCriteria(o => o.Status == status);
            ApplyPagination(PageSize * (PageIndex - 1),PageSize);
            AddOrderByDescending(o => o.OrderDate);
            AddInclude(o => o.DeliveryMethod);
            return this;
        }




    }
}
