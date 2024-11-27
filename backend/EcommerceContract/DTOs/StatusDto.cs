using Ecommerce.Contracts.DTOs.product;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ecommerce.Contracts.DTOs
{
    public  class StatusDto
    {
        public int id { get; init; }
        [Required]
        public string StatusName { get; init; }
        [Required]
        public string StatusDescription { get; set; }
         
        public  string AssignableBy { get; set; }

    }
}
