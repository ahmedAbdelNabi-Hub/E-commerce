using System;

namespace Ecommerce.Helpers
{
    public static class ProductHelper
    {
        // Method to generate SKU based on properties and initial values
        public static string GenerateSKU(int categoryId, string brand, DateTime createdAt, int id)
        {
            return $"{categoryId}-{(brand?.Substring(0, Math.Min(brand.Length, 3))?.ToUpper() ?? "BRD")}-{createdAt:yyyyMM}-{id:D5}";
        }

        // Method to calculate OfferPrice based on current Discount and Price
        public static decimal CalculateOfferPrice(decimal price, decimal discount)
        {
            return discount > 0 ? price * (1 - discount / 100) : price;
        }
    }
}
