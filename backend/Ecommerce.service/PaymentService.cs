using Ecommerce.Contracts.Interfaces;
using Ecommerce.Core;
using Ecommerce.Core.Entities.order;
using Ecommerce.Core.Specifications;
using Microsoft.Extensions.Configuration;
using Stripe;
using Stripe.Checkout;


namespace Ecommerce.Service
{
    public class PaymentService : IPaymentService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IConfiguration _configuration;
        private readonly StripeClient _stripeClient;

        public PaymentService(IUnitOfWork unitOfWork, IConfiguration configuration)
        {
            _unitOfWork = unitOfWork;
            _configuration = configuration;
            _stripeClient = new StripeClient(configuration["Stripe:Secretkey"]); // Correct way

            StripeConfiguration.ApiKey = _configuration["Stripe:Secretkey"]; 
        }

        public async Task<string> CreateCheckoutSessionAsync(int orderId)
        {
            var domain = "http://localhost:4200/";
            var order = await _unitOfWork.Repository<Order>().GetByIdSpecAsync(new OrderWithSpecictions(orderId));

            if (order == null)
                throw new Exception("Order not found");

            var options = new SessionCreateOptions
            {
                CustomerEmail  = order.BuyerEmail,
                PaymentMethodTypes = new List<string> { "card" },
                LineItems = order.Items.Select(item => new SessionLineItemOptions
                {
                    PriceData = new SessionLineItemPriceDataOptions
                    {
                        Currency = "usd",
                        UnitAmount = (long)(item.Price * 100), 
                        ProductData = new SessionLineItemPriceDataProductDataOptions
                        {
                            Name = item.ProductName.ToString(),
                            Images = new List<string> { item.PictureUrl } 
                        }
                    },
                    Quantity = item.Quantity
                }).ToList(),
                Mode = "payment",
                SuccessUrl = $"{domain}/order-success?session_id={{CHECKOUT_SESSION_ID}}",
                CancelUrl = $"{domain}/order-cancel"
            };

            var service = new SessionService(_stripeClient);
            var session = await service.CreateAsync(options);

            // Store paymentId in the Order entity
            order.PaymentIntentId = session.Id;
            await _unitOfWork.CompleteAsync(); 

            return session.Url;
        }


        /*public async Task<bool> HandlePaymentWebhookAsync(string payload, string signature)
        {
            var endpointSecret = _configuration["Stripe:WebhookSecret"];
            try
            {
                var stripeEvent = EventUtility.ConstructEvent(payload, signature, endpointSecret);

                if (stripeEvent.Type == Events.CheckoutSessionCompleted)
                {
                    var session = stripeEvent.Data.Object as Stripe.Checkout.Session;
                    var order = await _unitOfWork.Repository<Order>().FindAsync(o => o.PaymentIntentId == session.Id);

                    if (order != null)
                    {
                        order.Status = OrderStatus.Paid;
                        await _unitOfWork.CompleteAsync();
                    }
                }
                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }*/
    }
}
