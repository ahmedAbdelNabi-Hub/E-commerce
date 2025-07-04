using Ecommerce.core.Entities;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ecommerce.Contracts.DTOs.product
{
    public class ProductReadDto
    {
        public int Id { get; set; }

        public string Name { get; set; }
        public string Description { get; set; }
        public string Brand { get; set; }
        public string? SKU { get; set; }
        public int CategoryId { get; set; }  
        public string? CategoryName { get; set; } 
        public decimal Price { get; set; }
        public decimal Discount { get; set; } = 0;
        public decimal Weight { get; set; }
        public int DeliveryTimeInDays { get; set; }
        public int StockQuantity { get; set; } = 0;
        public bool IsActive { get; set; } = false;
        public string Dimensions { get; set; }

        public string? ImageUrl { get; set; }
        public string? LinkImage { get; set; }
        public decimal? OfferPrice { get; set; } 
        public DateTime? OfferStartDate { get; set; } 
        public DateTime? OfferEndDate { get; set; }
        public List<string> Thumbnails { get; set; } = new();

        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public DateTime UpdatedAt { get; set; } = DateTime.Now;
        public List<ProductAttributeDto> ProductAttributes { get; set; }

    }
}
