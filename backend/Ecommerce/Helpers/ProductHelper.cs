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
    }
}
