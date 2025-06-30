using Ecommerce.Core.Entities.order;
using Ecommerce.Repository.Data;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ecommerce.Repository.Repositories
{
    public class OrderRepository : GenericRepository<Order> 
    {
        private readonly EcommerceDbContext _dbContext;

        public OrderRepository(EcommerceDbContext dbContext) : base(dbContext)
        {
            _dbContext = dbContext;

        }

        public IQueryable<Order> GetOrderStatusChartQuery()
        {
            return _dbContext.Orders
                .Where(o => o.OrderDate >= DateTime.UtcNow.AddMonths(-6));
        }



    }
}
