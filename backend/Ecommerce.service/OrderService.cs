using Ecommerce.Contracts.DTOs.Charts;
using Ecommerce.Contracts.DTOs.order;
using Ecommerce.Contracts.Interfaces;
using Ecommerce.core.Entities;
using Ecommerce.core.Repositories;
using Ecommerce.core.Specifications;
using Ecommerce.Core;
using Ecommerce.Core.Entities;
using Ecommerce.Core.Entities.order;
using Ecommerce.Core.Enums;
using Ecommerce.Core.Repositories;
using Ecommerce.Core.Specifications;
using Microsoft.EntityFrameworkCore;
using Org.BouncyCastle.Bcpg;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ecommerce.service
{
    public class OrderService : IOrderService
    {
        private readonly IBasketRepository<CustomerBasket> _basketRepository;
        private readonly IUnitOfWork _unitOfWork;
        public OrderService(IBasketRepository<CustomerBasket> basketRepository, IUnitOfWork unitOfWork)
        {
            _basketRepository = basketRepository;
            _unitOfWork = unitOfWork;   
        }


        public async Task<IReadOnlyList<Order>> GetAllOrderByStatus(string status,int PageIndex = 1 , int PageSize = 8)
        {
            if (!Enum.TryParse(status, true, out OrderStatus orderStatus))
            {
                return await _unitOfWork.Repository<Order>().GetAllWithSpecAsync(new OrderWithSpecictions(PageIndex,PageSize));
            }

            return await _unitOfWork.Repository<Order>().GetAllWithSpecAsync(new OrderWithSpecictions().getOrderByStatus(orderStatus, PageIndex ,PageSize));       
        }

        public async Task<Order> CreateOrderAsync(string buyerEmail, string basketId, int deliveryMethodId, ShippingAddress shippingAddress,string paymentMethod)
        {
            #region Step 1: Retrieve and Validate Basket
            var basket = await GetBasketAsync(basketId);
            #endregion

            #region Step 2: Fetch Products for Basket Items
            var products = await GetProductsAsync(basket);
            #endregion

            #region Step 3: Valid Quantities Products
            var IsValidQuantities = HasValidQuantities(basket, products);
            if (IsValidQuantities != true)
                return new Order();
            #endregion

            #region Step 4: Convert Basket Items to Order Items
            var orderItems = MapBasketToOrderItems(basket, products);
            #endregion

            #region Step 5: Retrieve Delivery Method
            var deliveryMethod = await GetDeliveryMethodAsync(deliveryMethodId);
            #endregion

            #region Step 6: Create the Order Object
            var order = CreateOrderObject(buyerEmail, shippingAddress, orderItems, deliveryMethod, paymentMethod);
            #endregion

            #region Step 7: Save the Order in a Transaction
            return await SaveOrderAsync(order,basketId);
            #endregion
        }
        public Task<Order> GetOrderByIdForSpecificUserAsync(string buyerEmail, int orderId)
        {
            throw new NotImplementedException();
        }

        public async Task<IReadOnlyList<Order>> GetOrdersForSpecificUserAsync(string buyerEmail)
        {
          var specifc = new OrderWithSpecictions(buyerEmail);
          var orders = await _unitOfWork.Repository<Order>().GetAllWithSpecAsync(specifc);    
          return orders;    
        }

        public async Task<CombinedChartResponseDTO> GetDashboardChartData(ISpecifications<Order> specifications, ISpecifications<OrderItem> specOrderItems)
        {
            var sixteenDaysAgo = DateTime.UtcNow.AddDays(-15); // Last 16 days
            var orderQuery = _unitOfWork.Repository<Order>().GetQueryableWithSpec(specifications);
            var productQuery = _unitOfWork.Repository<OrderItem>().GetQueryableWithSpec(specOrderItems)
                .GroupBy(oi => oi.ProductName)
                .Select(g => new
                {
                    ProductName = g.Key,
                    OrderCount = g.Count(), 
                    Quantity = g.Sum(p => p.Quantity) 
                })
                .OrderByDescending(g => g.OrderCount) 
                .Take(30);

            var totalSalesTask = await orderQuery.SumAsync(o => o.SubTotal);
            var totalClientsTask = await orderQuery.Select(o => o.BuyerEmail).Distinct().CountAsync();
            var totalOrdersTask = await orderQuery.CountAsync();
          
            var totalProductsTask = await _unitOfWork.Repository<Product>().GetQueryableWithSpec(new ProductWithSpecifcations()).CountAsync();
            var orderDataTask = await orderQuery.Where(o => o.OrderDate >= sixteenDaysAgo) 
                .GroupBy(o => new { o.OrderDate.Date })
                .Select(g => new
                {
                    g.Key.Date,
                    TotalRevenue = g.Sum(o => o.SubTotal),
                    OrderCount = g.Count()
                })
                .OrderBy(g => g.Date).ToListAsync(); 

            var productDataTask = await productQuery.ToListAsync();

            var categoryChart = new ChartResponseDTO
            {
                Series = new List<ChartSeriesDTO>
        {
            new ChartSeriesDTO { Name = "Quantity Sold", Data = productDataTask.Select(c => (decimal)c.Quantity).ToList() }
        },
                Categories = productDataTask.Select(c => c.ProductName).ToList() // Sorted by order count
            };

            // Map order chart
            var orderChart = new ChartResponseDTO
            {
                Categories = orderDataTask.Select(o => o.Date.ToString("MMM dd")).ToList(), // Format as "Sep 10"
                Series = new List<ChartSeriesDTO>
        {
            new ChartSeriesDTO { Name = "Total Revenue", Data = orderDataTask.Select(o => o.TotalRevenue).ToList() },
            new ChartSeriesDTO { Name = "Order Count", Data = orderDataTask.Select(o => (decimal)o.OrderCount).ToList() }
        }
            };

            return new CombinedChartResponseDTO {TotalProducts = totalProductsTask, TotalClients = totalClientsTask,TotalOrders = totalOrdersTask , TotalSales = totalSalesTask,CategoryRevenueChart = categoryChart, OrderStatusChart = orderChart };
        }
        private async Task<CustomerBasket> GetBasketAsync(string basketId)
        {
            var basket = await _basketRepository.GetBasketAsync(basketId);
            if (basket == null || basket.BasketItems == null || !basket.BasketItems.Any())
                throw new Exception("Basket is empty or does not exist.");
            return basket;
        }
        private async Task<List<Product>> GetProductsAsync(CustomerBasket basket)
        {
            var productIds = basket.BasketItems.Select(b => b.ProductId).ToList();
            var products = await _unitOfWork.Repository<Product>().GetByIdsAsync(productIds);
            if (products == null || !products.Any())
                throw new Exception("Products not found for the given basket items.");
            return products;
        }
        private bool HasValidQuantities(CustomerBasket basket, List<Product> products)
        {
            foreach (var item in basket.BasketItems)
            {
                var product = products.FirstOrDefault(p => p.id == item.ProductId);
                if (product == null || item.Quantity > product.StockQuantity)
                    return false;
            }
            return true;
        }
        private decimal GetFinalPrice(Product product)
        {
            if (product.OfferStartDate.HasValue && product.OfferEndDate.HasValue &&
                product.OfferStartDate.Value < product.OfferEndDate.Value &&
                DateTime.Now >= product.OfferStartDate.Value && DateTime.Now <= product.OfferEndDate.Value &&
                product.OfferPrice.HasValue)
            {
                return product.OfferPrice.Value;
            }
            return product.Price;
        }
        private List<OrderItem> MapBasketToOrderItems(CustomerBasket basket, List<Product> products)
        {
            return basket.BasketItems.Select(item =>
            {
                var product = products.FirstOrDefault(p => p.id == item.ProductId);
                if (product == null)
                    throw new Exception($"Product with ID {item.ProductId} not found.");

                return new OrderItem
                {
                    ProductId = item.ProductId,
                    Price = GetFinalPrice(product),
                    PictureUrl = product.ImageUrl,
                    ProductName = product.Name,
                    Quantity = item.Quantity
                };
            }).ToList();
        }
        private async Task<DeliveryMethod> GetDeliveryMethodAsync(int deliveryMethodId)
        {
            var deliveryMethod = await _unitOfWork.Repository<DeliveryMethod>().GetByIdAsync(deliveryMethodId);
            if (deliveryMethod == null)
                throw new Exception("Delivery method not found.");
            return deliveryMethod;
        }
        private Order CreateOrderObject(string buyerEmail, ShippingAddress shippingAddress, List<OrderItem> orderItems, DeliveryMethod deliveryMethod,string _paymentMethod)
        {
            var subtotal = orderItems.Sum(item => item.TotalPrice);
            var total = subtotal + deliveryMethod.Cost;
            if (!Enum.TryParse(_paymentMethod, true, out PaymentMethods paymentMethod))
            {
                return new Order();
            }
            return new Order
            {
                BuyerEmail = buyerEmail,
                OrderDate = DateTime.UtcNow,
                PaymentMethod = paymentMethod,  
                ShippingAddress = shippingAddress,
                Items = orderItems,
                SubTotal = subtotal,
                DeliveryMethod = deliveryMethod,
                Status = OrderStatus.Pending,
                Total = total
            };
        }
        private async Task<Order> SaveOrderAsync(Order order, string basketId)
        {
            await _unitOfWork.BeginTransactionAsync();
            try
            {
                // Step 1: Get all products in one call (EF tracks them)
                var productIds = order.Items.Select(x => x.ProductId).Distinct().ToList();
                var products = await _unitOfWork.Repository<Product>().GetByIdsAsync(productIds);

                // Step 2: Validate and update stock
                foreach (var item in order.Items)
                {
                    var product = products.FirstOrDefault(p => p.id == item.ProductId);
                    if (product == null)
                        throw new Exception($"Product with ID {item.ProductId} not found.");

                    if (product.StockQuantity < item.Quantity)
                        throw new Exception($"Insufficient stock for product '{product.Name}'. Requested: {item.Quantity}, Available: {product.StockQuantity}");

                    product.StockQuantity -= item.Quantity; // EF tracks this change
                }

                // Step 2: Save the order
                await _unitOfWork.Repository<Order>().AddAsync(order);
                await _unitOfWork.CompleteAsync();

                // Step 3: Commit transaction
                await _unitOfWork.CommitAsync();

                // Step 4: Remove basket from Redis (assume _basketRepository is injected)
                await _basketRepository.DeleteBasketAsync(basketId);

                return order;
            }
            catch (Exception )
            {
                await _unitOfWork.RollbackAsync();
                return new Order();
             
            }
        }



    }
}
