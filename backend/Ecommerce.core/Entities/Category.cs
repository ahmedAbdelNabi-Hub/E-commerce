using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Ecommerce.core.Entities
{
    public class Category:BaseEntity
    {
        public string CategoryName { get; set; }  
        public string CategoryType { get; set; } 
        public string Image { get; set; }
        public ICollection<Product> Products { get; set; }  

    }
}
