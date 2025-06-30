using AutoMapper;
using Ecommerce.Contracts.DTOs.Category;
using Ecommerce.Contracts.DTOs.order;
using Ecommerce.core.Entities;
using Ecommerce.Core.Entities.order;

namespace Ecommerce.Helpers.PictureResolver
{
    public class PictureOrderItemsImageResolver : IValueResolver<OrderItem, OrderItemDTO, string>
    {
        private readonly IConfiguration _configuration;
        public PictureOrderItemsImageResolver(IConfiguration configuration)
        {
            _configuration = configuration;
        }
        public string Resolve(OrderItem source, OrderItemDTO destination, string destMember, ResolutionContext context)
        {
            if (!string.IsNullOrEmpty(source.PictureUrl))
            {
                var PictureWithParts = source.PictureUrl;
                return $"{_configuration["ApiBaiseUrl"]}/image/Product/{PictureWithParts}";
            }

            return "";
        }
    }
}
