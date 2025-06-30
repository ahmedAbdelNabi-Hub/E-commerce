using Ecommerce.Contracts.DTOs.Charts;
using Ecommerce.core.Specifications;
using Ecommerce.Core.Entities;
using Ecommerce.Core.Entities.order;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ecommerce.Contracts.Interfaces
{
    public interface IOrderService
    {
        Task<Order> CreateOrderAsync(string buyerEmail, string basketId, int deliveryMethodId, ShippingAddress shippingAddress,string paymentMethod);

        Task<Order> GetOrderByIdForSpecificUserAsync(string buyerEmail, int orderId);

        Task<IReadOnlyList<Order>> GetOrdersForSpecificUserAsync(string buyerEmail);

        Task<IReadOnlyList<Order>> GetAllOrderByStatus(string status, int PageIndex, int PageSize);
        Task<CombinedChartResponseDTO> GetDashboardChartData(ISpecifications<Order> specifications, ISpecifications<OrderItem> specOrderItems);

    }

}
