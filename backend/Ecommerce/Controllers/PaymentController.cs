using Ecommerce.Contracts.DTOs.Payment;
using Ecommerce.Contracts.Interfaces;
using Ecommerce.Controllers;
using Ecommerce.Core;
using Ecommerce.Core.Entities.order;
using Ecommerce.Core.Specifications;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Stripe;
using Stripe.Checkout;
using System;
using System.IO;
using System.Text;
using System.Threading.Tasks;

namespace Ecommerce.Api.Controllers
{
    public class PaymentController : BaseController
    {
        private readonly IPaymentService _paymentService;
        private readonly IOrderService _orderService;
        private readonly IUnitOfWork _unitOfWork;
        private const string StripeWebhookSecret = "whsec_f28a10058a569161f9fa036de7559e915c06c042fc705f1c2e8d986602631143"; // 🔹 Replace with your actual Stripe webhook secret
        
        public PaymentController(
            IPaymentService paymentService,
            IOrderService orderService,
            IUnitOfWork unitOfWork,
            ILogger<PaymentController> logger)
        {
            _paymentService = paymentService;
            _orderService = orderService;
            _unitOfWork = unitOfWork;
        }

        // 🔹 Create Checkout Session
        [HttpPost("/api/payment/create-checkout-session/{orderId}")]
        public async Task<IActionResult> CreateCheckoutSession(int orderId)
        {
            var sessionUrl = await _paymentService.CreateCheckoutSessionAsync(orderId);
            return Ok(new { url = sessionUrl });
        }

        // 🔹 Update Payment after checkout
        [HttpPost("/api/payment/update")]
        public async Task<IActionResult> UpdatePayment([FromBody] UpdatePaymentDTO request)
        {
            var order = await _unitOfWork.Repository<Order>().GetByIdSpecAsync(new OrderWithSpecictions().getOrderWithsessionId(request.SessionId));

            if (order == null)
                return NotFound(new { message = "Order not found for the given session ID" });

            var sessionService = new SessionService();
            var session = await sessionService.GetAsync(request.SessionId);

            if (session == null || string.IsNullOrEmpty(session.PaymentIntentId))
                return BadRequest(new { message = "Invalid session ID or payment not completed" });

            order.PaymentIntentId = session.PaymentIntentId;
            order.Status = OrderStatus.Paid;
            await _unitOfWork.CompleteAsync();

            return Ok(new { message = "Payment updated successfully", paymentIntentId = order.PaymentIntentId });
        }

        // 🔹 Secure Stripe Webhook
        [HttpPost("/api/payments/webhook")]
        public async Task<IActionResult> StripeWebhook()
        {
            Request.EnableBuffering(); 
            using var reader = new StreamReader(HttpContext.Request.Body, Encoding.UTF8, leaveOpen: true);
            var json = await reader.ReadToEndAsync();
            Request.Body.Position = 0; 
            Event stripeEvent;

            try
            {
                var stripeSignature = Request.Headers["Stripe-Signature"];
                stripeEvent = EventUtility.ConstructEvent(json, stripeSignature, StripeWebhookSecret);


                if (stripeEvent.Type == "checkout.session.completed") // 🔹 Corrected Event Name
                {
                    var session = stripeEvent.Data.Object as Stripe.Checkout.Session;
                    if (session == null)
                        return BadRequest(new { message = "Invalid session data" });

                    var order = await _unitOfWork.Repository<Order>().GetByIdSpecAsync(new OrderWithSpecictions().getOrderWithsessionId(session.Id));
                    if (order == null)
                    {
                        return NotFound(new { message = "Order not found" });
                    }

                    order.PaymentIntentId = session.PaymentIntentId;
                    order.Status = OrderStatus.Paid;
                    await _unitOfWork.CompleteAsync();

                }
            }
            catch (StripeException ex) { 
              return BadRequest(ex);
            }

            return Ok();
        }
    }
}
