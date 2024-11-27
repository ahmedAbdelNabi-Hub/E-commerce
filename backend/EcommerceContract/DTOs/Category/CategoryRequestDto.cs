using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ecommerce.Contracts.DTOs.Category
{
     public class CategoryRequestDto
    {
        public int id { get; set; }
        public string CategoryName { get; set; }
        public string CategoryType { get; set; }
        public string Image { get; set; }
    }
}
