using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ecommerce.Contracts.DTOs.product
{
    public class ProductViewDto
    {
        public ProductViewDto()
        {
            ProductReadDto = new List<ProductReadDto>();
        }

        [Required]
        public bool IsStoreInRedis {  get; set; }   
      
        [Required(ErrorMessage = " viewId is required.")]
        public string viewId { get; set; }

        [Required]
        public List<ProductReadDto> ProductReadDto { get; set; }   
    }
}
