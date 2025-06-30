using Ecommerce.Core.Entities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ecommerce.core.Entities
{
    //eager and lazy 
    public class Product:BaseEntity
    {

        public Product()
        {
            ProductStatus = new HashSet<ProductStatus>();   
            ProductAttributes = new HashSet<ProductAttributes>();
        }

        public string Name { get; set; } 
        public string Description { get; set; }  
        public string Brand { get; set; }
        public string SKU { get; set; }

        [ForeignKey("Category")]
        public int CategoryId { get; set; } 
        public Category Category { get; set; }  
        public decimal Price { get; set; }
        public decimal Discount { get; set; } = 0;
        public int StockQuantity { get; set; } = 0;
        public decimal Weight { get; set; }
        public string Dimensions { get; set; }  

        public bool IsActive { get; set; } = false;

        public string ImageUrl { get; set; }
        public string LinkImage {  get; set; }
        public decimal? OfferPrice { get; set; } 
        public DateTime? OfferStartDate { get; set; } 
        public DateTime? OfferEndDate { get; set; }
        public int DeliveryTimeInDays { get; set; }

        public ICollection<ProductStatus> ProductStatus { get; set; }
        public ICollection<ProductAttributes> ProductAttributes { get; set; }
       
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public DateTime UpdatedAt { get; set; } = DateTime.Now;
    }

}
