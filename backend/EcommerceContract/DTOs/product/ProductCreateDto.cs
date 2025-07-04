﻿using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ecommerce.Contracts.DTOs.product
{
    public class ProductCreateDto
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public string Brand { get; set; }
        public decimal Price { get; set; }
        public int StockQuantity { get; set; }
        public decimal Discount { get; set; }
        public DateTime? OfferStartDate { get; set; }
        public DateTime? OfferEndDate { get; set; }
        public float Weight { get; set; }
        public string Dimensions { get; set; }
        public int CategoryId { get; set; }
        public int DeliveryTimeInDays { get; set; }
        public IFormFile? ImageFile { get; set; }
        public List<IFormFile>? Thumbnails { get; set; } 

        public List<ProductAttributeDto> ProductAttributes { get; set; }

    }
}
