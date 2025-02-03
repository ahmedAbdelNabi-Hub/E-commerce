using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ecommerce.Contracts.DTOs.product
{
    public class ProductStatusDTO
    {
        public int ProductId { get; set; }        
        public int StatusId { get; set; }         
        public DateTime StatusChangeDate { get; set; } = DateTime.Now;
        public string? ChangedBy { get; set; } = "admin";
    }
}
