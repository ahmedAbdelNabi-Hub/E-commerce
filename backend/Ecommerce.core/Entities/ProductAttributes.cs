using Ecommerce.core.Entities;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ecommerce.Core.Entities
{
    public class ProductAttributes : BaseEntity
    {
        public string AttributeName { get; set; }
        public string AttributeValue { get; set; }
        public DateTime CreatedAt { get; set; } 
        public DateTime UpdatedAt { get; set; } 
        public bool IsFilterable { get; set; }

        [ForeignKey("Product")]
        public int? ProductId { get; set; }
        public Product Product { get; set; }    
    }
}
