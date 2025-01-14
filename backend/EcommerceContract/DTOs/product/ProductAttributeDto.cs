using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ecommerce.Contracts.DTOs.product
{
    public class ProductAttributeDto
    {
        [Required(ErrorMessage = "Attribute name is required.")]
        [StringLength(100, ErrorMessage = "Attribute name must be less than 100 characters.")]
        [MinLength(2, ErrorMessage = "Attribute name must be at least 3 characters long.")]
        public string AttributeName { get; set; }

        [Required(ErrorMessage = "Attribute value is required.")]
        [StringLength(255, ErrorMessage = "Attribute value must be less than 255 characters.")]
        [MinLength(1, ErrorMessage = "Attribute value must be at least 2 characters long.")]
        public string AttributeValue { get; set; }

        [Required(ErrorMessage = "IsFilterable value is required.")]
        public bool IsFilterable { get; set; }

        public int productId { get; set; }  

        public int id { get; set; }
    }
}
