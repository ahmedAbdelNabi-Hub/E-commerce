using Ecommerce.Contracts.DTOs.product;
using Ecommerce.core.Entities;

namespace Ecommerce.Extensions
{
    public static class ProductExtensions
    {
            public static void UpdateFromDto(this Product product, ProductCreateDto dto)
            {
                product.Name = dto.Name?.Trim();
                product.Description = dto.Description?.Trim();
                product.Brand = dto.Brand?.Trim();
                product.Price = dto.Price;
                product.Discount = dto.Discount;
                product.StockQuantity = dto.StockQuantity;
                product.Weight = (decimal)dto.Weight;
                product.Dimensions = dto.Dimensions?.Trim();
                product.CategoryId = dto.CategoryId;
                product.OfferStartDate = dto.OfferStartDate;
                product.OfferEndDate = dto.OfferEndDate;
                product.DeliveryTimeInDays = dto.DeliveryTimeInDays;
            }
        }
    }

