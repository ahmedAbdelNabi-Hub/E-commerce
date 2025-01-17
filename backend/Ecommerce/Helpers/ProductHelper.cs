using Ecommerce.Contracts.DTOs.product;
using Ecommerce.core.Entities;
using Ecommerce.Core.Entities;
using System;

namespace Ecommerce.Helpers
{
    public static class ProductHelper
    {
        public static string GenerateSKU(int categoryId, string brand, DateTime createdAt, int id)
        {
            return $"{categoryId}-{(brand?.Substring(0, Math.Min(brand.Length, 3))?.ToUpper() ?? "BRD")}-{createdAt:yyyyMM}-{id:D5}";
        }

        public static decimal CalculateOfferPrice(decimal price, decimal discount)
        {
            return discount > 0 ? price * (1 - discount / 100) : price;
        }


        public static Product DeepCopy(Product original)
        {
            var copy = new Product
            {
                id = original.id,
                Name = original.Name,
                Description = original.Description,
                Brand = original.Brand,
                SKU = original.SKU,
                CategoryId = original.CategoryId,
                Category = original.Category,
                Price = original.Price,
                Discount = original.Discount,
                Weight = original.Weight,
                DeliveryTimeInDays = original.DeliveryTimeInDays,
                StockQuantity = original.StockQuantity,
                ImageUrl = original.ImageUrl,
                LinkImage = original.LinkImage,
                OfferPrice = original.OfferPrice,
                OfferStartDate = original.OfferStartDate,
                OfferEndDate = original.OfferEndDate,
                CreatedAt = original.CreatedAt,
                UpdatedAt = original.UpdatedAt,
                ProductAttributes = original.ProductAttributes != null
                    ? new List<ProductAttributes>(original.ProductAttributes)
                    : new List<ProductAttributes>()
            };
            return copy;
        }

    }
}
