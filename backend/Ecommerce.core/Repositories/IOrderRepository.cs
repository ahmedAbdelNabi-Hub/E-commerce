using System.Collections.Generic;
using System.Threading.Tasks;

namespace Ecommerce.Core.Repositories
{
    public interface IOrderRepository
    {
        Task<List<(string Month, decimal TotalRevenue, int OrderCount)>> GetOrderStatusData();
    }
}
