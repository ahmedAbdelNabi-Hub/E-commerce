using AutoMapper;
using Ecommerce.Contracts.DTOs;
using Ecommerce.Contracts.DTOs.Charts;
using Ecommerce.Contracts.DTOs.order;
using Ecommerce.Contracts.DTOs.product;
using Ecommerce.Contracts.Interfaces;
using Ecommerce.Core;
using Ecommerce.Core.Entities.order;
using Ecommerce.Core.Enums;
using Ecommerce.Core.Repositories;
using Ecommerce.Core.Specifications;
using EcommerceContract.ErrorResponses;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Ecommerce.Controllers
{
    [Route("api/orders")]
    [ApiController]
    public class OrderController : BaseController
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly IBasketRepository<ProductViewDto> _basketRepository;
        private readonly IOrderService _orderService;
        private readonly IPaymentService _paymentService;

        public OrderController(IOrderService orderService, IUnitOfWork unitOfWork, IMapper mapper,
                               IBasketRepository<ProductViewDto> basketRepository, IPaymentService paymentService)
        {
            _mapper = mapper;
            _unitOfWork = unitOfWork;
            _basketRepository = basketRepository;
            _orderService = orderService;
            _paymentService = paymentService;
        }


        [HttpGet("/api/orders")]
        public async Task<ActionResult<PaginationDto<OrderDTO>>> GetOrdersByStatus([FromQuery] string? status , [FromQuery] int pageIndex = 1, [FromQuery] int pageSize = 8)
        {
           var order = await _orderService.GetAllOrderByStatus(status, pageIndex, pageSize);
            if (!order.Any()) { 
              return NotFound(new BaseApiResponse(StatusCodes.Status404NotFound,"Not Found Order"));
            }
           var mappingOrder = _mapper.Map<IReadOnlyList<OrderDTO>>(order); 
            return Ok(new PaginationDto<OrderDTO> { data = mappingOrder! , PageIndex = pageIndex , PageSize = pageSize,Count=0});
        }

        [Authorize]
        [HttpPost("/api/order/create")]
        public async Task<IActionResult> CreateOrder([FromBody] OrderParamsDTO orderParamsDTO)
        {
            var email = User.FindFirstValue(ClaimTypes.Email);
            if (string.IsNullOrEmpty(email))
                return Unauthorized(new BaseApiResponse(401, "Unauthorized User"));

            try
            {
                var order = await _orderService.CreateOrderAsync(email, orderParamsDTO.basketId,
                                                                 orderParamsDTO.deliveryMethodId,
                                                                 orderParamsDTO.shippingAddress,
                                                                 orderParamsDTO.PaymentMethod);
                if (order == null)
                    return BadRequest(new BaseApiResponse(400, "Failed to create order"));

                string sessionUrl = null;

                if (order.PaymentMethod == PaymentMethods.CreditCard || order.PaymentMethod == PaymentMethods.Paypal)
                {
                    sessionUrl = await _paymentService.CreateCheckoutSessionAsync(order.id);
                }

                return Ok(new
                {
                    orderId = order.id,
                    checkoutUrl = sessionUrl,
                    message = "Order created successfully"
                });
            }
            catch (Exception ex)
            {
                await _unitOfWork.RollbackAsync();
                return StatusCode(500, new BaseApiResponse(500, $"Internal server error: {ex.Message}"));
            }
        }

        [HttpDelete]
        [Route("/api/orders/{id}")]
        public async Task<IActionResult> DeleteOrder (int id)
        {
            var order = await _unitOfWork.Repository<Order>().GetByIdAsync(id);
            if(order == null) return NotFound(new BaseApiResponse(404,"Order Not Found"));
             await _unitOfWork.BeginTransactionAsync();
             await _unitOfWork.Repository<Order>().DeleteAsync(order);    
             var IsSuccess =  await _unitOfWork.CommitAsync();
            if (!IsSuccess) return BadRequest(new BaseApiResponse(StatusCodes.Status500InternalServerError,"Not Delete Order"));
            return Ok(new BaseApiResponse(StatusCodes.Status200OK));
        }


        [HttpPatch]
        [Route("/api/orders/{id}/status/{status}")]
        public async Task<IActionResult> UpdateStatus(int id, string status)
        {
            // Validate the provided status
            if (!Enum.TryParse(status, true, out OrderStatus newStatus))
            {
                return BadRequest(new BaseApiResponse(400, "Invalid status value"));
            }

            var order = await _unitOfWork.Repository<Order>().GetByIdAsync(id);
            if (order == null)
            {
                return NotFound(new BaseApiResponse(404, "Order Not Found"));
            }

            if (order.Status ==OrderStatus.Delivered || newStatus  == OrderStatus.Paid)
            {
                return BadRequest(new BaseApiResponse(400, "Order cannot be change status"));
            }

            await _unitOfWork.BeginTransactionAsync();
            order.Status = newStatus;
            await _unitOfWork.CompleteAsync();
            var isSuccess = await _unitOfWork.CommitAsync();

            if (!isSuccess)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new BaseApiResponse(500, "Failed to update order status"));
            }

            return Ok(new BaseApiResponse(200, "Order status updated successfully"));
        }

        [Authorize]
        [HttpGet]
        [Route("/api/orders/by-email")]
        public async Task<ActionResult<IReadOnlyList<OrderDTO>>> GetOrdersForSpecificUserAsync()
        {

           var email = User.FindFirstValue(ClaimTypes.Email);
            if (email == null) return Unauthorized(new BaseApiResponse(404, "Unauthorized User"));
            var order = await _orderService.GetOrdersForSpecificUserAsync(email);
            if (order == null || !order.Any())
                return NotFound(new BaseApiResponse(404, "No orders found for this user"));

            return Ok(_mapper.Map<IReadOnlyList<OrderDTO>>(order));
        }

        [HttpGet]
        [Route("/api/deliveryMethods")] 
        public async Task<ActionResult<IReadOnlyList<DeliveryMethodsDTO>>> GetDeliveryMethods()
        {
            var deliveryMethods = await _unitOfWork.Repository<DeliveryMethod>().GetAllAsync();
            if (deliveryMethods == null) return NotFound(new BaseApiResponse(404));
            return Ok(_mapper.Map<IReadOnlyList<DeliveryMethodsDTO>>(deliveryMethods));
        }
        [HttpGet]
        [Route("/api/orders/dashboard-chart-data")]
        public async Task<ActionResult<CombinedChartResponseDTO>> GetDashboardChartData()
        {
            var sixMonthsAgo = DateTime.Now.AddMonths(-6);

            var orderSpec = new OrderWithSpecictions(sixMonthsAgo); // Pass List<DateTime>
            var orderItemSpec = new OrderItemsWithSpecictions(); // Your existing implementation

            var chartData = await _orderService.GetDashboardCounter(orderSpec, orderItemSpec);

            if (chartData == null)
                return NotFound(new BaseApiResponse(404, "No data found"));

            return Ok(chartData);
        }



    }
}
