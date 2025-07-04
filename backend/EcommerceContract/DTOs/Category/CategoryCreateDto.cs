using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ecommerce.Contracts.DTOs.Category
{
    public class CategoryCreateDto
    {
        public string CategoryName { get; set; }
        public string CategoryType { get; set; }
        public IFormFile Image { get; set; }
    }
}
