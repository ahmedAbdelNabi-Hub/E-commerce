﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ecommerce.Contracts.DTOs.order
{
    public class OrderItemDTO
    {
        public int ProductId { get; set; }
        public string ProductName { get; set; } 
        public string PictureUrl { get; set; } 
        public decimal Price { get; set; }
        public int Quantity { get; set; } 
    }
}
